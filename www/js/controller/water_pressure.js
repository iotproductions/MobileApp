var ChartPressure;
app.controller("water_pressurectrl", function ($scope, $rootScope) { 
    $scope.Profile = Profile;
    $scope.LockValve = SWMPInfo.LockValve;//edit 28/09/2018
    $scope.LockValveTemp = SWMPInfo.LockValve;//edit 28/09/2018
    $scope.SimMode = SWMPInfo.SimMode;//edit 28/09/2018
    $scope.TimeOutSetting = null;//edit 28/09/2018

    
    $scope.Language = Language;
    $scope.ChartTitle = "";
    $scope.TypeChartDate = "D";
    $scope.TypeChart = "line";// line , bar
    $scope.DateGet = new Date();
    $scope.PressureCode = "";
    $scope.NewIndex = {
    }
    SetDigest($scope);

    GetListPressureDeviceByCustomer(SWMPInfo.CustomerCodeReg,function(result){// Get list Pressure
        if(result != null){
            if(result.success == true){
                $scope.PressureCode = result.data[0].PressureCode;
                GetNewIndexPressure($scope.PressureCode, function(PressureIndex){
                    if(PressureIndex != null){
                        if(PressureIndex.success == true){
                            $scope.NewIndex = PressureIndex.data;
                            SetDigest($scope);
                        }
                    }
                });

                ShowChartPressure($scope.DateGet,$scope.PressureCode,$scope.TypeChartDate,$scope.TypeChart,$scope);
            }
        }
    })
    GetTitleChart($scope.DateGet, $scope.TypeChartDate, function (title) {//Lấy tiêu đề theo thời gian
        $scope.ChartTitle = title;
        SetDigest($scope);
    });
   
    $scope.BackChart = function(){
        ShowLoading();
        if ($scope.TypeChartDate == "D") {
            $scope.DateGet = new Date($scope.DateGet.setDate($scope.DateGet.getDate() - 1));// lấy ngày trước
        }else if ($scope.TypeChartDate == "M") {
                $scope.DateGet = new Date($scope.DateGet.setMonth($scope.DateGet.getMonth() - 1));// lấy ngày này THÁNG trước
        } else if ($scope.TypeChartDate == "Y") {
                $scope.DateGet = new Date($scope.DateGet.setFullYear($scope.DateGet.getFullYear() - 1));// lấy ngày này NĂM trước
        }
        SetDigest($scope);
        GetTitleChart($scope.DateGet, $scope.TypeChartDate, function (title) {//Lấy tiêu đề theo thời gian
            $scope.ChartTitle = title;
            SetDigest($scope);
        });
        ShowChartPressure($scope.DateGet,$scope.PressureCode,$scope.TypeChartDate,$scope.TypeChart,$scope);
    }

    $scope.CurrentChart = function(){
        ShowLoading();
        $scope.DateGet = new Date();
        SetDigest($scope);

        GetTitleChart($scope.DateGet, $scope.TypeChartDate, function (title) {//Lấy tiêu đề theo thời gian
            $scope.ChartTitle = title;
            SetDigest($scope);
        });
        ShowChartPressure($scope.DateGet,$scope.PressureCode,$scope.TypeChartDate,$scope.TypeChart,$scope);
    }

    $scope.NextChart = function(){
        ShowLoading();
        var DateTemp = new Date($scope.DateGet);
        var CurrentDate = new Date();
        if ($scope.TypeChartDate == "D") {
            DateTemp = new Date(DateTemp.setDate(DateTemp.getDate() + 1));// lấy ngày sau
        } else if ($scope.TypeChartDate == "M") {
                DateTemp = new Date(DateTemp.setMonth(DateTemp.getMonth() + 1));// lấy ngày này THÁNG kế tiếp
        } else if ($scope.TypeChartDate == "Y") {
                DateTemp = new Date(DateTemp.setFullYear(DateTemp.getFullYear() + 1));// lấy ngày này NĂM kế tiếp
        }
        $scope.DateGet = DateTemp;
        SetDigest($scope);
        GetTitleChart($scope.DateGet, $scope.TypeChartDate, function (title) {//Lấy tiêu đề theo thời gian
            $scope.ChartTitle = title;
            SetDigest($scope);
        });
        ShowChartPressure($scope.DateGet,$scope.PressureCode,$scope.TypeChartDate,$scope.TypeChart,$scope);
    }

    $scope.SetTypeChartDate = function (Type) {
        ShowLoading();
        $scope.DateGet = new Date();
        $scope.TypeChartDate = Type;
        SetDigest($scope);
        GetTitleChart($scope.DateGet, $scope.TypeChartDate, function (title) {//Lấy tiêu đề theo thời gian
            $scope.ChartTitle = title;
            SetDigest($scope);
        });
        ShowChartPressure($scope.DateGet,$scope.PressureCode,$scope.TypeChartDate,$scope.TypeChart,$scope);
    }             
    
    $scope.SetLockValveWater = function () {
        SetLockValveWater($scope);
    }
});


function GetTitleChart(DateGet, TypeChartDate, callback) {

    var ChartTitle = "";
    if (TypeChartDate.toLowerCase() == "d") {
        ChartTitle = Language.DATE +" " + GetDateStringVN(DateGet);
    }else if (TypeChartDate.toLowerCase() == "m") {
        var MonthNames = [Language.MONTH + " 1", Language.MONTH + " 2", Language.MONTH + " 3", Language.MONTH + " 4", Language.MONTH + " 5", Language.MONTH + " 6", Language.MONTH + " 7", Language.MONTH + " 8", Language.MONTH + " 9", Language.MONTH + " 10", Language.MONTH + " 11", Language.MONTH + " 12"];
        DateGet = new Date(DateGet);
        ChartTitle = MonthNames[DateGet.getMonth()];
        ChartTitle = ChartTitle + "/" + DateGet.getFullYear();
        
    } else if (TypeChartDate.toLowerCase() == "y") {
        DateGet = new Date(DateGet);
        ChartTitle = Language.YEAR+ " " +  DateGet.getFullYear();
    }

    callback(ChartTitle);
}

function GetDateString(date) {
    date = new Date(date);
    return date.getFullYear() + '/' + (date.getMonth() + 1) + "/" + date.getDate();
}

function GetDateStringVN(date) {
    date = new Date(date);
    return date.getDate() + "/" + (date.getMonth() + 1) + '/' + date.getFullYear();
}

function GetListPressureDevice(Page,PageLimit, callback) {
    $.ajax({
        url: ip + "/api/GetListPressureDevice?token=" + Profile.Token, 
        type: "GET", 
        dataType: "JSON", 
        data: { Page:Page, PageLimit:PageLimit},
        timeout: 45000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
            HideLoading();
        }
    });
}

function GetListPressureDeviceByCustomer(CustomerCodeReg, callback) {
    $.ajax({
        url: ip + "/api/GetListPressureDeviceByOwner?token=" + Profile.Token, 
        type: "GET", 
        dataType: "JSON", 
        data: { CustomerCodeReg:CustomerCodeReg},
        timeout: 45000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
            HideLoading();
        }
    });
}

function GetNewIndexPressure(PressureCode, callback) {
    $.ajax({
        url: ip + "/api/GetNewIndexByPressureCode?token=" + Profile.Token, 
        type: "GET", 
        dataType: "JSON", 
        data: { PressureCode:PressureCode},
        timeout: 45000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
            HideLoading();
        }
    });
}

function GetChartPressureByDate(FullDate, PressureCode, callback) {
    var DateGet = GetDateString(FullDate);
    $.ajax({
        url: ip + "/api/GetListDataChartPressureByDate?token=" + Profile.Token, 
        type: "GET", 
        dataType: "JSON", 
        data: { 
            PressureCode:PressureCode,
            FromDate:DateGet
        },
        timeout: 45000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
            HideLoading();
        }
    });
}

function GetChartPressureByMonth(FullDate, PressureCode,callback) {
    FullDate = new Date(FullDate);
    var MonthGet = FullDate.getMonth() + 1;
    var YearGet = FullDate.getFullYear();
    $.ajax({
        url: ip + "/api/GetListDataChartPressureByMonth?token=" + Profile.Token, 
        type: "GET", 
        dataType: "JSON", 
        data: { 
            PressureCode:PressureCode,
            Month:MonthGet,
            Year:YearGet
        },
        timeout: 45000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
            HideLoading();
        }
    });
}

function GetChartPressureByYear(FullDate, PressureCode, callback) {
    FullDate = new Date(FullDate);
    var YearGet = FullDate.getFullYear();
    $.ajax({
        url: ip + "/api/GetListDataChartPressureByYear?token=" + Profile.Token, 
        type: "GET", 
        dataType: "JSON", 
        data: { 
            PressureCode:PressureCode,
            Year:YearGet
        },
        timeout: 45000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
            HideLoading();
        }
    });
}

function ShowChartPressure(FullDate, PressureCode, TypeChartDate, TypeChart, scope) {
    //Hàm lấy dữ liệu gas, sau đó gọi hàm Renderchart để vẽ biểu đồ
    //FullDate : thời gian cần vẻ(yyyy/MM/dd) ; 
    //TypeChartDate: ngày || tháng || năm  (d - m - y)
    //TypeChart: loại biểu đồ -  line, bar
    var Labels = [];
    var Datas = []; // Mảng data - 1 chart => 1 mảng data, 2 chart -  2 mảng data
    if (TypeChartDate == "D") {
        GetChartPressureByDate(FullDate, PressureCode, function (result) {//Lấy dữ liệu ngày để 
                if (result != null) {
                    if (result.success == true) {
                        Datas.push([]);
                        for (var i = 0; i < result.data.length; i++) {
                            Labels[i] = result.data[i].TimeLabel;
                            Datas[0][i] = result.data[i].SumInTime;
                        }
                        RenderChartPressure(TypeChartDate,"line", FullDate, Labels, Datas);
                        if( IsItemOfJsonInArrayNull(result.data,"SumInTime")){
                            $(".label-no-data-chart-pressure").show();
                        }else{
                            $(".label-no-data-chart-pressure").hide();
                        }
                    } else {//false
                        HideLoading();
                        Datas.push([]);
                        for (var i = 0; i <= 96; i++) {
                            Datas[0].push(null);
                        }
                        RenderChartPressure(TypeChartDate,"line", FullDate, Labels, Datas);
                        $(".label-no-data-chart-pressure").show();
                    }
                } else {//null
                    // Lỗi ko kết nối dc server hoặc ko có kết nối
                    HideLoading();
                    for (var i = 0; i <= 96; i++) {
                        Datas[0].push(null);
                    }
                    RenderChartPressure(TypeChartDate,"line", FullDate, Labels, Datas);
                    $(".label-no-data-chart-pressure").show();
                }
            })
    
        
    } else if (TypeChartDate == "M") {//Biểu đồ tháng
        GetChartPressureByMonth(FullDate, PressureCode, function (result) {// Lấy dữ liệu THÁNG để RenderChartPressure
                if (result != null) {
                    if (result.success == true) {
                      
                        Datas.push([]);
                        Datas.push([]);
                        // for (var i = 0; i < result.data.length; i++) {
                        //     Labels[i] = result.data[i].TimeLabel;
                        //     Datas[0][i] = result.data[i].SumInTime;
                        // }
                        for (var i = 0; i < result.data.length; i++) {
                            Labels.push(result.data[i].TimeLabel);
                            Datas[0].push(result.data[i].MinPressureValue);
                            Datas[1].push(result.data[i].MaxPressureValue);
                        }
                        RenderChartPressure(TypeChartDate,"bar", FullDate, Labels, Datas);
                        if( IsItemOfJsonInArrayNull(result.data,"MinPressureValue") && IsItemOfJsonInArrayNull(result.data,"MaxPressureValue")){
                            $(".label-no-data-chart-pressure").show();
                        }else{
                            $(".label-no-data-chart-pressure").hide();
                        }
                    } else {//false
                        HideLoading();
                        Datas.push(DataChartNull(TypeChartDate, FullDate));
                        RenderChartPressure(TypeChartDate,"line", FullDate, Labels, Datas);
                        $(".label-no-data-chart-pressure").show();
                    }
                } else {//null
                    // Lỗi ko kết nối dc server hoặc ko có kết nối
                    HideLoading();
                    Datas.push(DataChartNull(TypeChartDate, FullDate));
                    RenderChartPressure(TypeChartDate,"line", FullDate, Labels, Datas);
                    $(".label-no-data-chart-pressure").show();
                }
            });
        
    } else if (TypeChartDate == "Y") {//Biểu đồ năm
        GetChartPressureByYear(FullDate, PressureCode, function (result) {// Lấy dữ liệu NĂM để RenderChartPressure
                if (result != null) {
                    if (result.success == true) {
                        Datas.push([]);
                        Datas.push([]);
                        // for (var i = 0; i < result.data.length; i++) {
                        //     Labels[i] = result.data[i].TimeLabel;
                        //     Datas[0][i] = result.data[i].SumInTime;
                        // }
                        for (var i = 0; i < result.data.length; i++) {
                            Labels.push(result.data[i].TimeLabel);
                            Datas[0].push(result.data[i].MinPressureValue);
                            Datas[1].push(result.data[i].MaxPressureValue);
                        }
                        RenderChartPressure(TypeChartDate,"bar", FullDate, Labels, Datas);
                        if( IsItemOfJsonInArrayNull(result.data,"MinPressureValue") && IsItemOfJsonInArrayNull(result.data,"MaxPressureValue")){
                            $(".label-no-data-chart-pressure").show();
                        }else{
                            $(".label-no-data-chart-pressure").hide();
                        }
                    } else {//false
                        HideLoading();
                        Datas.push(DataChartNull(TypeChartDate, FullDate));
                        RenderChartPressure(TypeChartDate,"line", FullDate, Labels, Datas);
                        $(".label-no-data-chart-pressure").show();
                    }
                } else {//null
                    // Lỗi ko kết nối dc server hoặc ko có kết nối
                    HideLoading();
                    Datas.push(DataChartNull(TypeChartDate, FullDate));
                    RenderChartPressure(TypeChartDate,"line", FullDate, Labels, Datas);
                    $(".label-no-data-chart-pressure").show();
                }
            })

    }
}



function RenderChartPressure(TypeChartDate, TypeChart, DateGet, Labels, Datas) {
    var Datasets = [];
    var MaxValue = -999;//Max value  chart
    var IndexDataMax = 0;
    var SuggestedMax;
    var SuggestedMin;
    var StepSize;
    var MinValue = 999;
    var IndexDataMin = 0;
    var plugin = {
                afterRender: function(chart, options) {
                    HideLoading();
                }
            };
    for (var i = 0; i < Datas.length; i++) {
        if (arrayMax(Datas[i]) > MaxValue) {
            MaxValue = arrayMax(Datas[i]);
            IndexDataMax = i;
        }

        if (arrayMin(Datas[i]) < MinValue) {
            MinValue = arrayMin(Datas[i]);
            IndexDataMin = i;
        }
    }

     /*Xử lý suggest min max. step size */
     if (MaxValue == 0) {
        SuggestedMax = 1.2;
        SuggestedMin = 0;
        StepSize = 0.2;
    } else {
        if(MaxValue == MinValue){
            SuggestedMax = MaxValue *2;
            SuggestedMin = 0;
            StepSize = Math.round(SuggestedMax/7);
        }else{
            SuggestedMax = MaxValue;
            SuggestedMin = 0;
            StepSize = RoundNumber((SuggestedMax - SuggestedMin) / 7);
            SuggestedMax = RoundNumber((SuggestedMax - SuggestedMax % StepSize )+ (StepSize * 2));
        }
       
    }
    
    /*End Xử lý suggest min max. step size */

    /*Xử lý datasets */
    // console.log(Datas);
    // console.log(StepSize);
    // console.log(SuggestedMax);
    // console.log(SuggestedMin);
    // console.log(ShowLabelChartPressure(TypeChartDate, DateGet));
    for (var i = 0; i < Datas.length; i++) {// xử lý Datasets cho mảng datas
        if (TypeChart == "line") {
            Datasets.push({
                fill: false,
                borderColor: "#0BD6D6",
                pointBorderColor: "#0BD6D6",
                pointBackgroundColor: "#000",
                pointHoverBackgroundColor: "#000",
                pointHoverBorderColor: "#0BD6D6",
                pointBorderWidth: 2,
                pointHoverRadius: 2,
                pointHoverBorderWidth:2,
                pointRadius: 0,//3
                fill: false,
                borderWidth: 2,
                data: Datas[i],
            });
        } else if (TypeChart == "bar") {
            if (i == 0) {
                // Xử lý màu cột
                    var bg = [];
                    var bghover = [];
                    for (var j = 0; j < Datas[i].length; j++) { // kiểm tra giá trị min có âm hay không, không âm thì màu transparent
                        if (Datas[i][j] >= 0) {
                            bg.push("rgba(0,0,0,0)");
                            bghover.push("rgba(0,0,0,0)");
                        } else {
                            bg.push("#0BD6D6");
                            bghover.push("rgba(255,255,255,0.3)");
                        }
                    }
                    Datasets.push({
                        borderColor: bg,
                        backgroundColor: bg,
                        hoverBackgroundColor: bghover,
                        hoverBorderColor: bghover,
                        data: Datas[i].slice(0),
                    });


            }else{ //i > 0
                var DataMax = [];
                var bg = [];
                for (var j = 0; j < Datas[i].length; j++) { // Lấy chênh lệch giữa Min và Max để vẻ
                    if (Datas[i][j] != null) {
                        if (Datas[i - 1][j] >= 0) {//Giá trị min không âm thì lấy chênh lệch => min ko âm thì max ko âm
                            
                            if(arrayMax(Datas[i]) < 1){//Edit 06/08/2018 trường hơp max < 1
                                if(Datas[i][j] - Datas[i - 1][j] < 0.01){ 
                                    DataMax.push( Datas[i][j] - Datas[i - 1][j] + 0.01);
                                }else{
                                    DataMax.push(Datas[i][j] - Datas[i - 1][j]);
                                }
                            }else{
                                if(Datas[i][j] - Datas[i - 1][j] < 0.1){ //Edit 06/08/2018 trường hơp max >= 1
                                    DataMax.push( Datas[i][j] - Datas[i - 1][j] + 0.06);
                                }else{
                                    DataMax.push(Datas[i][j] - Datas[i - 1][j]);
                                }
                            }

                            bg.push("#0BD6D6");
                        } else { // Min Âm 
                            if (Datas[i][j] >= 0) {// Max ko âm lấy max
                                DataMax.push(Datas[i][j]);
                                bg.push("#0BD6D6");

                                Datasets[0].hoverBackgroundColor[j] = "rgba(255,255,255,0.3)";
                                Datasets[0].hoverBorderColor[j] = "rgba(255,255,255,0.3)";
                            }else {// Max âm
                                // DataMax.push(Datas[i-1][j]);// Gán ngược Min = Max
                                var tp = Datas[i][j] * 1;
                                var tp1 = Datas[i - 1][j] * 1;
                                Datasets[0].data[j] = Datas[i][j] * 1;// Gán ngược Min = Max

                                // Xử lý min max gần bằng nhau
                                if(tp1 - tp > -1){
                                    DataMax.push(tp1 - tp - 0.5);
                                }else{
                                    DataMax.push(tp1 - tp);// Max = Min - Max
                                }

                                bg.push("#0BD6D6");
                                Datasets[0].borderColor[j] = "rgba(0,0,0,0)";// Màu cột min
                                Datasets[0].backgroundColor[j] = "rgba(0,0,0,0)";
                                Datasets[0].hoverBackgroundColor[j] = "rgba(0,0,0,0)";
                                Datasets[0].hoverBorderColor[j] = "rgba(0,0,0,0)";
                            }

                        }
                    } else {
                        DataMax.push(Datas[i][j]);
                        bg.push("rgba(0,0,0,0)");
                    }
                }
                Datasets.push({
                    borderColor: bg,
                    backgroundColor: bg,
                    hoverBackgroundColor: "rgba(255,255,255,0.3)",
                    hoverBorderColor: "rgba(255,255,255,0.3)",
                    data: DataMax,
                });
            }
        }
    }
    /*End xử lý datasets */
    // console.log(Datasets);
    if (ChartPressure != undefined && typeof ChartPressure != "undefined" ) {
        ChartPressure.destroy();
    }
        Chart.defaults.global.defaultFontColor = 'white';
        Chart.defaults.global.defaultFontSize = GetFontSizeChart();
        var ctx = document.getElementById('chart-pressure').getContext('2d');
        ChartPressure = new Chart(ctx, {
            type: TypeChart,
            plugins: [plugin],
            data:
            {
                labels: ShowLabelChartPressure(TypeChartDate, DateGet),
                datasets: Datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                legend: {
                    display: false
                },

                scales: {
                    yAxes: [{
                        gridLines:
                        {
                            color: "rgba(0, 0, 0, .3)",
                            offsetGridLines: true,
                            drawBorder: false,
                            padding: 10,
                        },
                        ticks: {
                            beginAtZero: false,
                            suggestedMax: SuggestedMax,
                            suggestedMin: SuggestedMin,
                            max: SuggestedMax,
                            min: SuggestedMin,
                            stepSize: StepSize,//4
                            callback: function (value) {//Format number giá trị cột Y
                            //    return RoundNumber(value);
                            if(value == 0){
                                return "0.000";
                            }else{
                                return numberWithCommas(value.toFixed(3));
                            }
                            
                            }
                        },
                        stacked: TypeChart.toLowerCase() == "bar" ? true : false,
                    }],
                    xAxes: [{
                        // maxBarThickness: 7,
                        // barPercentage: 0.8,
                        // categoryPercentage: 0.7,
                        ticks: {
                            maxRotation: 0, // xoay label 0
                            autoSkip: false// Tắt tự động render label
                        },
                        gridLines: {
                            color: "rgba(0, 0, 0, 0)",
                            drawBorder: false, // Thuộc tính vẽ đường kẻ bottom cho chart.
                        },
                        stacked: TypeChart.toLowerCase() == "bar" ? true : false,
                    }]
                },
                tooltips: {
                    // mode: "x-axis",
                    enabled: true,
                    intersect: false,
                    mode: "x",
                    callbacks: {
                        title: function (data) {
                            if (TypeChartDate == 'D') {
                                return Language.TIME +" " + Labels[data[0].index];//"Thời gian "
                            } else if (TypeChartDate == 'M') {
                                return Language.DATE +" "+ Labels[data[0].index];//"Ngày " 
                            } else if (TypeChartDate == 'Y') {
                                return Language.MONTH +" "+ Labels[data[0].index];//"Tháng " 
                            }
                        
                        },
                        label: function (tooltipItem, data) {
                            return;
                        },
                        afterBody: function (tooltipItem,data) {
                            var text = [];
                            if (TypeChartDate == 'D') {
                                text.push(Language.WATER_PRESSURE + " : " + data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index] + " bar");//Áp suất nước
                            } else if (TypeChartDate == 'M') {
                                text.push(Language.WATER_PRESSURE + " " + Language.HIGHEST +" : " + ConvertToFloat( data.datasets[tooltipItem[1].datasetIndex].data[tooltipItem[1].index]) + " bar");//Áp suất nước cao nhất
                                text.push(Language.WATER_PRESSURE + " " + Language.LOWEST +" : " + ConvertToFloat( data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index]) + " bar");//Áp suất nước thấp nhất
                            } else if (TypeChartDate == 'Y') {
                                text.push(Language.WATER_PRESSURE + " " + Language.HIGHEST +" : " + ConvertToFloat( data.datasets[tooltipItem[1].datasetIndex].data[tooltipItem[1].index]) + " bar");//Áp suất nước cao nhất
                                text.push(Language.WATER_PRESSURE + " " + Language.LOWEST +" : " + ConvertToFloat( data.datasets[tooltipItem[0].datasetIndex].data[tooltipItem[0].index]) + " bar");//Áp suất nước thấp nhất
                            }
                            //data.datasets[0].datamin[tooltipItem.index];
                            return text;
                        }

                    }
                },

            }
        }
        );
    


}


function GetFontSizeChart() {
    var FontSize = 14;
    if (window.innerWidth >= 320 && window.innerWidth < 412) {
        FontSize = 14;
    }
    if (window.innerWidth >= 412) {
        FontSize = 16;
    }
    if (window.innerWidth >= 600) {
        FontSize = 19;
    }
    if (window.innerWidth >= 768) {
        FontSize = 20;
    }

    return FontSize;
}
function DataChartNull(TypeChartDate, FullDate){
    var Data =[];
    FullDate = new Date(FullDate);
    if(TypeChartDate == "d"){
        for(var i=0; i<23; i++){
            Data.push(null);
        }
    }else if(TypeChartDate == "m"){
        var days = FullDate.getDate();
        for(var i=1; i < days.length; i++){
            Data.push(null);
        }
    }else if(TypeChartDate == "y"){
         for(var i=1; i<12; i++){
            Data.push(null);
        }
    }
    return Data;
  }

function ShowLabelChartPressure(TypeChart, DateGet) {
    if (TypeChart == "D") {
        var h = [];
        for (var i = 0; i <= 24; i++) {
            if (i % 3 == 0) {
                h.push(i);
                if (i != 24) {
                    h.push("");
                    h.push("");
                    h.push("");
                }
            } else {
                h.push("");
                h.push("");
                h.push("");
                h.push("");
            }
        }
        return h;
    } else if (TypeChart == 'M') {//Biểu đồ tháng
        var Days = [];
        var D = new Date(DateGet);
        var S = CountDaysInMonth(D.getMonth() + 1, D.getFullYear());
        var dayold = 0;
        for (var i = 0; i < S; i++) {
            if ((dayold == 0)) {
                Days.push(FormatToZeroFirst(i + 1));
                dayold++;
            }
            else {
                if (dayold == 2)
                    dayold = 0;
                else dayold++;
                Days.push('');
            }
        }
        if (S == 30 || S == 29) {
            Days.push(S);
        }
        return Days;

    } else if (TypeChart == 'Y') {//Biểu đồ năm
        return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    }
}

function RoundNumber(Number) {// Làm tròn 3 chữ số
    if (Number == null) {
        return null;
    } else {
        return Math.round(Number * 1000) / 1000;
    }

}
function CountDaysInMonth(Month, Year) { // Lấy số ngày trong tháng
    return new Date(Year, Month, 0).getDate();
}
function numberWithCommas(x){// Phân cách phần ngàn, dùng dc cho cả kiểu float
    if(x == 0){
      return 0;
    }else{
      var parts = x.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
   
  }

  function IsItemOfJsonInArrayNull(arr, key){
    var kq = true;
    for(var i = 0; i < arr.length; i++){
      if(arr[i][key] != null){
        kq = false;
      }
    }
  
    return kq;
  }
