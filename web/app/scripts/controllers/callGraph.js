'use strict';

angular.module('fuelPerformanceVisualizerApp')
.controller('CallGraphController', function ($scope, availableGraphs) {
	$scope.graphs = availableGraphs;
	$scope.funcName = 'runapp';
	$scope.graphData = { trololo: 'trolo'};

	$scope.selectGraph = function(graph) {
		console.log(graph);	
	};
});
