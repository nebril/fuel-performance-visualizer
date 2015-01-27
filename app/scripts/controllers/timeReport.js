'use strict';

/**
 * @ngdoc function
 * @name fuelPerformanceVisualizerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the fuelPerformanceVisualizerApp
 */
angular.module('fuelPerformanceVisualizerApp')
.controller('TimeReportCtrl', function ($scope) {
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

	$scope.tests = [
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
	},
	{
		'series': [
			'test2',
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
	},
	{
		'series': [
			'test3',
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
	},
	];



});
