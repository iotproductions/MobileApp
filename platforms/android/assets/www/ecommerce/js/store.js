app.controller("storectrl", function ($scope, $rootScope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.ConvertObject = ConvertObject;
    var CustomerCodeShop=GetParamsPage().CusCode;
    $scope.Data;
    $scope.DataPro;
    $scope.Back = function () {
        PopPage();
    }
    $scope.ShowCart = function () {
        PushToPage("ecommerce/cart.html");
    }
    $scope.Account = function () {
        PushToPage("ecommerce/account.html");
    }
    // Lấy chi tiết thông tin shop
    GetDetailSeller(CustomerCodeShop, function (rel) {
        if (rel.success) {
            $scope.Data = rel.data;
            GetProByIDSeller($scope.Data._id, 1, 10, function (result) {
                if (result.success)
                    $scope.DataPro = result.data;
            });
            SetDigest($scope);
        }
    });
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
    SetDigest($scope);
});
function GetDetailSeller(cuscode, callback) {
    $.ajax({
        url: ipEcommerce + "/SellerChannel/GetInfoChannel", type: "GET", dataType: "JSON", data: { CustomerCode: cuscode },
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
function GetProByIDSeller(id, page, limitpage, callback) {
    $.ajax({
        url: ipEcommerce + "/Product/GetProductByIDSellerChannel", type: "GET", dataType: "JSON", data: { IDSellerChanel: id, Page: page, PageLimit: limitpage },
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