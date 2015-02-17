'use strict';

angular.module('fuelPerformanceVisualizerApp')
.controller('TimeReportCtrl', function ($scope, $rootScope, $window, testData) {
	var smallChartXLabels = 6;
	var bigChartXLabels = 15;
	$scope.config = {
		tooltips: true,
		labels: false,
		legend: {
			display: true,
			position: 'left',
		},
		lineLegend: 'traditional',
		colors: [],
		xAxisMaxTicks: smallChartXLabels,
	};

	$scope.chartType = 'line';

	$scope.tests = testData;

	if(typeof $rootScope.datapoints === 'undefined')
		$rootScope.datapoints = 5;

	var reloadCharts = function() {
		_.forEach($scope.tests, function(test){
			var slicer = - $scope.datapoints;
			test.data = test.originalData.slice(slicer);
			test.config = $scope.getConfig(test);
		});

		if($scope.bigTest) {
			$scope.bigTest.config.xAxisMaxTicks = bigChartXLabels;
		}
		$rootScope.datapoints = $scope.datapoints;
	};

	$scope.bigTest = null;
	$scope.selectBigTest = function(t) {
		if($scope.bigTest) {
			$scope.bigTest.config.xAxisMaxTicks = smallChartXLabels;
		}
		$scope.showBigTest = true;
		$scope.bigTest = t;
		$scope.bigTest.config.xAxisMaxTicks = bigChartXLabels;
		$window.scrollTo(0,0);
	};
	$scope.deselectBigTest = function() {
		$scope.showBigTest = false;
		$scope.bigTest.config.xAxisMaxTicks = smallChartXLabels;
		$scope.bigTest = null;
	};
	$scope.showBigTest = false;

	$scope.$watch('datapoints', reloadCharts);

	var stringToColour = function(str) {
		for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
		for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));
		return colour;
	};	

	$scope.getConfig = function(test) {
		var config = $scope.config;
		if(test) {
			config = (angular.extend({}, $scope.config, {colors: [stringToColour(test.name)]}));
		} else {
			config = $scope.config;
		}
		return config;

	};
});
