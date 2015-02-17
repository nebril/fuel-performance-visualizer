'use strict';

angular.module('fuelPerformanceVisualizerApp')
.factory('PerfTestDataNormalized', function ($q, $location) {
	var absUrl = $location.absUrl();
	var url = absUrl.slice(0, absUrl.indexOf('#'))  + 'test_report.csv';

	var deferred = $q.defer();
	var dateFieldName = 'date';
	var unitMultiplier = 100;

	Papa.parse(url, {
		download: true,
		header: true,
		complete: function(results) {
			var rows = results.data;
			var fields = results.meta.fields;


			var testNames = _(fields).without(dateFieldName).value();

			var maxValues = _(rows)
				.filter(function(row) { return row.date.length > 0; })
				.reduce(function(map, row){
					_.forEach(testNames, function(name){
						if(name in map) {
							if(map[name] < row[name]) {
								map[name] = row[name];
							}
						}else {
							map[name] = row[name];
						}
					});
					return map;
				}, {});

			var chart = {
				series: testNames,
				originalData: _(rows)
					.filter(function(row) { return row.date.length > 0; })
					.map(function(row){
						var date = moment(row.date).format('MM-DD H');
						return {
							x: date,
							y: [_(testNames)
								.map(function(name) {
									return row[name]/maxValues[name];
								})
								.reduce(function(sum, current){ return sum + current;}, 0) / testNames.length * unitMultiplier],
							tooltip: date,
						};
					})
					.value(),
			};

			console.log(chart);

			deferred.resolve(chart);
		},
	});	
	return deferred.promise;
});
