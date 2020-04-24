// Menu
app.controller("MenuMainCtrl", function ($scope, $timeout) {//edit 12/10/2017
    
        $scope.$on("OpenMenu", function (event, args) {
            $scope.User = Profile;
            $scope.Language = Language;
            $scope.ipImage = ipImage;
            $scope.Badges = 0;
            SetDigest($scope);
        })
    
        $timeout(function(){
            $scope.User = Profile;
            $scope.Language = Language;
            $scope.ipImage = ipImage;
            $scope.Badges = 0;
            SetDigest($scope);
        },2000);
    
        $scope.HideMenu = function(){
            slidemenu.right.close();
        }
        $scope.ShowFeedback = function () {
            PushToPage("html/feedback.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.ListPrice = function () {
            PushToPage("html/tableprice.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.Home = function () {
            ResetToPage("html/main.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.Chat = function () {
            //Updating();
            PushToPage("chat/chatlog.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.Setting = function () {
            PushToPage("html/setting.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.ConfigChart = function () {
            PushToPage("html/configchart.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.Back = function () {
            PopPage();
        }
        $scope.ChangeLanguage = function () {
            PushToPage("html/changelanguage.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.Profile = function () {
            PushToPage("html/profile.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.ShowNotica = function () {
            PushToPage("html/listnotica.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.About = function () {
            PushToPage("html/about.html", {animation: "fade"});
            slidemenu.right.close();
        }
        $scope.LogOut = function () {
            ons.notification.confirm({
                title: Language.CONFIRM, message: Language.MSS_CONFIRM_LOGOUT, buttonLabels: [Language.CANCEL, Language.LOG_OUT], callback: function (answer) {
                    if (answer == 1){
                        ShowLoading();
                        // LogOut();
                        slidemenu.right.close();
                        setTimeout(function () {
                            HideLoading();
                            ResetToLogin();
                        }, 1500)
                    }  
                }
            });
        }
    });
