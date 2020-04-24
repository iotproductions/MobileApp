app.controller('detailmoviectrl', function ($scope) {
    var pr = GetParamsPage();

    GetDetailMovie(pr._id, function (result) {
        $scope.Data = result;
        if ($scope.Data != null) {
            var listchap = [];
            $scope.Data.LinkDetail.filter(function (element, index) {
                var inx = index + 1;
                if (inx > 9) {
                    listchap.push(index);
                }
                else listchap.push("0" + inx);
            }, this);
            $scope.Data.Chap = listchap;
            $scope.ActiveID = "#movie_01";
            if($scope.Data.LinkDetail!=null)
            document.getElementById('moviecontrol').src = $scope.Data.LinkDetail[0];
            setTimeout(function () {
                $("#movie_01").addClass("activechap");
            }, 300);
        }
        SetDigest($scope);
    });
    $scope.ShowMovie = function (url, index) {
        document.getElementById('moviecontrol').src = url;
        $("#movie_" + $scope.Data.Chap[index]).addClass("activechap");
        $($scope.ActiveID).removeClass("activechap");
        $scope.ActiveID = "#movie_" + $scope.Data.Chap[index];
        SetDigest($scope);
    }
    SetDigest($scope);
});
function GetDetailMovie(id, callback) {
    $.ajax({
        url: ipMovie + "/Media/GetInfoMediaById",
        type: "GET", dataType: "JSON", data: { _id: id },
        timeout: 60000,
        contentType: 'application/x-www-form-urlencoded',
        success: function (data) {
            callback(data.data);
        }, error: function (xhr) {
            alert(JSON.stringify(xhr.message));
            callback(null);
        }
    });
}

// $(document).ready(function () {
//     var ownVideos = $("moviecontrol");
//     console.log("moviecontrol");

//     $.each(ownVideos, function (i, video) {                
//         var frameContent = $(video).contents().find('body').html();
//         if (frameContent) {
//             $(video).contents().find('body').html(frameContent.replace("autoplay", ""));
//         }
//     });
// });