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
			availableGraphs: function($location) {
				var absUrl = $location.absUrl();
				var url = absUrl.slice(0, absUrl.indexOf('#'))  + 'custom.json';
				var original = absUrl.slice(0, absUrl.indexOf('#'))  + 'custom.prof';

				// TODO mkwiek: get actual list of graphs
				return [
					{
						name: 'graph',
						path: url,
						originalFile: original,
					},
					{
						name: 'graph2',
						path: url,
						originalFile: original,
					},
				];
			}
		}
      })
      .otherwise({
        redirectTo: '/time-report'
      });
  });
