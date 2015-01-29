'use strict';

/**
 * @ngdoc service
 * @name fuelPerformanceVisualizerApp.PerfTestData
 * @description
 * # PerfTestData
 * Service in the fuelPerformanceVisualizerApp.
 */
angular.module('fuelPerformanceVisualizerApp')
.factory('PerfTestData', function ($q) {
	var url = 'http://localhost:9000/test_report.csv';

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
								x: moment(row.date).format('YYYY-MM-DD HH:mm'),
								y: [row[f]*unitMultiplier]
							};
						})
						.value(),
					name: f
				};	
			})
			.value();

			deferred.resolve(chartData);
			/*
			deferred.resolve([
				{
				'series': [
					'test1',
				],
				'data': [
					{
					'x': '1am',
					'y': [4],
				},
				{
					'x': '2am',
					'y': [24],
				},
				{
					'x': '3am',
					'y': [33],
				},
				{
					'x': '4am',
					'y': [12],
				},

				]
			}
			]);
		   */
		},
	});	
	return deferred.promise;

});
