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
	var url = absUrl.slice(0, absUrl.indexOf('#'))  + 'test_report.csv?date=' + moment().format();

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
				var test = {
					series: ['time[ms]'],
					originalData: _(rows)
						.filter(function(row) { return row.date.length > 0; })
						.filter(function(row) { return row[f].length > 0; })
						.map(function(row){
							var date = moment(row.date).format('MM-DD H');
							return {
								x: date,
								y: [row[f]*unitMultiplier],
								tooltip: date,
							};
						})
						.value(),
					name: f
				};
				test.lastDataPoint = test.originalData[test.originalData.length - 1].y[0];
				return test;
			})
			.value();

			deferred.resolve(chartData);
		},
	});	
	return deferred.promise;
});
