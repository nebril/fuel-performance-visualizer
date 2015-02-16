'use strict';

angular.module('fuelPerformanceVisualizerApp')
.controller('TimeTrendCtrl', function ($scope, testData) {
	$scope.chart = testData;

	$scope.chartType = 'line';
	$scope.config = {
		tooltips: true,
		labels: false,
		lineLegend: 'traditional',
	};
});
