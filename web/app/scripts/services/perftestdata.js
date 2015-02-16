'use strict';

/**
 * @ngdoc service
 * @name fuelPerformanceVisualizerApp.PerfTestData
 * @description
 * # PerfTestData
 * Service in the fuelPerformanceVisualizerApp.
 */
angular.module('fuelPerformanceVisualizerApp')
.factory('PerfTestData', function ($q, $location) {
	var absUrl = $location.absUrl();
	var url = absUrl.slice(0, absUrl.indexOf('#'))  + 'test_report.csv';

	var deferred = $q.defer();
	var dateFieldName = 'date';
	var unitMultiplier = 1000;

	Papa.parse(url, {
		download: true,
		header: true,
		complete: function(results) {
			var rows = results.data;
			var fields = results.meta.fields;

			var chartData = {};

			chartData = _(fields)
			.without(dateFieldName)
			.map(function(f){ 
				return {
					series: ['time[ms]'],
					originalData: _(rows)
						.filter(function(row) { return row.date.length > 0; })
						.filter(function(row) { return row[f].length > 0; })
						.map(function(row){
							return {
								x: moment(row.date).format('MM-DD H'),
								y: [row[f]*unitMultiplier]
							};
						})
						.value(),
					name: f
				};	
			})
			.value();

			deferred.resolve(chartData);
		},
	});	
	return deferred.promise;
});
