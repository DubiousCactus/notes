document.addEventListener('DOMContentLoaded', function () {
  (function () {
    const wrap = document.getElementById('post-graph-wrap');
    const container = document.getElementById('post-graph');
    if (!container || !wrap) return;
    const baseurl = container.dataset.baseurl || '';

    fetch(`${baseurl}/graph.json`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.nodes || !data.nodes.length) {
          const emptyMsg = document.getElementById('post-graph-empty');
          if (emptyMsg) emptyMsg.classList.remove('d-none');
          return;
        }
        render(data);
      })
      .catch((err) => {
        console.error('Failed to load graph data:', err);
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

      let width = container.clientWidth || 800;
      let height = container.clientHeight || 480;

      container.innerHTML = '';

      const svg = d3
        .select('#post-graph')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', [0, 0, width, height]);

      const g = svg.append('g').attr('class', 'graph-main');

      // Create Tooltip DOM
      let tooltip = wrap.querySelector('.graph-tooltip');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'graph-tooltip';
        wrap.appendChild(tooltip);
      }

      // Adjacency and degree maps
      const refDegree = {};
      const neighborMap = {};

      data.nodes.forEach((n) => {
        neighborMap[n.id] = new Set([n.id]);
      });

      data.links.forEach((l) => {
        const s = l.source;
        const t = l.target;

        if (neighborMap[s]) neighborMap[s].add(t);
        if (neighborMap[t]) neighborMap[t].add(s);

        if (l.kind === 'ref') {
          refDegree[s] = (refDegree[s] || 0) + 1;
          refDegree[t] = (refDegree[t] || 0) + 1;
        }
      });

      // Nodes data with radius and organic center starting positions
      const nodes = data.nodes.map((n) => {
        const r =
          n.type === 'category'
            ? 14
            : 4.5 + 2 * Math.sqrt(refDegree[n.id] || 0);
        const angle = Math.random() * 2 * Math.PI;
        const dist = Math.random() * 80;
        return {
          ...n,
          r,
          x: width / 2 + Math.cos(angle) * dist,
          y: height / 2 + Math.sin(angle) * dist
        };
      });

      // Force simulation
      const simulation = d3
        .forceSimulation(nodes)
        .force(
          'link',
          d3
            .forceLink(data.links)
            .id((d) => d.id)
            .distance((d) => (d.kind === 'cat' ? 75 : 50))
            .strength((d) => (d.kind === 'cat' ? 0.6 : 0.35))
        )
        .force('charge', d3.forceManyBody().strength(-140).distanceMax(380))
        .force('center', d3.forceCenter(width / 2, height / 2).strength(0.8))
        .force('collide', d3.forceCollide().radius((d) => d.r + 10).iterations(2))
        .force('x', d3.forceX(width / 2).strength(0.04))
        .force('y', d3.forceY(height / 2).strength(0.04))
        .stop();

      // Synchronously settle layout
      simulation.tick(280);

      // Render Links
      const link = g
        .append('g')
        .attr('class', 'graph-links')
        .selectAll('line')
        .data(data.links)
        .join('line')
        .attr('class', (d) =>
          d.kind === 'cat' ? 'graph-edge graph-edge-cat' : 'graph-edge'
        );

      // Render Nodes
      const node = g
        .append('g')
        .attr('class', 'graph-nodes')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .attr('class', (d) => `graph-node graph-node-${d.type}`)
        .style('cursor', 'pointer');

      node
        .append('circle')
        .attr('r', (d) => d.r)
        .attr('fill', (d) => CAT_COLORS[d.cat] || '#8a8a8a');

      // Labels
      let labelsVisible = true;
      const label = node
        .append('text')
        .text((d) => d.title)
        .attr('class', (d) =>
          d.type === 'category' ? 'graph-label graph-label-cat' : 'graph-label'
        )
        .attr('x', 0)
        .attr('y', (d) => d.r + 12)
        .attr('text-anchor', 'middle');

      // Update positions of links and nodes
      function updatePositions() {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y);
        node.attr('transform', (d) => `translate(${d.x},${d.y})`);
      }

      // Set positions BEFORE fitting and displaying
      updatePositions();

      // Zoom behavior
      const zoom = d3
        .zoom()
        .scaleExtent([0.15, 5])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
        });

      svg.call(zoom).on('dblclick.zoom', null);

      function fit(animated = false) {
        const currentWidth = container.clientWidth || width;
        const currentHeight = container.clientHeight || height;

        svg.attr('viewBox', [0, 0, currentWidth, currentHeight]);

        const xs = nodes.map((n) => n.x);
        const ys = nodes.map((n) => n.y);
        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        const bw = maxX - minX || 1;
        const bh = maxY - minY || 1;
        const padding = 50;

        const scale = Math.min(
          (currentWidth - padding * 2) / bw,
          (currentHeight - padding * 2) / bh,
          1.3
        );
        const tx = currentWidth / 2 - scale * (minX + bw / 2);
        const ty = currentHeight / 2 - scale * (minY + bh / 2);

        const transform = d3.zoomIdentity.translate(tx, ty).scale(scale);

        if (animated) {
          svg.transition().duration(500).ease(d3.easeCubicOut).call(zoom.transform, transform);
        } else {
          svg.call(zoom.transform, transform);
        }
      }

      // Initial fit cleanly centers and zooms the graph
      fit(false);

      // --- Persistent Filter State Management ---
      let activeCategoryFilter = 'all';
      const postCards = document.querySelectorAll('#post-list .card-wrapper');

      function applyFilterState() {
        if (activeCategoryFilter === 'all') {
          node.classed('is-highlighted', false);
          node.classed('is-dimmed', false);
          link.classed('is-highlighted', false);
          link.classed('is-dimmed', false);
        } else {
          const matchingNodes = nodes.filter((n) => n.cat === activeCategoryFilter);
          const matchingIds = new Set(matchingNodes.map((n) => n.id));

          node.classed('is-highlighted', (n) => matchingIds.has(n.id));
          node.classed('is-dimmed', (n) => !matchingIds.has(n.id));

          link.classed('is-highlighted', (l) => {
            const sId = l.source.id || l.source;
            const tId = l.target.id || l.target;
            return matchingIds.has(sId) || matchingIds.has(tId);
          });
          link.classed('is-dimmed', (l) => {
            const sId = l.source.id || l.source;
            const tId = l.target.id || l.target;
            return !matchingIds.has(sId) && !matchingIds.has(tId);
          });
        }

        postCards.forEach((card) => {
          const cardCat = card.dataset.cat;
          if (activeCategoryFilter === 'all' || cardCat === activeCategoryFilter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }

      // --- Hover Effects (Obsidian Style) ---
      function highlightNode(d) {
        const neighbors = neighborMap[d.id] || new Set([d.id]);

        node.classed('is-highlighted', (n) => neighbors.has(n.id));
        node.classed('is-dimmed', (n) => !neighbors.has(n.id));

        link.classed('is-highlighted', (l) => {
          const sId = l.source.id || l.source;
          const tId = l.target.id || l.target;
          return sId === d.id || tId === d.id;
        });
        link.classed('is-dimmed', (l) => {
          const sId = l.source.id || l.source;
          const tId = l.target.id || l.target;
          return sId !== d.id && tId !== d.id;
        });

        const catName = (d.cat || '').replace(/-/g, ' ');
        const catColor = CAT_COLORS[d.cat] || '#8a8a8a';
        const degree = neighborMap[d.id] ? neighborMap[d.id].size - 1 : 0;

        tooltip.innerHTML = `
          <div class="tooltip-title">${d.title}</div>
          <div class="tooltip-meta">
            <span class="tooltip-cat" style="background: ${catColor}">${catName}</span>
            ${d.date ? `<span>${d.date}</span>` : ''}
            <span>${degree} ${degree === 1 ? 'connection' : 'connections'}</span>
          </div>
        `;
        tooltip.classList.add('is-visible');
      }

      function unhighlightNode() {
        tooltip.classList.remove('is-visible');
        document.querySelectorAll('#post-list .card-wrapper').forEach((c) => c.classList.remove('is-graph-hovered'));
        // Restore active category filter state when hover ends!
        applyFilterState();
      }

      node
        .on('mouseenter', (event, d) => {
          highlightNode(d);
          const card = document.querySelector(`#post-list .card-wrapper[data-url="${d.url}"]`);
          if (card) card.classList.add('is-graph-hovered');
        })
        .on('mousemove', (event) => {
          const rect = wrap.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          tooltip.style.transform = `translate(${x + 14}px, ${y + 14}px)`;
        })
        .on('mouseleave', () => {
          unhighlightNode();
        })
        .on('click', (event, d) => {
          window.location.href = baseurl + d.url;
        })
        .on('dblclick', (event, d) => {
          event.stopPropagation();
          const currentWidth = container.clientWidth || 800;
          const currentHeight = container.clientHeight || 480;
          const targetScale = 2.2;
          const tx = currentWidth / 2 - targetScale * d.x;
          const ty = currentHeight / 2 - targetScale * d.y;
          svg
            .transition()
            .duration(600)
            .ease(d3.easeCubicOut)
            .call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(targetScale));
        });

      svg.on('dblclick', () => {
        fit(true);
      });

      // --- Bi-directional Post Card Hover Sync ---
      postCards.forEach((card) => {
        const cardUrl = card.dataset.url;
        if (!cardUrl) return;

        card.addEventListener('mouseenter', () => {
          const matchedNode = nodes.find(
            (n) => n.url === cardUrl || n.id === cardUrl
          );
          if (matchedNode) {
            highlightNode(matchedNode);
          }
        });

        card.addEventListener('mouseleave', () => {
          unhighlightNode();
        });
      });

      // --- Node Dragging ---
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

      // --- Category Filter Pills ---
      const filterContainer = document.getElementById('post-graph-filter');
      if (filterContainer) {
        const categories = Array.from(
          new Set(data.nodes.map((n) => n.cat).filter(Boolean))
        );

        filterContainer.innerHTML = `
          <button class="filter-pill active" data-cat="all">All Notes</button>
          ${categories
            .map((c) => {
              const color = CAT_COLORS[c] || '#8a8a8a';
              const name = c.replace(/-/g, ' ');
              return `<button class="filter-pill" data-cat="${c}">
                <span class="pill-dot" style="background:${color}"></span>${name}
              </button>`;
            })
            .join('')}
        `;

        filterContainer.querySelectorAll('.filter-pill').forEach((btn) => {
          btn.onclick = () => {
            filterContainer
              .querySelectorAll('.filter-pill')
              .forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            activeCategoryFilter = btn.dataset.cat;
            applyFilterState();
          };
        });
      }

      // --- Controls Toolbar ---
      let controls = wrap.querySelector('.graph-controls');
      if (!controls) {
        controls = document.createElement('div');
        controls.className = 'graph-controls';
        controls.innerHTML = `
          <button class="graph-btn" id="graph-btn-zoom-in" title="Zoom In">+</button>
          <button class="graph-btn" id="graph-btn-zoom-out" title="Zoom Out">−</button>
          <button class="graph-btn" id="graph-btn-reset" title="Reset View">🎯</button>
          <button class="graph-btn" id="graph-btn-labels" title="Toggle Labels">🏷️</button>
          <button class="graph-btn" id="graph-btn-fullscreen" title="Toggle Fullscreen">⛶</button>
        `;
        wrap.appendChild(controls);
      }

      controls.querySelector('#graph-btn-zoom-in').onclick = () => {
        svg.transition().duration(300).call(zoom.scaleBy, 1.3);
      };
      controls.querySelector('#graph-btn-zoom-out').onclick = () => {
        svg.transition().duration(300).call(zoom.scaleBy, 0.7);
      };
      controls.querySelector('#graph-btn-reset').onclick = () => {
        fit(true);
      };
      controls.querySelector('#graph-btn-labels').onclick = (e) => {
        labelsVisible = !labelsVisible;
        label.style('display', labelsVisible ? null : 'none');
        e.currentTarget.classList.toggle('active', !labelsVisible);
      };

      function toggleFullscreen() {
        wrap.classList.toggle('is-fullscreen');
        const isFS = wrap.classList.contains('is-fullscreen');
        const fsBtn = controls.querySelector('#graph-btn-fullscreen');
        if (fsBtn) fsBtn.classList.toggle('active', isFS);
        if (isFS) {
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = '';
        }
        requestAnimationFrame(() => {
          setTimeout(() => {
            fit(true);
          }, 50);
        });
      }

      controls.querySelector('#graph-btn-fullscreen').onclick = () => {
        toggleFullscreen();
      };

      // Press Escape to exit fullscreen
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && wrap.classList.contains('is-fullscreen')) {
          toggleFullscreen();
        }
      });

      // --- Sticky Graph on Scroll ---
      let isSticky = false;
      const initialWrapTop = wrap.getBoundingClientRect().top + window.scrollY;

      window.addEventListener('scroll', () => {
        if (wrap.classList.contains('is-fullscreen')) return;

        const scrollY = window.scrollY;
        const shouldBeSticky = scrollY > initialWrapTop + 140;

        if (shouldBeSticky !== isSticky) {
          isSticky = shouldBeSticky;
          wrap.classList.toggle('is-sticky', isSticky);
          requestAnimationFrame(() => {
            fit(false);
          });
        }
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        fit(false);
      });
    }
  })();
});
