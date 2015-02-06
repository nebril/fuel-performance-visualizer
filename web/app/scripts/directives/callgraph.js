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
		  console.log("callgraphdir");
		  scope.$watch('graph', function(graph) {
			console.log(graph);
		  });

		  scope.$watch('funcName', function(name) {
			console.log(name);
		  });
      }
    };
  });
