var IDRY_UUID_SERVICE = "0000abf0-0000-1000-8000-00805f9b34fb";
var IDRY_UUID_TEMPERATURE_CHAR = "0000abf2-0000-1000-8000-00805f9b34fb";
// var IDRY_UUID_WRITE_DATA = "0000abf2-0000-1000-8000-00805f9b34fb";
var IDRY_UUID_WRITE_DATA = "abf2";
var time_array= [];
var salinity_array = [];
var salinity_chart;
var looperVar;
var connected_id;
var iDry;
var frame_sensor = {
  hour: 0,
  min: 0,
  sec: 0,
  date: 0,
  month: 0,
  year: 0,
  type: 0,
  sensor_value:0
};
var idry_struct = {
  temperature: 0.0,
//  humidity: 20.0,
};

angular.module('UDTapp', ["highcharts-ng"])
.controller('AppCtrl', function($scope) {
 $scope.data_test = 12;
})
.controller('ngcharts', function($scope) {

  $scope.timestamp = [];
  $scope.salinity = [];
  $scope.chartSeries = [
    {"name": "Some data", "data": [1, 2, 4, 7, 3], id: 's1'}
  ];
  
  $scope.chartConfig = {

    chart: {
      height: 340,
      width: 340,
      type: 'spline'
    },
    plotOptions: {
      series: {
        stacking: ''
      },
      xAxis: {
        categories: $scope.timestamp
    },
    },
    series: [{
      name: 'Salinity',
      data:  $scope.salinity,
      color: '#ff9019'
    }],
    title: {
      text: 'Realtime salinity'
    }
  }
 });;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        document.getElementById("button-scan").disabled = false; 
    },
  
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
  
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('exec onDeviceReady');
        app.receivedEvent('deviceready');
        plot_chart();
    },
  
    refreshDeviceList: function() {
        console.log('exec refreshDeviceList');
        document.getElementById("BLE-table-body").innerHTML = ''; // empties the list
        document.getElementById("info").innerHTML = "Device Scanning...";

        // scan for all devices
        ble.scan([], 5, app.onDiscoverDevice, app.onError);
    },

    onDiscoverDevice: function(device) {
        console.log(JSON.stringify(device));
        if ( device.name !== undefined )
        {
          var listItem = document.createElement('tr'),
          html = '<td class="mdl-data-table__cell--non-numeric">' + device.name + '</td>' + 
            '<td class="mdl-data-table__cell--non-numeric">' + device.rssi + '</td>' + 
            '<td class="mdl-data-table__cell--non-numeric">' + device.id + '</td>';
          listItem.setAttribute('onclick',"app.bleConnectionRequest('" + device.id + "')" ); 
          listItem.dataset.deviceId = device.id;  // TODO
          listItem.innerHTML = html;
          document.getElementById("BLE-table-body").appendChild(listItem);
        }
    },
  
    bleConnectionRequest: function(dev_id) {
      connected_id = dev_id;
//      document.getElementById("BLE-table").disabled = true;
      document.getElementById("BLE-table-body").innerHTML = ''; // empties the list
      document.getElementById("info").innerHTML = "Connecting to UDT...";
      ble.connect(dev_id, app.bleConnectionSuccess, app.bleConnectionFailure);
    },
  
    bleConnectionSuccess: function(device) {

      iDry = device;  // store iDry data in global var

      console.log("Connected to device: ",iDry.id);
      document.getElementById("info").innerHTML = "UDT Connected ";
      document.getElementById("debug-info").innerHTML = "Connected to:" + iDry.id;
//      document.getElementById("debug-area").innerHTML = JSON.stringify(device);
      //enable button to "disconnect" 
      document.getElementById("button-scan").disabled = true;
      document.getElementById("button-disconnect").disabled = false;

      ble.startNotification(iDry.id, IDRY_UUID_SERVICE, IDRY_UUID_TEMPERATURE_CHAR, app.idry_temp_notification_handler, null);
      // if connected then start periodic reading of data
      looperVar = setInterval(looper,2000);
    },

    idry_temp_notification_handler: function(buffer) {
    
      // Decode the ArrayBuffer into a typed Array based on the data you expect
      var data = new Uint8Array(buffer);
      console.log("Receviced " , data.byteLength ," bytes");
      console.log("Data: ",data);
      // Kiem tra do dai khung truyen
      if (data.byteLength == 20)
      {
        switch (data[0]) 
        {
          case 0x64:
            if ((data[1] == 0x01) ||  (data[1] == 0x05))
            { 
              frame_sensor.hour  = data[2];
              frame_sensor.min   = data[3];
              frame_sensor.sec   = data[4];
              frame_sensor.date  = data[5];
              frame_sensor.month = data[6];
              frame_sensor.year  = data[7] + 2000;
              var data_array     = [data[9],data[10],data[11],data[12]];
              var number_logs    = ((data[16] << 8) | data[17]);
              // Create a buffer
              var buf = new ArrayBuffer(4);
              // Create a data view of it
              var view = new DataView(buf);
              // set bytes
              data_array.forEach(function (b, i) {
                  view.setUint8(i, b);
              });
              // Read the bits as a float; note that by doing this, we're implicitly
              // converting it from a 32-bit float into JavaScript's native 64-bit double
              var num_float = view.getFloat32(0);
              // Done
              // console.log(num_float);
              frame_sensor.sensor_value = num_float;
              document.getElementById("id_sensor_value").innerHTML = frame_sensor.sensor_value;
              document.getElementById("id_number_logs").innerHTML  = number_logs;
              idry_struct.temperature = num_float;
              var date = new Date(frame_sensor.year , frame_sensor.month - 1, frame_sensor.date, frame_sensor.hour + 7, frame_sensor.min, frame_sensor.sec, 0);
              var local_time = moment(date).format('DD/MM hh:mm a');
              // console.log("Convert time to local: ");
              // console.log(local_time);
              time_array.push(local_time);
              salinity_array.push(num_float); 
              salinity_chart.series[0].setData(salinity_array);
              salinity_chart.xAxis[0].setCategories(time_array);
            }
            break;
          default:
            break;
        }
      }
      // idry_struct.temperature = data[0] + data[1] * 255;
      // document.getElementById("debug-area").innerHTML = data[1] + "  " + data[0];
      updateFancyGauges();
    },
    bleConnectionFailure: function(device) {

      //enable button to "scan" 
      document.getElementById("button-scan").disabled = false;
      document.getElementById("button-disconnect").disabled = true;

      document.getElementById("BLE-table").disabled = false;
      document.getElementById("info").innerHTML = "Not Connected";
      // stop periodic task execution
      clearInterval(looperVar);
    },
  
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      document.getElementById("button-scan").disabled = false;
      document.getElementById("button-scan").innerHTML = "Scan BLE";
      console.log('Received Event: ' + id);
    }
};
// ASCII only
function stringToBytes(string) {
  var array = new Uint8Array(string.length);
  for (var i = 0, l = string.length; i < l; i++) {
      array[i] = string.charCodeAt(i);
   }
   return array.buffer;
}

// ASCII only
function bytesToString(buffer) {
   return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function add_logs()
{
  console.log("Add new logs on charts !");
  time_array = [0];
  salinity_array = [0];
  salinity_chart.series[0].setData(salinity_array);
  salinity_chart.xAxis[0].setCategories(time_array);
  var tx_buffer = new Uint8Array(20);
  tx_buffer[0] = 0x65;
  tx_buffer[1] = 0x08;
  tx_buffer[2] = 0;
  tx_buffer[3] = 0;
  tx_buffer[4] = 0
  tx_buffer[5] = 0;
  tx_buffer[6] = 0;
  tx_buffer[7] = 0;
  tx_buffer[8] = 0;
  tx_buffer[9] = 0;
  tx_buffer[10] = 0;
  tx_buffer[11] = 0;
  tx_buffer[12] = 0;
  tx_buffer[13] = 0;
  tx_buffer[14] = 0;
  tx_buffer[15] = 0;
  tx_buffer[16] = 0;
  tx_buffer[17] = 0;
  tx_buffer[18] = 0;
  tx_buffer[19] = 0;
  
  ble.writeWithoutResponse(connected_id, IDRY_UUID_SERVICE,  IDRY_UUID_WRITE_DATA, tx_buffer.buffer , function(sucess){
    document.getElementById("debug-info").innerHTML = "Send command ADD NEW LOGS success ! ";

  },function(failure){
    document.getElementById("debug-info").innerHTML = "Send command ADD NEW LOGS failed " + failure;

  });
}

function clear_logs()
{
  console.log("Clear logs on charts !");
  time_array = [0];
  salinity_array = [0];
  salinity_chart.series[0].setData(salinity_array);
  salinity_chart.xAxis[0].setCategories(time_array);
  var tx_buffer = new Uint8Array(20);
  tx_buffer[0] = 0x65;
  tx_buffer[1] = 0x05;
  tx_buffer[2] = 0;
  tx_buffer[3] = 0;
  tx_buffer[4] = 0
  tx_buffer[5] = 0;
  tx_buffer[6] = 0;
  tx_buffer[7] = 0;
  tx_buffer[8] = 0;
  tx_buffer[9] = 0;
  tx_buffer[10] = 0;
  tx_buffer[11] = 0;
  tx_buffer[12] = 0;
  tx_buffer[13] = 0;
  tx_buffer[14] = 0;
  tx_buffer[15] = 0;
  tx_buffer[16] = 0;
  tx_buffer[17] = 0;
  tx_buffer[18] = 0;
  tx_buffer[19] = 0;
  
  ble.writeWithoutResponse(connected_id, IDRY_UUID_SERVICE,  IDRY_UUID_WRITE_DATA, tx_buffer.buffer , function(sucess){
    document.getElementById("debug-info").innerHTML = "Send command CLEAR LOGS success ! ";

  },function(failure){
    document.getElementById("debug-info").innerHTML = "Send command CLEAR LOGS failed " + failure;

  });
}

function ble_get_data()
{
  var tx_buffer = new Uint8Array(20);
  tx_buffer[0] = 0x64;
  tx_buffer[1] = 0x01;
  tx_buffer[2] = 0;
  tx_buffer[3] = 0;
  tx_buffer[4] = 0
  tx_buffer[5] = 0;
  tx_buffer[6] = 0;
  tx_buffer[7] = 0;
  tx_buffer[8] = 0;
  tx_buffer[9] = 0;
  tx_buffer[10] = 0;
  tx_buffer[11] = 0;
  tx_buffer[12] = 0;
  tx_buffer[13] = 0;
  tx_buffer[14] = 0;
  tx_buffer[15] = 0;
  tx_buffer[16] = 0;
  tx_buffer[17] = 0;
  tx_buffer[18] = 0;
  tx_buffer[19] = 0;
  
  ble.writeWithoutResponse(connected_id, IDRY_UUID_SERVICE,  IDRY_UUID_WRITE_DATA, tx_buffer.buffer , function(sucess){
    document.getElementById("debug-info").innerHTML = "Send command GET DATA success ! ";

  },function(failure){
    document.getElementById("debug-info").innerHTML = "Send command GET DATA failed " + failure;

  });
}

function read_logs()
{
  var start_index = $("#log_index_start"). val();
  var stop_index = $("#log_index_stop"). val();
  console.log("Start Index: ", start_index);
  console.log("Stop Index: ", stop_index);
  if ((start_index >= 0) && (start_index < stop_index))
  {
    
    time_array = [];
    salinity_array = [];
    var tx_buffer = new Uint8Array(20);
    tx_buffer[0] = 0x64;
    tx_buffer[1] = 0x05;
    tx_buffer[2] = ((start_index << 8) & 0xFF);
    tx_buffer[3] = (start_index & 0xFF);
    tx_buffer[4] = ((stop_index << 8) & 0xFF);
    tx_buffer[5] = (stop_index & 0xFF);
    tx_buffer[6] = 0;
    tx_buffer[7] = 0;
    tx_buffer[8] = 0;
    tx_buffer[9] = 0;
    tx_buffer[10] = 0;
    tx_buffer[11] = 0;
    tx_buffer[12] = 0;
    tx_buffer[13] = 0;
    tx_buffer[14] = 0;
    tx_buffer[15] = 0;
    tx_buffer[16] = 0;
    tx_buffer[17] = 0;
    tx_buffer[18] = 0;
    tx_buffer[19] = 0;
    console.log("Read logs packet: ",tx_buffer);
    
    ble.writeWithoutResponse(connected_id, IDRY_UUID_SERVICE,  IDRY_UUID_WRITE_DATA, tx_buffer.buffer , function(sucess){
      document.getElementById("debug-info").innerHTML = "Send command Read logs success ! ";

    },function(failure){
      document.getElementById("debug-info").innerHTML = "Send command  Read logs failed " + failure;

    });
  }
  else
  {
    Swal.fire('Wrong value', 'Please enter valid index', 'error')
  }

}

function start_stop_measure()
{
  console.log("Send command Start/Stop sensor !");
  const tx_buffer = new Uint8Array(20);
  tx_buffer[0] = 0x65;
  tx_buffer[1] = 0x07;
  tx_buffer[2] = 0;
  tx_buffer[3] = 0;
  tx_buffer[4] = 0;
  tx_buffer[5] = 0;
  tx_buffer[6] = 0;
  tx_buffer[7] = 0;
  tx_buffer[8] = 0;
  tx_buffer[9] = 0;
  tx_buffer[10] = 0;
  tx_buffer[11] = 0;
  tx_buffer[12] = 0;
  tx_buffer[13] = 0;
  tx_buffer[14] = 0;
  tx_buffer[15] = 0;
  tx_buffer[16] = 0;
  tx_buffer[17] = 0;
  tx_buffer[18] = 0;
  tx_buffer[19] = 0;

  ble.writeWithoutResponse(connected_id, IDRY_UUID_SERVICE,  IDRY_UUID_WRITE_DATA, tx_buffer.buffer , function(sucess){
    document.getElementById("debug-info").innerHTML = "Send command START/STOP success ! ";

  },function(failure){
    document.getElementById("debug-info").innerHTML = "Send command START/STOP failed " + failure;

  });
}

function set_sample_time(sample_time)
{
  console.log("Sample time: ", sample_time);
  const tx_buffer = new Uint8Array(20);
  tx_buffer[0] = 0x65;
  tx_buffer[1] = 0x06;
  tx_buffer[2] = 0;
  tx_buffer[3] = sample_time;
  tx_buffer[4] = 0;
  tx_buffer[5] = 0;
  tx_buffer[6] = 0;
  tx_buffer[7] = 0;
  tx_buffer[8] = 0;
  tx_buffer[9] = 0;
  tx_buffer[10] = 0;
  tx_buffer[11] = 0;
  tx_buffer[12] = 0;
  tx_buffer[13] = 0;
  tx_buffer[14] = 0;
  tx_buffer[15] = 0;
  tx_buffer[16] = 0;
  tx_buffer[17] = 0;
  tx_buffer[18] = 0;
  tx_buffer[19] = 0;

  ble.writeWithoutResponse(connected_id, IDRY_UUID_SERVICE,  IDRY_UUID_WRITE_DATA, tx_buffer.buffer , function(sucess){
    document.getElementById("debug-info").innerHTML = "Set sample time to: " + sample_time;

  },function(failure){
    document.getElementById("debug-info").innerHTML = "Set Sample time failed " + failure;

  });
}

function ble_write_data()
{
  var current_timestamp = moment().tz("Asia/Ho_Chi_Minh");
  console.log('Current timestamp: ' + current_timestamp);
  var now = new Date(current_timestamp);
  var current_time = now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate() + ' '+now.getUTCHours() + ':'+now.getMinutes() + ':'+now.getSeconds();
  console.log('Current time: ' + current_time);
  const tx_buffer = new Uint8Array(20);
  tx_buffer[0] = 0x65;
  tx_buffer[1] = 0x04;
  tx_buffer[2] = now.getUTCHours();
  tx_buffer[3] = now.getMinutes();
  tx_buffer[4] = now.getSeconds();
  tx_buffer[5] = now.getDate();
  tx_buffer[6] = now.getMonth()+ 1;
  tx_buffer[7] = now.getFullYear() - 2000;
  tx_buffer[8] = 0;
  tx_buffer[9] = 0;
  tx_buffer[10] = 0;
  tx_buffer[11] = 0;
  tx_buffer[12] = 0;
  tx_buffer[13] = 0;
  tx_buffer[14] = 0;
  tx_buffer[15] = 0;
  tx_buffer[16] = 0;
  tx_buffer[17] = 0;
  tx_buffer[18] = 0;
  tx_buffer[19] = 0;

  ble.writeWithoutResponse(connected_id, IDRY_UUID_SERVICE,  IDRY_UUID_WRITE_DATA, tx_buffer.buffer , function(sucess){
    document.getElementById("debug-info").innerHTML = "Send data success ! ";

  },function(failure){
    document.getElementById("debug-info").innerHTML = "Send data fail ! " + failure;

  });
}

setTimeout(function () {
  app.initialize(); 
  } ,2000);
  

var looperCnt = 0;

function looper() {
  document.getElementById("info").innerHTML = "Receiving data frame: " + looperCnt++;
}

function plot_chart() {
  salinity_chart = new Highcharts.Chart({

      chart: {
          renderTo: 'id_salinity_chart',
          type: 'spline',
          zoomType: 'xy',
          panning: true,
          panKey: 'shift'
      },
      animation: true,
      title: {
          text: 'Realtime Salinity'
      },
      xAxis: {
          categories: time_array
      },
      yAxis: {
          title: {
              text: 'g/L'
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
          name: 'Salinity',
          data: salinity_array,
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
};
  

// tab menu helper
function openPage(evt, pageName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(pageName).style.display = "block";
    evt.currentTarget.className += " active";

    
}
// Gauge helper
function createCharts() {

  var basicGaugeSettings  = {
    id: "tbd",
    title: "Salinity",
    label: "g/L",
    value: 0,
    gaugeWidthScale: 0.6, // Do lon cua vien gauge chart
    min: 0,
    max: 50.0,
    decimals: 2,
    counter: true,
    donut: false,
    relativeGaugeSize: true,
  }
  
  basicGaugeSettings.id    = "salinity-gauge";
  temperatureGauge = new JustGage(basicGaugeSettings);
  updateTemperatureGauge();
}

function updateFancyGauges() {
 
    // update Stat Symple
    updateTemperatureGauge();
}

function setGaugeSize(id){
//  var size = Math.min(window.innerHeight, window.innerWidth) / 2;
  var size = (window.innerHeight * 0.9) / 2;
  document.getElementById(id).style.width =  window.innerWidth + 'px';
  document.getElementById(id).style.height = size + 'px';
}
// Draw or Redraw meterial (desicant, tank) chart
function updateTemperatureGauge() {
  setGaugeSize("salinity-gauge");
  temperatureGauge.refresh(idry_struct.temperature / 1.0);
}


