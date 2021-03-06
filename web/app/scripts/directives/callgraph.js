'use strict';

angular.module('fuelPerformanceVisualizerApp')
.directive('callGraph', function () {
	return {
		templateUrl: '/views/directives/callgraph.html',
		restrict: 'E',
		scope: {
			graph: '=',
			funcName: '=',
		},
		link: function postLink(scope, element, attrs) {
			scope.dataSelected = {};

			var theGraphElement = element.find('.thegraph');
			var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

			var offsetTop = theGraphElement.offset().top

			var resultHeight = viewportHeight - offsetTop;
			theGraphElement.css('height', resultHeight + 'px');

			var allcy, cy;

			var dagreLayout = {
				name: 'dagre',

				// dagre algo options, uses default value on undefined
				nodeSep: 700, // the separation between adjacent nodes in the same rank
				edgeSep: undefined, // the separation between adjacent edges in the same rank
				rankSep: undefined, // the separation between adjacent nodes in the same rank
				rankDir: 'TP', // 'TB' for top to bottom flow, 'LR' for left to right
				minLen: function( edge ){ return 2; }, // number of ranks to keep between the source and target of the edge

				// general layout options
				fit: false, // whether to fit to viewport
				padding: 100, // fit padding
				animate: false, // whether to transition the node positions
				animationDuration: 500, // duration of animation in ms if enabled
				boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
				ready: function(){}, // on layoutready
				stop: function(){} // on layoutstop
			};
			var layout = dagreLayout;

			var allcy = cytoscape({
				ready: function(){ console.log('allcy ready') },
				headless: true,
			});

			var cyOptions = {
				container: element.find('.thegraph')[0],
				style: cytoscape.stylesheet()
				.selector('node')
				.css({
					'content': 'data(label)',
					'text-valign': 'center',
					'color': 'black',
					'background-color' : '#BDECB6',
					'border-color': '#BDECB6',
					'width': 'mapData(percentage, 0, 100, 10, 200)',
					'height': 'mapData(percentage, 0, 100, 10, 200)',
					'border-width': 3,
					'font-size': '25px',
				})
				.selector('edge')
				.css({
					'font-size': '20px',
					'color' : 'black',
					'content': 'data(label)',
					'target-arrow-shape': 'triangle',
					'width': 3,
					'line-color': '#ddd',
					'target-arrow-color': '#ddd'
				})
				.selector(':selected')
				.css({
					'background-color': '#A8F4E3',
					'border-color': '#A8F4E3',
				}),
				layout: layout,
				hideEdgesOnViewport: false,
				hideLabelsOnViewport: true,
			};

			var cy = cytoscape(cyOptions);
			var rebindClick = function() {
				cy.nodes().off('click', onClick);
				cy.nodes().on('click', onClick);
			};

			var redrawGraph = function(node) {
				cy.layout(layout);
				cy.load( cy.elements('*').jsons(), function() { cy.center(node)} );
				window.setTimeout(rebindClick, 500); //because it enters recursion when not timouted	
			};

			var onClick = function() {
				var node = this;

				this.select();

				var original = allcy.$('#' + node.data('id'));
				if(typeof node.data('loadedChildren') !== true) {
					node.data('loadedChildren', true);
					var added = original.neighborhood()

					cy.add(added);
					redrawGraph(node);
				}
			};


			var hideSubgraph = function() {
				cy.remove(this.successors());
				redrawGraph(this);
			};

			var hideSubgraphAndNode = function() {
				cy.remove(this.successors());
				cy.remove(this);
				redrawGraph(this);
			};

			var hideSiblings = function() {
				this.select();
				var siblings = this.incomers().outgoers().filter('node[id != "' + this.id() + '"]');
				hideSubgraphAndNode.apply(siblings);
				redrawGraph(this);
			}

			var hideNode = function() {
				cy.remove(this);
				redrawGraph(this);
			};

			var showNodeDetails = function() {
				scope.dataSelected = this.data();
				scope.$apply();
				$('#nodeModal').modal()
			};

			var cxtMenuDefaults = {
				menuRadius: 100, // the radius of the circular menu in pixels
				selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
				commands: [ // an array of commands to list in the menu
				{
					content: 'Hide subgraph with node',
					select: hideSubgraphAndNode, 
				},
				{
					content: 'Hide subgraph',
					select: hideSubgraph, 
				},
				{
					content: 'Hide all siblings',
					select: hideSiblings,
				},
				{
					content: 'Hide node',
					select: hideNode,
				},
				{
					content: 'Show details',
					select: showNodeDetails,
				},
				], 
				fillColor: 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
				activeFillColor: 'rgba(92, 194, 237, 0.75)', // the colour used to indicate the selected command
				activePadding: 20, // additional size in pixels for the active command
				indicatorSize: 24, // the size in pixels of the pointer to the active command
				separatorWidth: 3, // the empty spacing in pixels between successive commands
				spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
				minSpotlightRadius: 24, // the minimum radius in pixels of the spotlight
				maxSpotlightRadius: 38, // the maximum radius in pixels of the spotlight
				itemColor: 'white', // the colour of text in the command's content
				itemTextShadowColor: 'black', // the text shadow colour of the command's content
				zIndex: 9999 // the z-index of the ui div
			};

			var rebuildGraph = function(funcName) {
				cy.remove(cy.elements());
				cy.add(allcy.nodes("[functionName *= '" + funcName + "']").closedNeighborhood());
				redrawGraph();
			};

			cy.cxtmenu(cxtMenuDefaults);

			scope.$watch('graph', function(graph) {
				allcy.load(graph, function(){
					console.log('allcy loaded');	
				});

				rebuildGraph(scope.funcName);
			});

			scope.$watch('funcName', function(name) {
				rebuildGraph(name);	
			});
		}
	};
});
