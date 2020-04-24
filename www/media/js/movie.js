// cam.html
app.controller('moviectrl', function ($scope) {
    $scope.Language = Language;
    $scope.ipImageMovie = ipImageMovie;
    $scope.ListCateMovie = [];
    GetMedia();
    function GetMedia() {
        $.ajax({
            url: ipMovie + "/Media/GetAll",
            type: "GET", dataType: "JSON", data: { Page: 1, PageLimit: 50 },
            timeout: 60000,
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                $scope.Data = data.data;
                //console.log(data);
                SetDigest($scope);
            }, error: function (xhr) {

            }
        });
    }
    $scope.DetailMovie = function (item) {
        PushToPage(path_html_mv+"/detailmovie.html", item);
    }
    SetDigest($scope);
});
app.controller('menumoviectrl', function ($scope) {
    $scope.Language = Language;
    $scope.ipImageMovie = ipImageMovie;
    $scope.ListCateMovie = [];
    var menu = document.getElementById('menu');
    menu.zIndex = -111;
    LoadCatePhim(function(rel){
        $scope.ListCateMovie = rel;
    });
    $scope.ShowChildMenu = function () {
        $("#typemovie").toggle();
    }
    function LoadCatePhim(callback) {
        $.ajax({
            url: ipMovie + "/Media/GetListMediaType",
            type: "GET", dataType: "JSON", data: {},
            timeout: 60000,
            success: function (data) {
                callback(data.data);
            }, error: function (xhr) {
    
            }
        });
    }
    // Chuyển đến trang danh sách phim lọc bởi cate
    SetDigest($scope);
});
function OpenMenu() {
    var menu = document.getElementById('menu');
    // menu.style.zIndex = 1;
    menu.open();
}
function HideMenu() {
    // $("#slitter-movie").css({ "z-index": "-111" });
    var menu = document.getElementById('menu');
    menu.close();
}
function ShowMovieByCate(catetype) {
    if (catetype == -1)
        HideMenu();
    else if (catetype == -2) {
        HideMenu();
        PushToPage(path_html_mv+"/listmovie.html", { cate: null });
    }
    else if (catetype == -3) {
        HideMenu();
        PushToPage(path_html_mv+"/listmovie.html", { cate: null });
    }
    else {
        HideMenu();
        PushToPage(path_html_mv+"/listmovie.html", { cate: catetype.id });
    }
}
