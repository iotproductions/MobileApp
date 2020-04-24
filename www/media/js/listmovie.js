// cam.html
app.controller('listmoviectrl', function ($scope) {
    $scope.Language = Language;
    $scope.ipImageMovie = ipImageMovie;
    $scope.ListCateMovie = [];
    var id = GetParamsPage().cate;
    LoadCatePhim(function (rel) {
        if (rel != null) {
            rel.filter(function (n, i) {
                if (n.MediaType == id) {
                    $scope.DescCate=n.Description;
                }
            });
        }
    });
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
    GetListMedia(id);
    function GetListMedia(id) {
        $.ajax({
            url: ipMovie + "/Media/GetAll",
            type: "GET", dataType: "JSON", data: { Page: 1, PageLimit: 50, MediaType: id },
            timeout: 60000,
            contentType: 'application/x-www-form-urlencoded',
            success: function (data) {
                $scope.Data = data.data;
                SetDigest($scope);
            }, error: function (xhr) {

            }
        });
    }

    $scope.DetailMovie = function (item) {
        PushToPage("media/html/detailmovie.html", item);
    }
    SetDigest($scope);
});
