app.controller("sizectrl", function ($scope, $rootScope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.Back = function () {
        PopPage();
    }
    $scope.Data = {
        W: null,
        H: null,
        L: null
    }
    var l = GetParamsPage();
    if (l == null || l == undefined) {
        l = {
            W: null,
            H: null,
            L: null
        };
        $scope.Data = l;
    }
    else {
        if (Array.isArray(l)) {
            if (l[0].Value.length > 0) {
                var rl = l[0].Value[0].split(" x ");
                if (rl.length > 0) {
                    $scope.Data = {
                        W: rl[0].replace(" ", ""),
                        L: rl[1].replace(" ", ""),
                        H: rl[2].replace(" ", ""),
                    }
                }
            }
        }
    }
    $scope.Save = function () {
        CheckValid($scope.Data, function (rel) 
        {
            if (rel) {
                $rootScope.$broadcast("addsize", $scope.Data);
                PopPage();
            }
        });
    }
    function CheckValid(Data, callback) {
        if (IsEmptyString(Data.W)) 
        {
            ShowToastEcommerce(LanguageEcom.PLEASE_ENTER_WEIGHT, null, 2000, "toast-add-cart", function () {
                callback(false);
            })
        }
        else if(isNaN(Data.W))
        {
            ShowToastEcommerce(LanguageEcom.PLEASE_ENTER_WEIGHT_NUMBER, null, 2000, "toast-add-cart", function () {
                callback(false);
            })
        }
        else if (IsEmptyString(Data.L)) {
            ShowToastEcommerce(LanguageEcom.PLEASE_ENTER_LENGTH, null, 2000, "toast-add-cart", function () {
                callback(false);
            })
        }
        else if (isNaN(Data.L)) {
            ShowToastEcommerce(LanguageEcom.PLEASE_ENTER_LENGTH_NUMBER, null, 2000, "toast-add-cart", function () {
                callback(false);
            })
        }
        else if (IsEmptyString(Data.H)) {
            ShowToastEcommerce(LanguageEcom.PLEASE_ENTER_HEIGHT, null, 2000, "toast-add-cart", function () {
                callback(false);
            })
        }
        else if (isNaN(Data.H)) {
            ShowToastEcommerce(LanguageEcom.PLEASE_ENTER_HEIGHT_NUMBER, null, 2000, "toast-add-cart", function () {
                callback(false);
            })
        }
        else callback(true);
    }
    SetDigest($scope);
});