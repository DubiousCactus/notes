document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('mini-post-graph');
  const backlinksList = document.getElementById('post-backlinks-list');
  if (!container) return;

  const baseurl = container.dataset.baseurl || '';
  let currentUrl = container.dataset.url || '';
  if (!currentUrl.endsWith('/')) currentUrl += '/';

  fetch(`${baseurl}/graph.json`)
    .then((r) => r.json())
    .then((data) => {
      if (!data.nodes || !data.nodes.length) return;
      renderLocalGraph(data);
    })
    .catch((err) => console.error('Failed to load graph for backlinks:', err));

  function renderLocalGraph(data) {
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

    const targetNode = data.nodes.find(
      (n) => n.url === currentUrl || n.id === currentUrl
    );

    if (!targetNode) {
      document.getElementById('post-backlinks-container')?.classList.add('d-none');
      return;
    }

    // Deep copy links with clean string IDs
    const localLinks = data.links
      .filter((l) => {
        const sId = typeof l.source === 'object' ? l.source.id : l.source;
        const tId = typeof l.target === 'object' ? l.target.id : l.target;
        return sId === targetNode.id || tId === targetNode.id;
      })
      .map((l) => ({
        source: typeof l.source === 'object' ? l.source.id : l.source,
        target: typeof l.target === 'object' ? l.target.id : l.target,
        kind: l.kind
      }));

    const connectedIds = new Set([targetNode.id]);
    localLinks.forEach((l) => {
      connectedIds.add(l.source);
      connectedIds.add(l.target);
    });

    const localNodes = data.nodes
      .filter((n) => connectedIds.has(n.id))
      .map((n) => {
        const isCurrent = n.id === targetNode.id;
        const r = isCurrent ? 15 : n.type === 'category' ? 12 : 7;
        return { ...n, r, isCurrent };
      });

    // Backlinks list cards
    const incomingBacklinks = localLinks.filter((l) => l.target === targetNode.id && l.kind === 'ref');
    const outgoingLinks = localLinks.filter((l) => l.source === targetNode.id && l.kind === 'ref');

    if (backlinksList) {
      backlinksList.innerHTML = '';

      const referencingNodes = incomingBacklinks
        .map((l) => data.nodes.find((n) => n.id === l.source))
        .filter(Boolean);

      const referencedNodes = outgoingLinks
        .map((l) => data.nodes.find((n) => n.id === l.target))
        .filter(Boolean);

      if (!referencingNodes.length && !referencedNodes.length) {
        backlinksList.innerHTML = `
          <div class="col-12">
            <p class="text-muted small mb-0">No direct references found for this note yet.</p>
          </div>
        `;
      } else {
        if (referencingNodes.length > 0) {
          const col = document.createElement('div');
          col.className = 'col-md-6';
          col.innerHTML = `
            <div class="backlink-card p-3 rounded border">
              <h6 class="backlink-subhead text-muted mb-2"><i class="fas fa-arrow-left me-1"></i> Referenced By (${referencingNodes.length})</h6>
              <ul class="list-unstyled mb-0">
                ${referencingNodes
                  .map(
                    (n) => `
                  <li class="mb-1">
                    <a href="${baseurl}${n.url}" class="fw-semibold text-decoration-none">${n.title}</a>
                    <span class="badge ms-1" style="background: ${CAT_COLORS[n.cat] || '#8a8a8a'}">${(n.cat || '').replace(/-/g, ' ')}</span>
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>
          `;
          backlinksList.appendChild(col);
        }

        if (referencedNodes.length > 0) {
          const col = document.createElement('div');
          col.className = 'col-md-6';
          col.innerHTML = `
            <div class="backlink-card p-3 rounded border">
              <h6 class="backlink-subhead text-muted mb-2"><i class="fas fa-arrow-right me-1"></i> Links To (${referencedNodes.length})</h6>
              <ul class="list-unstyled mb-0">
                ${referencedNodes
                  .map(
                    (n) => `
                  <li class="mb-1">
                    <a href="${baseurl}${n.url}" class="fw-semibold text-decoration-none">${n.title}</a>
                    <span class="badge ms-1" style="background: ${CAT_COLORS[n.cat] || '#8a8a8a'}">${(n.cat || '').replace(/-/g, ' ')}</span>
                  </li>
                `
                  )
                  .join('')}
              </ul>
            </div>
          `;
          backlinksList.appendChild(col);
        }
      }
    }

    // Mini D3 Ego Graph
    const width = container.clientWidth || 600;
    const height = 280;

    container.innerHTML = '';
    const svg = d3
      .select('#mini-post-graph')
      .append('svg')
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    const g = svg.append('g');

    const simulation = d3
      .forceSimulation(localNodes)
      .force(
        'link',
        d3
          .forceLink(localLinks)
          .id((d) => d.id)
          .distance(90)
      )
      .force('charge', d3.forceManyBody().strength(-180))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius((d) => d.r + 20))
      .stop();

    simulation.tick(280);

    const link = g
      .append('g')
      .selectAll('line')
      .data(localLinks)
      .join('line')
      .attr('class', (d) =>
        d.kind === 'cat' ? 'graph-edge graph-edge-cat' : 'graph-edge'
      );

    const node = g
      .append('g')
      .selectAll('g')
      .data(localNodes)
      .join('g')
      .attr('class', (d) => `graph-node ${d.isCurrent ? 'is-current-node' : ''}`)
      .style('cursor', (d) => (d.isCurrent ? 'default' : 'pointer'))
      .on('click', (event, d) => {
        if (!d.isCurrent) window.location.href = baseurl + d.url;
      });

    node
      .append('circle')
      .attr('r', (d) => d.r)
      .attr('fill', (d) => CAT_COLORS[d.cat] || '#8a8a8a')
      .attr('stroke', (d) => (d.isCurrent ? '#fff' : 'none'))
      .attr('stroke-width', (d) => (d.isCurrent ? 3 : 0));

    // Display clean, truncated labels with native hover tooltip
    node
      .append('text')
      .text((d) => (d.title.length > 22 ? d.title.slice(0, 20) + '…' : d.title))
      .attr('class', (d) =>
        d.isCurrent
          ? 'graph-label mini-graph-label is-current-label'
          : 'graph-label mini-graph-label'
      )
      .attr('x', 0)
      .attr('y', (d) => d.r + 13)
      .attr('text-anchor', 'middle');

    node.append('title').text((d) => d.title);

    function updatePositions() {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);
      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    }

    updatePositions();

    const zoom = d3.zoom().on('zoom', (e) => g.attr('transform', e.transform));
    svg.call(zoom);

    // Drag support
    node.call(
      d3
        .drag()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.2).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          const transform = d3.zoomTransform(svg.node());
          d.fx = transform.invertX(event.x);
          d.fy = transform.invertY(event.y);
          updatePositions();
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

    simulation.on('tick', () => {
      updatePositions();
    });

    const xs = localNodes.map((n) => n.x);
    const ys = localNodes.map((n) => n.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const bw = maxX - minX || 1;
    const bh = maxY - minY || 1;
    const scale = Math.min((width - 80) / bw, (height - 80) / bh, 1.2);
    const tx = width / 2 - scale * (minX + bw / 2);
    const ty = height / 2 - scale * (minY + bh / 2);

    svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
  }
});
