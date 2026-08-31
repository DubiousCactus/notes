#!/usr/bin/env python3
"""Migrate the Obsidian vault (~/Learning to Learn) into this Chirpy site.

Usage: python3 tools/migrate_obsidian.py

Grouping model (cherry-picked):
- GROUPS below define consolidated "big posts" (a folder, or a single note).
- Every other publishable note becomes an independent post.
- Nested categories are derived from the vault folder structure, preserving
  group/subgroup hierarchy (e.g. mathematical-foundations > information-theory).

Conversion rules:
- Wikilinks resolve via a global URL map (big-post notes -> /posts/<group>/#anchor,
  independent notes -> /posts/<slug>/).
- Transclusions (![[Note]]) are inlined under a `## Note Title` heading.
- Image embeds (![[img]]) are copied to assets/img/blog/ (slugified names).
- Callouts -> blockquotes, ==highlights== -> <mark>, single-$ math -> kramdown
  $$..$$ math with pipes rewritten to \\vert.
- Post dates come from file mtimes (max mtime for big posts).
"""

import re
import shutil
from datetime import datetime
from pathlib import Path

VAULT = Path.home() / "Learning to Learn"
SITE = Path(__file__).resolve().parent.parent
POSTS_OUT = SITE / "_posts"
ASSETS_OUT = SITE / "assets" / "img" / "blog"

# (vault-relative path, post title) — folders consolidate all their notes,
# single .md paths become a one-note big post.
GROUPS = [
    ("Attention is all you need", "Attention is all you need"),
    ("Meta-Learning/A Gentle Introduction to Meta-Learning.md",
     "A Gentle Introduction to Meta-Learning"),
    ("Gaussian & Neural Processes/Gaussian Processes from A to Z.md",
     "Gaussian Processes from A to Z"),
    ("Gaussian & Neural Processes/The Neural Process Family.md",
     "The Neural Process Family"),
]


TITLE_OVERRIDES = {
    "Overfitting and memorisation in meta-learning":
        "Task overfitting and the memorisation problem",
}


def slugify(name):
    s = name.strip().lower()
    s = re.sub(r"[^\w\s-]", "", s)
    return re.sub(r"[\s_]+", "-", s).strip("-")


def slugify_asset(name):
    p = Path(name)
    return slugify(p.stem) + p.suffix.lower()


def find_note(title):
    matches = [p for p in VAULT.rglob(title + ".md") if ".trash" not in p.parts]
    return matches[0] if matches else None


def find_asset(name):
    matches = [p for p in VAULT.rglob(name) if ".trash" not in p.parts]
    return matches[0] if matches else None


def publishable_notes():
    """All notes that should become (or be part of) posts."""
    out = []
    for p in sorted(VAULT.rglob("*.md")):
        rel = p.relative_to(VAULT)
        if ".trash" in rel.parts or ".obsidian" in rel.parts:
            continue
        if rel.parts[0] == "Excalidraw":  # drawing notes, not blog posts
            continue
        if any(part == "figures" for part in rel.parts):
            continue
        if p.name.endswith(".excalidraw.md"):
            continue
        if len(rel.parts) < 2:  # vault-root notes are not blog content
            continue
        out.append(p)
    return out


# ---------------- pass 1: assignment + URL map ----------------

def build_assignment(notes):
    """note_path -> dict(post_slug, anchor, categories, title, is_spine)"""
    assign = {}
    group_notes = {}
    for rel_path, title in GROUPS:
        slug = slugify(title)
        vp = VAULT / rel_path
        if vp.is_dir():
            members = [n for n in notes if n.relative_to(VAULT).parts[0] == rel_path]
            cats = [slug]
        else:
            members = [vp] if vp in notes else []
            cats = [slugify(vp.relative_to(VAULT).parts[0])]
        for m in members:
            group_notes[m] = (slug, title, cats)
        assign["_groups"] = assign.get("_groups", {})
        assign["_groups"][slug] = {"title": title, "members": members, "cats": cats}

    for n in notes:
        if n in group_notes:
            slug, title, cats = group_notes[n]
            assign[n] = {"post_slug": slug, "anchor": None, "cats": cats,
                         "title": title, "grouped": True}
        else:
            rel = n.relative_to(VAULT)
            cats = [slugify(part) for part in rel.parts[:-1]]
            assign[n] = {"post_slug": slugify(n.stem), "anchor": None,
                         "cats": cats, "title": n.stem, "grouped": False}
    return assign


def note_url(note, assign):
    a = assign[note]
    url = f"/posts/{a['post_slug']}/"
    # anchor for grouped notes that are not the spine (spine decided in pass 2)
    if a["grouped"] and not a.get("is_spine"):
        a["anchor"] = slugify(note.stem)
    if a.get("anchor"):
        url += f"#{a['anchor']}"
    return url


# ---------------- pass 2: conversion ----------------

_copied = set()


def copy_asset(path):
    dest = ASSETS_OUT / slugify_asset(path.name)
    if path not in _copied:
        shutil.copy2(path, dest)
        _copied.add(path)
        print(f"  asset: {dest.relative_to(SITE)}")
    return dest


def convert_note(path, visited, assign, is_root=False):
    if path in visited and not is_root:
        return f"*[{path.stem} — included above]*"
    visited.add(path)
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"\A---\n.*?\n---\n", "", text, flags=re.S)
    embeds = []

    def repl_embed(m):
        target = m.group(1).split("|")[0].split("#")[0].strip()
        note = find_note(target)
        if note:
            body = convert_note(note, visited, assign)
            embeds.append(f"## {target}\n\n{body}")
            return f"\n\x00EMBED{len(embeds) - 1}\x00\n"
        asset = find_asset(target)
        if asset:
            copy_asset(asset)
            return "![{}](/assets/img/blog/{})".format(
                Path(target).stem, slugify_asset(target))
        print(f"  WARNING: missing embed '{target}' in {path.name}")
        return f"*missing embed: {target}*"

    def repl_link(m):
        raw = m.group(1)
        target = raw.split("|")[0].split("#")[0].strip()
        label = raw.split("|")[1].strip() if "|" in raw else target
        note = find_note(target)
        if note and note in assign:
            return f"[{label}]({note_url(note, assign)})"
        asset = find_asset(target)
        if asset:
            copy_asset(asset)
            return "[{}](/assets/img/blog/{})".format(label, slugify_asset(target))
        print(f"  WARNING: unresolved wikilink '{target}' in {path.name}")
        return label

    def mathify(m):
        return "$$" + m.group(1).replace("|", r"\vert") + "$$"

    # protect display-math blocks ($$ on their own lines) from line-level
    # conversions; restored with guaranteed blank-line separation
    lines = text.split("\n")
    display_blocks = []
    protected = []
    i = 0
    while i < len(lines):
        if lines[i].strip() == "$$":
            j = i + 1
            while j < len(lines) and lines[j].strip() != "$$":
                j += 1
            if j < len(lines):
                display_blocks.append("\n".join(lines[i + 1:j]))
                protected.append(f"\x00MATHBLOCK{len(display_blocks) - 1}\x00")
                i = j + 1
                continue
        protected.append(lines[i])
        i += 1
    text = "\n".join(protected)

    out = []
    for line in text.split("\n"):
        m = re.match(r"^(>\s*)\[![a-z]+\][^\s]*\s*(.*)$", line, flags=re.I)
        if m:
            line = "> " + m.group(2)
        line = re.sub(r"!\[\[([^\]]+)\]\]", repl_embed, line)
        line = re.sub(r"(?<!!)\[\[([^\]]+)\]\]", repl_link, line)
        line = re.sub(r"\$([^\$\n]+?)\$", mathify, line)
        line = re.sub(r"==(.*?)==", r"<mark>\1</mark>", line)
        out.append(line)

    body = "\n".join(out)
    body = re.sub(r"\x00EMBED(\d+)\x00",
                  lambda m: embeds[int(m.group(1))], body)

    def repl_rel(m):
        alt, ref = m.group(1), m.group(2)
        if ref.startswith(("http://", "https://", "/")):
            return m.group(0)
        cand = path.parent / ref
        if not cand.exists():
            cand = find_asset(Path(ref).name)
        if cand and cand.exists():
            copy_asset(cand)
            return "![{}](/assets/img/blog/{})".format(alt, slugify_asset(ref))
        print(f"  WARNING: missing image '{ref}' in {path.name}")
        return m.group(0)

    body = re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", repl_rel, body)

    def restore_block(m):
        return "\n\n$$\n" + display_blocks[int(m.group(1))] + "\n$$\n\n"

    body = re.sub(r"\x00MATHBLOCK(\d+)\x00", restore_block, body)
    return body


def write_post(slug, title, cats, date, body):
    fm = ("---\n"
          f'title: "{title.replace(chr(34), chr(39))}"\n'
          f"description: \"{title} — notes by Théo Morales\"\n"
          f"date: {date} 12:00:00\n"
          f"categories: [{', '.join(cats)}]\n"
          "math: true\n"
          "pin: false\n"
          "---\n\n")
    dest = POSTS_OUT / f"{date}-{slug}.md"
    # {% raw %} keeps Liquid away from LaTeX braces ({{ ... }} sequences)
    dest.write_text(fm + "{% raw %}\n" + body.strip() + "\n{% endraw %}\n",
                    encoding="utf-8")
    print(f"  post:  {dest.relative_to(SITE)}  (cats: {', '.join(cats)})")


def main():
    POSTS_OUT.mkdir(exist_ok=True)
    ASSETS_OUT.mkdir(parents=True, exist_ok=True)
    notes = publishable_notes()
    assign = build_assignment(notes)

    # mark spines: for each group, spine = member with most sibling
    # transclusions (fallback: most recent mtime)
    for slug, g in assign["_groups"].items():
        members = g["members"]
        if not members:
            continue

        def score(p):
            targets = re.findall(r"!\[\[([^\]|#]+)",
                                 p.read_text(encoding="utf-8"))
            sib = sum(1 for t in targets
                      if find_note(t.strip()) in members)
            return (sib, p.stat().st_mtime)

        spine = max(members, key=score)
        assign[spine]["is_spine"] = True
        g["spine"] = spine

    # absorb notes transitively transcluded by group spines
    absorbed = {}
    for slug, g in assign["_groups"].items():
        spine = g.get("spine")
        if not spine:
            continue
        stack, seen = [spine], {spine}
        while stack:
            cur = stack.pop()
            text = cur.read_text(encoding="utf-8")
            for t in re.findall(r"!\[\[([^\]|#]+)", text):
                note = find_note(t.strip())
                if note and note not in seen and note in assign:
                    seen.add(note)
                    stack.append(note)
                    if note != spine:
                        absorbed[note] = (slug, slugify(note.stem))
        g["absorbed"] = seen
    for note, (slug, anchor) in absorbed.items():
        assign[note]["post_slug"] = slug
        assign[note]["anchor"] = anchor

    # independent posts
    for n in notes:
        a = assign[n]
        if a["grouped"] or n in absorbed:
            continue
        visited = set()
        body = convert_note(n, visited, assign)
        title = TITLE_OVERRIDES.get(n.stem, a["title"])
        if title != a["title"]:
            # drop the note's own leading heading when it duplicates the title
            body = re.sub(r"^##\s+" + re.escape(a["title"]) + r"\s*\n+", "", body)
        date = datetime.fromtimestamp(n.stat().st_mtime).strftime("%Y-%m-%d")
        write_post(a["post_slug"], title, a["cats"], date, body)

    # big posts
    for slug, g in assign["_groups"].items():
        members = g["members"]
        if not members:
            continue
        spine = g["spine"]
        visited = {spine}
        body = convert_note(spine, visited, assign, is_root=True)
        rest = [p for p in members if p not in visited]
        rest.sort(key=lambda p: p.stat().st_mtime, reverse=True)
        for note in rest:
            section = convert_note(note, visited, assign)
            body += f"\n\n## {note.stem}\n\n{section}"
        date = max(p.stat().st_mtime for p in members)
        date = datetime.fromtimestamp(date).strftime("%Y-%m-%d")
        write_post(slug, g["title"], g["cats"], date, body)


if __name__ == "__main__":
    main()
