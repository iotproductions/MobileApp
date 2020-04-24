// Menu
app.controller("homectrl", function ($scope, $timeout,$http) {
    $scope.title = "Dashboard Home";
    $scope.chart_time = [];
    $scope.chart_data = [];
    $scope.temperature_chart;
    $scope.showchartloading = true;
    $scope.get_data = function () {
      console.log("Call get data !"); 
    //   Swal.fire({
    //     title: 'Loading...',
    //     html: 'Waiting for data loading...',
    //     timer: 1000
    //       });
      $scope.showchartloading = true;
      $http({
        method: "GET",
        url: "http://lethanhtrieu.servehttp.com:1122/nodes/getChartToday",
      }).then(
        function successCallback(response) {
          // this callback will be called asynchronously
          console.log(response.data);
          $scope.data_get = response;
          angular.forEach(response.data.payload, function (value, key) {
            //  console.log(value.createdAt + " " + value.payload[0].temperature);
            $scope.chart_time.push(moment(new Date(value.createdAt)).format('LT'));
            $scope.chart_data.push(value.payload[0].temperature);
          });

          $scope.temperature_chart.series[0].setData($scope.chart_data);
          $scope.temperature_chart.xAxis[0].setCategories($scope.chart_time);

          $scope.showchartloading = false;

          // when the response is available
        },
        function errorCallback(error) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(error);
        }
      );
    };
    // Simple GET request example:
    $scope.plot_temperature_charts = function()
    {
        $scope.temperature_chart = new Highcharts.Chart({

            chart: {
                renderTo: 'id_temperature_chart',
                type: 'spline',
                zoomType: 'xy',
                panning: true,
                panKey: 'shift'
            },
            animation: true,
            title: {
                text: 'Realtime Temperature'
            },
            xAxis: {
                categories: $scope.chart_time
            },
            yAxis: {
                title: {
                    text: '°C'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            loading: {
                hideDuration: 1000,
                showDuration: 1000
            },

            series: [{
                name: 'Temperature',
                data: $scope.chart_data,
                color: '#ff9019'
            }],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });
    }; // Temperature charts



});
    