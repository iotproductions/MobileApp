app.controller('profilectrl', function ($scope, $rootScope) {
    $scope.Language = Language;
    $scope.ipImage = ipImage;
    $scope.User = {};
    $scope.UserShow = {};
    $scope.UserShow.FullName = $scope.User.FullName = Profile.FullName;
    $scope.UserShow.Avatar = $scope.User.Avatar = Profile.Avatar;
    $scope.UserShow.PhoneNumber = $scope.User.PhoneNumber = Profile.PhoneNumber;
    $scope.UserShow.Email = $scope.User.Email = Profile.Email;
    $scope.UserShow.CustomerCode = $scope.User.CustomerCode = Profile.UserName;
    SetDigest($scope);

    $scope.Back = function () {
        PopPage();
    }
    $scope.SaveProfile = function () {//Edit 05/10/2017 Update Profile
        ShowLoading();
        var url = ip + "/api/Update_Mobile?token=" + Profile.Token;
        var params = {
            FullName: $scope.User.FullName,
            // Address: $scope.User.Address,
            PhoneNumber: $scope.User.PhoneNumber,
            Email: $scope.User.Email,
            UserName: $scope.User.CustomerCode
        }
        if(params.FullName =="" || params.PhoneNumber =="" || params.Email ==""){
            HideLoading();
            ons.notification.alert({
                title: Language.INFO, message: Language.REQUIRED_FILEDS, buttonLabels: [Language.CLOSE], 
            });
        }else if(params.FullName.length < 6){// Full name tối thiểu 6 ký tự
            HideLoading();
            ons.notification.alert({
                title: Language.INFO, message: Language.NAME_MUST_AT_LEAST_6_CHARACTERS, buttonLabels: [Language.CLOSE], 
            });
        }else if(ValidatePhoneNumber(params.PhoneNumber) == false){// Phone ko hợp lệ
            HideLoading();
            ons.notification.alert({
                title: Language.INFO, message: Language.PHONE_NUMBER_NOT_VALID, buttonLabels: [Language.CLOSE], 
            });
        }else if(ValidateEmail(params.Email)== false){//Email ko hợp lệ
            HideLoading();
            ons.notification.alert({
                title: Language.INFO, message: Language.EMAIL_NOT_VALID, buttonLabels: [Language.CLOSE]
            });
        }else{// Thông tin hợp lệ -> save
            GetDataAjax(url, "POST", JSON.stringify(params), function (result) {
                HideLoading();
                if (result != null && result.success) {
                    $scope.UserShow.FullName = Profile.FullName = $scope.User.FullName;
                    $scope.UserShow.PhoneNumber = Profile.PhoneNumber = $scope.User.PhoneNumber;
                    $scope.UserShow.Email = Profile.Email = $scope.User.Email;
                    SetDigest($scope);
                    $rootScope.$broadcast("RefeshProfile");
                    ShowNoticaAlert(Language.UPDATE_PROFILE_SUCCESS, 1500);
                }
                else {
                    HideLoading();
                  
                }
            });
        }
    }
   
    // jQuery(".wrap-update-profile input").focus(function(){
    //     jQuery(".save-profile-btn").fadeIn();
    // }).focusout(function(){
    //     jQuery(".save-profile-btn").fadeOut();
    // });

    $scope.Edit = function($event){//Click button edit = > focus vào input
        $($event.currentTarget).prev().focus();
    }
    $scope.ChangeAvatar = function () {// Đổi avatar
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
            parentFol: 'Avatar',
            childFol: 'Customer',
            size: '300',
        }
        $("#loadingimg").show();
        UploadAvatar(dataUpload, function (rel) {
            var url = ip + "/api/Update_Mobile?token=" + Profile.Token;
            var params = {
                UserName: Profile.UserName, Avatar: "/" + rel
            }
            GetDataAjax(url, "POST", JSON.stringify(params), function (result) {
                HideLoading();
                if (result != null && result.success) {
                    Profile.Avatar = "/" + rel;
                    document.getElementById("avatarcus").src = ipImage + "/" + rel;
                    $("#loadingimg").fadeOut(100);
                }
                else {
                    $("#loadingimg").fadeOut(100);
                    ons.notification.alert({
                        message: GetErrorContent(result.errcode), title: Language.INFO, buttonLabels: [Language.CLOSE], callback: null
                    });
                }
            });
        });
    }
    function onFail(ev) {
        // alert(JSON.stringify(ev));

    }
    function onPhotoURISuccessAvatar(imgData) {
        plugins.crop.promise(imgData, {})
            .then(function success(newPath) {
                var can = document.getElementById("imgCanvas");
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
                        parentFol: 'Avatar',
                        childFol: 'Customer',
                        size: '300',
                    }
                    $("#loadingimg").show();
                    UploadAvatar(dataUpload, function (rel) {
                        var url = ip + "/api/Update_Mobile?token=" + Profile.Token;
                        var params = {
                            UserName: Profile.UserName, Avatar: "/" + rel
                        }
                        GetDataAjax(url, "POST", JSON.stringify(params), function (result) {
                            HideLoading();
                            if (result != null && result.success) {
                                Profile.Avatar = "/" + rel;
                                document.getElementById("avatarcus").src = ipImage + "/" + rel;
                                $("#loadingimg").fadeOut(100);
                            }
                            else {
                                $("#loadingimg").fadeOut(100);
                                ons.notification.alert({
                                    message: GetErrorContent(result.errcode), 
                                    title: Language.INFO, 
                                    buttonLabels: [Language.CLOSE], 
                                    callback: null
                                });
                            }
                        });
                    });
                };
                img.src = newPath;
            })
            .catch(function fail(err) {

            });
    }
});