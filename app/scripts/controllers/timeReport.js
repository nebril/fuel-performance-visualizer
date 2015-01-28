'use strict';

/**
 * @ngdoc function
 * @name fuelPerformanceVisualizerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the fuelPerformanceVisualizerApp
 */
angular.module('fuelPerformanceVisualizerApp')
.controller('TimeReportCtrl', function ($scope, PerfTestData) {
	$scope.config = {
		tooltips: true,
		labels: false,
		mouseover: function() {},
		mouseout: function() {},
		click: function() {},
		legend: {
			display: true,
			position: 'left'
		},
		lineLegend: 'traditional' // can be also 'traditional'
	};

	$scope.chartType = 'line';

	$scope.tests = [];

	PerfTestData.then(function(value) {
		$scope.tests = value;
	});
});
