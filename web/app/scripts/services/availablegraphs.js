'use strict';

angular.module('fuelPerformanceVisualizerApp')
.factory('AvailableGraphs', function ($q, $location, $http) {
	var absUrl = $location.absUrl();
	var absUrlRoot = absUrl.slice(0, absUrl.indexOf('#'));

	var graphsUrl = absUrlRoot + 'dot/graphs.json';

	var deferred = $q.defer();

	$http.get(graphsUrl)
	.success(function(response){
		var data = {};
		for(name in response) {
			var graphs = response[name];
			graphs = graphs.map(function(graph){
				angular.extend(graph.graph, {
					handler_name: graph.graph.path.slice(graph.graph.path.lastIndexOf('/') + 1)
				});
				return graph;
			});
			data[name] = graphs;
		}	
		deferred.resolve(data);
	});

	return deferred.promise;

});
