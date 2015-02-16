'use strict';

/**
 * @ngdoc overview
 * @name fuelPerformanceVisualizerApp
 * @description
 * # fuelPerformanceVisualizerApp
 *
 * Main module of the application.
 */
angular
  .module('fuelPerformanceVisualizerApp', [
    'ngRoute',
    'ngTouch',
	'angularCharts',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/time-report', {
        redirectTo: '/time-report/charts'
      })
      .when('/time-report/trend', {
        templateUrl: 'views/time-trend.html',
        controller: 'TimeTrendCtrl',
		resolve: {
			testData: function(PerfTestDataNormalized) {
				return PerfTestDataNormalized;
			}
		},
      })
      .when('/time-report/charts', {
        templateUrl: 'views/time-report.html',
        controller: 'TimeReportCtrl',
		resolve: {
			testData: function(PerfTestData) {
				return PerfTestData;
			}
		},
      })
      .when('/graph', {
        templateUrl: 'views/graph.html',
        controller: 'CallGraphController',
		resolve: {
			availableGraphs: function(AvailableGraphs) {
				return AvailableGraphs;
			}
		}
      })
      .otherwise({
        redirectTo: '/time-report'
      });
  });
