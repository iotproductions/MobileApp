// var mainIP = "http://rynandemo.com:8000";//ip public để đăng nhập và get ip setting
// var mainIP  = "http://192.168.54.28:8000";//ip local
var mainIP = "http://115.78.182.212:7676";// ip Public
// var mainIP = "http:/192.168.54.24:7777";// ip demo
var ip; 
var ipToken; 
var ipbackup;
var ipImage = "http://image.rynanmobile.com";

var ipAd = "http://115.78.182.204:9095";
var WeatherAPI = "8a5c34cd7f3b4855b4975d42059d6492";
var ListParamsLocal = {
    BadgesNews: "BadgesNews",
    popPageMain: "popPageMain"
};
var AppCode = "SWMP";
var KeyLocalEcom = {
    OrderCart: "Ecom_OrderCart",
    SubscribeName: "SubscribeName",
    ConfigChartNuoc: "ConfigChartNuoc",
    ItemLanguage: "ItemLanguage",
};
var myLineChart;
var myLineChartDetail;
var listMonthChart = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31];
var listDateChart = [0, 3, 6, 9, 12, 15, 18, 21, 24];
var listYearChart = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var DeviceInfo;
var device;
var Language;
var HaveNotification = 0;
var navihtml = "";
var socket;
var ipSocket = "http://rynandemo.com:6026";
var ExitApp = 0;
var IsShowChart = 0; //edit 05/10/2017
var NetworkStatus = 1; //edit 05/10/2017
var StatesNW = {};//edit 05/10/2017
var IsNetWorkErrorShow = 0;
var Profile;
var SWMPInfo;
var LangCode="vn";
var app = ons.bootstrap('app', ['onsen', 'ngSanitize']);
app.run(function ($rootScope) {
    document.addEventListener('online', function () {//edit 05/10/2017
        NetworkStatus = 1;
    }, false);

    document.addEventListener('offline', function () {//edit 05/10/2017
        if (NetworkStatus == 1) {
            CheckConnection();
        }
    });

    document.addEventListener("resume", function () {//edit 05/10/2017
        CheckConnection();
    }, false);

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        ons.disableDeviceBackButtonHandler();
        ons.setDefaultDeviceBackButtonListener(function (event) {
            var page = GetPageName();
            if (page == "html/main.html" || page == "html/login.html" || typeof page == "undefined") {
                if (ExitApp == 0) {
                    ShowAlertConfirm(Language.EXIT_APP_QUES, Language.ALERT, function (idx) {
                        if (idx == 1) {
                            navigator.app.exitApp();
                        }
                        else {
                            ExitApp = 0;
                            return;
                        }
                    });

                    ExitApp = 1;
                }

            }
            else {
                PopPage();
            }
        }, false);

        if (navigator.connection.type != "none") {
            var itemlang = localStorage.getItem(AppCode + KeyLocalEcom.ItemLanguage);
            if (itemlang == "" || itemlang == undefined || itemlang == null) {
                itemlang = "VN";
            }
            LangCode=itemlang;
            var db = window.sqlitePlugin.openDatabase({ name: 'swm.db', location: 'default', androidDatabaseImplementation: 2 });
        }
    }
});
app.directive('lostconnect', function () {
    return {
        restrict: 'A',
        replace: false,
        template: '<div class="lostconnection" style="width: 100%;height: 100px;text-align: center;padding:40px 0"><img src="img/icon/telecom.png" class="telecom"/><div style="font-size:85%;opacity:0.8" ng-bind="Language.LOST_CONNECT"></div><div style="font-size:85%;opacity:0.8" ng-bind="Language.TOUCH_SCREEN_AGAIN"></div></div>',
    }
});
app.directive('toolbarmk', function () {/*Edit 17/10/2017*/
    return {
        restrict: 'A',
        replace: true,
        template:
            '<div class="tabbar bar-bottom" style="height:100%;">' +
            '<label onclick="ShowNotication()" class="tabbar__item" >' +
            '<input ng-checked="{{ShowInfo}}" type="radio" id="radiocat" name="tab-bar-a">' +
            '<button class="tabbar__button _notification" >' + /*Edit 17/10/2017 thêm class _notification*/
            '<img src="img/Thong_bao.png"/>' +
            '<span class="notification" id="alert-count"></span>' +
            '<div class="tabbar__label" ng-bind="Language.NOTIFICATIONS"></div>' +
            '</button>' +
            '</label>'


            + '<label class="tabbar__item" onclick="ShowBilling()" >'
            + '<input id="radioacc" ng-checked={{ShowBill}} type="radio" name="tab-bar-a">'
            + '<button class="tabbar__button _billing" >'/*Edit 17/10/2017 thêm class  _billing*/
            + '<img src="img/Hoa_don.png"/>'
            + '<div class="tabbar__label"  ng-bind="Language.BILL_WATER"></div>'
            + '</button>'
            + '</label>'

            + '<label class="tabbar__item" onclick="ShowChartDetail()" >'
            + '<input id="radiophantich" ng-checked={{ShowChartDetail}} type="radio" name="tab-bar-a">'
            + '<button class="tabbar__button _phantich" >'
            + '<img src="img/phan_tich.png"/>'
            + '<div class="tabbar__label"  ng-bind="Language.ANALYSIS"></div>'
            + '</button>'
            + '</label>'

            // + '<label ng-if="Profile.UserName" == "ChuMyCus" class="tabbar__item" onclick="ShowShopping()" >'
            // + '<input id="radioquancao" ng-checked={{ShowShopping}} type="radio" name="tab-bar-a">'
            // + '<button class="tabbar__button _quangcao" >'
            // + '<img src="img/icon-shop.png"/>'
            // + '<div class="tabbar__label"  ng-bind="Language.SHOPPING"></div>'
            // + '</button>'
            // + '</label>'
            // + '<label class="tabbar__item" onclick="ShowChartDetail()" >'
            // + '<input id="radioacc" ng-checked={{ShowChartDetail}} type="radio" name="tab-bar-a">'
            // + '<button class="tabbar__button _phantich" >'
            // + '<img src="img/phan_tich.png"/>'
            // + '<div class="tabbar__label"  ng-bind="Language.ANALYSIS"></div>'
            // + '</button>'
            // + '</label>'
            // +
            // '<label class="tabbar__item"  onclick="ShowChartDetail()">' +
            // '<input id="radiophantich" ng-checked="{{ShowChartDetail}}" type="radio" name="tab-bar-a">' +
            // '<button class="tabbar__button _phantich">' + /*Edit 17/10/2017 thêm class _main*/
            // '<img src="img/phan_tich.png"/>' +
            // '<div class="tabbar__label"  ng-bind="Language.ANALYSIS"></div>' +
            // '</button>' +
            // '</label>' 
            +
            '<label class="tabbar__item"  onclick="ShowBarHome()">' +
            '<input id="radiohome" ng-checked="{{ShowHome}}" type="radio" name="tab-bar-a">' +
            '<button class="tabbar__button _main">' + /*Edit 17/10/2017 thêm class _main*/
            '<img src="img/Trang_chu.png"/>' +
            '<div class="tabbar__label"  ng-bind="Language.HOME"></div>' +
            '</button>' +
            '</label>' +
            + '</div>',
    };
});
app.controller('billingdetailctrl', function ($scope) {
    $scope.Language = Language;
    $scope.ipImage = ipImage;
    $scope.Data = GetParamsPage().BillInfo;
    $scope.Users = { Avatar: Profile.Avatar, FullName: SWMPInfo.NameReg, CustomerCodeReg: SWMPInfo.CustomerCodeReg };
    $scope.Back = function () {
        PopPage();
    }
    SetDigest($scope);
});
app.controller('billingctrl', function ($scope) {
    $scope.Language = Language;
    $scope.ipImage = ipImage;
    $scope.Data = {};
    $scope.ShowBill = true;
    $scope.Back = function () {
        PopPage();
    }
    $scope.ShowBillWater = function (bill) {
        PushToPage("html/billingdetail.html", { BillInfo: bill });
    }
    LoadBillingWater(new Date().getFullYear(), function (result) {
        $scope.Data = result;
        SetDigest($scope);
    });
    SetDigest($scope);
});
app.controller("MainCtrl", function ($scope, $rootScope) { //edit 05/10/2017

    jQuery(document).ajaxError(function (event, jqxhr, settings, thrownError) {//edit 05/10/2017 Event khi gọi ajax bất kì bị lỗi

        CheckConnection();//Lỗi ajax = > kt kết nối mạng 

    });

    jQuery(document).ajaxSuccess(function (event, xhr, settings) {//edit 05/10/2017 Event khi gọi ajax bất kì thành công. http://api.jquery.com/ajaxSuccess/
        if (xhr.responseJSON.success == false && xhr.responseJSON.error == "token_expired") {//Lỗi token hết hạn
            ons.notification.alert({
                messageHTML: Language.YOUR_LOGIN_HAS_EXPIRED_PLEASE_RE_LOGIN_TO_CONTINUE_USING, title: Language.NOTIFICATION, buttonLabels: [Language.CLOSE], callback: function () {
                    ResetToLogin();
                }
            });
        }
    });

    /*Ecommerce*/
    if (localStorage.getItem(AppCode + KeyLocalEcom.ItemLanguage)) {
        var lcode = localStorage.getItem(AppCode + KeyLocalEcom.ItemLanguage);
    } else {
        lcode = "vn";
    }

    LoadLanguageEcommerce(lcode, function (result) {
        $scope.LanguageEcom = result;
        SetDigest($scope);
    })
    $scope.Coupon = "";
    $scope.CheckCoupon = function () {
        ModalCheckCoupon.hide();
        ModalLoaderEcommerce.show();
        CheckCoupon($scope.Coupon, 1, $rootScope.Cart.CartTotal, function (result) {
            setTimeout(function () {
                ModalLoaderEcommerce.hide();
                if (result != null) {
                    if (result.success == true) {
                        ShowToastEcommerce("Đơn hàng được giảm" + result.data.Discount + "%", null, 1500, "toast-add-cart", function () {
                            $rootScope.$broadcast("Discount", [result.data.Discount, $scope.Coupon]); // Truyền giá giảm vào giỏ hàng
                        });
                    } else {
                        AlertError(result.errcode);
                    }

                }

            }, 1000)

        })
    }

    $scope.HideModalCheckCoupon = function () {
        ModalCheckCoupon.hide();
    }
    /*Ecommerce*/

    var itemlang = localStorage.getItem(AppCode + KeyLocalEcom.ItemLanguage);
    if (itemlang == "" || itemlang == undefined || itemlang == null) {
        itemlang = "VN";
        localStorage.setItem(AppCode + KeyLocalEcom.ItemLanguage, itemlang);
    }

    LoadLanguageSWM(itemlang, function (rel) {
        Language = rel;
        $scope.Language = Language;
        SetDigest($scope);
    });

    $scope.RefreshPage = function () {
        var page = GetPageName();
        navihtml = page;
        if (page == "html/main.html") {
            $rootScope.$emit("RefresNotica", {});
            statusinterval = false;
        }
        else if (page == "controller/profile/profile.html") {
            $rootScope.$emit("RefeshProfile", {});
        }
        else if (page == "chat/chat.html") {
            $rootScope.$broadcast("GetlogMess", {});
        }
    }
});

// search ShowNotice
app.controller('searchnoticectrl', function ($scope) {
    $scope.Language = {
        SEARCH: Language.SEARCH,
    }
    $scope.Back = function () {
        PopPage();
    }
    $scope.KeySearch = "";
    $scope.DataSearch;
    var params = {
        Content: $scope.KeySearch,
        Page: 1
    }
    $scope.ShowDetailNotica = function (item) {
        PushToPage("html/detailnotica.html", { item: item })
    }
    $scope.onchane = function () {
        var url = ip + "/api/SearchNotification?token=" + Profile.Token;
        params.Content = $scope.KeySearch;
        params.Page = 1;
        $.ajax({
            url: url,
            type: "POST", dataType: "JSON", data: params,
            timeout: 60000,
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                if (data.success) {
                    for (var k = 0; k < data.data.length; k++) {
                        var d = new Date(data.data[k].LastUpdate);
                        var dtime = ConvertDateToString(new Date(), false, "yyyyMMdd");
                        var date = ConvertDateToString(d, false, "yyyyMMdd");

                        if (dtime == date) {
                            data.data[k].LastUpdate = formatTime(d);
                        }
                        else if (dtime.substring(1, 4) != date.substring(1, 4)) {
                            data.data[k].LastUpdate = ConvertDateToString(new Date(date), false, "ddMMyy");
                        }
                        else {
                            data.data[k].LastUpdate = ConvertDateToString(new Date(date), false, "ddMM");
                        }
                    }
                    $scope.DataSearch = data.data;
                    params.Page += 1;
                }
                else {
                    $scope.DataSearch = [];
                }
                SetDigest($scope);
            }, error: function (xhr, textStatus, thrownError) {
                CheckServer(xhr.statusText);
            }
        });
    }
    var controller = new ScrollMagic.Controller();
    var scene = new ScrollMagic.Scene({ triggerElement: ".dynamicContent #loader2", triggerHook: "onEnter" })
        .addTo(controller)
        .on("enter", function (e) {
            if (!$("#loader2").hasClass("active")) {
                if (params.Page > 1)
                    $("#loader2").addClass("active");

                var url = ip + "/api/SearchNotification?token=" + Profile.Token;
                params.Content = $scope.KeySearch;
                if ($scope.KeySearch != "") {
                    $.ajax({
                        url: url,
                        type: "POST", dataType: "JSON", data: params,
                        timeout: 60000,
                        contentType: 'application/x-www-form-urlencoded',
                        success: function (data) {
                            if (data.success && data.data.length > 0) {
                                for (var k = 0; k < data.data.length; k++) {
                                    var d = new Date(data.data[k].LastUpdate);
                                    var dtime = ConvertDateToString(new Date(), false, "yyyyMMdd");
                                    var date = ConvertDateToString(d, false, "yyyyMMdd");

                                    if (dtime == date) {
                                        data.data[k].LastUpdate = formatTime(d);
                                    }
                                    else if (dtime.substring(1, 4) != date.substring(1, 4)) {
                                        data.data[k].LastUpdate = ConvertDateToString(new Date(date), false, "ddMMyy");
                                    }
                                    else {
                                        data.data[k].LastUpdate = ConvertDateToString(new Date(date), false, "ddMM");
                                    }
                                }
                                data.data.forEach(function (element) {
                                    $scope.DataSearch.push(element);
                                }, this);
                            }
                            setTimeout(function () {
                                scene.update();
                                $("#loader2").removeClass("active");
                            }, 500);
                            SetDigest($scope);
                        }, error: function (xhr, textStatus, thrownError) {
                            setTimeout(function () {
                                scene.update();
                                $("#loader2").removeClass("active");
                            }, 500);
                            CheckServer(xhr.statusText);
                        }
                    });
                }
                else {
                    scene.update();
                    $("#loader2").removeClass("active");
                    $scope.DataSearch = [];
                    SetDigest($scope);
                }
            }
        });

    SetDigest($scope);
});

// listnotica
app.controller('notificationctrl', function ($scope, $rootScope) {
    $scope.Language = Language;
    SetDigest($scope);
    $scope.SearchNotica = function () {
        PushToPage("html/searchnotice.html", { animation: "none" });
    }
    $scope.$on("refreshDataNews", function () {
        mydata.Page = 0;
        addBoxes(null, function (rel) {

        });
    });
    $scope.Back = function () {
        // ResetToPage("html/main.html");
        PopPage();
    }
    ShowLoading();
    var toDate = new Date().toJSON().slice(0, 10).replace(/-/g, "/");
    var fromDate = new Date();
    fromDate.setFullYear(fromDate.getFullYear() - 1);
    fromDate = fromDate.toJSON().slice(0, 10).replace(/-/g, "/");
    var mydata = {
        ProvinceCode: Profile.ProvinceCode,
        CustomerCode: SWMPInfo.CustomerCodeReg,
        FromDate: fromDate,
        ToDate: toDate,
        Page: 0,
        PageLimit: 50,
        token: Profile.Token
    }
    $scope.DataNotica = [];
    var controller = new ScrollMagic.Controller();
    var scene = new ScrollMagic.Scene({ triggerElement: ".dynamicContent #loader", triggerHook: "onEnter" })
        .addTo(controller)
        .on("enter", function (e) {
            if (!$("#loader").hasClass("active")) {
                if (mydata.Page > 0)
                    $("#loader").addClass("active");
                addBoxes(null, function (rel) {
                    if (rel) {
                        var relnews = $scope.DataNotica.filter(function (n, index) {
                            if (n.FlagRead == 1) {
                                return n;
                            }
                        });
                        if (relnews.length > 0) {
                            window.sqlitePlugin.openDatabase({ name: 'swm.db', location: 'default', androidDatabaseImplementation: 2 }, function (db) {
                                db.transaction(function (tx) {
                                    tx.executeSql("CREATE TABLE IF NOT EXISTS FLAGREAD (IDNews VARCHAR PRIMARY KEY,AppCode)");
                                    for (var s = 0; s <= relnews.length - 1; s++) {
                                        var query = "INSERT OR IGNORE INTO FLAGREAD values (?,?)";
                                        tx.executeSql(query, [relnews[s]._id, AppCode], function (tx, res) {
                                        });
                                    }
                                }, function (error) {
                                    db.close();
                                }, function () {
                                    db.close(function (sub) {
                                        console.log('Insert news not exits OK˝');
                                    });

                                });
                            });
                        }
                    }
                    setTimeout(function () {
                        scene.update();
                        $("#loader").removeClass("active");
                    }, 500);
                });
            }
        });
    function addBoxes(done, callback) {
        mydata.Page += 1;
        mydata.token = Profile.Token;
        GetListNotification(mydata, function (result) {
            HideLoading();
            if (result != null && result.length > 0) {
                if (mydata.Page == 1)
                    $scope.DataNotica = result;
                else {
                    result.forEach(function (element) {
                        $scope.DataNotica.push(element);
                    }, this);
                }
                SetDigest($scope);
                callback(true);
            }
            else {
                mydata.Page -= 1;
                callback(false);
            }

        });
    }
    $scope.ShowDetailNotica = function (item) {
        PushToPage("html/detailnotica.html", { item: item })
    }
});
// listnotica end
// detailnotica
app.controller('detailnotificationctrl', function ($scope, $rootScope) {
    $scope.Language = {
        INFO: Language.INFO,
        DATE_PUB_INFO: Language.DATE_PUB_INFO,

    };
    var item = GetParamsPage();
    $scope.DataNotica = item.item;
    ChangeStatusReadNotica($scope.DataNotica._id, SWMPInfo.CustomerCodeReg, function (rel) {
        window.sqlitePlugin.openDatabase({ name: 'mekong.db', location: 'default', androidDatabaseImplementation: 2 }, function (db) {
            db.transaction(function (tx) {
                var query = "DELETE FROM FLAGREAD WHERE IDNews = '" + $scope.DataNotica._id + "'";
                tx.executeSql(query, [], function (tx, res) {
                    console.log("rowsAffected: " + res.rowsAffected);
                },
                    function (tx, error) {
                        console.log('DELETE error: ' + error.message);
                    });
            }, function (error) {
                console.log(JSON.stringify(error));
                db.close();
            }, function () {
                db.close(function (sub) {
                    console.log("delete news id OK");
                });
            });
        });
    });
    $scope.Back = function () {
        $rootScope.$broadcast("refreshDataNews");
        PopPage();
    }
    SetDigest($scope);
});
// detailnotica end


// config chart
app.controller("configchartctrl", function ($scope) {
    $scope.ipImage = ipImage;
    $scope.Language = Language;
    $scope.Data = {
        MucNuocMin: null,
        MucNuocMax: null,
        StepSize: null,
        ValueTru: null,
        IdAWD: null
    }
    var data = localStorage.getItem(AppCode + KeyLocalEcom.ConfigChartNuoc);
    if (data != undefined && data != "") {
        data = JSON.parse(data);
        $scope.Data.MucNuocMax = data.MucNuocMax;
        $scope.Data.MucNuocMin = data.MucNuocMin;
        $scope.Data.StepSize = data.StepSize;
        $scope.Data.ValueTru = data.ValueTru;
        $scope.Data.IdAWD = data.IdAWD;
        $scope.Data.ColorBorderChart = data.ColorBorderChart;
    }
    $scope.SaveData = function (item) {
        $scope.Data.IdAWD = item.IDAWD;
        if (item.IDAWD == "FGW01/SN02")
            $scope.Data.ColorBorderChart = "#F4DF74";
        else $scope.Data.ColorBorderChart = "";
    }
    GetListADW(function (rel) {
        $scope.ListAWD = rel;
        SetDigest($scope);
    });
    $scope.SaveConfig = function () {
        if (isNaN($scope.Data.MucNuocMax) == true || isNaN($scope.Data.MucNuocMin) == true) {
            ons.notification.alert({
                title: Language.ALERT, message: Language.MAXMIN_ISNOT_FORMAT, buttonLabels: [Language.CLOSE], callback: null
            });
        }
        else if ($scope.Data.MucNuocMax <= $scope.Data.MucNuocMin) {
            ons.notification.alert({
                title: Language.ALERT, message: Language.ERROR_VALUE_MAXMIN, buttonLabels: [Language.CLOSE], callback: null
            });
        }
        else {
            localStorage.setItem(AppCode + KeyLocalEcom.ConfigChartNuoc, JSON.stringify($scope.Data));
            ons.notification.alert({
                title: Language.ALERT, message: Language.SAVE_CONFIG_COMP, buttonLabels: [Language.CLOSE], callback: function () {
                    ResetToPage("html/main.html");
                }
            });
        }
    }
    SetDigest($scope);
});
// changelanguage
app.controller("ChangeLanguageCtrl", function ($scope) {
    $scope.LCode = localStorage.getItem(AppCode + KeyLocalEcom.ItemLanguage);
    if ($scope.LCode == "" || $scope.LCode == undefined || $scope.LCode == null) {
        $scope.LCode = "vn";
    }
    $scope.LCode = $scope.LCode.toLowerCase();
    SetDigest($scope);
    $scope.ChangeLanguage = function (lcode) {
        ShowLoading();
        LangCode= lcode;
        $scope.LCode = lcode;
        localStorage.setItem(AppCode + KeyLocalEcom.ItemLanguage, $scope.LCode);
        // LoadLanguage(item, function (rel) {
        //     Language = rel;
        //     LoadLanguageEcom(item, function (rel) {
        //         LanguageEcom = rel;
        //         localStorage.setItem(AppCode + KeyLocalEcom.ItemLanguage, item);
        //         ResetToPage("html/main.html");
        //     });
        // });
        LoadLanguageSWM($scope.LCode, function (rel) {
            Language = rel;
            $scope.Language = Language;
            SetDigest($scope);
            ResetToPage("html/main.html");
        });
    }
    SetDigest($scope);
});
// setting
app.controller('SettingCtrl', function ($scope) {//Edit 10/10/2017
    $scope.Language = Language;
    $scope.ListSetting = {};
    var contentalert = Language.ENTER_WARNING;
    if (SWMPInfo.ListSetting != undefined && SWMPInfo.ListSetting != null) {
        $scope.ListSetting = SWMPInfo.ListSetting;
        SetDigest($scope);
    }

    if ($scope.ListSetting.EnableChat == false) {
        $("#switch-chat_").prop('disabled', true);
    } else {
        $("#switch-chat_").prop('disabled', false);
    }

    $scope.SelectRangeSali = function () {
        ons.notification.confirm({
            messageHTML: "<div style='padding-bottom:10px;'>" + contentalert + "</div><div><input style='width:100%;overflow:hidden' onkeyup='storevaluesali(this)'  id='alert-input' type='text' class='text-input input-alert'/></div>",
            title: "",
            buttonLabels: [Language.CANCEL, Language.OK],
            callback: function (index) {
                if (index != 0) {
                    $scope.ListSetting.UseInMonth = Math.round(parseFloat(document.getElementById("hiddensali").value) * 10000) / 10000;
                    if ($scope.ListSetting.UseInMonth == 0) {
                        $scope.ListSetting.UseInMonth = null;
                    }
                    if ($scope.ListSetting.UseInMonth > 9999) {
                        $scope.ListSetting.UseInMonth = 9999;
                    }
                    SaveConfigSetting($scope.ListSetting, function (rel) {
                        SWMPInfo.ListSetting = $scope.ListSetting;
                    });
                }
                SetDigest($scope);
            }
        });
    }
    $scope.SelectRangeDate = function () {
        ons.notification.confirm({
            messageHTML: "<div style='padding-bottom:10px;'>" + contentalert + "</div><div><input style='width:100%;overflow:hidden' onkeyup='storevaluesdate(this)' id='alert-input' type='text' class='text-input input-alert'/></div>",
            title: "",
            buttonLabels: [Language.CANCEL, Language.OK],
            callback: function (index) {
                if (index != 0) {
                    $scope.ListSetting.UseInDay = Math.round(parseFloat(document.getElementById("hiddendate").value) * 10000) / 10000;
                    if ($scope.ListSetting.UseInDay == 0) {
                        $scope.ListSetting.UseInDay = null;
                    }

                    if ($scope.ListSetting.UseInDay > 9999) {
                        $scope.ListSetting.UseInDay = 9999;
                    }
                    SaveConfigSetting($scope.ListSetting, function (rel) {
                        SWMPInfo.ListSetting = $scope.ListSetting;
                    });
                }
                SetDigest($scope);
            }
        });
    }


    RemoveClass("allow-chat", "disabled");
    document.getElementById('switch-chat').addEventListener('change', function (e) {
        $scope.ListSetting.EnableChat = e.target.checked;
        if ($scope.ListSetting.EnableChat == true) {
            // RemoveClass("allow-chat", "disabled");
            $("#switch-chat_").prop('disabled', false);

            ons.notification.alert({
                title: Language.ALERT, message: Language.THE_CHAT_FEATURE_IS_GROWING_BUT_YOU_CAN_GET_NOTIFICATIONS_AND_INVOICES, buttonLabels: [Language.CLOSE], callback: null
            });

        }
        else {
            // AddClass("allow-chat", "disabled");
            $("#switch-chat_").prop('disabled', true);
        }
        SaveConfigSetting($scope.ListSetting, function (rel) {
            SWMPInfo.ListSetting = $scope.ListSetting;
        });
    });
    document.getElementById('switch-chat_').addEventListener('change', function (e) {
        $scope.ListSetting.GetNotificationChat = e.target.checked;
        SaveConfigSetting($scope.ListSetting, function (rel) {
            SWMPInfo.ListSetting = $scope.ListSetting;
        });
    });
    document.getElementById('switch-sali').addEventListener('change', function (e) {
        $scope.ListSetting.GetNotificationUseInMonth = e.target.checked;
        SaveConfigSetting($scope.ListSetting, function (rel) {
            SWMPInfo.ListSetting = $scope.ListSetting;
        });
    });
    document.getElementById('switch-sali-date').addEventListener('change', function (e) {
        $scope.ListSetting.GetNotificationUseInDay = e.target.checked;
        SaveConfigSetting($scope.ListSetting, function (rel) {
            SWMPInfo.ListSetting = $scope.ListSetting;
        });
    });
    document.getElementById('switch-info').addEventListener('change', function (e) {
        $scope.ListSetting.GetNotifications = e.target.checked;
        SaveConfigSetting($scope.ListSetting, function (rel) {
            SWMPInfo.ListSetting = $scope.ListSetting;
        });
    });
    SetDigest($scope);
})
// setting end

// chart detail
app.controller('chartdetailctrl', function ($scope) {
    $scope.Language = Language;
    $scope.UseRangeInDate;
    $scope.PriceSWMP = Profile.PriceSWMP;
    $scope.TitleBeforeUse = Language.BEFORE_DATE;
    $scope.TypeDate = "D";
    $scope.DataCurrent;
    if (SWMPInfo != null && SWMPInfo != undefined)
        $scope.UseRangeInDate = SWMPInfo.ListSetting.UseInDay;
    var params = {
        DateCurrent: new Date(),
        DateFrom: new Date(),
        DateTo: new Date(),
        TypeDate: "D",
        isReload: false
    }
    $scope.BackChart = function () {
        if (params.TypeDate == "D") {
            params.DateFrom.setDate(params.DateFrom.getDate() - 1);
            params.DateTo.setDate(params.DateTo.getDate() - 1);
        }
        else if (params.TypeDate == "M") {
            params.DateTo.setMonth(params.DateFrom.getMonth());
            params.DateFrom.setMonth(params.DateFrom.getMonth() - 1);
        }
        else if (params.TypeDate == "Y") {
            params.DateTo.setFullYear(params.DateFrom.getFullYear());
            params.DateFrom.setFullYear(params.DateFrom.getFullYear() - 1);
        }
        LoadData(params, $scope);
    }
    $scope.NextChart = function () {
        params.DateCurrent = new Date();
        if (params.TypeDate == "D") {
            params.DateFrom.setDate(params.DateFrom.getDate() + 1);
            params.DateTo.setDate(params.DateTo.getDate() + 1);
            var datefrom = new Date(params.DateFrom.getFullYear(), params.DateFrom.getMonth(), params.DateFrom.getDate());
            var datetoo = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            if (datefrom > datetoo) {
                ons.notification.alert({
                    message: Language.CANNOT_DATA_DATE + " " + ConvertDateToString(params.DateFrom, false, "ddMMyyyy"), 
                    title: Language.ALERT, 
                    buttonLabels: [Language.CLOSE],
                     callback: function () {
                        params.DateFrom.setDate(params.DateFrom.getDate() - 1);
                        params.DateTo.setDate(params.DateTo.getDate() - 1);
                    }
                });
                return false;
            }
            else if (datefrom.toString() == datetoo.toString()) {
                statusinterval = false;
            }
        }
        else if (params.TypeDate == "M") {
            params.DateFrom.setMonth(params.DateFrom.getMonth() + 1);
            params.DateTo.setMonth(params.DateFrom.getMonth() + 1);
            var monthfrom = new Date(params.DateFrom.getFullYear(), params.DateFrom.getMonth() + 1, 1);
            if (monthfrom > new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)) {
                ons.notification.alert({
                    message: Language.CANNOT_DATA_MONTH + " " + ConvertDateToString(params.DateFrom, false, "MMyyyy"), 
                    title: Language.ALERT, 
                    buttonLabels: [Language.CLOSE], 
                    callback: function () {
                        params.DateFrom.setMonth(params.DateFrom.getMonth() - 1);
                        params.DateTo.setMonth(params.DateFrom.getMonth() - 1);
                    }
                });
                return false;
            }
        }
        else if (params.TypeDate == "Y") {
            params.DateFrom.setFullYear(params.DateFrom.getFullYear() + 1);
            params.DateTo.setFullYear(params.DateFrom.getFullYear() + 1);
            if (params.DateFrom.getFullYear() > new Date().getFullYear()) {
                ons.notification.alert({
                    message: Language.CANNOT_DATA_YEAR + " " + ConvertDateToString(params.DateFrom, false, "yyyy"), 
                    title: Language.ALERT, 
                    buttonLabels: [Language.CLOSE], 
                    callback: function () {
                        params.DateFrom.setFullYear(params.DateFrom.getFullYear() - 1);
                        params.DateTo.setFullYear(params.DateFrom.getFullYear() - 1);
                    }
                });
                return false;
            }
        }
        LoadData(params, $scope);
    }
    $scope.CurrentChart = function (id, nameclass) {
        var lb = document.getElementsByName("aly-label");
        if (lb != undefined && lb != null) {
            for (var i = 0; i < lb.length; i++) {
                $(lb[i]).removeClass("label-active");
            }
            $(lb[0]).addClass("label-active");
        }
        $scope.TypeDate = "D";
        params.TypeDate = "D";
        params.DateCurrent = new Date();
        params.DateFrom = new Date();
        params.DateTo = new Date();
        params.DateTo.setDate(params.DateTo.getDate() + 1);
        LoadData(params, $scope);
    }
    $scope.ShowData = function (type, index) {
        $scope.TypeDate = type;
        params.TypeDate = type;
        var lb = document.getElementsByName("aly-label");
        if (lb != undefined && lb != null) {
            for (var i = 0; i < lb.length; i++) {
                $(lb[lb.length-(i+1)]).removeClass("label-active");
            }
            $(lb[index]).addClass("label-active");
        }
        LoadData(params, $scope);
    }
    $scope.TypeDate = "D";
    params.TypeDate = "D";
    params.DateCurrent = new Date();
    params.DateFrom = new Date();
    params.DateTo = new Date();
    params.DateTo.setDate(params.DateTo.getDate() + 1);
    LoadData(params, $scope);
    SetDigest($scope);
});

function LoadData(params, scope) {

    if (params.TypeDate == "D") {
        scope.TitleBeforeUse = Language.BEFORE_DATE;
        LoadChartTimeLine(params, function (result) {
            HideLoading();
            scope.Data = result;
            scope.Data.SumInDateN = scope.Data.SumInDate;
            scope.Data.SumInDate = scope.Data.SumInDate.toFixed(3);
            scope.DataCurrent = ConvertDateToString(params.DateFrom, false, "ddMMyyyy");
            SetDataUseBefore(params, result.SumInDate, scope, function () {
                LoadAlertRangeOutWater(params.DateFrom, SWMPInfo.CustomerCodeReg, function (rel) {
                    if (rel != undefined && rel != null && rel.UseAllow != null)
                        scope.UseRangeInDate = rel.UseAllow;
                    else
                        scope.UseRangeInDate = -1;

                    if (scope.UseRangeInDate > 0 && scope.Data.SumInDateN > scope.UseRangeInDate) {
                        scope.ShowOutRange = true;
                        scope.ShowInRange = false;
                    }
                    else {
                        scope.ShowOutRange = false;
                        scope.ShowInRange = true;

                    }
                    var dtdate = scope.Data.data;
                    if (dtdate != null && dtdate != undefined && dtdate.length > 0) {
                        var valuedtfirst = dtdate[0];
                        for (var i = dtdate.length - 1; i >= 0; i--) {
                            if (dtdate[i].NumberAdr - valuedtfirst.NumberAdr > scope.UseRangeInDate && scope.UseRangeInDate > 0) {
                                scope.Data.data[i].ShowOutRange = true;
                                scope.Data.data[i].ShowInRange = false;
                            }
                            else {
                                scope.Data.data[i].ShowOutRange = false;
                                scope.Data.data[i].ShowInRange = true;
                            }
                        }
                    }
                    scope.Data.LostData = scope.Data.SumInDateN - scope.UseRangeInDate;
                    scope.Data.MoneyLost = Math.round((scope.Data.LostData * Profile.PriceSWMP));
                    scope.Data.LostData = scope.Data.LostData.toFixed(3);
                    SetDigest(scope);
                });

            });

        });
    }
    else if (params.TypeDate == "M") {
        scope.TitleBeforeUse = Language.BEFORE_MONTH;

        scope.TypeDate = "M";
        params.TypeDate = "M";
        LoadChartTimeLine(params, function (result) {
            HideLoading();
            var dt = result.data;
            if (dt != undefined) {
                // for (var str = 0; str < dt.length; str++) {
                //     var max = dt[str].MaxIndex;
                //     result.data[str].NumberAdr = max;
                // }
                var rel = result.data.filter(function (ind) {
                    return new Date(ind.Date) < new Date();
                });
                result.data = rel;
            }
            scope.Data = result;

            scope.DataCurrent = ConvertDateToString(params.DateFrom, false, "MMyyyy");
            scope.Data.RangeOutUse = result.SumInDate - scope.UseRangeInDate;
            scope.Data.SumInDateN = result.SumInDate;
            scope.UseRangeInDate = SWMPInfo.ListSetting.UseInMonth;
            if (scope.UseRangeInDate == null || scope.UseRangeInDate == undefined)
                scope.UseRangeInDate = -1;
            if (scope.Data.SumInDateN > scope.UseRangeInDate) {
                scope.ShowOutRange = true;
                scope.ShowInRange = false;
            }
            else {
                scope.ShowOutRange = false;
                scope.ShowInRange = true;
            }
            var dtmonth = scope.Data.data;
            if (dtmonth != null && dtmonth != undefined && dtmonth.length > 0) {
                var valuedtfirst = dtmonth[0];
                for (var i = dtmonth.length - 1; i >= 0; i--) {
                    if (dtmonth[i].MaxIndex - valuedtfirst.MinIndex > scope.UseRangeInDate && scope.UseRangeInDate > 0) {
                        scope.Data.data[i].ShowOutRange = true;
                        scope.Data.data[i].ShowInRange = false;
                    }
                    else {
                        scope.Data.data[i].ShowOutRange = false;
                        scope.Data.data[i].ShowInRange = true;
                    }
                }
            }
            SetDataUseBefore(params, result.SumInDate, scope, function () {
                scope.Data.LostData = scope.Data.SumInDateN - scope.UseRangeInDate;
                scope.Data.MoneyLost = Math.round((scope.Data.LostData * Profile.PriceSWMP));
                scope.Data.LostData = scope.Data.LostData.toFixed(3);
                SetDigest(scope);
            });
        });
    }
    else if (params.TypeDate == "Y") {
        scope.TypeDate = "Y";
        params.TypeDate = "Y";
        scope.TitleBeforeUse = Language.BEFORE_YEAR;
        LoadChartTimeLine(params, function (result) {
            HideLoading();
            if (result.SumInDate == undefined)
                result.SumInDate = 0;
            var dt = result.data;
            if (dt != undefined) {
                var month = new Date().getMonth() + 1;
                var rel = result.data.filter(function (ind) {
                    return parseInt(ind.Time) <= month;
                });
                result.data = rel;
            }
            scope.Data = result;
            scope.DataCurrent = ConvertDateToString(params.DateFrom, false, "yyyy");
            scope.Data.SumInDateN = result.SumInDate;
            scope.UseRangeInDate = 3000;
            scope.ShowOutRange = false;
            scope.ShowInRange = true;
            var dtyear = scope.Data.data;
            if (dtyear != null && dtyear != undefined && dtyear.length > 0) {
                var valuedtfirst = dtyear[0];
                for (var i = dtyear.length - 1; i >= 0; i--) {
                    if (dtyear[i].MaxIndex - valuedtfirst.MinIndex > scope.UseRangeInDate && scope.UseRangeInDate > 0) {
                        scope.Data.data[i].ShowOutRange = true;
                        scope.Data.data[i].ShowInRange = false;
                    }
                    else {
                        scope.Data.data[i].ShowOutRange = false;
                        scope.Data.data[i].ShowInRange = true;
                    }
                }
            }
            SetDataUseBefore(params, result.SumInDate, scope, function () {
                SetDigest(scope);
            });

        });
    }
}
function SetDataUseBefore(params, sumindate, scope, callback) {
    LoadIndexBefore(params, function (rel) {
        if (rel != undefined && rel != null) {
            scope.Data.BeforeIndex = rel.SumInDate;
            if (scope.Data.BeforeIndex == 0 || isNaN(scope.Data.BeforeIndex))
                scope.Data.BeforeIndex = 0;
            scope.Data.BeforeIndex = scope.Data.BeforeIndex.toFixed(3);
            scope.Data.ToTalSum = rel.SumInDate - parseFloat(sumindate);
            if (scope.Data.ToTalSum != null && scope.Data.ToTalSum > 0) {
                if (scope.Data.ToTalSum > 0) {
                    scope.Data.TietKiem = Language.SAVING;
                }
                else {
                    scope.Data.TietKiem = Language.DONATE;
                }
                scope.Data.ToTalSum = scope.Data.ToTalSum.toFixed(3);
            }
            else {
                scope.Data.TietKiem = Language.DONATE;
                if (scope.Data.ToTalSum == "NaN" || isNaN(scope.Data.ToTalSum) || scope.Data.ToTalSum == undefined || scope.Data.ToTalSum == 0)
                    scope.Data.ToTalSum = 0;
                scope.Data.ToTalSum = parseFloat(scope.Data.ToTalSum.toString().replace("-", "")).toFixed(3);
                if (scope.Data.SumInDate == 0 || scope.Data.SumInDate == undefined) {
                    scope.Data.SumInDate = (0).toFixed(3);
                }

            }
        }
        else {
            scope.Data.BeforeIndex = (0).toFixed(3);
            scope.Data.ToTalSum = (0).toFixed(3);
            scope.Data.TietKiem = Language.SAVING;
        }
        callback(true);
    });
}
// Menu end
// main.html
var intervalMucNuoc;
var intervalMain;
var statusinterval;

app.controller('adsdetailctrl', function ($scope, $rootScope) {
    $scope.Language = Language;
    $scope.Data = {};
    $scope.Data.ID = GetParamsPage().ID;
    $scope.Back = function () {
        PopPage();
    }
    SetDigest($scope);
});

app.controller('mainctrl', function ($scope, $rootScope) {
    document.querySelector('#navigator').onDeviceBackButton.disable(); //Edit 05/10/2017 disable back button.

    $scope.Profile = Profile;
    $scope.LockValve = SWMPInfo.LockValve;//edit 28/09/2018
    $scope.LockValveTemp = SWMPInfo.LockValve;//edit 28/09/2018
    $scope.SimMode = SWMPInfo.SimMode;//edit 28/09/2018
    $scope.TimeOutSetting = null;//edit 28/09/2018
    SetDigest($scope);

    $rootScope.Cart = {
        NumberCartItem: 0,
        Items: [],
        CartTotal: 0,
    };

    $scope.checkecom = CheckEcommerce();
    $scope.IsMovie = $scope.checkecom == false ? true : false;

    if (localStorage.getItem(KeyCartItems) != undefined && localStorage.getItem(KeyCartItems) != null) {
        $rootScope.Cart.NumberCartItem = localStorage.getItem(KeyNumberCartItem);
        $rootScope.Cart.Items = JSON.parse(localStorage.getItem(KeyCartItems));
    }

    $scope.Ads = [
        {
            Link: "img/ad/ad01.png",
            Name: "Cityland Luxury Villas",
            Id: "ad01"
        }, {
            Link: "img/ad/ad02.png",
            Name: "CityLand Riverside Quận 7",
            Id: "ad02"
        }, {
            Link: "img/ad/ad03.png",
            Name: "Cityland Park Hills - Gò Vấp",
            Id: "ad03"
        }, {
            Link: "img/ad/ad04.png",
            Name: "Căn hộ Cityland Park Hills",
            Id: "ad04"
        }, {
            Link: "img/ad/ad05.png",
            Name: "Căn hộ cao cấp Lucky Palace",
            Id: "ad05"
        }, {
            Link: "img/ad/ad06.png",
            Name: "Căn hộ thông minh - Richstar",
            Id: "ad06"
        }
    ]
    function StopAds() {
        $(".canvas-base").css({ "opacity": 1 });
        document.getElementById("adsimg").src = "img/Icon_128x128.png";
        $scope.OnAds = false;
        clearInterval($scope.IntervalAds);
    }
    $scope.ShowAdDetail = function (id) {
        StopAds();
        PushToPage("html/adsdetail.html", { ID: "ad0" + (id + 1) });
    }
    $scope.OnAds = false;

    socket = io(ipSocket);
    $scope.Language = Language;;
    $scope.ShowHome = "true";
    $scope.ipImage = ipImage;
    $scope.User = Profile;
    $rootScope.NotificationCount = 0;
    $scope.NameChart = "myChart";
    $scope.IndexAdr = 0;

    var countnews = localStorage.getItem(AppCode + "refreshCountNews");
    if (countnews == "0"){
        countnews = "";
    }
        
    var clearcount = setInterval(function () {
        GetCountNewsNotica(function (rel) {
            if (rel == 0)
                rel = "";
            document.getElementById("alert-count").innerHTML = rel;
            clearInterval(clearcount);
        });
    }, 500);

    $scope.SetLockValveWater = function () {
        SetLockValveWater($scope);
    }

    GetNewIndexSWM(SWMPInfo.SerialNumberReg, function(result){
        if(result!= null){
            if(result.success == true){
                $scope.IndexAdr = result.data.NumberAdr;
                SetDigest($scope);
            }
        }
    });
    socket.off(SWMPInfo.SerialNumberReg); //Socket gửi lệnh đóng mở van
    socket.on(SWMPInfo.SerialNumberReg, function (data) {
       if(data == "LockVal was received."){
            ModalNotice.hide();
            if ( $scope.TimeOutSetting != null && $scope.TimeOutSetting != undefined) {
                clearTimeout($scope.TimeOutSetting );
            }
            GetInfoCustomer(SWMPInfo.CustomerCodeReg,function(result){
                if(result != null){
                    if(result.success == true){
                        $scope.LockValve = result.data.LockValve;
                        $scope.LockValveTemp = result.data.LockValve;
                        SetDigest($scope);
            
                        if($scope.LockValveTemp == "C"){
                            var text = Language.LOCK_VALVE_SUCCESS;
                        }else if($scope.LockValveTemp == "O"){
                            var text = Language.OPEN_VALVE_SUCCESS;
                        }
                        ons.notification.alert({
                            message: text,
                            title: Language.ALERT,
                            buttonLabels: [Language.CLOSE],
                        });
                    }
                }
            })
          
       }
    });

    $scope.ShowChartDetail = function () {
        PushToPage("html/chartdetail.html");
    }
    GetPriceSWMP(SWMPInfo.IDObjectOup, function (result) {
        Profile.PriceSWMP = result;
        setTimeout(function () {
            GetDefaultSensorNode(SWMPInfo.CustomerCodeReg, new Date(), function (result) {
                $scope.SWData = result;
                $scope.SWDataCurrent = result;
                SetDigest($rootScope);
                SetDigest($scope);
                ConfigAndRunChart($scope, params, myLineChart);
            });
        }, 500);

    });
    $rootScope.$on("RefresNotica", function () {
        if ($rootScope.NotificationCount < 1)
            $("#notification-main").hide();
    });
    $scope.idclassold = "mk-main-label01";
    $scope.ActiveIdChart = "sali";
    AddClass("sali", "color-active-bar");
    $scope.TitleChart = Language.HOUR;
    statusinterval = false;
    $scope.SWData = {
        SumInTime: 0,
        WeatherInfo: 0,
        Money: 0
    };
    $scope.SWDataCurrent = {
        SumInTime: 0,
        WeatherInfo: 0,
        Money: 0
    };
    var dateto = new Date();
    dateto.setDate(dateto.getDate() + 1);
    $scope.TypeChart = "line";
    $scope.IsFill = true;
    $scope.TypeData = "S";
    $scope.TypeDate = "D";
    $scope.Main = {
        DateCurrent: ConvertDateToString(new Date(), false, "ddMMyyyy"),
        TimeCurrent: FormatToZeroFirst(new Date().getHours()) + ":" + FormatToZeroFirst(new Date().getMinutes()) + ":" + FormatToZeroFirst(new Date().getSeconds()),
        TitleDate: Language.DATE + " " + ConvertDateToString(new Date(), false, "ddMMyyyy"),
    }
    var params = {
        DateCurrent: new Date(),
        DateFrom: new Date(),
        DateTo: dateto,
        TypeDate: "D",
        isReload: false,
        Language: {
            DATE: Language.DATE,
            MONTH: Language.MONTH,
            YEAR: Language.YEAR,
            WATER_INDEX: Language.WATER_INDEX,
            TIME: Language.TIME,
            SAVING: Language.SAVING
        }
    }

   
    socket.off(SWMPInfo.CustomerCodeReg);
    socket.on(SWMPInfo.CustomerCodeReg, function (data) {
        if (params.TypeDate == "D") {
            $scope.Main.DateCurrent = ConvertDateToString(new Date(), false, "ddMMyyyy"),
                $scope.Main.TimeCurrent = FormatToZeroFirst(new Date().getHours()) + ":" + FormatToZeroFirst(new Date().getMinutes()) + ":" + FormatToZeroFirst(new Date().getSeconds());
            GetDefaultSensorNode(SWMPInfo.CustomerCodeReg, new Date(), function (result) {
                $scope.SWData = result;
                $scope.SWDataCurrent = result;
                SetDigest($rootScope);
                SetDigest($scope);
                ConfigAndRunChart($scope, params, myLineChart);
            });
            // ConfigAndRunChart($scope, params, myLineChart);
            SetDigest($scope);
        }
        GetNewIndexSWM(SWMPInfo.SerialNumberReg, function(result){
            if(result!= null){
                if(result.success == true){
                    $scope.IndexAdr = result.data.NumberAdr;
                    SetDigest($scope);
                }
            }
        });
    });


    $scope.ShowHelp = function () {
        clearInterval($scope.IntervalAds);
        if (!$scope.OnAds) {
            $(".canvas-base").css({ "opacity": 0 });
            document.getElementById("adsimg").src = "img/Icon_Lock_128x128.png";
            $scope.OnAds = true;
            if ($scope.IntervalAds != null && $scope.IntervalAds != undefined) {
                clearInterval($scope.IntervalAds);
            }
            $scope.IntervalAds = setInterval(function () {
                var index = carouselad.getActiveIndex();
                if (index == $scope.Ads.length - 1)
                    carouselad.first({ animation: "none" });
                else
                    carouselad.next({ animation: "none" });
            }, 2500);
        }
        else {
            document.getElementById("adsimg").src = "img/Icon_128x128.png";
            $scope.OnAds = false;
            clearInterval($scope.IntervalAds);
            $(".canvas-base").css({ "opacity": 1 });
        }
    }

//    $scope.ShowWaterPressure = function () {
//        PushToPage("html/water_pressure.html");
//    }

    $scope.ShowChartDate = function (id, nameclass) {// Edit 05/10/2017
        if (NetworkStatus == 1) {// Có kết nối
            $scope.TitleChart = Language.HOUR;
            ShowTitleChart(0);
            RemoveClass($scope.idclassold, nameclass);
            // if (myLineChart != undefined)
            //     myLineChart.destroy();
            // myLineChart = undefined;
            AddClass(id, nameclass);
            $scope.idclassold = id;
            $scope.TypeDate = "D";
            params.TypeDate = "D";
            params.DateFrom = new Date();
            params.DateTo = new Date();
            params.DateTo.setDate(params.DateTo.getDate() + 1);
            params.DateCurrent = new Date();
            $scope.TypeChart = "line";
            LoadChart(params, function (result) {
                if (result == null) {
                    $scope.Main.TitleDate = Language.DATE + " " + ConvertDateToString(params.DateFrom, false, "ddMMyyyy");// Set lại tiêu đề biểu đồ ngày
                    SetDigest($scope);
                    ShowAlert(Language.CANNOT_DATA, Language.ALERT, function () { });
                }
                else {
                    $scope.SWData = result;
                    SetDigest($rootScope);
                    SetDigest($scope);
                    ConfigAndRunChart($scope, params, myLineChart);
                }
            });
        } else {// Không có kết nối
            CheckConnection();
        }

    }
    $scope.ShowChartMonth = function (id, nameclass) {// Edit 05/10/2017
        if (NetworkStatus == 1) {// Có kết nối
            $scope.TitleChart = Language.DATE;
            RemoveClass($scope.idclassold, nameclass);
            // if (myLineChart != undefined)
            //     myLineChart.destroy();
            // myLineChart = undefined;
            params.Chart = myLineChart;
            AddClass(id, nameclass);
            $scope.idclassold = id;
            $scope.TypeDate = "M";
            params.TypeDate = "M";
            $scope.TypeChart = "line";
            params.DateFrom = new Date();
            params.DateTo = new Date();
            LoadChart(params, function (result) {
                if (result == null) {
                    $scope.Main.TitleDate = Language.MONTH + " " + ConvertDateToString(params.DateFrom, false, "MMyyyy"); // Set lại tiêu đề biểu đồ tháng
                    SetDigest($scope);
                    ShowAlert(Language.CANNOT_DATA, Language.ALERT, function () { });
                }
                else {
                    $scope.SWData = result;
                    SetDigest($rootScope);
                    SetDigest($scope);
                    ConfigAndRunChart($scope, params, myLineChart);
                }
            });
        } else {// Không có kết nối
            CheckConnection();
        }

    }
    $scope.ShowChartYear = function (id, nameclass) {// Edit 05/10/2017
        if (NetworkStatus == 1) {// Có kết nối
            $scope.TitleChart = Language.MONTH;
            statusinterval = true;
            ShowTitleChart(0, 1);
            RemoveClass($scope.idclassold, nameclass);
            AddClass(id, nameclass);
            // if (myLineChart != undefined)
            //     myLineChart.destroy();
            // myLineChart = undefined;
            $scope.idclassold = id;
            $scope.TypeDate = "Y";
            params.TypeDate = "Y";
            $scope.TypeChart = "line";
            params.DateFrom = new Date();
            params.DateTo = new Date();
            LoadChart(params, function (result) {
                if (result == null) {
                    $scope.Main.TitleDate = Language.YEAR + " " + ConvertDateToString(params.DateFrom, false, "yyyy");// Set lại tiêu đề biểu đồ năm
                    SetDigest($scope);
                    ShowAlert(Language.CANNOT_DATA, Language.ALERT, function () { });
                }
                else {
                    $scope.SWData = result;
                    SetDigest($rootScope);
                    SetDigest($scope);
                    ConfigAndRunChart($scope, params, myLineChart);
                }
            });
        } else {// Không có kết nối
            CheckConnection();
        }

    }
    $scope.CurrentChart = function (id, nameclass) {// Edit 05/10/2017
        if (NetworkStatus == 1) {// Có kết nối
            $scope.TitleChart = Language.HOUR;
            ShowTitleChart(0);
            RemoveClass($scope.idclassold, nameclass);
            AddClass(id, nameclass);
            $scope.idclassold = id;
            $scope.TypeDate = "D";
            params.TypeDate = "D";
            $scope.TypeChart = "line";
            params.DateCurrent = new Date();
            params.DateFrom = new Date();
            params.DateTo = new Date();
            params.DateTo.setDate(params.DateTo.getDate() + 1);
            GetDefaultSensorNode(SWMPInfo.CustomerCodeReg, new Date(), function (result) {
                $scope.SWData = result;
                $scope.SWDataCurrent = result;
                SetDigest($rootScope);
                SetDigest($scope);
                ConfigAndRunChart($scope, params, myLineChart);
            });
        } else {// Không có kết nối
            CheckConnection();
        }

    }
    $scope.ShowNotica = function () {
        if (intervalMucNuoc != null)
            clearInterval(intervalMucNuoc);
        PushToPage("html/listnotica.html");
    }
    $scope.BackChart = function () {// Edit 05/10/2017
        if (NetworkStatus == 1) {// Có kết nối
            if (IsShowChart == 0) {//Edit 05/10/2017  //Nếu BackChart trước đã kết thúc
                IsShowChart = 1;// Edit 05/10/2017 //Bắt đầu back chart 
                statusinterval = true;
                if (params.TypeDate == "D") {
                    params.DateFrom.setDate(params.DateFrom.getDate() - 1);
                    params.DateTo.setDate(params.DateTo.getDate() - 1);
                }
                else if (params.TypeDate == "M") {
                    params.DateTo.setMonth(params.DateFrom.getMonth());
                    params.DateFrom.setMonth(params.DateFrom.getMonth() - 1);
                }
                else if (params.TypeDate == "Y") {
                    params.DateTo.setFullYear(params.DateFrom.getFullYear());
                    params.DateFrom.setFullYear(params.DateFrom.getFullYear() - 1);
                }
                LoadChart(params, function (result) {
                    if (result.success == false) {//Không có dữ liệu - bật thông báo cho khách hàng nhưng vẫn vẻ biểu đồ trống
                        var label;
                        if (params.TypeDate == "D") {
                            label = Language.CANNOT_DATA_DATE + " " + ConvertDateToString(params.DateFrom, false, "ddMMyyyy");
                        }
                        else if (params.TypeDate == "M") {
                            label = Language.CANNOT_DATA_MONTH + " " + ConvertDateToString(params.DateFrom, false, "MMyyyy");
                        }
                        else if (params.TypeDate == "Y") {
                            label = Language.CANNOT_DATA_YEAR + " " + ConvertDateToString(params.DateFrom, false, "yyyy");
                        }
                        ShowAlert(label, Language.ALERT, function () { });
                        IsShowChart = 0;//Edit 05/10/2017 // back chart kết thúc
                    }

                    $scope.SWData = result;
                    SetDigest($rootScope);
                    SetDigest($scope);
                    ConfigAndRunChart($scope, params, myLineChart);
                    IsShowChart = 0;//Edit 05/10/2017 // back chart kết thúc
                });
            }
        } else {// Không có kết nối
            CheckConnection();
        }
    }
    $scope.NextChart = function () {
        if (NetworkStatus == 1) {// Có kết nối
            if (IsShowChart == 0) {//Edit 05/10/2017  //Nếu BackChart trước đã kết thúc
                IsShowChart = 1; // Edit 05/10/2017 //Bắt đầu next chart 
                params.DateCurrent = new Date();
                if (params.TypeDate == "D") {
                    params.DateFrom.setDate(params.DateFrom.getDate() + 1);
                    params.DateTo.setDate(params.DateTo.getDate() + 1);
                    var datefrom = new Date(params.DateFrom.getFullYear(), params.DateFrom.getMonth(), params.DateFrom.getDate());
                    var datetoo = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
                    if (datefrom > datetoo) {
                        ons.notification.alert({
                            message: Language.CANNOT_DATA_DATE + " " + ConvertDateToString(params.DateFrom, false, "ddMMyyyy"), 
                            title: Language.ALERT, 
                            buttonLabels: [Language.CLOSE], callback: function () {
                                params.DateFrom.setDate(params.DateFrom.getDate() - 1);
                                params.DateTo.setDate(params.DateTo.getDate() - 1);
                            }
                        });
                        IsShowChart = 0;//Edit 05/10/2017 // next chart kết thúc
                        return false;
                    }
                    else if (datefrom.toString() == datetoo.toString()) {
                        statusinterval = false;
                        IsShowChart = 0;//Edit 05/10/2017 // next chart kết thúc
                    }
                }
                else if (params.TypeDate == "M") {
                    params.DateFrom.setMonth(params.DateFrom.getMonth() + 1);
                    params.DateTo.setMonth(params.DateFrom.getMonth() + 1);
                    var monthfrom = new Date(params.DateFrom.getFullYear(), params.DateFrom.getMonth() + 1, 1);
                    if (monthfrom > new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)) {
                        ons.notification.alert({
                            message: Language.CANNOT_DATA_MONTH + " " + ConvertDateToString(params.DateFrom, false, "MMyyyy"), 
                            title: Language.ALERT, 
                            buttonLabels: [Language.CLOSE], 
                            callback: function () {
                                params.DateFrom.setMonth(params.DateFrom.getMonth() - 1);
                                params.DateTo.setMonth(params.DateFrom.getMonth() - 1);
                            }
                        });
                        IsShowChart = 0;//Edit 05/10/2017 // next chart kết thúc
                        return false;
                    }
                }
                else if (params.TypeDate == "Y") {
                    params.DateFrom.setFullYear(params.DateFrom.getFullYear() + 1);
                    params.DateTo.setFullYear(params.DateFrom.getFullYear() + 1);
                    if (params.DateFrom.getFullYear() > new Date().getFullYear()) {
                        ons.notification.alert({
                            message: Language.CANNOT_DATA_YEAR + " " + ConvertDateToString(params.DateFrom, false, "yyyy"), title: Language.ALERT, buttonLabels: [Language.CLOSE], callback: function () {
                                params.DateFrom.setFullYear(params.DateFrom.getFullYear() - 1);
                                params.DateTo.setFullYear(params.DateFrom.getFullYear() - 1);
                            }
                        });
                        IsShowChart = 0;//Edit 05/10/2017 // next chart kết thúc
                        return false;
                    }
                }
                LoadChart(params, function (result) {
                    if (result.success == false) {//Không có dữ liệu - bật thông báo cho khách hàng nhưng vẫn vẻ biểu đồ trống
                        var label;
                        if (params.TypeDate == "D") {
                            label = Language.CANNOT_DATA_DATE + " " + ConvertDateToString(params.DateFrom, false, "ddMMyyyy");
                        }
                        else if (params.TypeDate == "M") {
                            label = Language.CANNOT_DATA_MONTH + " " + ConvertDateToString(params.DateFrom, false, "MMyyyy");
                        }
                        else if (params.TypeDate == "Y") {
                            label = Language.CANNOT_DATA_YEAR + " " + ConvertDateToString(params.DateFrom, false, "yyyy");
                        }
                        ShowAlert(label, Language.ALERT, function () { });
                        IsShowChart = 0;//Edit 05/10/2017 // back chart kết thúc
                    }

                    $scope.SWData = result;
                    SetDigest($rootScope);
                    SetDigest($scope);
                    ConfigAndRunChart($scope, params, myLineChart);
                    IsShowChart = 0;//Edit 05/10/2017 // next chart kết thúc
                });
            }
        } else {// Không có kết nối
            CheckConnection();
        }

    }
    $scope.ShowMenu = function () {
        clearInterval(intervalMucNuoc);
        statusinterval = true;
        // PushToPage("html/menu.html", { animation: "lift" });
        slidemenu.right.open();
        $rootScope.$broadcast("OpenMenu", ["ReloadMenu"]);

    }
    SetDigest($scope);
});
// main.html end
app.controller("SubController", function ($scope) {
});

app.controller('feedbackctrl', function ($scope) {
    $scope.Language = Language;
    $scope.ipImage = ipImage;
    $scope.Data = {
        CustomerCodeReg: SWMPInfo.CustomerCodeReg,
        IDArea: SWMPInfo.IDArea,
        BadSattusRpd: 0,
        BadDateRPpd: new Date(),
        DescRPpd: "",
        Avatar: Profile.Avatar,
        AddressReg: SWMPInfo.AddressReg,
        EmailReg: SWMPInfo.EmailReg,
        NameReg: SWMPInfo.NameReg,
        ListImage: []
    }
    $scope.Back = function () {
        PopPage();
    }
    $scope.SendFeedback = function () {
        if ($scope.Data.DescRPpd != "") {
            ShowLoading();
            $.ajax({
                url: ip + "/api/RPDamageSWMIns?token=" + Profile.Token, type: "POST", dataType: "JSON", data: { Data: JSON.stringify($scope.Data) },
                timeout: 45000,
                success: function (data) {
                    HideLoading();
                    if (data.success) {
                        ShowAlert(Language.FEEDBACK_COMPLETE, Language.ALERT, function () {
                            PopPage();
                        });
                    }
                }
                , error: function (xhr) {
                    ShowAlert(JSON.stringify(xhr), Language.ALERT, function () { });
                    HideLoading();
                }
            });
        }
        else {
            ShowAlert(Language.PLEASE_ENTER_DESCFEED, Language.ALERT, function () { });
        }
    }
    $scope.AddPicture = function () {
        var options = {
            title: Language.CHOOSE_IMAGE_2,
            buttonLabels: [Language.CAPTURE_IMAGE, Language.CHOOSE_IMAGE],
            addCancelButtonWithLabel: Language.CANCEL,
            androidEnableCancelButton: true,
            winphoneEnableCancelButton: true
        };
        window.plugins.actionsheet.show(options, function (index) {

            if (index == 1) {
                // Take picture using device camera and retrieve image as base64-encoded string
                navigator.camera.getPicture(onPhotoDataSuccessAvatar, onFail, {
                    quality: 80,
                    targetWidth: 600,
                    targetHeight: 600,
                    allowEdit: false,
                    destinationType: Camera.DestinationType.DATA_URL,
                    saveToPhotoAlbum: false,
                    encodingType: Camera.EncodingType.PNG,
                    mediaType: Camera.MediaType.PICTURE,
                });
            }
            else if (index == 2) {
                navigator.camera.getPicture(onPhotoURISuccessAvatar, onFail, {
                    quality: 80,
                    targetWidth: 600,
                    targetHeight: 600,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.PNG,
                    mediaType: Camera.MediaType.PICTURE,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    correctOrientation: true
                });
            }
        });
    }
    function onPhotoDataSuccessAvatar(imgData) {
        var dataUpload = {
            username: Profile.UserName,
            base64img: imgData,
            parentFol: 'RgDamage',
            childFol: 'PicFeedback',
            size: '300',
        }
        UploadAvatar(dataUpload, function (rel) {
            $scope.Data.ListImage.push("/" + rel);
            SetDigest($scope);
        });
    }
    function onFail(ev) {
        // alert(JSON.stringify(ev));

    }
    function onPhotoURISuccessAvatar(imgData) {
        plugins.crop.promise(imgData, {})
            .then(function success(newPath) {
                var can = document.getElementById("imgCanvasRg");
                var ctx = can.getContext("2d");

                var img = new Image();
                img.onload = function () {
                    can.width = img.width;
                    can.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    var encodedBase = can.toDataURL();
                    encodedBase = encodedBase.split(',')[1];
                    var dataUpload = {
                        username: Profile.UserName,
                        base64img: encodedBase,
                        parentFol: 'RgDamage',
                        childFol: 'PicFeedback',
                        size: '300',
                    }
                    UploadAvatar(dataUpload, function (rel) {
                        $scope.Data.ListImage.push("/" + rel);
                        SetDigest($scope);
                    });
                };
                img.src = newPath;
            })
            .catch(function fail(err) {

            });
    }
    SetDigest($scope);
});

//Forgot Password
app.controller('ForgotPassword', function ($scope) {
    $('#tabIndexForgotPwd').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            var $this = $(e.target);
            var index = parseFloat($this.attr('data-index'));
            $('[data-index="' + (index + 1).toString() + '"]').focus();
        }
    });

    $scope.forgotPassword = function () {
        PushToPage("html/forgot_password.html");
    }
    $scope.Send = function () {
        var userName = $(".UserName_ForgotPwd").val();
        var email = $(".Email_ForgotPwd").val();
        if (email.replace(/\s/g, '') == "" || userName.replace(/\s/g, '') == "" || !validateEmail(email.replace(/\s/g, ''))) {
            if (userName.replace(/\s/g, '') == "" || email.replace(/\s/g, '') == "") {
                if (userName.replace(/\s/g, '') == "")
                    animateError("#UserName_ForgotPwd");
                if (email.replace(/\s/g, '') == "")
                    animateError("#Email_ForgotPwd");
            } else {
                if (!validateEmail(email.replace(/\s/g, ''))) {
                    alertMessage('Email không đúng định dạng');
                }
            }

        } else {
            ForgotPassword(userName, email);
        }
    }
    $scope.popPage = function () {
        PopPage();
    }

    SetDigest($scope);
});
// login page
app.controller('loginctrl', function ($scope, $rootScope) {
    ShowLoading();
    setTimeout(function () {
        if (ons.platform.isIOS()) {
            if (typeof device != "undefined") {
                navigator.splashscreen.hide();
            }
        }
    }, 500);
    LoadSettingCache(function (rel) {
        if (rel != undefined && rel != null)
            ipImage = "http://" + rel;
    });
    document.addEventListener("resume", onResume, false);
    function onResume() {

        var page = GetPageName();
        if (page == "html/login.html") {
            window.location.href = "index.html";
        }
    }

    Profile = localStorage.getItem(AppCode + "profile");
    if (Profile != "" && Profile != null)
        Profile = JSON.parse(Profile);
    else {
        Profile = { UserName: "", Password: "" }
    }
    $scope.LoginData = { UserName: Profile.UserName, Password: Profile.PasswordNotEncryt == undefined ? "" : Profile.PasswordNotEncryt };
    try {
        cordova.getAppVersion.getVersionNumber(function (version) {
            $scope.VersionApp = version.toString().replace(" ", "");
            var status = false;
            var OS = ons.platform.isIOS() ? 1 : 0;
            status = true;
            var autologin = (Profile != null && localStorage.getItem(AppCode + "logined") == "1");
            if (!autologin) {
                HideLoading();
                $('.login-content').fadeIn(500);
                if (typeof device != "undefined") {
                    navigator.splashscreen.hide();
                }
            } else {
                var verCheck = setInterval(function () {
                    if (status && autologin) {
                        if (typeof device != "undefined") {
                            navigator.splashscreen.hide();
                        }
                        LoginToMain($scope, null, function (result) {
                            HideLoading();
                            if (result) {
                                if (HaveNotification == 1) {//Khi xem thông báo
                                    var myInterval = setInterval(function () {
                                        if (NotificationData.additionalData.type == 0) // notification thông báo
                                        {
                                            PushToPage('html/listnotica.html');
                                        }

                                        else if (NotificationData.additionalData.type == 2) // notification hoá đơn
                                        {
                                            PushToPage("html/billing.html");
                                        }
                                        else if (NotificationData.additionalData.type == 3) // notification cảnh báo
                                        {
                                            PushToPage('html/main.html');
                                        }
                                        else if (NotificationData.additionalData.type == 201)// notification ecommerce
                                        {
                                            PushToPage("ecommerce/detailnotification.html", { id: NotificationData.additionalData.idNotification });
                                        }
                                        clearInterval(myInterval);
                                    }, 500);
                                } else {
                                    PushToPage("html/main.html");
                                }
                            } else {
                                HideLoading();
                                $('.login-content').show();
                                if (typeof device != "undefined") {
                                    navigator.splashscreen.hide();
                                }
                            }
                        });
                    }
                    clearInterval(verCheck);
                }, 1000);
            }
        });
    } catch (error) {
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }
        HideLoading();
        $('.login-content').show();
    }

    $scope.Login = function () {
        setTimeout(function () {
            
            HideLoading();
            PushToPage("html/home.html");
            // LoginToMain($scope, null, function (result) {
            //     HideLoading();
            //     if (result) {
            //         localStorage.setItem(AppCode + 'logined', "1");
            //         PushToPage("html/main.html");
            //     }
            //     else {
            //         $('#login-process').fadeOut(100, function () {
            //             $('.login-content').fadeIn(200);
            //         });
            //     }
            // });
        }, 100);
    };
    SetDigest($scope);
});
function LoadSettingCache(callback) {
    $.ajax({
        url: ipAd + "/SettingAppRouter/GetSettingName", type: "GET", dataType: "JSON", data: { SettingName: "SVRIMG" },
        timeout: 4500,
        success: function (data) {
            if (data.success == true) {
                callback(data.data.ValueInfo);
            } else {
                callback(null);
            }
        }
        , error: function (xhr) {
            CheckServer(xhr.statusText);
            callback(null);
        }
    });
}
// login page end
// 
function SetDigest(scope) {
    if (!scope.$$phase)
        scope.$digest();
}
function PushToPage(page, params) {//edit 05/10/2017
    if (NetworkStatus == 1) {// Có kết nối mạng
        navihtml = page;
        HideLoading();
        if (GetPageName() == page) {
            if (params != null) {
                params['page'] = page;
                document.querySelector('#navigator').replacePage(page, { data: params });
            } else {
                document.querySelector('#navigator').replacePage(page, { data: { page: page } });
            }
        } if (CheckPageExist(page) == false) {
            if (params != null) {
                params['page'] = page;
                document.querySelector('#navigator').pushPage(page, { data: params, animation: params.animation });
            } else {
                document.querySelector('#navigator').pushPage(page, { data: { page: page } });
            }
        } else {// page exists
            if (params != null) {
                params['page'] = page;
                document.querySelector('#navigator').bringPageTop(page, { data: params });
            } else {
                document.querySelector('#navigator').bringPageTop(page, { data: { page: page } });
            }
        }
    } else {// Không có kết nối
        if (IsNetWorkErrorShow == 0) {// Chưa bật thông báo nào - tránh bật nhiều thông báo cùng lúc
            IsNetWorkErrorShow = 1; //Đã bật thông báo
            ons.notification.alert({
                messageHTML: "<div style='text-align:center'><img style='width:80px' src='img/wifi.png' /></div><div>" + Language.NO_NETWORK_CONNECTION_PLEASE_TRY_AGAIN + "</div>",
                title: "",
                buttonLabels: [Language.CLOSE],
                callback: function () {
                    IsNetWorkErrorShow = 0;
                }
            });
        }

    }
}

function ResetToPage(page, params) {
    HideLoading();
    if (page == "html/main.html") {
        localStorage.setItem(AppCode + ListParamsLocal.popPageMain, 1);
    }
    if (params != null) {
        document.querySelector('#navigator').resetToPage(page, params, { animation: "slide" });
    }
    else {
        document.querySelector('#navigator').resetToPage(page, { animation: "slide" });
    }
}
function AddJSONObjectToArray(item, nameJSONLocal, callback) {
    if (!empty(nameJSONLocal)) {
        var json = localStorage.getItem(AppCode + nameJSONLocal);
        if (!empty(json)) {
            json = JSON.parse(json);
        }
        else {
            json = [];
        }
        json.push(item);
        localStorage.setItem(AppCode + nameJSONLocal, JSON.stringify(json));
    }
    callback(json.length);
}
// Kiểm tra chuỗi string empty
function empty(str) {
    if (typeof str == 'undefined' || typeof str == 'null' || !str || str.length === 0 || str === "" || !/[^\s]/.test(str) || /^\s*$/.test(str) || str.replace(/\s/g, "") === "") {
        return true;
    }
    else {
        return false;
    }
}
function ResetToLogin() {//edit 12/10/2017
    HideLoading();
    if (socket != null && socket != undefined)
        socket.disconnect();
    // if (socketChat != null && socketChat != undefined)
    //     socketChat.disconnect();
    localStorage.removeItem(AppCode + "logined");
    // document.querySelector('#navigator').resetToPage("html/login.html");
    slidemenu.content.load("html/login.html").then(function () {
        slidemenu.right.close();
        SWMPInfo=null;
    });
}
function PopPage(params) {
    HideLoading();
    if (params != null) {
        document.querySelector('#navigator').popPage(params);
    }
    else
        document.querySelector('#navigator').popPage();
}
function GetPageName() {
    // console.log(JSON.stringify(document.querySelector('#navigator').topPage.data));
    if (document.querySelector('#navigator').topPage == null || document.querySelector('#navigator').topPage.data == null || document.querySelector('#navigator').topPage.data == undefined) {
        return null;
    } else {
        return document.querySelector('#navigator').topPage.data.page;
    }
}
function GetLocalItem(name) {
    var rel = localStorage.getItem(name);
    if (!empty(rel)) {
        return JSON.parse(rel).length;
    }
    else
        return "";
}
function Back() {
    PopPage();
}
function GetParamsPage() {
    return document.querySelector('#navigator').topPage.data;
}
function ShowBarHome() {
    if (intervalMucNuoc != null)
        clearInterval(intervalMucNuoc);
    statusinterval = false;
    if (document.querySelector('#navigator').topPage.pushedOptions.page != "html/main.html") {
        ResetToPage("html/main.html");
    }
}

function ShowShopping() {
    if (CheckEcommerce() == true) {
        statusinterval = true;
        RAPInfo = Profile.RAPInfo;
        if (intervalMucNuoc != null)
            clearInterval(intervalMucNuoc);
        PushToPage("ecommerce/company.html");
    }
    else {
        if (intervalMucNuoc != null){
            clearInterval(intervalMucNuoc);
        }
        Updating();
    }
}

function ShowNotication() {
    if (document.querySelector('#navigator').topPage.pushedOptions.page != "html/listnotica.html") { // edit 18/10/2017
        navihtml = "html/listnotica.html";
        PushToPage("html/listnotica.html");
    }
}
function ShowBarcode() {
    ons.notification.alert({ message: "Tính năng đang phát triển", title: Language.ALERT, buttonLabels: [Language.CLOSE] });
}
function Updating() {
    ons.notification.alert({ message: "Tính năng đang phát triển", title: Language.ALERT, buttonLabels: [Language.CLOSE] });
}
function ShowHistory() {
    var name = document.querySelector('#navigator').topPage.pushedOptions.page;
    if (name != "html/history.html")
        PushToPage("html/history.html");
}
function CheckEcommerce() // kiem tra xem co quyen su dung ecommerce hay ko
{
    if (Profile != null && Profile.ListApp != null) {
        var validEcommerce = Profile.ListApp.filter(function (value) {
            return value.AppCode == AppCode;
        });
        if (validEcommerce != null && validEcommerce.length > 0) {
            return validEcommerce[0].CheckEcom;
        }
        else return false;
    }
    else return false;
}

function ShowHelp() {
    Updating();
}
function GetPageNameCurrent() {
    return document.querySelector('#navigator').topPage.pushedOptions.page;
}
function ShowAccount() {
    if (intervalMucNuoc != null)
        clearInterval(intervalMucNuoc);
    statusinterval = true;
    var name = document.querySelector('#navigator').topPage.pushedOptions.page;
    if (name != "controller/profile/profile.html")
        PushToPage("controller/profile/profile.html");
}
function ShowBilling() {
    var name = document.querySelector('#navigator').topPage.pushedOptions.page;
    if (name != "html/billing.html")
        PushToPage("html/billing.html");
}
function ShowChartDetail() {
    var name = document.querySelector('#navigator').topPage.pushedOptions.page;
    if (name != "html/chartdetail.html")
        PushToPage("html/chartdetail.html");
}

function ShowLoading() {
    $("#modal").fadeIn(100);
}
function HideLoading() {
    $("#modal").fadeOut(100);
}
function arrayMin(arr) {
    var len = arr.length, min = Infinity;
    while (len--) {
        if (Number(arr[len]) < min) {
            if (arr[len] == null)
                continue;
            min = Number(arr[len]);
        }
    }
    return min;
};
function arrayMax(arr) {
    var len = arr.length, max = -Infinity;
    while (len--) {
        if (Number(arr[len]) > max) {
            max = Number(arr[len]);
        }
    }
    return max;
};
function GetFontSizeLabelChart1() {
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

function GetFontSizeLabelChart() {
    var size = 14;

    if (CheckIsIOS()) {
        if (window.innerWidth <= 800) {
            size = 20;
        }
        if (window.innerWidth <= 768) {
            size = 18;
        }
        if (window.innerWidth <= 600) {
            size = 17;
        }
        if (window.innerWidth <= 414) {
            size = 16;
        }
        if (window.innerWidth <= 365) {
            size = 13;
        }
        if (window.innerWidth <= 320) {
            size = 12;
        }
        return size;
    } else {
        if (window.innerWidth <= 800) {
            size = 18;
        }
        if (window.innerWidth <= 600) {
            size = 17;
        }
        if (window.innerWidth <= 480) {
            size = 16;
        }
        if (window.innerWidth <= 384) {
            size = 13;
        }
        return size;
    }

}
function GetLineChart() {
    if (window.innerWidth >= 768) {
        return 2;
    }
    else return 1;
}
function


    GetDataAjax(url, type, params, callback) {//edit 05/10/2017
    $.ajax({
        url: url, type: type, dataType: "JSON", data: { Data: params },
        timeout: 45000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
        }
    });
}
function Chat() {
    Updating();
}
function ShowNoticaAlert(content, timeout) {
    document.getElementById("contentNotice").innerHTML = content;
    ModalNotice.show();
    setTimeout(function () {
        HideNoticaAlert();
        // PopPage();
    }, timeout);
}
function HideNoticaAlert() {
    ModalNotice.hide();
}
function GetErrorContent(errorcode) {
    if (errorcode == "ERR_000034") {
        return Language.ERR_000034;
    }
}
function showappstore(url) {
    if (ons.platform.isIOS()) {
        window.location = url;
        // window.open(url, "_system");
    }
    else {
        window.open(url, "_system");
    }
    navigator.app.exitApp();
}
function ConvertPhanCach(x, phancach) {
    if (x === null || x === "")
        x = 0;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, phancach);
}
function LostConnect(isShow) {
    if (isShow)
        $("#lost-connect").fadeIn(300);
    else $("#lost-connect").fadeOut(300);
}
function InsertNews(idnews) {
    window.sqlitePlugin.openDatabase({ name: 'swm.db', location: 'default', androidDatabaseImplementation: 2 }, function (db) {

        db.transaction(function (tx) {
            tx.executeSql("CREATE TABLE IF NOT EXISTS FLAGREAD (IDNews VARCHAR PRIMARY KEY,AppCode)");
            var query = "INSERT OR IGNORE INTO FLAGREAD values (?,?)";
            tx.executeSql(query, [idnews, AppCode], function (tx, res) {

            });

        }, function (error) {
            console.log("ERROR========" + JSON.stringify(error) + "----" + new Date().toLocaleDateString());
            db.close();
        }, function () {
            db.close(function (sub) {
                console.log("Close Insert OK");
            });
        });

    });
}
// listnotica
function GetListNotification(mydata, callback) {//edit 12/09/2016
    ShowLoading();
    $.ajax({
        url: ip + "/api/GetByProvinceAndDateMobile", type: "GET", dataType: "JSON", data: mydata,
        timeout: 4500,
        success: function (data) {
            if (data.success == true) {
                for (var k = 0; k < data.data.length; k++) {
                    var d = new Date(data.data[k].LastUpdate);
                    var dtime = ConvertDateToString(new Date(), false, "yyyyMMdd");
                    var date = ConvertDateToString(d, false, "yyyyMMdd");

                    if (dtime == date) {
                        data.data[k].LastUpdate = formatTime(d);
                    }
                    else if (dtime.substring(1, 4) != date.substring(1, 4)) {
                        data.data[k].LastUpdate = ConvertDateToString(new Date(date), false, "ddMMyy");
                    }
                    else {
                        data.data[k].LastUpdate = ConvertDateToString(new Date(date), false, "ddMM");
                    }
                }
                if (data.data.length > 0) {
                    callback(data.data);
                }
                else {
                    callback(null);
                }

            } else {
                callback(null);
            }

        }
        , error: function (xhr) {
            CheckServer(xhr.statusText);
            callback(null);
        }
    });
}
// Cập nhật trạng thái tin nhắn đã đọc
function ChangeStatusReadNotica(idnotica, UserCode, callback) {
    $.ajax({
        url: ip + "/api/DeleteNewNotificationMobile?token=" + Profile.Token,
        type: "POST", dataType: "JSON", data: { IdNotifications: idnotica, CustomerCodeReg: UserCode },
        contentType: 'application/x-www-form-urlencoded',
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            callback(data.success);
        }, error: function (xhr) {
            // alert(JSON.stringify(xhr));
            callback(false);
        }
    });
}
// listnotica end
// Login function
function LoginToMain(scope, event, callback) {//Edit 10/10/2017
    ShowLoading();
    if (event == undefined || event == null || event.keyCode == 13) {
        Login({ ip: mainIP, UserName: scope.LoginData.UserName, VersionApp: scope.VersionApp, Password: scope.LoginData.Password }, function (rel) {
            if (rel != null && rel != "Unauthorized" && rel != "Not Found" && rel != "error") {//Đăng nhập thành công
                Profile = rel.data;
                Profile.PasswordNotEncryt = scope.LoginData.Password;
                Profile.Token = rel.token;
                Profile.token = rel.token;
                Profile.ListApp.filter(function (element, index) {
                    if ( CompareString( element.AppCode, "SWMP")) {
                        iptokenswm = element.ListLink.link_token_swm;
                        ipsocketswm = element.ListLink.link_socket_reload_swm;
                        
                        ipToken = element.ListLink.link_token_swm;
                        ip = element.ListLink.link_token_swm;
                        ipbackup = element.ListLink.link_token_swm_backup;
                        ipSocket = element.ListLink.link_socket_reload_swm;
                        GetInfoCustomer(element.AccountApp, function (result) {
                            if(result != null){
                                SWMPInfo = result.data;
                                if(result.success == true){
                                    if (device != undefined && device != null) {
                                        setTimeout(function () {
                                            var Push_DeviceInfo = {
                                                DeviceId: localStorage.getItem(AppCode + "DeviceID"),
                                                OS: device.platform,
                                                UUID: device.uuid
                                            };
                                            $.ajax({
                                                url: ip + "/api/UpdateListDeviceIDRegister?token=" + Profile.Token,
                                                type: "POST",
                                                contentType: 'application/x-www-form-urlencoded',
                                                dataType: "JSON",
                                                data: { 
                                                    CustomerCodeReg: SWMPInfo.CustomerCodeReg, 
                                                    DeviceInfo: JSON.stringify(Push_DeviceInfo) 
                                                },
                                                timeout: 45000,
                                                success: function (data) {
                                                }, error: function (xhr) {
                                                    CheckServer(xhr.statusText);
                                                }
                                            });
                                        }, 500)
                                    }
                                }
                            }
                        });
                    }
                });
                // RAPInfo = Profile.RAPInfo;
                // RAPInfo.UserName = Profile.UserName;
                // RAPInfo.Token = rel.token;
                localStorage.setItem(AppCode + "profile", JSON.stringify(rel.data));
                localStorage.setItem(AppCode + "account", JSON.stringify(rel));
                localStorage.setItem(AppCode + "logined", "1");
                // CreateChat(DeviceInfo);
                setTimeout(function () {
                    HideLoading();
                    //Chua dang ky
                    if(CheckIsnullUndefined(SWMPInfo)){
                        ShowAlert(Language.CHUA_DANG_KY_NUOC, Language.ALERT, function () { });
                        $('.login-content').toggle(true);
                    }else{
                        callback(true);
                    }
                }, 500);

            } else {//Đăng nhập thất bại
                if (rel == "Not Found") {//Ip chính down -> sử dụng ip phụ
                    if (ip == ipbackup){
                        ip == ipToken;
                    }else{
                        ip = ipbackup;
                    }
                }else {
                    if (rel == "error") {
                        ShowErrorNetwork();
                    }
                    else {
                        ons.notification.alert({
                            message: Language.LOGIN_FAIL,
                            title: Language.ERROR,
                            buttonLabel: Language.CLOSE,
                            animation: 'default',
                            callback: function () {
                                setTimeout(function () {
                                    HideLoading();
                                    callback(false);
                                }, 500);
                            }
                        });
                    }
                }
            }
        });
    } else {
        HideLoading();
    }
}
// Check Chat
function CreateChat(deviceInfo) {
    if (Profile.Avatar == null || Profile.Avatar == undefined || Profile.Avatar == "")
        Profile.Avatar = "/Avatar/default.jpg";
    CheckAccountChat(Profile.UserName, SWMPInfo.CustomerCodeReg, AppCode, SWMPInfo.NameReg, Profile.Avatar, deviceInfo, function (result) {
        if (result != null) {
            Profile.AccountChat = result.Account;
        }
    });
    //Chat
    localStorage.setItem(AppCode + "profile", JSON.stringify(Profile));
    // Chat
    socketChat.connect();
    var datestring = ConvertDateToString(new Date(), false, "ddMMyyyy HH:mm");
    socket.emit('adduser', { Name: AppCode + SWMPInfo.CustomerCodeReg, FullName: SWMPInfo.NameReg, Avatar: Profile.Avatar, DateOnline: datestring, Topic: AppCode + SWMPInfo.CustomerCodeReg });
}
function Login(params, callback) {
    if (params != undefined && params != null) {
        DeviceInfo = { DeviceID: 'undefined', DeviceIP: "192.168.0.1", DeviceName: 'undefined', AppProject: AppCode };
        if (typeof device !== 'undefined') {
            DeviceInfo.DeviceID = localStorage.getItem(AppCode + "DeviceID");
            DeviceInfo.DeviceName = device.model;
            DeviceInfo.UUID = device.uuid;
            DeviceInfo.OS = device.platform;
        }


        if (!empty(params.UserName)){
            var pass = CryptoJS.AES.encrypt(params.Password, params.UserName.substring(1, 4)).toString();
        }
            
        $.ajax({
            // url: params.ip + "/api/rapAuthenticateLoginMobile", type: "POST",// public PHP
            // url: params.ip + "/token/rapAuthenticateLoginMobile", type: "POST",// test
            url: params.ip + "/token/LoginCustomer", type: "POST",// token Nodejs
            timeout: 30000,
            // async: false,
            data: { 
                Username: params.UserName, 
                Password: pass, 
                deviceuuid: typeof device !== 'undefined' ? device.uuid : null, 
                DeviceInfo: JSON.stringify(DeviceInfo), 
                VersionApp: params.VersionApp, 
                AppCode: "SWMP" 
            },
            success: function (data) {
                if (data.success == true) {
                    // Lấy ip từ config
                    // ipToken = data.data.ListLink.link_token;
                    // ip = data.data.ListLink.link_token;
                    // ipbackup = data.data.ListLink.link_token_backup;
                    // ipSocket = data.data.ListLink.link_socket_reload;
                    callback(data);

                }
                else callback(null);
            },
            error: function (xhr, textStatus, thrownError) {
                HideLoading();
                callback(xhr.statusText);
            }
        });
    }
    else callback(null);
}
// Login function
// HISTORY
function GetLogRequest(CusCode, callback) {
    ShowLoading();
    $.ajax({
        url: ip + "/api/Mekong/GetByCusCodeAndDate", type: "GET", dataType: "JSON", data: { CustomerCode: CusCode, Page: -1, token: Profile.Token },
        timeout: 45000,
        success: function (data) {

            if (data.success == true) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i]._IDADDetailNode == undefined || data.data[i]._IDADDetailNode == null)
                        continue;
                    data.data[i]._IDADDetailNode.CreateDate = new Date(data.data[i]._IDADDetailNode.CreateDate);
                    //   data.data[i].MeterPumpSettingShow = ConvertNumberFormat(data.data[i].MeterPumpSetting);
                    if (data.data[i]._IDADDetailNode.RealityMeterPump == null) {// nếu số nước bơm = null thì gán =0
                        data.data[i]._IDADDetailNode.RealityMeterPump = 0;
                        data.data[i]._IDADDetailNode.RealityMeterPumpShow = 0;
                    }
                    else {
                        //   data.data[i]._IDADDetailNode.RealityMeterPumpShow = ConvertNumberFormat(data.data[i]._IDADDetailNode.RealityMeterPump);
                    }

                    // if(data.data[i]._IDADDetailNode.StartDateReq!=null ){
                    //     data.data[i]._IDADDetailNode.StartDateReqShow = DateFormatTypeVN(data.data[i]._IDADDetailNode.StartDateReq);
                    //     data.data[i]._IDADDetailNode.StartTimeReqShow = GetTimeOfDate(data.data[i]._IDADDetailNode.StartDateReq); 

                    // }
                    //  if(data.data[i]._IDADDetailNode.EndDateReq!=null )
                    //  {
                    //     data.data[i]._IDADDetailNode.EndDateReqShow = DateFormatTypeVN(data.data[i]._IDADDetailNode.EndDateReq);
                    //     data.data[i]._IDADDetailNode.EndTimeReqShow = GetTimeOfDate(data.data[i]._IDADDetailNode.EndDateReq); 
                    //  }
                    // GetSalinityByDistanceCode(data.data[i].DistanceCode,function(result){
                    //     if(result !=null && result !='' && result !=undefined){
                    //         data.data[i].StartSalinity=result.StartSalinity;
                    //         data.data[i].EndSalinity=result.EndSalinity;
                    //     }   
                    // })

                    //format lại ngày hiển thị
                    //data.data[i].RequestDateShow = DateFormatTypeVN(data.data[i].RequestDate);
                }
                HideLoading();
                callback(data.data);
            } else {
                HideLoading();
                callback(null);
            }

        }
        , error: function (xhr) {
            HideLoading();
        }
    });
}
// HISTORY END
function ShowTitleChart(status, type) {
    // var str = $("#titlechart");
    // RemoveClass("titlechart", "marginchart");
    // RemoveClass("titlechart", "marginchart2");
    // if (status != undefined && status != null)
    //     AddClass("titlechart", "marginchart");
    // if(type=="1")
    // {
    //     AddClass("titlechart", "marginchart2");
    // }
    // str.show();
}
function RemoveInterval(interval) {
    if (interval != null && interval != undefined)
        clearInterval(interval);
}
// main end


function LoadLanguageSWM(lcode, callback) {
    lcode = lcode.toLowerCase();
    var link = "language/swm_" + lcode + ".json";
    $.getJSON(link, function (data) {
        Language = data;
        callback(data);
    });
}


// Chart
function GetDefaultSensorNode(CustomerCodeReg, datetime, callback) {
    ShowLoading();
    $.ajax({
        url: ip + "/api/GetChartToDate_ByIndex_FromCache",
        type: "GET",
        dataType: "JSON",
        data: { CustomerCodeReg: CustomerCodeReg, DateGet: datetime.getFullYear() + "/" + (datetime.getMonth() + 1) + "/" + datetime.getDate(), TimePlus: 1, token: Profile.Token },
        timeout: 45000,
        success: function (data) {
            HideLoading();
            if (data.success == true) {
                data.Money = Math.round(data.SumInDate * Profile.PriceSWMP);
                data.SumInDate = data.SumInDate.toFixed(3);
                callback(data);
            }
            else {
                var dt = { // Edit 05/10/2017
                    Money: 0,
                    SumInDate: 0,
                    data: [],
                };
                callback(dt);
            }
        }, error: function (xhr) {
            HideLoading();
        }
    });
}
function GetWeather(cityID, callback) {
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/weather",
        type: "GET",
        dataType: "JSON",
        data: { id: cityID, appid: WeatherAPI },
        timeout: 45000,
        success: function (data) {
            if (data != null) {
                data.main.temp_C = Math.round((data.main.temp - 273.16) * 10) / 10; // chuyển độ K => C
                callback(data.main);
            } else {
                var c = {};
                callback(c);
            }

        }, error: function (xhr) {

        }
    });
}
function LoadChartTimeLine(params, callback) {
    LoadChart(params, function (result) {
        callback(result);
    });
}
function LoadIndexBefore(params, callback) {
    var dateform = new Date(params.DateFrom.getFullYear(), params.DateFrom.getMonth(), params.DateFrom.getDate());

    var url = ip + "/api/getNewIndexToDateMobile?token=" + Profile.Token;
    var param = {};
    if (params.TypeDate == "D") {
        dateform.setDate(dateform.getDate() - 1);
        param = { CustomerCodeReg: SWMPInfo.CustomerCodeReg, DateGet: ConvertDateToString(dateform, false, "yyyyMMdd"), IDObjectOUP: SWMPInfo.IDObjectOup };
    }
    else if (params.TypeDate == "M") {
        dateform.setMonth(dateform.getMonth() - 1);
        param = {
            ChiSoKhiGan: null, Serial: SWMPInfo.SerialNumberReg, IDObjectOUP: SWMPInfo.IDObjectOup, MonthGet: dateform.getMonth() + 1, YearGet: dateform.getFullYear()
        }
        url = ip + "/api/GetNewIndexToMonthMobile?token=" + Profile.Token;
    }
    else if (params.TypeDate == "Y") {
        param = {
            ChiSoKhiGan: null, Serial: SWMPInfo.SerialNumberReg, IDObjectOUP: SWMPInfo.IDObjectOup, YearGet: params.DateFrom.getFullYear() - 1
        }
        url = ip + "/api/GetNewIndexToYearMobile?token=" + Profile.Token;
    }
    $.ajax({
        url: url, type: "GET", dataType: "JSON", data: param,
        timeout: 45000,
        success: function (data) {
            if (params.TypeDate == "Y" || params.TypeDate == "M") {
                if (params.TypeDate == "Y")
                    data.Data.SumInDate = data.Data.SumInYear;
                else if (params.TypeDate == "M")
                    data.Data.SumInDate = data.Data.SumInMonth;
                callback(data.Data);
            }
            else callback(data.data);
        }
        , error: function (xhr) {
            HideLoading();
            callback(null);
        }
    });

}
function LoadAlertRangeOutWater(datetime, CustomerCode, callback) {
    var url = ip + "/api/GetLogPush_Day?token=" + Profile.Token;
    var param = {
        CustomerCodeReg: CustomerCode, Date: ConvertDateToString(datetime, false, "yyyyMMdd")
    }
    $.ajax({
        url: url, type: "GET", dataType: "JSON", data: param,
        timeout: 45000,
        success: function (data) {
            callback(data.data);
        },
        error: function (xhr) {
            // alert(JSON.stringify(xhr));
            callback(null);
        }
    });
}
function LoadChart(params, callback) {
    ShowLoading();
    var url = ip + "/api/GetChartToDate_ByIndex_FromCache?token=" + Profile.Token;
    var param = { CustomerCodeReg: SWMPInfo.CustomerCodeReg, DateGet: params.DateFrom.getFullYear() + "/" + (params.DateFrom.getMonth() + 1) + "/" + params.DateFrom.getDate(), TimePlus: 1 };
    if (params.TypeDate == "M") {
        url = ip + "/api/GetChartToMonth_FromCache?token=" + Profile.Token;
        param = {
            CustomerCodeReg: SWMPInfo.CustomerCodeReg,
            MonthGet: params.DateFrom.getMonth() + 1,
            YearGet: params.DateFrom.getFullYear()
        };
    }
    else if (params.TypeDate == "Y") {
        url = ip + "/api/GetChartToYearMobile_FromCache?token=" + Profile.Token;
        param = { CustomerCodeReg: SWMPInfo.CustomerCodeReg, YearGet: params.DateFrom.getFullYear() };
    }
    $.ajax({
        url: url, type: "GET", dataType: "JSON", data: param,
        timeout: 45000,
        success: function (data) {
            HideLoading();
            if (data.success) {
                if (params.TypeDate != "D") {
                    if (params.TypeDate == "M") {
                        data.Money = Math.round(data.SumIndexOfMonth * Profile.PriceSWMP);
                        data.SumInDate = data.SumIndexOfMonth;
                    }
                    else {
                        data.Money = Math.round(data.SumInYear * Profile.PriceSWMP);
                        data.SumInDate = data.SumInYear;
                    }

                    var str = data.data;
                    if (data.data != undefined) {
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].HourSend = data.data[i].Time;
                            data.data[i].TimeSend = data.data[i].Time;
                        }
                    }
                }
                else {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].TimeSend = ConvertTime(data.data[i].TimeSend, ':');
                    }
                    data.Money = Math.round(data.SumInDate * Profile.PriceSWMP);
                }
                data.TietKiem = Language.SAVING;
                data.ToTalSum = 0
                callback(data);

            } else {// Edit 05/10/2017
                var dt = {
                    success: false,
                    SumInDate: 0,
                    Money: 0,
                    data: []
                }
                callback(dt);
            }
        }
        , error: function (xhr) {
            HideLoading();
            callback(null);
            // modal.hide();
        }
    });
}
function ShowChart(params, scope, callback) {
    if (ConvertDateToString(params.DateFrom, false, "ddMMyyyy") == ConvertDateToString(params.DateTo, false, "ddMMyyyy") && params.TypeDate == "D") {
        params.DateTo.setDate(params.DateTo.getDate() + 1);
    }
    params.TypeData = undefined;
    var rel = scope.SWData;
    var listData = [];
    if (rel != null && rel != undefined) {
        GetDataByCondition(rel.data, function (result) {
            listData = result;
        });
        params.Data = rel.data;
    }
    optionchartLine(params, scope.TypeChart, listData, function (rel) {
        GenderChart(rel, params, scope);
        callback(true);
        // var h = $(".canvas-base").height();
        // var w = $(".canvas-base").width();
        // $(".ad").css({"width": w, "height":h});
    });
}
function GetDataByCondition(data, callback) {
    var listData = [];
    if (data != null && data != undefined) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].SumInTime != null) {
                listData.push(data[i].SumInTime.toFixed(3));
            } else {
                listData.push(data[i].SumInTime);
            }

        }
    }
    callback(listData);
}
function optionchartLine(params, TypeChart, data, callback) {
    var rel = {};
    var pointradius = 4;
    var borderWidth = GetLineChart();
    var pointHoverBorderWidth = 1;
    var radius = 2;
    var str = data;
    var colorborder = "#0BD6D6";
    rel = {
        labels: RenderLabel(params, params.Data, null),
        datasets: [
            {
                labelCustom: RenderLabel(params, params.Data, true),
                fill: false,// scope.IsFill,// không vẻ vung dưới đường line
                lineTension: 0.2,
                radius: radius,
                borderWidth: borderWidth,
                backgroundColor: "rgba(75,192,192,0.1)",
                borderColor: colorborder,
                pointBorderColor: colorborder,
                pointBackgroundColor: "black",
                pointBorderWidth: 1,
                pointHoverRadius: pointradius,
                pointHoverBackgroundColor: "rgba(255, 255, 1, 1)",
                pointHoverBorderColor: colorborder,
                pointHoverBorderWidth: pointHoverBorderWidth,
                data: data,
            },
        ]
    };
    callback(rel);
}
function GetDataByConditionMonthYear(data, typeData, callback) {
    var listData = [];
    var dataMin = [];
    var dataMax = []
    if (typeData == "S") {
        if (data != null && data != undefined) {
            for (var i = 0; i < data.length; i++) {
                dataMin.push(data[i].MinSalinity);
                dataMax.push(data[i].MaxSalinity);
            }
        }

    }
    else if (typeData == "T") {
        if (data != null && data != undefined) {

            for (var i = 0; i < data.length; i++) {
                dataMin.push(data[i].MinTemperature);
                dataMax.push(data[i].MaxTemperature);
            }
        }
    }
    else if (typeData == "P") {
        if (data != null && data != undefined) {
            for (var i = 0; i < data.length; i++) {
                dataMin.push(data[i].MinPH);
                dataMax.push(data[i].MaxPH);
            }
        }
    }
    listData.push(dataMin);
    listData.push(dataMax);
    callback(listData);
}
function ConfigAndRunChart(scope, params) {

    if (scope.TypeDate == "D")
        scope.Main.TitleDate = Language.DATE + " " + ConvertDateToString(params.DateFrom, false, "ddMMyyyy");
    else if (scope.TypeDate == "M")
        scope.Main.TitleDate = Language.MONTH + " " + ConvertDateToString(params.DateFrom, false, "MMyyyy");
    else if (scope.TypeDate == "Y")
        scope.Main.TitleDate = Language.YEAR + " " + ConvertDateToString(params.DateFrom, false, "yyyy");
    SetDigest(scope);
    ShowChart(params, scope, function (rel) {
    });
}
function GenderChart(data, params, scope) {

    if (params.ChartType == "detail") {
        if (myLineChartDetail != undefined) {
            myLineChartDetail.destroy();
        }
    }
    var labeltooltip = "";
    var maxvalue = undefined;
    var minvalue = undefined;
    var stepsize = undefined;
    var colorzero = undefined;
    var widthzero = undefined;
    var borderDashOffset = undefined;
    var borderDash = undefined;
    var step = CheckStep();
    var fontSizeLabel = GetFontSizeLabelChart();
    var plugin = {
        afterRender: function (chart, options) {
            HideLoading();
        }
    };
    labeltooltip = Language.WATER_INDEX + " ";
    if (scope.SWData == null || scope.SWData.data == null || scope.SWData.data.length == 0) {
        if (scope.TypeDate == "Y") {
            minvalue = 0;
            maxvalue = 80;
            stepsize = 10;
        }
        else {
            minvalue = 0;
            maxvalue = 8;
            stepsize = 1;
        }
    }
    else {
        minvalue = arrayMin(data.datasets[0].data);
        maxvalue = arrayMax(data.datasets[0].data);
        var val = maxvalue - minvalue;
        if (val < 0.1)
            maxvalue = maxvalue + 0.1;
        else maxvalue = maxvalue + .05;
        if (scope.TypeDate == "Y") {
            maxvalue += 2;
            minvalue -= 1;
        }
        minvalue = 0;
        if (scope.TypeDate == "Y") {
            stepsize = Math.round(((maxvalue - minvalue) / step) * 1000) / 1000;
        }
        else
            stepsize = Math.round(((maxvalue - minvalue) / step) * 1000) / 1000;
    }
    Chart.defaults.global.defaultFontSize = fontSizeLabel;
    if (myLineChart != undefined) {
        myLineChart.destroy();
    }
    // if (myLineChart != undefined && myLineChart.ctx!=null) 
    // {
    //     myLineChart.data = data;
    //     myLineChart.options.scales.yAxes[0].ticks.suggestedMax = maxvalue;
    //     myLineChart.options.scales.yAxes[0].ticks.suggestedMin = minvalue;
    //     myLineChart.options.scales.yAxes[0].ticks.stepSize = stepsize;
    //     myLineChart.options.scales.yAxes[0].ticks.min = minvalue;
    //     myLineChart.config.type = scope.TypeChart;
    //     myLineChart.update();
    // }
    // else {
    var ctx = document.getElementById(scope.NameChart).getContext('2d');
    myLineChart = new Chart(ctx, {
        type: scope.TypeChart,
        plugins: [plugin],
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    ticks:
                        {
                            fontColor: "white",
                            TitleLabel: scope.TitleChart,
                            maxRotation: 0,
                            autoSkip: false,
                        },
                    gridLines: {
                        color: "rgba(0, 0, 0, 0)",
                        drawBorder: false, // Thuộc tính vẽ đường kẻ bottom cho chart.
                    }
                }],
                yAxes: [{
                    gridLines:
                        {
                            color: "rgba(0, 0, 0, .3)",
                            zeroLineColor: colorzero,// 'red',
                            zeroLineWidth: widthzero,// 0.5,
                            offsetGridLines: true,
                            borderDashOffsetCustom: borderDashOffset,
                            borderDashCustom: borderDash,
                            drawBorder: false,
                            padding: 10,
                        },
                    ticks:
                        {
                            ValueLineDraw: data.ValueLineDraw, // set giá trị sẽ vẽ line cố định trên biểu đồ.
                            ColorValueLineDraw: data.ColorValueLineDraw, // Màu line sẽ vẽ 
                            fontColor: "white",
                            callback: function (label, index, labels) {
                                if (scope.TypeData == "T") {
                                    if (label != undefined && label.toFixed != undefined)
                                        return label.toFixed(1);
                                }
                                else if (scope.TypeData == "S") {
                                    if (label != undefined && label.toFixed != undefined)
                                        return label.toFixed(3);
                                }
                                else if (scope.TypeData == "P") {
                                    if (label != undefined && label.toFixed != undefined)
                                        return label.toFixed(2);
                                }
                                else if (scope.TypeData == "N") {
                                    if (label != undefined && label.toFixed != undefined)
                                        return label.toFixed(1);
                                }
                                else if (scope.TypeData == "L") {
                                    if (label != undefined && label.toFixed != undefined)
                                        return ConvertPhanCach(label, phancach);
                                }
                                else return label;
                            },
                            suggestedMax: maxvalue,
                            suggestedMin: minvalue,
                            beginAtZero: true,
                            min: minvalue,
                            stepSize: stepsize,
                        },
                }]
            }
            ,
            tooltips:
                {
                    mode: "x",
                    intersect: false,
                    mode: "x",
                    enabled: true,
                    callbacks: {
                        title: function (tooltipItems, data) {
                            var value = data.datasets[0].labelCustom[tooltipItems[0].index].toString();
                            var label = params.Language.TIME;
                            if (params.TypeDate == "M")
                                label = params.Language.DATE;
                            else if (params.TypeDate == "Y")
                                label = params.Language.MONTH;
                            return label + ": " + value;
                        },
                        label: function (tooltipItem, data) {
                            var datasetLabel = data.datasets[tooltipItem.datasetIndex].label || labeltooltip;
                            if (tooltipItem.datasetIndex == 0 && params.TypeDate != "D")
                                datasetLabel = datasetLabel;
                            var label = tooltipItem.yLabel;
                            if (scope.TypeData == "S")
                                label = parseFloat(label).toFixed(3);
                            else if (scope.TypeData == "T")
                                label = parseFloat(label).toFixed(1);
                            else if (scope.TypeData == "P")
                                label = parseFloat(label).toFixed(2);
                            return datasetLabel + ': ' + label;
                        }
                    }
                },
            legend: {
                display: false,
                labels: {
                    fontColor: 'rgb(255, 99, 132)',
                }
            },
            title: {
                display: false,
                text: 'Custom Chart Title'
            }
        }
    });
    // }
}
function RenderLabel(params, data, isfull) {
    if (data != null && data.length > 0) {
        for (var i = data.length; i <= 24; i++) {
            data.push({
                HourSend: i,
                TimeSend: i
            })
        }
    }
    var hour = [];
    var old = 1;
    var dayofmonth = new Date(params.DateFrom.getFullYear(), params.DateFrom.getMonth() + 1, 0).getDate();
    if (params.TypeDate == "D") {
        if (data.length == 0) {
            // hàm lấy label nước của ngày
            for (var j = 0; j <= 25; j += 1) {
                if (listDateChart.indexOf(j) != -1) {
                    hour.push(FormatToZeroFirst(j));
                    if (j < 24) // không add cột cuối cùng trục x
                    {
                        hour.push("");
                        hour.push("");
                        hour.push("");
                    }
                }
                else hour.push("");
            }
        }
        else {
            for (var i = 0; i <= data.length - 1; i += 1) {
                if (isfull) {
                    if (data.length > i)
                        hour.push(data[i].TimeSend);
                }
                else {

                    if (!empty(data[i].HourSend.toString()) && listDateChart.indexOf(parseInt(data[i].HourSend)) != -1) {
                        hour.push(FormatToZeroFirst(data[i].HourSend));
                    }
                    else hour.push("");
                }
            }
        }
        return hour;
    } // kết thúc ngày
    else if (params.TypeDate == "M") {
        var dayold = 0;
        for (var i = 0; i < dayofmonth; i++) {
            if ((dayold == 0 || isfull)) {

                hour.push(FormatToZeroFirst(i + 1));

                dayold++;
            }
            else {

                if (dayold == 2)
                    dayold = 0;
                else dayold++;
                hour.push('');
            }

        }
        if (dayofmonth == 30 || dayofmonth == 29) {
            hour.push(dayofmonth);
        }
        return hour;
    } // kết thúc tháng
    else if (params.TypeDate == "Y") {
        for (var i = 0; i < 12; i++) {
            hour.push(FormatToZeroFirst(i + 1));
        }
        return hour;
    } // kết thúc nam
    //  }

}
app.controller("tablepricectrl", function ($scope) {
    $scope.Language = Language;
    $scope.Data = [];
    GetListTablePrice(function (result) {
        if (result != null && result.data.length > 0) {
            $scope.Data = result.data;
            SetDigest($scope);
        } else {
            $scope.Data = null;
            SetDigest($scope);
        }
    });

    $scope.ConvertNumber = function (price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    $scope.View = function ($event) {
        $($event.currentTarget).toggleClass("active").next().slideToggle(200);
    }
    $scope.Back = function () {
        PopPage();
    }
});

app.controller("aboutctrl", function ($scope) {
    $scope.Language = Language;
    $scope.InstalledVersion = "1.0";
    $scope.CurrentVersion = "1.0";
    if (typeof cordova != "undefined") {
        cordova.getAppVersion.getVersionNumber().then(function (version) {
            $scope.InstalledVersion = version;
            $scope.CurrentVersion = version;
            SetDigest($scope);
        });
    }

    $scope.Back = function () {
        PopPage();
    }
    SetDigest($scope);
})
function GetListTablePrice(callback) {
    $.ajax({
        url: ip + "/api/GetListPriceForMobile?token=" + Profile.Token,
        type: "GET",
        dataType: "JSON",
        data: { IDObjectOup: SWMPInfo.IDObjectOup },
        timeout: 45000,
        // contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
        }
    });
}
// Chart end
// setting 
function storevaluesali(e) {
    e.value = e.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    $("#hiddensali").prop("value", e.value);
}
function storevaluesdate(e) {
    e.value = e.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    $("#hiddendate").prop("value", e.value);
}
function SaveConfigSetting(settings, callback) {
    $.ajax({
        url: ip + "/api/SettingNotificationByCusCode?token=" + Profile.Token, type: "POST", dataType: "JSON", data: { CustomerCodeReg: SWMPInfo.CustomerCodeReg, ListSetting: JSON.stringify(settings) },
        timeout: 45000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data.success);
        }
        , error: function (xhr) {
            callback(null);
            HideLoading();
        }
    });
}
// setting end

// ConfigChartNuoc end
// Extend
function ConvertTime(value, char) {
    if (value != null) {
        if (char == null)
            char = '.';
        var str = value.toString().split(char);
        var rel = "";
        if (str[0].toString().length < 2)
            rel = "0" + str[0].toString();
        else rel = str[0].toString();
        if (str.length > 1) {
            if (str[1].toString().length < 2)
                rel += ":" + "0" + str[1].toString();
            else rel += ":" + str[1].toString();
        }
        else rel += ":00";
        return rel;
    }
    else return value;
}
function ConvertDateToString(date, isFirstDate, format) {
    var dates = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    if (format == "ddMMyyyy") {
        dates = FormatToZeroFirst(date.getDate()) + "/" + FormatToZeroFirst((date.getMonth() + 1)) + "/" + date.getFullYear();
    }
    else if (format == "MMyyyy") {
        dates = FormatToZeroFirst((date.getMonth() + 1)) + "/" + date.getFullYear();
    }
    else if (format == "yyyy") {
        dates = date.getFullYear();
    }
    else if (format == "ddMMyy") {
        dates = FormatToZeroFirst(date.getDate()) + "/" + FormatToZeroFirst((date.getMonth() + 1)) + "/" + (date.getYear() - 100);
    }
    else if (format == "yyyyMMdd") {
        dates = date.getFullYear() + "/" + FormatToZeroFirst(date.getMonth() + 1) + "/" + FormatToZeroFirst(date.getDate());
    }
    else if (format == "HHmmss") {
        dates = FormatToZeroFirst(date.getUTCHours()) + ":" + FormatToZeroFirst(date.getMinutes()) + ":" + FormatToZeroFirst(date.getSeconds());
    }
    else if (format == "ddMM") {
        dates = FormatToZeroFirst(date.getDate()) + "/" + FormatToZeroFirst(date.getMonth() + 1);
    }
    if (isFirstDate) {
        if (format == "ddMMyyyy") {
            dates = "01/" + FormatToZeroFirst((date.getMonth() + 1)) + "/" + date.getFullYear();
        }
        else
            dates = date.getFullYear() + "/" + (date.getMonth() + 1) + "/01";
    }

    return dates;
}
function FormatToZeroFirst(value) {
    if (value != null) {
        if (value == 0) {
            return "0";
        }
        else if (value.toString().length < 2) {
            return "0" + value;
        }
        else return value.toString();
    }
    else return value;
}
function AddClass(id, nameclass) {
    if (id != undefined && id != null && id != "") {
        $("#" + id).removeClass(nameclass);
        $("#" + id).addClass(nameclass);
    }
}
function RemoveClass(id, nameclass) {
    if (id != undefined && id != null && id != "")
        $("#" + id).removeClass(nameclass);
}
function RefreshToken() {

}
// Extend End

function ReloadToken() {
    setInterval(function () {
        $.ajax({
            url: ip + "/api/refreshToken?token=" + Profile.Token, type: "POST", dataType: "JSON", data: { ucode: Profile.UserName, deviceuuid: device.uuid },
            timeout: 45000,
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                if (data.data != undefined && data.data != null)
                    Profile.Token = data.data;
                else if (data.success == false)
                    ResetToLogin();
            }
            , error: function (xhr) {
                HideLoading();
                ResetToLogin();
            }
        });
    }, 120000);
}

// SWMP
function GetPriceSWMP(objoup, callback) {
    var url = ipToken + "/api/GetTempPriceForMobile?token=" + Profile.Token;
    var param = {
        IDObjectOup: objoup
    }
    $.ajax({
        url: url, type: "GET", dataType: "JSON", data: param,
        timeout: 45000,
        success: function (data) {
            callback(data.data);
        }
        , error: function (xhr) {
            // alert(JSON.stringify(xhr));
        }
    });
}
function LoadBillingWater(InYear, callback) {
    $.ajax({
        url: ip + "/api/GetMCByUserCode?token=" + Profile.Token,
        type: "GET", dataType: "JSON", data: { CustomerCodeReg: SWMPInfo.CustomerCodeReg, InYear: InYear },
        timeout: 35000,
        success: function (data) {
            if (data != null && data != undefined) {
                if (data.success == true) {
                    for (var i = 0; i < data.Data.length; i++) {
                        data.Data[i].BillWithoutTaxShow = ConvertPhanCach(data.Data[i].BillWithoutTax);
                        data.Data[i].BillAfterTaxShow = ConvertPhanCach(data.Data[i].BillAfterTax);
                        data.Data[i].OldIndexMcoShow = ConvertPhanCach(data.Data[i].OldIndexMco);
                        data.Data[i].NewIndexMcoShow = ConvertPhanCach(data.Data[i].NewIndexMco);
                        data.Data[i].TotalIndexShow = ConvertPhanCach(data.Data[i].TotalIndex);
                        data.Data[i].VATTaxShow = ConvertPhanCach(parseInt(data.Data[i].BillWithoutTax * 5 / 100));
                        data.Data[i].TTDBTaxShow = ConvertPhanCach(parseInt(data.Data[i].BillWithoutTax * 10 / 100));
                    }
                    callback(data.Data);
                }
            }

        }, error: function (xhr, textStatus, thrownError) {
            callback(null);
        }
    });
}
// main end

function CheckServer(status) {//Edit 10/10/2017
    if (status == "Not Found") {
        HideLoading();
        if (ip == ipbackup) {
            ip = ipToken;
        } else ip = ipbackup;
        localStorage.setItem(AppCode + 'ip', ip);
        // if (Language == undefined) {
        //     Language = {};
        //     Language.CANNOT_CONNECT_TO_SERVER = "Không thể kết nối đến server, vui lòng thử lại!";
        //     Language.ERROR = "Thông báo lỗi";
        //     Language.CLOSE = "Đóng";
        // }
        // ons.notification.alert({
        //     message: Language.CANNOT_CONNECT_TO_SERVER,
        //     title: Language.ERROR,
        //     buttonLabel: Language.CLOSE,
        //     animation: 'default',
        //     callback: null
        // });
    }
    else {
        $.ajax({
            url: ip, type: "GET", dataType: "JSON",
            timeout: 7000,
            success: function (data) {
            }
            , error: function (xhr) {
                if (xhr.statusText == "OK") {

                }
                else {
                    HideLoading();
                    if (ip == ipbackup) {
                        ip = ipToken;
                    }
                    else ip = ipbackup;
                    localStorage.setItem(AppCode + 'ip', ip);
                    // if (Language == undefined) {
                    //     Language = {};
                    //     Language.CANNOT_CONNECT_TO_SERVER = "Không thể kết nối đến server, vui lòng thử lại!";
                    //     Language.ERROR = "Thông báo lỗi";
                    //     Language.CLOSE = "Đóng";
                    // }
                    // ons.notification.alert({
                    //     message: Language.CANNOT_CONNECT_TO_SERVER,
                    //     title: Language.ERROR,
                    //     buttonLabel: Language.CLOSE,
                    //     animation: 'default',
                    //     callback: null
                    // });
                }
            }
        });
    }
}
function GetCountNewsNotica(callback) {
    var count;
    window.sqlitePlugin.openDatabase({ name: 'swm.db', location: 'default', androidDatabaseImplementation: 2 }, function (db) {
        db.transaction(function (tx) {
            tx.executeSql('SELECT count(*) AS mycount FROM FLAGREAD', [], function (tx, rs) {
                if (rs != null && rs.rows.length > 0) {
                    count = rs.rows.item(0).mycount;
                }
            })
        }, function (error) {
            db.close();
            callback(null);
        }, function () {
            db.close(function (sub) {
            }, function (err) {
                console.log("Close db GetCountNewsNotica error:==" + JSON.stringify(err));
            });
            callback(count);
        });
    });
}
function formatTime(date) {
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
        h = hh - 12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    m = m < 10 ? "0" + m : m;
    /* if you want 2 digit hours: */
    h = h < 10 ? "0" + h : h;
    return h + ":" + m + " " + dd;
}
function ShowAlert(content, title, callback) {
    ons.notification.alert({
        messageHTML: content, title: title, buttonLabels: [Language.CLOSE], callback: function () {
            if (callback != null)
                callback(true);
        }
    });
}
function ShowAlertConfirm(content, title, callback) {
    ons.notification.confirm({
        messageHTML: content, title: title, buttonLabels: [Language.CANCEL, Language.OK], callback: function (idx) {
            if (callback != null)
                callback(idx);
        }
    });
}
function ShowAlertHelp(content, title, callback) {
    ons.notification.confirm({
        messageHTML: content, title: title, buttonLabels: [Language.CLOSE, Language.HELP_SHORT], callback: function (index) {
            if (callback != null)
                callback(index);
        }
    });
}
function UploadAvatar(data, callback) {
    $.ajax({
        url: "http://image.rynanmobile.com/upload/ImageBase64",
        type: "POST",
        dataType: 'JSON',
        async: false,
        data: data,
        timeout: 45000,
        success: function (result) {
            result.data.uploadPath;
            callback(result.data.uploadPath);
        },
        error: function (xhr, textStatus, thrownError) {

        }
    });
}
function getDataUri(url, callback) {
    var fileToLoad = url;

    var fileReader = new FileReader();

    fileReader.onload = function (fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64

        var newImage = document.createElement('img');
        newImage.src = srcData;

        callback(newImage.outerHTML);
    }
    fileReader.readAsDataURL(fileToLoad);
}

function LogOut() { //Edit
    var DeviceInfoLogOut = {
        DeviceID: DeviceInfo.DeviceID,
        DeviceIP: DeviceInfo.DeviceIP,
        DeviceName: DeviceInfo.DeviceName,
        AppProject: DeviceInfo.AppProject
    }
    $.ajax({
        url: ip + "/api/Logout_Logoff?token=" + Profile.Token,
        type: "POST",
        dataType: 'JSON',
        data: {
            Username: Profile.UserName,
            DeviceInfo: JSON.stringify(DeviceInfoLogOut),
        },
        timeout: 45000,
        success: function (result) {
            // console.log(JSON.stringify(result));
        },
        error: function (xhr, textStatus, thrownError) {
            // console.log(JSON.stringify(xhr));
        }
    });
}


function CheckPageExist(page) {
    var pageStack = document.querySelector('#navigator').pages;
    for (var i = 0; i < pageStack.length; i++) {
        if (pageStack[i].data != undefined && page == pageStack[i].data.page) {
            return true;
        }
    }

    if (i == pageStack.length) {
        return false;
    }
}

function ValidatePhoneNumber(phonenumber) {
    var re = /^[0-9]{8,11}$/;
    return re.test(phonenumber);
}
function ValidateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function CheckConnection() { //edit 05/10/2017
    if (typeof Connection !== "undefined") {
        var networkState = navigator.connection.type;
        StatesNW[Connection.UNKNOWN] = 'Unknown connection';
        StatesNW[Connection.ETHERNET] = 'Ethernet connection';
        StatesNW[Connection.WIFI] = 'WiFi connection';
        StatesNW[Connection.CELL_2G] = 'Cell 2G connection';
        StatesNW[Connection.CELL_3G] = 'Cell 3G connection';
        StatesNW[Connection.CELL_4G] = 'Cell 4G connection';
        StatesNW[Connection.CELL] = 'Cell generic connection';
        StatesNW[Connection.NONE] = 'No network connection';
        if (StatesNW[networkState] == "No network connection") {
            NetworkStatus = 0;
            if (IsNetWorkErrorShow == 0) {//Nếu thông báo chưa bật - tránh bật nhiều thông báo cùng lúc.
                IsNetWorkErrorShow = 1; // Đã bật thông báo.
                ons.notification.alert({
                    messageHTML: "<div style='text-align:center'><img style='width:80px' src='img/wifi.png' /></div><div>" + Language.NO_NETWORK_CONNECTION_PLEASE_TRY_AGAIN + "</div>",
                    title: "",
                    buttonLabels: [Language.CLOSE],
                    callback: function () {
                        IsNetWorkErrorShow = 0;//Đã tắt thông báo.
                    }
                });
            }
        } else {
            NetworkStatus = 1;
        }
    }

}


function ShowMovie() {
    PushToPage("media/html/mainmovie.html");
}

function CheckStep() {
    if (window.innerHeight >= 680) {
        return 8;
    }
    if (window.innerHeight > 720) {
        return 10;
    }
    else return 6;
}
function GetInfoCustomer(cuscode, callback) {
    $.ajax({
        url: ip + "/api/GetInfoByCusCodeLogin_Mobile", 
        type: "GET", 
        dataType: "JSON", 
        data: { 
            CusCode: cuscode, 
            token: Profile.token
    },
        timeout: 25000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            alert(xhr.message);
            callback(null);
        }
    });
}

function SetLockValveByCustomer(SerialNumberReg,LockValve,CustomerInfo,callback){
    $.ajax({
        url: ip + "/api/SetLockValveByCustomer_Mobile?token=" + Profile.token, 
        type: "POST", 
        dataType: "JSON", 
        data: { 
            SerialNumberReg: SerialNumberReg, 
            LockValve:LockValve,
            CustomerInfo:CustomerInfo,
    },
        timeout: 25000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function ShowWater() {
    ResetToPage("html/main.html", {animation: "fade"});
}
  function ShowWaterPressure() {
      if(SWMPInfo.ListPressureDevice.length > 0){
        PushToPage("html/water_pressure.html");
      }else{
        ons.notification.alert({
            message: Language.NO_WATER_PRESSURE,
            title: Language.ALERT,
            buttonLabels: [Language.CLOSE],
        });
      }
  
  }
  
  function ListPrice() {
  PushToPage("html/tableprice.html", {animation: "fade"});
  slidemenu.right.close();
  }
  
  function Setting  () {
  PushToPage("html/setting.html", {animation: "fade"});
  slidemenu.right.close();
  }

  function SetLockValveWater($scope) {
    if($scope.LockValve == "O"){
        ons.notification.confirm({
            title: Language.CONFIRM, 
            message: Language.DO_YOU_WANT_TO_LOCK_THE_VALVE, 
            buttonLabels: [Language.CANCEL, Language.OK], 
            callback: function (answer) {
                if (answer == 1){
                    $scope.LockValveTemp = "C";
                    SetLockValveByCustomer(SWMPInfo.SerialNumberReg,$scope.LockValveTemp,SWMPInfo._id, function(result){
                        if(result != null){
                            if(result.success == true){
                                $scope.SimMode = result.SimMode;
                                SetDigest($scope);
                                if($scope.SimMode =="O"){
                                    document.getElementById("contentNotice").innerHTML = Language.MSS_SENDING_COMMAND_LOCK_VALVE;
                                    ModalNotice.show();
                                    $scope.TimeOutSetting = setTimeout(function(){
                                        ModalNotice.hide();
                                        ons.notification.alert({
                                            message: Language.MSS_NOT_RECEIVED_RESPONSE_FROM_WATCH,
                                            title: Language.ALERT,
                                            buttonLabels: [Language.CLOSE],
                                        });
                                    },180000);
                                }else if($scope.SimMode =="F"){
                                    ons.notification.alert({
                                        message: Language.MSS_SEND_COMMAND_LOCK_VALVE + Math.ceil(result.WaitMinute) + Language.MINUTES_REMIAN,
                                        title: Language.ALERT,
                                        buttonLabels: [Language.CLOSE],
                                    }); 
                                }
                            }else{
                                ons.notification.alert({
                                    message: Language.MSS_SEND_COMMAND_LOCK_VALVE_FAIL,
                                    title: Language.ALERT,
                                    buttonLabels: [Language.CLOSE],
                                }); 
                            }
                        }else{
                            ons.notification.alert({
                                message: Language.MSS_SEND_COMMAND_LOCK_VALVE_FAIL,
                                title: Language.ALERT,
                                buttonLabels: [Language.CLOSE],
                            }); 
                        }
                    })
                }  
            }
        });
    }else if($scope.LockValve == "C"){
        ons.notification.confirm({
            title: Language.CONFIRM, message: Language.DO_YOU_WANT_OPEN_VALVE, 
            buttonLabels: [Language.CANCEL, Language.OK], 
            callback: function (answer) {
                if (answer == 1){
                    $scope.LockValveTemp = "O";
                    SetLockValveByCustomer(SWMPInfo.SerialNumberReg,$scope.LockValveTemp,SWMPInfo._id, function(result){
                        if(result != null){
                            if(result.success == true){
                                $scope.SimMode = result.SimMode;
                                SetDigest($scope);
                                if($scope.SimMode =="O"){
                                    document.getElementById("contentNotice").innerHTML = Language.MSS_SENDING_COMMAND_OPEN_VALVE;
                                    ModalNotice.show();
                                    $scope.TimeOutSetting = setTimeout(function(){
                                        ModalNotice.hide();
                                        ons.notification.alert({
                                            message: Language.MSS_NOT_RECEIVED_RESPONSE_FROM_WATCH,
                                            title: Language.ALERT,
                                            buttonLabels: [Language.CLOSE],
                                        });
                                    },180000);
                                }else if($scope.SimMode =="F"){
                                    ons.notification.alert({
                                        message: Language.MSS_SEND_COMMAND_OPEN_VALVE + Math.ceil(result.WaitMinute) + Language.MINUTES_REMIAN,
                                        title: Language.ALERT,
                                        buttonLabels: [Language.CLOSE],
                                    }); 
                                }
                            }else{
                                ons.notification.alert({
                                    message: Language.MSS_SEND_COMMAND_VALVE_FAIL,
                                    title: Language.ALERT,
                                    buttonLabels: [Language.CLOSE],
                                }); 
                            }
                        }else{
                            ons.notification.alert({
                                message: Language.MSS_SEND_COMMAND_VALVE_FAI,
                                title: Language.ALERT,
                                buttonLabels: [Language.CLOSE],
                            }); 
                        }  
                    })
                }  
            }
        });
    }else if($scope.LockValve == "PO"){
        ons.notification.alert({
            message: Language.PROCESSING_OPEN_VALVE,
            title: Language.ALERT,
            buttonLabels: [Language.CLOSE],
        });
    }else if($scope.LockValve == "PC"){
        ons.notification.alert({
            message: Language.PROCESSING_CLOSE_VALVE,
            title: Language.ALERT,
            buttonLabels: [Language.CLOSE],
        });
    }else{
        //Không có van
        ons.notification.alert({
            message: Language.PLEASE_ATTACH_CONTROL_VALVE,
            title: Language.ALERT,
            buttonLabels: [Language.CLOSE],
        });
    }
}

function GetNewIndexSWM(SerialNumber, callback) {
    $.ajax({
        url: ip + "/api/GetNewIndex?token=" + Profile.token,
        type: "GET",
        dataType: "JSON",
        data: { SerialNumber: SerialNumber},
        timeout: 40000,
        success: function (data) {
            callback(data);
        }
        , error: function (xhr) {
            callback(null);
        }
    });
}