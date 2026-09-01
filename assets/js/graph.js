document.addEventListener('DOMContentLoaded', function () {
(function () {
    const wrap = document.getElementById('post-graph');
    if (!wrap) return;
    const baseurl = wrap.dataset.baseurl || '';

    fetch(`${baseurl}/graph.json`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.nodes.length) {
          document.getElementById('post-graph-empty').classList.remove('d-none');
          return;
        }
        render(data);
      });

    function render(data) {
      const CAT_COLORS = {
        'mathematical-foundations': '#4065dc',
        'information-theory': '#9359db',
        'linear-algebra': '#e66d9b',
        'probabilities-statistics': '#e3764f',
        'deep-learning': '#417262',
        'meta-learning': '#c94458',
        'gaussian-neural-processes': '#2f9bb7',
        'attention-is-all-you-need': '#eeb662',
        'hand-object-interaction': '#56836f',
        'conversations': '#9a6fb8',
        'sparse-distributed-memory': '#8a8a8a',
        'uncategorised': '#8a8a8a'
      };

      const width = wrap.clientWidth || 800;
      const height = 480;

      const svg = d3
        .select('#post-graph')
        .append('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('width', '100%')
        .attr('height', height);

      const g = svg.append('g');

      const refDegree = {};
      data.links.forEach((l) => {
        if (l.kind !== 'ref') return;
        refDegree[l.source] = (refDegree[l.source] || 0) + 1;
        refDegree[l.target] = (refDegree[l.target] || 0) + 1;
      });

      const nodes = data.nodes.map((n) => ({
        ...n,
        r:
          n.type === 'category'
            ? 15
            : 4 + 2 * Math.sqrt(refDegree[n.id] || 0)
      }));

      /* settle the layout synchronously, then fit it to the viewport */
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink(data.links)
            .id((d) => d.id)
            .distance((d) => (d.kind === 'cat' ? 80 : 60))
            .strength((d) => (d.kind === 'cat' ? 0.7 : 0.4))
        )
        .force('charge', d3.forceManyBody().strength(-170))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collide', d3.forceCollide().radius((d) => d.r + 14))
        .stop();
      simulation.tick(280);

      const link = g
        .append('g')
        .selectAll('line')
        .data(data.links)
        .join('line')
        .attr('class', (d) =>
          d.kind === 'cat' ? 'graph-edge graph-edge-cat' : 'graph-edge'
        );

      const node = g
        .append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', (d) => `graph-node graph-node-${d.type}`)
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          window.location.href = baseurl + d.url;
        });

      node
        .append('circle')
        .attr('r', (d) => d.r)
        .attr('fill', (d) => CAT_COLORS[d.cat] || '#999');

      node
        .append('text')
        .text((d) => d.title)
        .attr('class', (d) =>
          d.type === 'category' ? 'graph-label graph-label-cat' : 'graph-label'
        )
        .attr('x', 0)
        .attr('y', (d) => d.r + 12)
        .attr('text-anchor', 'middle');

      node.append('title').text((d) =>
        d.type === 'category' ? `Category: ${d.title}` : `${d.title}\n${d.date}`
      );

      /* fit the whole graph into view */
      const zoom = d3.zoom().scaleExtent([0.2, 4]).on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
      svg.call(zoom).on('dblclick.zoom', null);

      function fit() {
        const xs = nodes.map((n) => n.x);
        const ys = nodes.map((n) => n.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);
        const bw = maxX - minX || 1;
        const bh = maxY - minY || 1;
        const scale = Math.min(width / bw, height / bh) * 0.85;
        const tx = width / 2 - scale * (minX + bw / 2);
        const ty = height / 2 - scale * (minY + bh / 2);
        svg.call(
          zoom.transform,
          d3.zoomIdentity.translate(tx, ty).scale(Math.min(scale, 1.5))
        );
      }

      fit();

      node.call(
        d3
          .drag()
          .on('start', (event, d) => {
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            const t = d3.zoomTransform(svg.node());
            d.fx = t.invertX(event.x);
            d.fy = t.invertY(event.y);
            simulation.alpha(0.3).restart();
          })
          .on('end', (event, d) => {
            d.fx = null;
            d.fy = null;
          })
      );

      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);
        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      });
    }
  })();
});
