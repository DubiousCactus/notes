#!/usr/bin/env python3
"""Migrate categories from the Obsidian vault (~/Learning to Learn) into this
Chirpy site as ONE consolidated post per category.

Usage: python3 tools/migrate_obsidian.py "Category Name" ["Another Category"]

- The note with the most transclusions of its sibling notes becomes the spine
  of the consolidated post (fallback: most recently modified).
- Notes embedded via ![[Note]] are inlined under a `## Note Title` heading.
- Remaining sibling notes are appended as `## Note Title` sections.
- Post date = most recent file mtime in the category.
- Obsidian syntax converted: wikilinks, transclusions, image embeds, callouts,
  ==highlights==. Math is normalized for kramdown+MathJax.
- Referenced assets are copied to assets/img/blog/ (slugified names).
"""

import re
import shutil
import sys
from datetime import datetime
from pathlib import Path

VAULT = Path.home() / "Learning to Learn"
SITE = Path(__file__).resolve().parent.parent
POSTS_OUT = SITE / "_posts"
ASSETS_OUT = SITE / "assets" / "img" / "blog"


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


_copied = set()


def copy_asset(path):
    dest = ASSETS_OUT / slugify_asset(path.name)
    if path not in _copied:
        shutil.copy2(path, dest)
        _copied.add(path)
        print(f"  asset: {dest.relative_to(SITE)}")
    return dest


def category_of(note_path):
    try:
        return note_path.relative_to(VAULT).parts[0]
    except ValueError:
        return None


def link_for_note(target_title, current_category):
    """Wikilink target -> URL. Notes in the consolidated post become anchors."""
    note = find_note(target_title)
    if not note:
        return None
    cat = category_of(note)
    if not cat or cat.startswith(".") or cat == current_category:
        return f"#{slugify(target_title)}"
    return f"/blog/{slugify(cat)}/#{slugify(target_title)}"


def convert_note(path, visited, current_category, is_root=False):
    """Return converted markdown body for a note (transclusions inlined)."""
    if path in visited and not is_root:
        return f"*[{path.stem} already included above]*"
    visited.add(path)
    text = path.read_text(encoding="utf-8")
    text = re.sub(r"\A---\n.*?\n---\n", "", text, flags=re.S)  # front matter
    embeds = []  # rendered transclusions, protected via placeholders

    def repl_embed(m):
        target = m.group(1).split("|")[0].split("#")[0].strip()
        note = find_note(target)
        if note:
            body = convert_note(note, visited, current_category)
            embeds.append(f"## {target}\n\n{body}")
            return f"\n\x00EMBED{len(embeds) - 1}\x00\n"
        asset = find_asset(target)
        if asset:
            copy_asset(asset)
            return "![{}](/assets/img/blog/{})".format(
                Path(target).stem, slugify_asset(target))
        print(f"  WARNING: missing embed '{target}' in {path.name}")
        return f"*missing embed: {target}*"

    out = []
    for line in text.split("\n"):
        m = re.match(r"^(>\s*)\[![a-z]+\][^\s]*\s*(.*)$", line, flags=re.I)
        if m:  # callout -> plain blockquote
            line = "> " + m.group(2)

        line = re.sub(r"!\[\[([^\]]+)\]\]", repl_embed, line)

        def repl_link(m):
            raw = m.group(1)
            target = raw.split("|")[0].split("#")[0].strip()
            label = raw.split("|")[1].strip() if "|" in raw else target
            if find_note(target):
                url = link_for_note(target, current_category)
                return f"[{label}]({url})"
            asset = find_asset(target)
            if asset:
                copy_asset(asset)
                return "[{}](/assets/img/blog/{})".format(
                    label, slugify_asset(target))
            print(f"  WARNING: unresolved wikilink '{target}' in {path.name}")
            return label

        line = re.sub(r"(?<!!)\[\[([^\]]+)\]\]", repl_link, line)

        # single-$ inline math -> kramdown $$..$$ math (avoids markdown
        # mangling of underscores); pipes -> \vert (kramdown would otherwise
        # treat a paragraph containing pipes as a table)
        def mathify(m):
            return "$$" + m.group(1).replace("|", r"\vert") + "$$"

        line = re.sub(r"\$([^\$\n]+?)\$", mathify, line)
        line = re.sub(r"==(.*?)==", r"<mark>\1</mark>", line)
        out.append(line)

    body = "\n".join(out)

    # restore protected transclusions
    def unembed(m):
        return embeds[int(m.group(1))]

    body = re.sub(r"\x00EMBED(\d+)\x00", unembed, body)

    # rewrite relative markdown image paths (e.g. ![alt](img.png))
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

    return re.sub(r"!\[([^\]]*)\]\(([^)]+)\)", repl_rel, body)


def migrate_category(cat):
    cat_dir = VAULT / cat
    if not cat_dir.is_dir():
        sys.exit(f"Category folder not found: {cat_dir}")
    category = slugify(cat)
    print(f"== {cat} -> post '{category}' ==")

    notes = [p for p in sorted(cat_dir.glob("*.md"))]
    notes = [p for p in notes if not p.name.endswith(".excalidraw.md")]
    if not notes:
        print("  (no notes, skipped)")
        return

    # spine = note transcluding the most siblings, fallback: most recent mtime
    def spine_score(p):
        targets = re.findall(r"!\[\[([^\]|#]+)", p.read_text(encoding="utf-8"))
        sib = sum(1 for t in targets if find_note(t.strip()) and
                  (cat_dir / (t.strip() + ".md")).exists())
        return (sib, p.stat().st_mtime)

    spine = max(notes, key=spine_score)
    visited = {spine}
    body = convert_note(spine, visited, cat, is_root=True)

    # append notes not already embedded in the spine, newest first
    rest = [p for p in notes if p not in visited]
    rest.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    for note in rest:
        section = convert_note(note, visited, cat)
        body += f"\n\n## {note.stem}\n\n{section}"

    date = max(p.stat().st_mtime for p in notes)
    date = datetime.fromtimestamp(date).strftime("%Y-%m-%d")
    fm = ("---\n"
          "title: \"{}\"\n"
          "description: \"{}\"\n"
          "date: {} 12:00:00\n"
          "categories: [{}]\n"
          "math: true\n"
          "pin: false\n"
          "---\n\n").format(cat, f"Notes on {cat.lower()}", date, category)
    dest = POSTS_OUT / f"{date}-{category}.md"
    dest.write_text(fm + body.strip() + "\n", encoding="utf-8")
    print(f"  post:  {dest.relative_to(SITE)}")


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    POSTS_OUT.mkdir(exist_ok=True)
    ASSETS_OUT.mkdir(parents=True, exist_ok=True)
    for cat in sys.argv[1:]:
        migrate_category(cat)


if __name__ == "__main__":
    main()
