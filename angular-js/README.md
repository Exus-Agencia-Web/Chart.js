# ChartJS AngularJS Wrapper

Wrapper oficial de Chart.js para aplicaciones AngularJS (1.x). Esta biblioteca proporciona una integración completa y fácil de usar de Chart.js en aplicaciones legacy de AngularJS.

## Características

- ✅ Integración completa con Chart.js 4.x
- ✅ Directivas declarativas para todos los tipos de gráficos
- ✅ Actualización reactiva de datos y opciones
- ✅ Servicio para gestión avanzada de gráficos
- ✅ Soporte para plugins personalizados
- ✅ Callbacks para eventos del ciclo de vida
- ✅ Compatible con AngularJS 1.2+

## Instalación

### Usando CDN

```html
<!-- AngularJS -->
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>

<!-- ChartJS AngularJS Wrapper -->
<script src="chartjs-angular.js"></script>
```

### Usando NPM/PNPM

```bash
npm install angular chart.js
# o
pnpm add angular chart.js
```

## Configuración

Agrega el módulo `chartjs-angular` como dependencia en tu aplicación:

```javascript
angular.module('myApp', ['chartjs-angular']);
```

## Uso Básico

### Directiva chart-canvas (Recomendada)

La directiva `chart-canvas` es la más flexible y permite crear cualquier tipo de gráfico:

```html
<canvas chart-canvas
        chart-type="line"
        chart-data="myChartData"
        chart-options="myChartOptions"
        chart-id="myChart">
</canvas>
```

**Controlador:**

```javascript
angular.module('myApp').controller('MyController', function($scope) {
  $scope.myChartData = {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [{
      label: 'Ventas 2024',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1
    }]
  };

  $scope.myChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Gráfico de Ventas Mensuales'
      }
    }
  };
});
```

### Directivas Especializadas

También puedes usar directivas especializadas para cada tipo de gráfico:

#### Gráfico de Línea

```html
<chart-line chart-data="lineData" chart-options="lineOptions" chart-id="lineChart"></chart-line>
```

#### Gráfico de Barras

```html
<chart-bar chart-data="barData" chart-options="barOptions" chart-id="barChart"></chart-bar>
```

#### Gráfico Circular (Pie)

```html
<chart-pie chart-data="pieData" chart-options="pieOptions" chart-id="pieChart"></chart-pie>
```

#### Gráfico de Dona (Doughnut)

```html
<chart-doughnut chart-data="doughnutData" chart-options="doughnutOptions" chart-id="doughnutChart"></chart-doughnut>
```

#### Otros tipos disponibles

- `<chart-radar>` - Gráfico de radar
- `<chart-polar-area>` - Gráfico de área polar
- `<chart-bubble>` - Gráfico de burbujas
- `<chart-scatter>` - Gráfico de dispersión

## Ejemplos Avanzados

### Actualización Dinámica de Datos

Los datos y opciones del gráfico se actualizan automáticamente cuando cambian:

```javascript
$scope.updateData = function() {
  $scope.myChartData.datasets[0].data = [
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100,
    Math.random() * 100
  ];
};
```

### Callbacks del Ciclo de Vida

```html
<canvas chart-canvas
        chart-type="bar"
        chart-data="barData"
        chart-options="barOptions"
        on-chart-create="onChartCreated(chart)"
        on-chart-update="onChartUpdated(chart)"
        on-chart-destroy="onChartDestroyed(chart)">
</canvas>
```

```javascript
$scope.onChartCreated = function(chart) {
  console.log('Gráfico creado:', chart);
};

$scope.onChartUpdated = function(chart) {
  console.log('Gráfico actualizado:', chart);
};

$scope.onChartDestroyed = function(chart) {
  console.log('Gráfico destruido:', chart);
};
```

### Usando el Servicio ChartJsService

El servicio `ChartJsService` proporciona métodos avanzados para gestionar gráficos:

```javascript
angular.module('myApp').controller('MyController',
  function($scope, ChartJsService) {

    // Registrar componentes de Chart.js
    ChartJsService.register(
      Chart.LineController,
      Chart.LineElement,
      Chart.PointElement,
      Chart.CategoryScale,
      Chart.LinearScale
    );

    // Obtener una instancia de gráfico
    var chart = ChartJsService.getChart('myChart');

    // Actualizar solo los datos
    ChartJsService.updateChartData('myChart', newData);

    // Actualizar solo las opciones
    ChartJsService.updateChartOptions('myChart', newOptions);

    // Destruir un gráfico manualmente
    ChartJsService.destroyChart('myChart');
  }
);
```

### Usando Plugins Personalizados

```javascript
$scope.customPlugin = {
  id: 'customPlugin',
  beforeDraw: function(chart) {
    // Tu código personalizado aquí
  }
};
```

```html
<canvas chart-canvas
        chart-type="line"
        chart-data="myData"
        chart-plugins="[customPlugin]">
</canvas>
```

## API

### Directiva chart-canvas

**Atributos:**

- `chart-type` (string, requerido): Tipo de gráfico ('line', 'bar', 'pie', 'doughnut', 'radar', 'polarArea', 'bubble', 'scatter')
- `chart-data` (object, requerido): Datos del gráfico en formato Chart.js
- `chart-options` (object, opcional): Opciones de configuración del gráfico
- `chart-id` (string, opcional): ID único del canvas (se genera automáticamente si no se proporciona)
- `chart-plugins` (array, opcional): Array de plugins personalizados
- `on-chart-create` (function, opcional): Callback ejecutado cuando se crea el gráfico
- `on-chart-update` (function, opcional): Callback ejecutado cuando se actualiza el gráfico
- `on-chart-destroy` (function, opcional): Callback ejecutado cuando se destruye el gráfico

### Servicio ChartJsService

**Métodos:**

- `register(...components)`: Registra componentes de Chart.js
- `createOrUpdateChart(canvasId, config)`: Crea o actualiza un gráfico
- `getChart(canvasId)`: Obtiene una instancia de gráfico por ID
- `destroyChart(canvasId)`: Destruye un gráfico
- `updateChartData(canvasId, data)`: Actualiza solo los datos de un gráfico
- `updateChartOptions(canvasId, options)`: Actualiza solo las opciones de un gráfico

## Ejemplo Completo de Gráfico de Línea

```html
<!DOCTYPE html>
<html ng-app="myApp">
<head>
  <title>ChartJS AngularJS Example</title>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"></script>
  <script src="chartjs-angular.js"></script>
</head>
<body ng-controller="ChartController">
  <h1>Ventas Mensuales</h1>

  <canvas chart-canvas
          chart-type="line"
          chart-data="salesData"
          chart-options="chartOptions"
          chart-id="salesChart"
          style="max-width: 800px; margin: 0 auto;">
  </canvas>

  <button ng-click="updateData()">Actualizar Datos</button>

  <script>
    angular.module('myApp', ['chartjs-angular'])
      .controller('ChartController', function($scope) {
        $scope.salesData = {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
          datasets: [{
            label: 'Ventas',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        };

        $scope.chartOptions = {
          responsive: true,
          maintainAspectRatio: true
        };

        $scope.updateData = function() {
          $scope.salesData.datasets[0].data =
            $scope.salesData.datasets[0].data.map(function() {
              return Math.floor(Math.random() * 20);
            });
        };
      });
  </script>
</body>
</html>
```

## Compatibilidad

- **AngularJS**: 1.2.0 o superior
- **Chart.js**: 4.0.0 o superior
- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas 2 versiones)

## Registro de Componentes de Chart.js

Chart.js 4.x utiliza un sistema de registro de componentes. Asegúrate de registrar los componentes que necesitas:

```javascript
// Usando el módulo auto (registra todo automáticamente)
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/auto/auto.umd.min.js"></script>

// O registra componentes manualmente
angular.module('myApp').run(function(ChartJsService) {
  ChartJsService.register(
    Chart.LineController,
    Chart.BarController,
    Chart.LineElement,
    Chart.BarElement,
    Chart.PointElement,
    Chart.CategoryScale,
    Chart.LinearScale,
    Chart.Title,
    Chart.Tooltip,
    Chart.Legend
  );
});
```

## Mejores Prácticas

1. **Usa chart-id único**: Siempre proporciona un `chart-id` único para cada gráfico en tu aplicación
2. **Evita mutaciones directas**: Cuando actualices datos, crea un nuevo objeto en lugar de mutar el existente
3. **Optimiza las actualizaciones**: Usa `$timeout` o `$scope.$applyAsync()` para agrupar actualizaciones
4. **Limpia recursos**: Los gráficos se destruyen automáticamente cuando el scope se destruye, pero puedes destruirlos manualmente si es necesario

## Limitaciones Conocidas

- Chart.js 4.x requiere navegadores con soporte para Canvas API
- AngularJS 1.x es una biblioteca legacy; considera migrar a Angular moderno para nuevos proyectos
- Los gráficos muy complejos con muchos datos pueden afectar el rendimiento

## Soporte

Para reportar issues o contribuir, visita el repositorio oficial de Chart.js:
https://github.com/chartjs/Chart.js

## Licencia

MIT License - Ver LICENSE.md para más detalles

## Recursos Adicionales

- [Documentación de Chart.js](https://www.chartjs.org/docs/latest/)
- [Ejemplos de Chart.js](https://www.chartjs.org/samples/)
- [Documentación de AngularJS](https://docs.angularjs.org/)

---

**Nota**: Este es un wrapper para AngularJS (Angular 1.x). Si estás usando Angular moderno (2+), considera usar paquetes oficiales como `ng2-charts` o `@ng-apexcharts`.
