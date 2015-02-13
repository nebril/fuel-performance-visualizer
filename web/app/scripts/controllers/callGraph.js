'use strict';

angular.module('fuelPerformanceVisualizerApp')
.controller('CallGraphController', function ($scope, $http, $location, availableGraphs) {
	console.log(availableGraphs);
	var absUrl = $location.absUrl();
	var absUrlRoot = absUrl.slice(0, absUrl.indexOf('#'));

	$scope.tests = availableGraphs;
	$scope.funcName = 'handle_class';
	$scope.selectedGraph = null;
	$scope.selectedNode = null;
	$scope.search = {
		test_name: ''
	};
	$scope.graphSearch = {
		graph: {path: ''}
	};

	$scope.selectGraph = function(graph) {
		$http.get(absUrlRoot + graph.path)
			.success(function(data) {
				$scope.graphData = data;
				$scope.selectedGraph = graph;
			})
			.error(function() {
				console.error('Cold not load graph');
			});
	};

	$scope.filterByName = function(tests) {
		var result = {};
		for(var name in tests) {
			if ($scope.search.test_name.length === 0 || (name.indexOf($scope.search.test_name) > -1)){
				result[name] = tests[name];
			}
		}
		return result;
	};
});
