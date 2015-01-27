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
		title: '',
		tooltips: true,
		labels: false,
		mouseover: function() {},
		mouseout: function() {},
		click: function() {},
		legend: {
			display: true,
			position: 'left'
		},
		innerRadius: 0,
		lineLegend: 'lineEnd' // can be also 'traditional'
	};

	$scope.chartType = 'line';

	$scope.tests = [];

	PerfTestData.then(function(value) {
		$scope.tests = value;
	});
});
