app.controller("mainshopctrl", function ($scope, $rootScope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.ConvertObject = ConvertObject;
    SetDigest($scope);
    $scope.Back = function () {
        PopPage();
    }
    if ($rootScope.TimerInterval == null || $rootScope.TimerInterval == undefined) {
        $rootScope.Timer = {
            Hour: 1,
            Minute: 50,
            Second: 50
        }
    }
    else {
        clearInterval($rootScope.TimerInterval);
    }
    $rootScope.TimerInterval = setInterval(function () {
        $rootScope.Timer.Second--;
        if ($rootScope.Timer.Second <= 0) {
            $rootScope.Timer.Minute = -1;
            $rootScope.Timer.Second = 59;
        }
        if ($rootScope.Timer.Minute <= 0) {
            $rootScope.Timer.Hour = 0;
            $rootScope.Timer.Minute = 59;
            $rootScope.Timer.Second = 59;
        }
        if ($rootScope.Timer.Hour == 0 && $rootScope.Timer.Minute == 0 && $rootScope.Timer.Second == 0) {
            $rootScope.Timer = {
                Hour: 1,
                Minute: 50,
                Second: 50
            }
        }
        SetDigest($rootScope);
    }, 1000);
    $scope.ShowHome = function () {
        ResetToEcommerce(null);
    }
    $scope.ShowInfo = function () {
        PushToPage("html/listnotica.html");
    }
    $scope.Analysis = function () {
        PushToPage("ecommerce/analysis.html");
    }
    $scope.ShowAccount = function () {
        PushToPage("ecommerce/account.html");
    }
    $scope.RegisterShop = function (id) {
        if (RAPInfo.IsSeller == true) {
            PushToPage("ecommerce/uploadproduct.html");
        }
        else
            PushToPage("ecommerce/regisshop.html");
    }
    $scope.QuickBuy = function (item) {
        AddToCart(item._id, item.ProCode, item.ProName, 1, item.PriceDetail, item.Weight, item.Unit, item.LinkAvatar, $rootScope, function () {
            $rootScope.$broadcast("RefreshCartItem");
            ShowToastEcommerce(LanguageEcom.ADD_TO_CART_SUCCESS, null, 1000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
        });
    }
    $scope.ShowDetailproduct = function (product) {
        PushToPage("ecommerce/product-detail.html", { Product: { ProCode: product.ProCode, Weight: product.Weight, Unit: product.Unit } });
    }
    if (RAPInfo == undefined || RAPInfo == null) {
        GetRapInfo(function (rel) {
            if (rel) {
                if (RAPInfo.SellerChannel != null && RAPInfo.SellerChannel.length > 0) {
                    if (RAPInfo.SellerChannel[0].Status == 1) {
                        RAPInfo.IsSeller = true;
                        $("#actionseller2").removeClass("ion-plus-round");
                        $("#actionseller2").addClass("ion-android-camera");
                    }
                }
            }
        });
    }
    else {
        if (RAPInfo.SellerChannel != null && RAPInfo.SellerChannel.length > 0) {
            if (RAPInfo.SellerChannel[0].Status == 1) {
                RAPInfo.IsSeller = true;
                $("#actionseller2").removeClass("ion-plus-round");
                $("#actionseller2").addClass("ion-android-camera");
            }
        }
    }
    GetListFavoriteBrand(1, 4, null, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ListBrandFavorite = result.data;
                SetDigest($scope);
            }
        }
    });
    GetProductSale(1, 5, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ListMostSell = result.data;
                SetDigest($scope);
            }
        }
    });
    GetProducts(1, 8, 20, null, null, null, null, function (result) { //5 sx mới nhất
        if (result != null) {
            if (result.success == true) {
                $scope.ListProByShop = result.data;
                SetDigest($scope);
                console.log($scope.ListProByShop);
            }
        }
    });
    // Link đến thông tin cửa hàng
    $scope.ShowStore = function (id,username) {
        PushToPage("ecommerce/store.html", { CusCode: id,UserName:username });
    }
    $scope.ShowCart = function () {
        PushToPage("ecommerce/cart.html");
    }
    $scope.Account = function () {
        PushToPage("ecommerce/account.html");
    }
    SetDigest($scope);
});
function GetListFavoriteBrand(page, pagelimit, sort, callback) {
    $.ajax({
        url: ipEcommerce + "/SellerChannel/GetAll", type: "GET", dataType: "JSON", data: { Page: page, PageLimit: pagelimit, Sort: sort },
        timeout: 4500,
        success: function (data) {
            if (data.success == true) {
                callback(data);
            }
            else callback(null);
        }
        , error: function (xhr) {
            CheckServer(xhr.statusText);
            callback(null);
        }
    });
}