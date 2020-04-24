app.controller("uploadproductctrl", function ($scope, $rootScope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.Back = function () {
        PopPage();
    }
    var procode =null;
    try {
        procode= GetParamsPage().procode;
    } catch (error) {
        
    }
    

    $scope.Config = {
        ImageSample: "canvas-upimg",
        TargetWidth: "300",
        TargetHeight: "300",
        FolderParent: "",
        FolderChild: RAPInfo.CustomerCode

    };
    $scope.ListPicture = [];
    $scope.Data = {
        ProName: "",
        ProTitle: "",
        ProDescription: "",
        CatCode: null,
        CatName: null,
        AppCode: AppCode,
        ProducerCode: "",
        ProPrice: null,
        ProSalePrice: null,
        ProDiscount: null,
        ProUnit: "",
        LinkAvatar: "",
        ListImage: [],//{Index: Number, ProCode: "", Size: "", LinkImage: ""}
        CreateBy: RAPInfo.CustomerCode,
        ProProperties: [],
        Tags: "",
        ListPrice: [], //[{Price: 0, LimitCount: 0}],
        _IdSellerChanel: RAPInfo.SellerChannel[0]._id,
        Quantity: null,
    };
    if (!IsEmptyString(procode)) {
        GetDetailProductByCode(procode, function (rel) {
            if (rel.success) {
                $scope.Data = rel.data;
                $scope.IsEdit = true;
            }
        });
    }
    // Set giá trị category khi thêm sản phẩm
    $scope.$on("SetCateToUploadPro", function (event, cate) {
        cate = JSON.parse(cate);
        $scope.Data.CatName = cate.CatName;
        $scope.Data.CatCode = cate.CatCode;
        $scope.Config.FolderParent = "RAP/" + cate.CatCode;
        SetDigest($scope);
    });
    $scope.$on("addsize", function (event, size) {
        $scope.Data.ProProperties = [
            {
                "SIZE": size.W + " x " + size.L + " x " + size.H
            }
        ];
        $scope.PackageSize = ConvertPropertyToArray($scope.Data.ProProperties);
        SetDigest($scope);
    });
    $scope.$on("addlistprice", function (event, list) {
        $scope.Data.ListPrice = list;
        if (list != null && list.length > 0) {
            var l = list[list.length - 1];
            $scope.Data.PriceLast = LanguageEcom.SL + " " + l.LimitCount + " ; " + l.Price + LanguageEcom.CURRENCY;
        }
        SetDigest($scope);
    });
    // Set kích thước sản phẩm
    $scope.SetSize = function () {
        PushToPage("ecommerce/size.html", $scope.PackageSize);
    }
    // Check length product name
    $scope.CheckLengthProName = function () {
        $scope.CharacterName = $scope.Data.ProName.length;
        SetDigest($scope);
    }
    $scope.AddWhoSale = function () {
        PushToPage("ecommerce/whosale.html", $scope.Data.ListPrice);
    }
    $scope.SelectCate = function () {
        PushToPage("ecommerce/category.html", { AddPro: true, Category: "" });
    }
    // Save sản phẩm
    $scope.Save = function () {
        var count = 1;
        $scope.ListPicture.forEach(function (element) {
            UploadAvatar(element, function (rel) {
                $scope.Data.ListImage.push({ Index: count, ProCode: $scope.Data.ProCode, Size: "400x300", LinkImage: "/" + rel });
                count++;
                SetDigest($scope);
            });
        }, this);

        if ($scope.ListPicture.length > 0) {
            $scope.Data.LinkAvatar = $scope.Data.ListImage[0].LinkImage;
        }
        SetDigest($scope);
        CheckValidSave($scope.Data, function (rel) {
            if (rel) {
                var url = ipEcommerce + "/Product/CreateProductCus";
                var procode=undefined;
                if ($scope.IsEdit) {
                    url = ipEcommerce + "/Product/UpdateProductCus";
                    procode=$scope.Data.ProCode;
                }
                $.ajax({
                    url: url, type: "POST", dataType: "JSON", data: {ProCode:procode, Data: JSON.stringify($scope.Data) },
                    timeout: 4500,
                    success: function (data) {
                        if (data.success == true) {
                            PopPage();
                        }
                        else {
                            ShowAlert(LanguageEcom[data.errcode], LanguageEcom.INFO, function () { });
                            callback(false);
                        }
                    }
                    , error: function (xhr) {
                        CheckServer(xhr.statusText);
                        callback(false);
                    }
                });
            }
        });
    }
    function CheckValidSave(data, callback) {
        if (data.LinkAvatar == null || data.LinkAvatar == "") {
            ShowAlert(LanguageEcom.ADD_PICTURE_UP, LanguageEcom.INFO, function () {
                callback(false);
            });
        }
        else if (IsEmptyString(data.ProName)) {
            ShowToastEcommerce("Tên sản phẩm không được rỗng", null, 2000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
            callback(false);
        }
        else if (IsEmptyString(data.ProDescription)) {
            ShowToastEcommerce("Mô tả sản phẩm không được rỗng", null, 2000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
            callback(false);
        }
        else if (IsEmptyString(data.CatCode)) {
            ShowToastEcommerce("Danh mục loại sản phẩm không được rỗng", null, 2000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
            callback(false);
        }
        else if (IsEmptyString(data.Quantity)) {
            ShowToastEcommerce("Số lượng không được rỗng", null, 2000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
            callback(false);
        }
        else if (IsEmptyString(data.ProPrice)) {
            ShowToastEcommerce("Giá sản phẩm không được rỗng", null, 2000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
            callback(false);
        }
        else if (isNaN(data.ProPrice)) {
            ShowToastEcommerce(LanguageEcom.PRICE_PRO_NUMBER, null, 2000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
            callback(false);
        }
        else callback(true);
    }
    // Upload hình ảnh sản phẩm
    $scope.ShowUploadImg = function () {
        var options = {
            title: Language.CHOOSE_IMAGE_2,
            buttonLabels: [Language.CAPTURE_IMAGE, Language.CHOOSE_IMAGE],
            addCancelButtonWithLabel: Language.CANCEL,
            androidEnableCancelButton: true,
            winphoneEnableCancelButton: true
        };
        window.plugins.actionsheet.show(options, function (index) {
            if (index == 1) { // Sử dụng camera
                navigator.camera.getPicture(onPhotoDataSuccessAvatar, onFail, {
                    quality: 80,
                    targetWidth: $scope.Config.TargetWidth,
                    targetHeight: $scope.Config.TargetHeight,
                    allowEdit: false,
                    destinationType: Camera.DestinationType.DATA_URL,
                    saveToPhotoAlbum: false,
                    encodingType: Camera.EncodingType.PNG,
                    mediaType: Camera.MediaType.PICTURE,
                });
            }
            else if (index == 2) { // sử dụng thư viện ảnh
                navigator.camera.getPicture(onPhotoURISuccessAvatar, onFail, {
                    quality: 80,
                    targetWidth: $scope.Config.TargetWidth,
                    targetHeight: $scope.Config.TargetHeight,
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
            username: Profile.MKInfo.CustomerCode,
            base64img: imgData,
            parentFol: $scope.Config.FolderParent,
            childFol: $scope.Config.FolderChild,
            Size: '300',
        }
        $scope.ListPicture.push(dataUpload);
        SetDigest($scope);
        // UploadAvatar(dataUpload, function (rel) {
        //     $scope.Data.ListImage.push("/" + rel);
        //     SetDigest($scope);
        // });
    }
    function onFail(ev) {
        alert(JSON.stringify(ev));
    }
    function onPhotoURISuccessAvatar(imgData) {
        plugins.crop.promise(imgData, {})
            .then(function success(newPath) {
                var can = document.getElementById($scope.Config.ImageSample);
                var ctx = can.getContext("2d");

                var img = new Image();
                img.onload = function () {
                    can.width = img.width;
                    can.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    var encodedBase = can.toDataURL();
                    encodedBase = encodedBase.split(',')[1];
                    var dataUpload = {
                        username: Profile.MKInfo.CustomerCode,
                        base64img: encodedBase,
                        parentFol: $scope.Config.FolderParent,
                        childFol: $scope.Config.FolderChild,
                        newPath: newPath,
                        Size: '300',
                    }
                    // alert(dataUpload.childFol + "---" + dataUpload.parentFol + "----" + dataUpload.username);
                    $scope.ListPicture.push(dataUpload);
                    SetDigest($scope);
                    var objimg = document.getElementsByClassName("image-upload")[0];
                    objimg.scrollLeft = objimg.scrollWidth - objimg.clientWidth;
                    // UploadAvatar(dataUpload, function (rel) {
                    //     if ($scope.Config.Index == 1)
                    //         $scope.Data.Avatar = "/" + rel;
                    //     else $scope.Data.CoverAvatar = "/" + rel;
                    //     SetDigest($scope);
                    // });
                };
                // document.getElementById($scope.Config.ImageSet).src = newPath;
                img.src = newPath;
            })
            .catch(function fail(err) {

            });
    }
    SetDigest($scope);
});
function GetDetailProductByCode(procode, callback) {
    $.ajax({
        url: ipEcommerce + "/Product/GetProductCusByProCode", type: "GET", dataType: "JSON", data: { ProCode: procode },
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