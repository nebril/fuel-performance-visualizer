'use strict';

angular.module('fuelPerformanceVisualizerApp')
.factory('AvailableGraphs', function ($q, $location, $http) {
	var absUrl = $location.absUrl();
	var absUrlRoot = absUrl.slice(0, absUrl.indexOf('#'));

	var graphsUrl = absUrlRoot + 'dot/graphs.json?date=' + moment().format();

	var deferred = $q.defer();

	$http.get(graphsUrl)
	.success(function(response){
		var data = {
			priority: false,
			graphs: {}
		};
		for(var name in response) {
			if(name === 'priority') {
				data[name] = response[name];
			} else {
				var graphs = response[name];
				graphs = graphs.map(function(graph){
					angular.extend(graph.graph, {
						handler_name: graph.graph.path.slice(graph.graph.path.lastIndexOf('/') + 1),
						originalFile: graph.graph.path.replace('.dot.json', '') + '.prof'
					});
					return graph;
				});
				data.graphs[name] = graphs;
			}
		}	
		deferred.resolve(data);
	});

	return deferred.promise;

});
