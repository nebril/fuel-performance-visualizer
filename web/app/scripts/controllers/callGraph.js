'use strict';

angular.module('fuelPerformanceVisualizerApp')
.controller('CallGraphController', function ($scope, $rootScope, $http, $location, availableGraphs) {
	var absUrl = $location.absUrl();
	var absUrlRoot = absUrl.slice(0, absUrl.indexOf('#'));

	$scope.tests = availableGraphs.graphs;
	$scope.onlyFailedTests = availableGraphs.priority;
	$scope.funcName = 'handle_class';
	$scope.selectedGraph = null;
	$scope.selectedNode = null;

	if(typeof $rootScope.testSearch === 'undefined')
		$rootScope.testSearch = {
			test_name: ''
		};

	if(typeof $rootScope.graphSearch === 'undefined')
		$rootScope.graphSearch = {
			graph: {handler_name: ''}
		};

	var addLabels = function(data) {
		data.nodes.map(function(node) {
			console.log(node);
			node.data.label = node.data.functionName + 
				', ' + node.data.percentage + '%, ' + 
				node.data.callCount + 'x';
		});

		return data;
	};

	$scope.selectGraph = function(graph) {
		$http.get(absUrlRoot + graph.path)
			.success(function(data) {
				addLabels(data);
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
			if ($scope.testSearch.test_name.length === 0 || (name.indexOf($scope.testSearch.test_name) > -1)){
				result[name] = tests[name];
			}
		}
		return result;
	};
});
