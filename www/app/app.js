// app.js - Business logic here

// Creating module with name cordovaApp
var smartHomeApp = angular.module("cordovaApp", []);
var api_base_url = "http://lethanhtrieu.servehttp.com:1122";

// creating the controller and inject Angular's $scope
smartHomeApp.controller("mainController", [
  "$scope",
  "$http",
  function($scope, $http) {
    $scope.latest_temperature;
    $scope.current_hudimity;
    $scope.latest_time;
    $scope.temperature_labels = [];
    $scope.temperature_data   = [];

    $scope.switchstate  = false;
    $( document ).ready(function() {
      console.log( "ready!" );
      

      if ($scope.switchstate)
      {
        $('#toggle-demo').bootstrapToggle('on');
      }
      else
      {
        $('#toggle-demo').bootstrapToggle('off')
      }

      $('#toggle-demo').change(function() {
        
        $('#toggle-demo').html('Toggle: ' + $(this).prop('checked'))
        ons.notification.toast('Device changed state: ' + $(this).prop('checked'), { timeout: 2000 }); // Shows from 0s to 2s
      })
    });
    	
    $scope.devices_state = {
      "Living Room": true,
      "Bad Room": true,
      "Kitchen Room": false,
      "Garden Lights": true,
      "Garage Light": true,
      "Smart Lamp": false
    };

    $scope.message = "ON";
    $scope.imgs = ["img/light_on.png", "img/light_off.png"];

    $scope.currentCoverImg = $scope.imgs[0];
    $scope.light_on = $scope.imgs[0];
    $scope.light_off = $scope.imgs[0];
    function changeCover(index) {
      console.log("Curent state of " + index);
      $scope.currentCoverImg = $scope.imgs[index];
    }

    $scope.onChange = function(cbState) {
      console.log("Change event on " + cbState);
      // $scope.message = cbState;
      if (cbState) {
        changeCover(0);
        $scope.message = "ON";
      } else {
        changeCover(1);
        $scope.message = "OFF";
      }
    };
    //all your init controller goodness in here
    (function init() {
      // load data, init scope, etc.
     
      $("#datepicker").bootstrapMaterialDatePicker({
        format: "DD/MM/YYYY",
        cancelText: "Cancel",
        time: false,
        clearText: "Cancel"
      });
      $("#id_start_date").bootstrapMaterialDatePicker({
        format: "DD/MM/YYYY",
        cancelText: "Cancel",
        time: false,
        clearText: "Cancel"
      });
      $("#id_end_date").bootstrapMaterialDatePicker({
        format: "DD/MM/YYYY",
        cancelText: "Cancel",
        time: false,
        clearText: "Cancel"
      });
      $scope.chart_start_date = moment().format("DD/MM/YYYY");
      $scope.chart_end_date = moment().format("DD/MM/YYYY");

      $('#datepicker').bootstrapMaterialDatePicker({ weekStart : 0 }).on('change', function(e, date)
      {
        console.log('bootstrapMaterialDatePicker changed: ' + moment(date).format("YYYY-MM-DD"));
      });
      $('#id_start_date').bootstrapMaterialDatePicker({ weekStart : 0 }).on('change', function(e, date)
      {
        console.log('chart_start_date changed: ' + moment(date).format("YYYY-MM-DD"));
        $scope.chart_start_date = moment(date).format("DD/MM/YYYY");
      });
      $('#id_end_date').bootstrapMaterialDatePicker({ weekStart : 0 }).on('change', function(e, date)
      {
        console.log('chart_end_date changed: ' + moment(date).format("YYYY-MM-DD"));
        $scope.chart_end_date = moment(date).format("DD/MM/YYYY");
      });
    
      
      
    })();

    // Flech data from API
    $scope.drawTodayChart = function(date) {
      console.log("Get data of " + date);
      // Simple GET request example:
        $scope.showchartloading = true;
        $scope.temperature_labels = [];
        $scope.temperature_data   = [];
        $http.get(api_base_url + "/nodes/getChartToday")
          .then(function(response) {
            $scope.getdata = response.data.payload; // get data from json
            console.log("Respone getdata: ", $scope.getdata);
            $scope.latest_time = moment(
              $scope.getdata[$scope.getdata.length - 1].sensor_time
            ).format("hh:mmA");
            $scope.current_hudimity = Math.floor(Math.random() * (75 - 69 + 1)) + 69;
            //  console.log("latest_time: ", $scope.latest_time);
            angular.forEach($scope.getdata, function(item) {
              $scope.temperature_labels.push(
                moment(item.sensor_time).format("LT")
              );
              $scope.temperature_data.push(item.payload[0].temperature);
            });
            $scope.min_temperature = Math.min.apply(
              null,
              $scope.temperature_data
            ); // 1
            $scope.max_temperature = Math.max.apply(
              null,
              $scope.temperature_data
            ); // 4
            $scope.latest_temperature =
              $scope.temperature_data[$scope.temperature_data.length - 1];
            $scope.average_temperature = $scope.calculateAverage(
              $scope.temperature_data
            );

            $scope.showchartloading = false;
            $("#temperatureChart").highcharts({
              chart: {
                zoomType: "xy",
                style: {
                  fontFamily: "Helvetica"
                }
              },
              title: {
                text: "Real time temperature"
              },

              subtitle: {
                text: "(Daily chart)"
              },
              tooltip: {
                animation: true
              },
              xAxis: {
                categories: $scope.temperature_labels
              },
              yAxis: {
                title: {
                  text: "C degere"
                }
              },
              legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "middle"
              },
              series: [
                {
                  name: "Temperature",
                  type: "spline",
                  data: $scope.temperature_data,
                  color: "#fc8803"
                }
              ],

              responsive: {
                rules: [
                  {
                    condition: {
                      maxWidth: 420
                    },
                    chartOptions: {
                      legend: {
                        layout: "horizontal",
                        align: "center",
                        verticalAlign: "bottom"
                      }
                    }
                  }
                ]
              }
            });
          });
      }; // Drawchart
      $scope.drawTodayChart (moment().format("YYYY-MM-DD"));
      $scope.calculateAverage = function(MyData){ 
        var sum = 0; 
        for(var i = 0; i < MyData.length; i++){
            sum += parseInt(MyData[i], 10); //don't forget to add the base 
        }
    
        var avg = sum/MyData.length;
    
        return avg; 
    };

    $scope.scan_qr_code = function(){
      cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                  "Result: " + result.text + "\n" +
                  "Format: " + result.format + "\n" +
                  "Cancelled: " + result.cancelled);
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera : true, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
            formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
     );
    };

    $scope.getChartFromDateToDate = function(startDate, endDate, sensor_id){
      $scope.showchartloading = true;
      var string_start_date = moment(startDate, "DD/MM/YYYY").format('YYYY/MM/DD');
      var string_end_date = moment(endDate, "DD/MM/YYYY").format('YYYY/MM/DD');
  
      console.log("Start date: ", startDate);
      console.log("End date: ", endDate);
      console.log("string_start_date date: ", string_start_date);
      console.log("string_end_date date: ", string_end_date);
      var url_chart = api_base_url + "/nodes/getNodeFromDateToDate?sensor_id=" + sensor_id + "&FromDate=" + string_start_date + "&ToDate=" + string_end_date;
      console.log("Call GET: ", url_chart);
      $http.get(url_chart)
        .then(function (response) {
          $scope.temperature_data = [];
          $scope.temperature_labels = [];
          if (response.data.length  > 0)
          {
            $scope.getdata = response.data.payload;; // get data from json
            // console.log("Respone getdata: ", $scope.getdata);
            $scope.latest_time = moment($scope.getdata[$scope.getdata.length - 1].sensor_time).format('LT');
            //  console.log("latest_time: ", $scope.latest_time);
            angular.forEach($scope.getdata, function (item) {
              $scope.temperature_labels.push(moment(item.sensor_time).format('LT'));
              $scope.temperature_data.push(item.payload[0].temperature);
            });
            console.log("Respone temperature_data: ", $scope.temperature_data);
            console.log("Respone temperature_labels: ", $scope.temperature_labels);
            $scope.min_temperature = Math.min.apply(null, $scope.temperature_data) // 1
            $scope.max_temperature = Math.max.apply(null, $scope.temperature_data) // 4
            $scope.latest_temperature = $scope.temperature_data[$scope.temperature_data.length - 1];
            $scope.average_temperature = $scope.calculateAverage($scope.temperature_data);
        
            // Update today chart
            var chart_temperature = $('#temperatureChart').highcharts();
            chart_temperature.series[0].update({data: $scope.temperature_data}, true);
            chart_temperature.xAxis[0].update({categories:  $scope.temperature_labels});
            chart_temperature.redraw();
          }
          $scope.showchartloading = false;
        }); // Get date
    } // getChartFromDateToDate
    
    // Refresh function
    $scope.refreshChartToday = function() {
      $scope.drawTodayChart (moment().format("YYYY-MM-DD"));
      
    };
    // Convert json to array
    $scope.jsonToArray = function(json_data, selector) {
      var arrayData = [];
      for (var i = 0; i < json_data.length; i++) {
        switch (selector) {
          case "sensor_time":
            arrayData.push(moment(json_data[i].sensor_time).format("LT"));
            break;
          case "SerialNumber":
            arrayData.push(json_data[i].SerialNumber);
            break;
          case "Humidity":
            arrayData.push(json_data[i].Humidity);
            break;
          case "temperature":
            arrayData.push(parseFloat(json_data[i].temperature).toFixed(2));
            break;
          case "createdAt":
            arrayData.push(json_data[i].createdAt);
            break;
          case "updatedAt":
            arrayData.push(json_data[i].updatedAt);
            break;
          case "_id":
            arrayData.push(json_data[i]._id);
            break;
          default:
            break;
        }
      }
      return arrayData;
    };
  } // smartHomeApp.controller("mainController"
]); // angular.module("cordovaApp"
