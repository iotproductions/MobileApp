app.controller("whosalectrl", function ($scope, $rootScope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.Back = function () {
        PopPage();
    }
    $scope.ListPrice = [];
    var listprice = GetParamsPage();
    if (listprice == null || listprice == undefined) {
        listprice = [{
            Price: null, LimitCount: null
        }];
    }
    $scope.ListPrice = listprice;
    $scope.AddRangePrice = function () {
        $scope.ListPrice.push({
            Price: null, LimitCount: null
        });
    }
    $scope.RemovePrice = function (index) {
        $scope.ListPrice.splice(index, 1);
        SetDigest($scope);
    }
    $scope.Save = function () {
        PopPage();
        $rootScope.$broadcast("addlistprice", $scope.ListPrice);
    }
    SetDigest($scope);
});