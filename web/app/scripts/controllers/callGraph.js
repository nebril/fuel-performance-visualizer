'use strict';

angular.module('fuelPerformanceVisualizerApp')
.controller('CallGraphController', function ($scope, $http, availableGraphs) {
	$scope.graphs = availableGraphs;
	$scope.funcName = 'runapp';
	$scope.selectedGraph = null;

	$scope.selectGraph = function(graph) {
		$http.get(graph.path)
			.success(function(data) {
				$scope.graphData = data;
				$scope.selectedGraph = graph;
			})
			.error(function() {
				console.error('Cold not load graph');
			});
	};
});
