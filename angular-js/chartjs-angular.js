/**
 * ChartJS AngularJS Wrapper
 *
 * Este módulo proporciona una integración completa de Chart.js para aplicaciones AngularJS (1.x).
 * Incluye directivas, servicios y utilidades para trabajar con gráficos de forma declarativa.
 *
 * @version 1.0.0
 * @license MIT
 */

(function(angular) {
  'use strict';

  /**
   * Módulo principal chartjs-angular
   */
  var chartjsAngular = angular.module('chartjs-angular', []);

  /**
   * Servicio ChartJsService
   * Gestiona las instancias de Chart.js y proporciona métodos de utilidad
   */
  chartjsAngular.service('ChartJsService', ['$window', function($window) {
    var Chart = $window.Chart;
    var chartInstances = {};

    /**
     * Registra componentes de Chart.js
     */
    this.register = function() {
      if (Chart && Chart.register) {
        Chart.register.apply(Chart, arguments);
      }
    };

    /**
     * Crea o actualiza un gráfico
     */
    this.createOrUpdateChart = function(canvasId, config) {
      var existingChart = chartInstances[canvasId];

      if (existingChart) {
        existingChart.destroy();
      }

      var canvas = document.getElementById(canvasId);
      if (!canvas) {
        console.error('Canvas element not found:', canvasId);
        return null;
      }

      var chart = new Chart(canvas, config);
      chartInstances[canvasId] = chart;
      return chart;
    };

    /**
     * Obtiene una instancia de gráfico por ID
     */
    this.getChart = function(canvasId) {
      return chartInstances[canvasId] || Chart.getChart(canvasId);
    };

    /**
     * Destruye un gráfico
     */
    this.destroyChart = function(canvasId) {
      var chart = chartInstances[canvasId];
      if (chart) {
        chart.destroy();
        delete chartInstances[canvasId];
      }
    };

    /**
     * Actualiza los datos de un gráfico existente
     */
    this.updateChartData = function(canvasId, data) {
      var chart = this.getChart(canvasId);
      if (chart) {
        chart.data = data;
        chart.update();
      }
    };

    /**
     * Actualiza las opciones de un gráfico existente
     */
    this.updateChartOptions = function(canvasId, options) {
      var chart = this.getChart(canvasId);
      if (chart) {
        chart.options = options;
        chart.update();
      }
    };
  }]);

  /**
   * Directiva chart-canvas
   * Permite crear gráficos de Chart.js de forma declarativa
   *
   * Uso:
   * <canvas chart-canvas
   *         chart-type="line"
   *         chart-data="myData"
   *         chart-options="myOptions"
   *         chart-id="myChart">
   * </canvas>
   */
  chartjsAngular.directive('chartCanvas', ['ChartJsService', '$timeout', function(ChartJsService, $timeout) {
    return {
      restrict: 'A',
      scope: {
        chartType: '@',
        chartData: '=',
        chartOptions: '=?',
        chartId: '@',
        chartPlugins: '=?',
        onChartCreate: '&?',
        onChartUpdate: '&?',
        onChartDestroy: '&?'
      },
      link: function(scope, element, attrs) {
        var chart = null;
        var canvasId = scope.chartId || 'chart-' + scope.$id;

        // Establecer el ID del canvas si no existe
        if (!element.attr('id')) {
          element.attr('id', canvasId);
        }

        /**
         * Crea o actualiza el gráfico
         */
        function createOrUpdateChart() {
          if (!scope.chartType || !scope.chartData) {
            return;
          }

          var config = {
            type: scope.chartType,
            data: scope.chartData,
            options: scope.chartOptions || {},
            plugins: scope.chartPlugins || []
          };

          $timeout(function() {
            chart = ChartJsService.createOrUpdateChart(canvasId, config);

            if (chart && scope.onChartCreate) {
              scope.onChartCreate({chart: chart});
            }
          });
        }

        /**
         * Actualiza el gráfico existente
         */
        function updateChart() {
          if (chart) {
            chart.data = scope.chartData;
            chart.options = scope.chartOptions || {};
            chart.update();

            if (scope.onChartUpdate) {
              scope.onChartUpdate({chart: chart});
            }
          } else {
            createOrUpdateChart();
          }
        }

        // Observar cambios en el tipo de gráfico
        scope.$watch('chartType', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            createOrUpdateChart();
          }
        });

        // Observar cambios en los datos
        scope.$watch('chartData', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            updateChart();
          }
        }, true);

        // Observar cambios en las opciones
        scope.$watch('chartOptions', function(newValue, oldValue) {
          if (newValue && newValue !== oldValue) {
            updateChart();
          }
        }, true);

        // Inicializar el gráfico
        createOrUpdateChart();

        // Limpiar al destruir
        scope.$on('$destroy', function() {
          if (chart) {
            if (scope.onChartDestroy) {
              scope.onChartDestroy({chart: chart});
            }
            ChartJsService.destroyChart(canvasId);
            chart = null;
          }
        });
      }
    };
  }]);

  /**
   * Directiva chart-line
   * Directiva especializada para gráficos de línea
   */
  chartjsAngular.directive('chartLine', function() {
    return {
      restrict: 'E',
      template: '<canvas chart-canvas chart-type="line" chart-data="chartData" chart-options="chartOptions" chart-id="{{chartId}}"></canvas>',
      scope: {
        chartData: '=',
        chartOptions: '=?',
        chartId: '@'
      }
    };
  });

  /**
   * Directiva chart-bar
   * Directiva especializada para gráficos de barras
   */
  chartjsAngular.directive('chartBar', function() {
    return {
      restrict: 'E',
      template: '<canvas chart-canvas chart-type="bar" chart-data="chartData" chart-options="chartOptions" chart-id="{{chartId}}"></canvas>',
      scope: {
        chartData: '=',
        chartOptions: '=?',
        chartId: '@'
      }
    };
  });

  /**
   * Directiva chart-pie
   * Directiva especializada para gráficos circulares
   */
  chartjsAngular.directive('chartPie', function() {
    return {
      restrict: 'E',
      template: '<canvas chart-canvas chart-type="pie" chart-data="chartData" chart-options="chartOptions" chart-id="{{chartId}}"></canvas>',
      scope: {
        chartData: '=',
        chartOptions: '=?',
        chartId: '@'
      }
    };
  });

  /**
   * Directiva chart-doughnut
   * Directiva especializada para gráficos de dona
   */
  chartjsAngular.directive('chartDoughnut', function() {
    return {
      restrict: 'E',
      template: '<canvas chart-canvas chart-type="doughnut" chart-data="chartData" chart-options="chartOptions" chart-id="{{chartId}}"></canvas>',
      scope: {
        chartData: '=',
        chartOptions: '=?',
        chartId: '@'
      }
    };
  });

  /**
   * Directiva chart-radar
   * Directiva especializada para gráficos de radar
   */
  chartjsAngular.directive('chartRadar', function() {
    return {
      restrict: 'E',
      template: '<canvas chart-canvas chart-type="radar" chart-data="chartData" chart-options="chartOptions" chart-id="{{chartId}}"></canvas>',
      scope: {
        chartData: '=',
        chartOptions: '=?',
        chartId: '@'
      }
    };
  });

  /**
   * Directiva chart-polar-area
   * Directiva especializada para gráficos de área polar
   */
  chartjsAngular.directive('chartPolarArea', function() {
    return {
      restrict: 'E',
      template: '<canvas chart-canvas chart-type="polarArea" chart-data="chartData" chart-options="chartOptions" chart-id="{{chartId}}"></canvas>',
      scope: {
        chartData: '=',
        chartOptions: '=?',
        chartId: '@'
      }
    };
  });

  /**
   * Directiva chart-bubble
   * Directiva especializada para gráficos de burbujas
   */
  chartjsAngular.directive('chartBubble', function() {
    return {
      restrict: 'E',
      template: '<canvas chart-canvas chart-type="bubble" chart-data="chartData" chart-options="chartOptions" chart-id="{{chartId}}"></canvas>',
      scope: {
        chartData: '=',
        chartOptions: '=?',
        chartId: '@'
      }
    };
  });

  /**
   * Directiva chart-scatter
   * Directiva especializada para gráficos de dispersión
   */
  chartjsAngular.directive('chartScatter', function() {
    return {
      restrict: 'E',
      template: '<canvas chart-canvas chart-type="scatter" chart-data="chartData" chart-options="chartOptions" chart-id="{{chartId}}"></canvas>',
      scope: {
        chartData: '=',
        chartOptions: '=?',
        chartId: '@'
      }
    };
  });

})(window.angular);
