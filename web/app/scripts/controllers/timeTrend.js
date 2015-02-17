'use strict';

angular.module('fuelPerformanceVisualizerApp')
.controller('TimeTrendCtrl', function ($scope, $rootScope, testData) {
	$scope.chart = testData;
	if(typeof $rootScope.datapoints === 'undefined')
		$rootScope.datapoints = 10;

	$scope.chartType = 'line';
	$scope.config = {
		tooltips: true,
		labels: false,
		lineLegend: 'traditional',
		colors: ['#FF0000'],
	};

	$scope.$watch('datapoints', function(count) {
		var slicer = - $scope.datapoints;
		$scope.chart.data = $scope.chart.originalData.slice(slicer);
		$rootScope.datapoints = count;
	});
});
