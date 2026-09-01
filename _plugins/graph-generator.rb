# frozen_string_literal: true

# Generates graph.json at build time: a node-link overview of the blog.
# - Big category hub nodes (one per primary category)
# - Smaller post nodes
# - Edges: post -> its category hub, and post -> post when one references
#   another (relative `../slug/` or absolute `/posts/slug/` markdown links)
#
# Runs on every Jekyll build, so manually created/edited posts stay in sync.

require 'json'
require 'fileutils'

module GraphGenerator
  class GeneratedFile < Jekyll::StaticFile
    def initialize(site, name, content)
      super(site, site.source, '', name)
      @content = content
    end

    def write(dest)
      dest_path = destination(dest)
      FileUtils.mkdir_p(File.dirname(dest_path))
      File.write(dest_path, @content)
      true
    end

    def modified?
      true
    end
  end

  class Generator < Jekyll::Generator
    LINK_PATTERNS = [
      %r{\]\(\.\./([a-z0-9\-]+)/},
      %r{\]\(/posts/([a-z0-9\-]+)/}
    ].freeze

    def generate(site)
      nodes = []
      links = []
      cat_nodes = {}
      post_slugs = {}

      site.posts.docs.each do |post|
        slug = File.basename(post.path, '.md').sub(/\A\d{4}-\d{2}-\d{2}-/, '')
        post_slugs[slug] = true
      end

      site.posts.docs.each do |post|
        slug = File.basename(post.path, '.md').sub(/\A\d{4}-\d{2}-\d{2}-/, '')
        cat = (post.data['categories'] || []).first || 'uncategorised'

        cat_nodes[cat] ||= begin
          node = { 'id' => "cat:#{cat}", 'title' => cat.tr('-', ' '),
                   'url' => "/categories/#{cat}/", 'cat' => cat, 'type' => 'category' }
          nodes << node
          node
        end

        nodes << { 'id' => "/posts/#{slug}/", 'title' => post.data['title'].to_s,
                   'url' => "/posts/#{slug}/", 'cat' => cat, 'type' => 'post',
                   'date' => post.date.strftime('%Y.%m.%d') }
        links << { 'source' => "/posts/#{slug}/", 'target' => "cat:#{cat}",
                   'kind' => 'cat' }

        content = post.content.to_s
        LINK_PATTERNS.each do |pattern|
          content.scan(pattern) do |(target)|
            next unless post_slugs[target]
            links << { 'source' => "/posts/#{slug}/",
                       'target' => "/posts/#{target}/", 'kind' => 'ref' }
          end
        end
      end

      links.uniq!
      payload = JSON.pretty_generate({ 'nodes' => nodes, 'links' => links })
      site.static_files << GeneratedFile.new(site, 'graph.json', payload)
      Jekyll.logger.info 'Graph:', "#{nodes.size} nodes, #{links.size} edges"
    end
  end
end
