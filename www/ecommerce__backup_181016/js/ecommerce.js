// var ipEcommerce = "http://115.78.182.248:6030";
var ipEcommerce = "http://rynandemo.com:9095";
// var ipEcommerce = "http://apidemo.diamond.local:6030";
var ipImageEcommerce = "http://image.rynanmobile.com";
// var ipImageEcommerce = "http://192.168.54.30";
var charSeparator = ".";
var KeyNumberCartItem = AppCode + "NumberCartItem";
var KeyCartItems = AppCode + "CartItems";
var RAPInfo;
var LanguageEcom;
// Load Javascript
$("head").append('<script type="text/javascript" src="ecommerce/js/uploadproduct.js"></script>');
$("head").append('<script type="text/javascript" src="ecommerce/js/whosale.js"></script>');
$("head").append('<script type="text/javascript" src="ecommerce/js/size.js"></script>');
$("head").append('<script type="text/javascript" src="ecommerce/js/mainshop.js"></script>');
$("head").append('<script type="text/javascript" src="ecommerce/js/store.js"></script>');
var styleMap = [
    {
        featureType: 'poi.business',
        stylers: [{ visibility: 'off' }]
    },
    {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{ visibility: 'off' }]
    },
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#d59563' }]
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }],//[{color: '#d59563'}]
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{ color: '#263c3f' }]
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#6b9a76' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#38414e' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#212a37' }]
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#9ca5b3' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#746855' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{ color: '#1f2835' }]
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#f3d19c' }]
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{ color: '#2f3948' }]
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{ visibility: 'off' }],// [{color: '#d59563'}]
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#17263c' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#515c6d' }]
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#17263c' }]
    }
];
var ConvertObject = {
    ConvertDateToHour: function (dateto) {
        // alert("sss");
        //     var datetime =new Date ("2017/03/10 17:30");
        // var d1 = new Date("2017/03/10 19:00");
        var sa = (new Date().getTime() - new Date(dateto).getTime());
        var s = Math.round(sa / 1000 / 60 / 60 / 24);
        // if (s <= 23) {
        if (s <= 0) {
            s = Math.floor(sa / 1000 / 60 / 60 / 24);
            sa -= s * 1000 * 60 * 60 * 24; // giảm offset đi 
            var hours = Math.floor(sa / 1000 / 60 / 60);
            if (hours > 0) {
                return hours + " giờ trước";
            }
            else {
                sa -= hours * 1000 * 60 * 60; // giảm offset đi 
                var minutes = Math.floor(sa / 1000 / 60);
                if (minutes == 0) {
                    sa -= minutes * 1000 * 60;
                    var seconds = Math.floor(sa / 1000);
                    return seconds + " giây trước";
                }
                else
                    return minutes + " phút trước";
            }
        }
        else {
            if (s < 7) {
                return s.toString().replace('-', '') + " ngày trước";
            }
            else {
                s = Math.round(s / 7);
                if (s < 4) {
                    return s.toString().replace('-', '') + " tuần trước";
                }
                else {
                    s = Math.round(s / 4);
                    if (s < 12) {
                        return s.toString().replace('-', '') + " tháng trước";
                    }
                    else {
                        s = Math.round(s / 12);
                        return s.toString().replace('-', '') + " năm trước";
                    }
                }
            }
            // return s.toString().replace('-', '') + " giờ trước";
        }
        // }
        // else {
        //     s = Math.round(s / 24);
        //     if (s < 7) {
        //         return s.toString().replace('-', '') + " ngày trước";
        //     }
        //     else {
        //         s = Math.round(s / 7);
        //         if (s < 4) {
        //             return s.toString().replace('-', '') + " tuần trước";
        //         }
        //         else {
        //             s = Math.round(s / 4);
        //             if (s < 12) {
        //                 return s.toString().replace('-', '') + " tháng trước";
        //             }
        //             else {
        //                 s = Math.round(s / 12);
        //                 return s.toString().replace('-', '') + " năm trước";
        //             }
        //         }
        //     }
        // }
    },
    CheckImageExists: function (image_url) {// Kiểm tra ảnh có tồn tại hay bị xoá

        var http = new XMLHttpRequest();
        http.open('HEAD', ipEcommerce + image_url, false);
        http.send();
        return http.status != 404; // true - tồn tại

    },
    CheckImage: function (image_url) { // Kiểm tra ảnh null hoặc không tồn tại và trả về link mặc định
        if (image_url == null || typeof image_url == "undefined") {
            return "ecommerce/img/default_avatar.png";

            // } else if (ConvertObject.CheckImageExists(image_url) == false) {
            //     return "ecommerce/img/default_avatar.png";
        } else {
            return ipImageEcommerce + image_url;
        }
    },
    ConvertNumberFormat: function (value, isNum) { //Định dạng phần ngàn 
        if (value != undefined && value != null) {
            if (isNum == true)
                value = decimalAdjust("round", value, -3);

            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, charSeparator);
        } else {
            return 0;
        }
    },

    ConvertShowStarRating: function (rate) { // Hiển thị đánh giá
        var output = ' <i class="ion-android-star" ></i>' +
            '<i class="ion-android-star" ></i>' +
            '<i class="ion-android-star" ></i>' +
            '<i class="ion-android-star" ></i>' +
            '<i class="ion-android-star" ></i>';

        if (rate <= 0.5) {
            output = '<i class="ion-android-star-half" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>';
        }

        if (0.5 < rate && rate <= 1) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>';
        }
        if (1 < rate && rate <= 1.5) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star-half" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>';
        }

        if (1.5 < rate && rate <= 2) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>';
        }
        if (2 < rate && rate <= 2.5) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star-half" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>';
        }
        if (2.5 < rate && rate <= 3) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star-outline" ></i>' +
                '<i class="ion-android-star-outline" ></i>';
        }
        if (3 < rate && rate <= 3.5) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star-half" ></i>' +
                '<i class="ion-android-star-outline" ></i>';
        }

        if (3.5 < rate && rate <= 4) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star-outline" ></i>';
        }

        if (4 < rate && rate <= 4.5) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star-half" ></i>';
        }

        if (4.5 < rate && rate <= 5) {
            output = '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>' +
                '<i class="ion-android-star" ></i>';
        }
        return output;
    }
}
app.directive('loader', function () {
    return {
        restrict: 'A',
        replace: true,
        template: '<div class="overlay-page-loader"><div class="middle"><div class="cp-skeleton cp-spinner"></div></div></div>',
    };
});

app.directive('ecommercemainslider', function () { // Slider quảng cáo chính ecommerce
    return {
        restrict: 'A',
        replace: true,
        template: '<ons-carousel-item ng-repeat="item in Ads">' + '<img style="width:100%;height:100%"  ng-src="{{ipImageEcommerce}}{{item.CommerLinkImage[0]}}" /></ons-carousel-item>'
        + '<div class="dot-carousel" ng-if="Data.CommerLinkImage.length>1"><div><div class="dotitem" id="{{$index}}" ng-repeat="item in Data.CommerLinkImage"></div></div></div>'
    };
});

app.directive('ecommercecategoryslider', function () { // Slider danh mục sp ecommerce
    return {
        restrict: 'A',
        replace: true,
        template: '<div class="cateslideer-parent"><div class="cate-child"><div ng-click="ShowAllCategory()"><img ng-src="ecommerce/img/allcategory.png"/><div class="cate-name"> Tất cả</div></div><div ng-click="ShowCategory(item)" ng-repeat="item in ListCategory"><img ng-src="{{ipImageEcommerce}}{{item.IconImage}}"/><div class="cate-name" ng-bind="item.CatName"></div></div></div></div>'
    };
});
app.directive('ecommercesaleoffproductslider', function () {// Slider sp giảm giá nhiều nhất
    return {
        restrict: 'A',
        replace: true,
        template: '<div class="sellslideer-parent"><div class="sell-child">' +
        '<div ng-repeat="item in ListSafeOff" ng-click="ShowDetailproduct(item)">' +
        '<img ng-src="{{ipImageEcommerce}}{{item.LinkAvatar}}" />' +
        '<div class="product-name" ng-bind="item.ProName"></div>' +
        '<div class="product-price"><span ng-bind="ConvertObject.ConvertNumberFormat(item.PriceDetail)"></span>đ</div>' +
        '</div></div>' +
        '</div>',
    };
});

app.directive('mostsellproductslider', function () {// Slider sp bán chạy
    return {
        restrict: 'A',
        replace: true,
        template: '<div class="sellslideer-parent"><div class="sell-child">' +
        '<div ng-repeat="item in ListMostSell" ng-click="ShowDetailproduct(item)">' +
        '<div class="saleshop"><img src="ecommerce/img/Sale.png"><div ng-bind-template="{{item.ProDiscount}}%"></div></div>' +
        '<img ng-src="{{ipImageEcommerce}}{{item.LinkAvatar}}" onerror="this.src="\'ecommerce/img/icon-no-image.png\'"/>' +
        '<div class="product-name" ng-bind="item.ProName"></div>' +
        '<div class="product-price"><span ng-bind="ConvertObject.ConvertNumberFormat(item.PriceDetail)"></span>đ</div>' +
        '</div></div>' +
        '</div>',
        // link: function (scope, elm, attrs) {
        //     elm.ready(function () {
        //         setTimeout(function () {
        //             $('.most-sell-products-slider').owlCarousel({
        //                 loop: false,
        //                 margin: 10,
        //                 autoplay: false,
        //                 lazyLoad: true,
        //                 nav: false,
        //                 dots: false,
        //                 responsiveClass: true,
        //                 responsive: {
        //                     0: {
        //                         items: 3,
        //                     },
        //                 }
        //             })
        //         }, 350);
        //     });
        // }
    };
});

app.directive('ecommercegalleryproductimagesslider', function () {// Slider ảnh sp
    return {
        restrict: 'A',
        replace: true,
        template:
        '<div>' +
        '<div class="slide-default"><img src="ecommerce/img/slide-default.png" style="max-width:100%" /></div>' + // Default slide
        '<div class="owl-carousel owl-theme product-gallery-images-slider">' +
        '<div ng-repeat="item in Data.ListImage">' +
        '<img  class="owl-lazy" data-src="{{ipImageEcommerce}}{{item.LinkImage}}" />' +
        '</div>' +
        '</div>' +
        '</div>',
        link: function (scope, elm, attrs) {
            elm.ready(function () {
                setTimeout(function () {
                    $('.product-gallery-images-slider').owlCarousel({
                        loop: false,
                        autoplay: false,
                        lazyLoad: true,
                        nav: false,
                        dots: true,
                        responsiveClass: true,
                        responsive: {
                            0: {
                                items: 1,
                            },
                        },
                        onInitialized: function () {
                            $(".slide-default").remove();
                        }
                    })
                }, 100);
            });
        }
    };
});

app.directive('relateproductslider', function () {// Slider sp tương tự (cùng danh mục)
    return {
        restrict: 'A',
        replace: true,
        template: '<div class="sellslideer-parent"><div class="sell-child">' +
        '<div ng-repeat="item in RelateProducts" ng-click="ShowDetailproduct(item)">' +
        '<img ng-src="{{ipImageEcommerce}}{{item.LinkAvatar}}" />' +
        '<div class="product-name" ng-bind="item.ProName"></div>' +
        '<div class="product-price"><span ng-bind="ConvertObject.ConvertNumberFormat(item.PriceDetail)"></span>đ</div>' +
        '</div></div>' +
        '</div>',
        // link: function (scope, elm, attrs) {
        //     elm.ready(function () {
        //         setTimeout(function () {
        //             $('.relateproducts-slider').owlCarousel({
        //                 loop: false,
        //                 margin: 10,
        //                 autoplay: false,
        //                 lazyLoad: true,
        //                 nav: false,
        //                 dots: false,
        //                 responsiveClass: true,
        //                 responsive: {
        //                     0: {
        //                         items: 3,
        //                     },
        //                 }
        //             })
        //         }, 100);
        //     });
        // }
    };
});

app.directive('ratechart', function () {
    return {
        restrict: 'A',
        replace: true,
        template:
        ' <div class="ecommerce-chart-rate">' +
        '<div>' +
        '<div><span ng-bind="Data.Rate"></span><span>/5</span></div>' +
        '<div class="eommerce-star-rating detail-product-rate">' +
        '<span ng-bind-html="ConvertObject.ConvertShowStarRating(Data.Rate)"></span>' +
        '<div style="color:gray"><span ng-bind="Data.TotalRate"></span> đánh giá</div>' +
        '</div>' +
        '</div>' +
        '<div>' +
        '<div ng-repeat="item in Data.ListRateDetail.slice().reverse()" class="line-chart-rate">' +
        '<span class="line-chart-rate-count" ng-bind="item.TotalRate"></span>' +
        '<span class="line-chart-bg">' +
        '<span style="width:{{item.TotalRate/Data.TotalRate*100}}%"></span>' +
        '</span>' +
        '<span class="line-chart-rate-number">' +
        '<span ng-bind="item._id"></span> sao' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>',
    };
});

app.directive('notfound', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            text: '@',
            icon: "@",
        },
        template: "<div class='ecommerce-notfound middle'>" +
        "<div ng-if='icon != undefined' class='icon-notfound'><i class='{{icon}}'></i></div>" +
        "<div class='text-notfound' ng-bind='text'></div>" +
        "</div>",

    };
});
app.directive('elemReady', function ($parse) {
    return {
        restrict: 'A',
        link: function ($scope, elem, attrs) {
            elem.ready(function () {
                setTimeout(function () {
                    $scope.$apply(function () {
                        var TimeOut = attrs.elemReady;
                        if (TimeOut) {
                            HidePageOverlayLoader(TimeOut, elem);
                        } else {
                            HidePageOverlayLoader(0, elem);
                        }

                    })
                }, 1)
            })
        }
    }
})

app.controller("maintabbarctrl", function ($scope, $rootScope) {
    var lcode = localStorage.getItem(AppCode + KeyLocalEcom.ItemLanguage);
    LoadLanguageEcommerce(lcode, function (result) {
        LanguageEcom = result;
        $scope.LanguageEcom = result;
        SetDigest($scope);
    });
    if (RAPInfo == undefined || RAPInfo == null)
        GetRapInfo(function () {

        });
    if (localStorage.getItem(KeyCartItems) != undefined && localStorage.getItem(KeyCartItems) != null) {
        $rootScope.Cart.NumberCartItem = localStorage.getItem(KeyNumberCartItem);
        $rootScope.Cart.Items = JSON.parse(localStorage.getItem(KeyCartItems));
    }
    $scope.PreChange = function () {
        $scope.TabIndexPrevious = EcommerceTabbar.getActiveTabIndex();
        SetDigest($scope);
    }
    $scope.changetab = function () {

        if (EcommerceTabbar.getActiveTabIndex() == 2) {
            $rootScope.$broadcast("refreshorders");
        }
    }
    $scope.$on("RefreshCartItem", function () {
        SetDigest($rootScope);
    })
})
app.controller("mainecommercectrl", function ($scope, $rootScope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.ListCategory = [];
    $scope.ListSafeOff = [];
    $scope.ListMostSell = [];
    $scope.ListCombo = [];
    $scope.Ads = [];
    $scope.NewProducts = [];
    $scope.ConvertObject = ConvertObject;
    $scope.ipImageEcommerce = ipImageEcommerce;
    SetDigest($scope);
    SetDigest($rootScope);

    LoadIpImage(function (ip) {
        $scope.ipImageEcommerce = ipImageEcommerce = "http://" + ip;
        SetDigest($scope);
    });
    $scope.ShowCart = function () {
        PushToPage("ecommerce/cart.html");
    }
    GetCategories("", AppCode, function (result) {// Lấy danh mục cấp 1
        if (result.success == true) {
            $scope.ListCategory = result.Data;
            SetDigest($scope);
        }
    })
    GetProductSale(1, 8, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ListSafeOff = result.data;
                SetDigest($scope);
            }

        }
    });
    GetProducts(1, 8, 4, null, null, null, null, function (result) { //4 sx theo bán chạy
        if (result != null) {
            if (result.success == true) {
                $scope.ListMostSell = result.data;
                SetDigest($scope);
            }

        }

    });

    GetProducts(1, 8, 5, null, null, null, null, function (result) { //5 sx mới nhất
        if (result != null) {
            if (result.success == true) {
                $scope.NewProducts = result.data;
                SetDigest($scope);
            }

        }

    });
    GetAds(20, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.Ads = result.data;
                SetDigest($scope);
            }
        }
    });

    GetComboInDate(1, 10, function (result) {// Lấy ds combo trong ngày.  stt 1  - đang bán
        $scope.ListCombo = result.data;
        SetDigest($scope);
    })

    $scope.ShowListProduct = function (sort) {
        // -1: Combo
        // + 1: Gía cao - thấp
        // + 2: Giá thấp - cao
        // + 3: Giảm giá nhiều nhất
        // + 4: Bán chạy nhất
        // + 5: Mới nhất
        PushToPage("ecommerce/listproduct.html", { Sort: sort });
    }
    $scope.ShowCategory = function (cate) {
        ShowCategory(cate);
    }
    $scope.ShowAllCategory = function () {
        ShowCategory({ CatCode: "" });
    }
    $scope.Back = function () {
        PopPage();
    }
    $scope.ToogleSpeedDial = function ($event) {
        $($event.currentTarget).toggleClass("open");
    }

    $scope.ShowDetailproduct = function (product) {
        PushToPage("ecommerce/product-detail.html", { Product: { ProCode: product.ProCode, Weight: product.Weight, Unit: product.Unit } });
    }

    $scope.GotoRegister = function () {
        PushToPage("ecommerce/registerchannel.html");
    }
    $scope.QuickBuy = function (item) {
        AddToCart(item._id, item.ProCode, item.ProName, 1, item.PriceDetail, item.Weight, item.Unit, item.LinkAvatar, $rootScope, function () {
            $rootScope.$broadcast("RefreshCartItem");
            ShowToastEcommerce(LanguageEcom.ADD_TO_CART_SUCCESS, null, 1000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
        });
    }
});
app.controller('catemainctrl', function ($scope, $rootScope) {
    $scope.ipImageEcommerce = ipImageEcommerce;
    var lcode = localStorage.getItem(AppCode + KeyLocalEcom.ItemLanguage);
    LoadLanguageEcommerce(lcode, function (result) {
        LanguageEcom = result;
        $scope.LanguageEcom = result;
        SetDigest($scope);
    });
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
    var showPopover = function (target) {
        document
            .getElementById('popover-sell')
            .show(target);
    };

    var hidePopover = function () {
        document
            .getElementById('popover-sell')
            .hide();
    };
    $scope.IndexImgAds = 1;
    var listimgads = ["ecommerce/img/ad02.jpg", "ecommerce/img/ad01.png"]
    var intervalImage = setInterval(function () {
        var image = $("#imgads");
        image.fadeOut('slow', function () {
            $scope.IndexImgAds++;
            if ($scope.IndexImgAds >= listimgads.length)
                $scope.IndexImgAds = 0;
            image.attr('src', listimgads[$scope.IndexImgAds]);
            image.fadeIn('slow');
            SetDigest($scope);
        });
    }, 4500);

    $scope.ShowCart = function () {
        PushToPage("ecommerce/cart.html");
    }
    $scope.RegisterShop = function (id) {
        if (RAPInfo.IsSeller == true) {
            PushToPage("ecommerce/uploadproduct.html");
        }
        else
            PushToPage("ecommerce/regisshop.html",{IsEdit:false});
    }
    $scope.Account = function () {
        PushToPage("ecommerce/account.html");
    }
    if ($rootScope.Cart == null || $rootScope.Cart == undefined) {
        $rootScope.Cart = {
            NumberCartItem: 0,
            Items: [],
            CartTotal: 0,
        };
    }
    $scope.CateIndexActive = 0;
    $scope.CatData = [];
    $(document.getElementsByClassName("itemcatemain")[0]).addClass("active");
    if (RAPInfo == undefined || RAPInfo == null)
        GetRapInfo(function (rel) {
            if (rel) {
                if (RAPInfo.SellerChannel != null && RAPInfo.SellerChannel.length > 0) {
                    if (RAPInfo.SellerChannel[0].Status == 1) {
                        RAPInfo.IsSeller = true;
                        $("#actionseller").removeClass("ion-plus-round");
                        $("#actionseller").addClass("ion-android-camera");
                    }
                }
            }
        });
    $scope.ShowByIndex = function (index) {
        var name = document.getElementsByClassName("itemcatemain");
        if (name != null && name.length > 0) {
            $(name[$scope.CateIndexActive]).removeClass("active");
            $(name[index]).addClass("active");
            $scope.CateIndexActive = index;
        }
        if (index == 1) {
            PushToPage("ecommerce/mainshop.html");
        }
    }
    $scope.ShowByCate = function (code) {
        if (code.IsChild == false)
            PushToPage("ecommerce/listproduct.html", { Sort: 5, Category: code.CatCode });
        else
            PushToPage("ecommerce/category.html", { Category: code.CatCode });
    }
    GetCategories(null, AppCode, function (result) {

        var count = 1;
        var iscolor = 0;
        for (var i = 0; i <= result.Data.length - 1; i++) {
            if (i == 0) {
                result.Data[i].Color = iscolor + 1;
            }
            else {
                if (count == 2) {
                    result.Data[i].Color = iscolor;
                    if (iscolor == 0)
                        iscolor = 1;
                    else iscolor = 0;
                    count = 1;
                }
                else {
                    result.Data[i].Color = iscolor;
                    count++;
                }
            }
        }
        $scope.CatData = result.Data;
        SetDigest($scope);
    });
    $scope.Back = function () {
        clearInterval(intervalImage);
        ResetToPage("html/main.html");
    }
    SetDigest($scope);
});
app.controller("categoryctrl", function ($scope, $rootScope) {
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.ListCategory = [];
    $scope.LanguageEcom = LanguageEcom;
    $scope.Category = GetParamsPage().Category;
    $scope.AddPro = GetParamsPage().AddPro;
    if ($scope.AddPro) {
        $("#tabright-cate").hide();
    }
    if ($scope.Category == undefined)
        $scope.Category = {
            CatCode: ""
        };
    SetDigest($scope);
    GetCategories($scope.Category, AppCode, function (result) {
        if (result.success == true) {
            $scope.ListCategory = result.Data;
            SetDigest($scope);
        }
        else {
            $scope.ShowCategory({ CatCode: $scope.Category, IsChild: false });
        }
    });

    $scope.ShowCategory = function (cate) {
        if (cate.IsChild)
            ShowCateByParent(cate.CatCode, $scope.AddPro);
        else {
            if ($scope.AddPro) {
                var pages = document.querySelector('#navigator').children;
                if (pages != null) {
                    var status = true;
                    for (var i = pages.length - 1; i >= 0; i--) {
                        if (pages[i - 1].id == "category.html") {
                            document.querySelector('#navigator').removePage(i - 1);
                        }
                        else break;
                    }
                    $rootScope.$broadcast("SetCateToUploadPro", JSON.stringify(cate));
                    PopPage();
                }
            }
            else {
                PushToPage("ecommerce/listproduct.html", { Sort: 5, Category: cate.CatCode });
            }
        }
    }
    $scope.ShowCart = function () {
        PushToPage("ecommerce/cart.html");
    }
    $scope.Account = function () {
        PushToPage("ecommerce/account.html");
    }
    $scope.Back = function () {
        PopPage();
    }
}); // End categoryctrl

app.controller("productincategoryctrl", function ($scope) {
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.LanguageEcom = LanguageEcom;
    $scope.Category = GetParamsPage().Category;
    $scope.Products = [];
    $scope.ConvertObject = ConvertObject;
    SetDigest($scope);
    GetProductByCatCode($scope.Category.CatCode, false, 1, 100, 5, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.Products = result.data;
                SetDigest($scope);
            }
        }
    })
    $scope.ShowDetailproduct = function (product) {
        PushToPage("ecommerce/product-detail.html", { Product: { ProCode: product.ProCode, Weight: product.Weight, Unit: product.Unit } });
    }

    $scope.Back = function () {
        PopPage();
    }
});

app.controller("listproductctrl", function ($scope, $rootScope) {
    $scope.Sort = GetParamsPage().Sort;
    $scope.CateCode = GetParamsPage().Category;
    $scope.CountStory = 0;
    $scope.Tilte = LanguageEcom.PRODUCT_LIST;
    if ($scope.Sort == 5) {
        $scope.Tilte = LanguageEcom.NEW_PRODUCT;
    } else if ($scope.Sort == 4) {
        $scope.Tilte = LanguageEcom.PRODUCT_BEST_SELL;
    } else if ($scope.Sort == 3) {
        $scope.Tilte = LanguageEcom.PRODUCT_SALE;
    } else if ($scope.Sort == 2) {
        $scope.Tilte = LanguageEcom.PRICE_LOW_HIGH;
    } else if ($scope.Sort == 1) {
        $scope.Tilte = LanguageEcom.PRICE_HIGH_LOW;
    } else if ($scope.Sort == -1) {
        $scope.Tilte = LanguageEcom.COMBO_TODAY;
    }
    // document.getElementById("loadmorepro").style.display="none";
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.LanguageEcom = LanguageEcom;
    $scope.ListCategory = [];
    $scope.Products = [];
    $scope.ConvertObject = ConvertObject;
    $scope.FlagScroll = true;
    $scope.DataFilter = {
        Page: 1,
        Pagelimit: 20,
        MinPrice: null,
        MaxPrice: null,
        KeySearch: ""
    }

    $scope.ListSelectedCategory = [];
    $scope.Filter = function () {
        $scope.DataFilter.Page = 1;
        GetProducts($scope.DataFilter.Page, $scope.DataFilter.Pagelimit, $scope.Sort, $scope.ListSelectedCategory, $scope.DataFilter.MinPrice, $scope.DataFilter.MaxPrice, $scope.DataFilter.KeySearch, function (result) {
            FilterProductPanel.right.close();
            if (result != null) {
                if (result.success == true) {
                    $scope.CountStory = result.CountStory;
                    $scope.Products = result.data;
                    SetDigest($scope);
                }

            }

        });
    }
    SetDigest($scope);

    if ($scope.Sort != -1) {
        if ($scope.CateCode != null) {
            $scope.ListSelectedCategory.push($scope.CateCode);
            $scope.Filter();
        }
        else {
            GetProducts($scope.DataFilter.Page, $scope.DataFilter.Pagelimit, $scope.Sort, $scope.ListSelectedCategory, $scope.DataFilter.MinPrice, $scope.DataFilter.MaxPrice, $scope.DataFilter.KeySearch, function (result) {
                if (result != null) {
                    if (result.success == true) {
                        $scope.CountStory = result.CountStory;
                        $scope.Products = result.data;
                        SetDigest($scope);
                    }

                }

            });
        }
    } else {
        GetComboInDate($scope.Page, $scope.DataFilter.Pagelimit, function (result) {// Lấy ds combo trong ngày.  stt 1  - đang bán
            if (result != null) {
                if (result.success == true) {
                    $scope.CountStory = result.CountStory;
                    $scope.Products = result.data;
                    SetDigest($scope);
                }

            }
        })
    }

    GetCategories("", AppCode, function (result) {// Lấy danh mục cấp 1
        if (result.success == true) {
            $scope.ListCategory = result.Data;
            $scope.ListCategory.forEach(function (element) {
                if (element.CatCode == $scope.CateCode)
                    element.IsSelected = 1;
            }, this);
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

    $scope.ShowSortPanel = function ($event) {
        SortProductPopover.show($event);
    }
    $scope.SortBy = function (sort) {
        $scope.Sort = sort;
        if ($scope.Sort == 5) {
            $scope.Tilte = LanguageEcom.NEW_PRODUCT;
        } else if ($scope.Sort == 4) {
            $scope.Tilte = LanguageEcom.PRODUCT_BEST_SELL;
        } else if ($scope.Sort == 3) {
            $scope.Tilte = LanguageEcom.PRODUCT_SALE;
        } else if ($scope.Sort == 2) {
            $scope.Tilte = LanguageEcom.PRICE_LOW_HIGH;
        } else if ($scope.Sort == 1) {
            $scope.Tilte = LanguageEcom.PRICE_HIGH_LOW;
        } else if ($scope.Sort == -1) {
            $scope.Tilte = LanguageEcom.COMBO_TODAY;
        }
        $scope.DataFilter.Page = 1;
        SetDigest($scope);
        SortProductPopover.hide();
        ModalLoaderEcommerce.show();

        setTimeout(function () {
            if ($scope.Sort != -1) {
                GetProducts($scope.DataFilter.Page, $scope.DataFilter.Pagelimit, $scope.Sort, $scope.ListSelectedCategory, $scope.DataFilter.MinPrice, $scope.DataFilter.MaxPrice, $scope.DataFilter.KeySearch, function (result) {
                    ModalLoaderEcommerce.hide();
                    if (result != null) {
                        if (result.success == true) {
                            $scope.CountStory = result.CountStory;
                            $scope.Products = result.data;
                            SetDigest($scope);
                        }

                    }

                });
            } else {
                GetComboInDate($scope.Page, $scope.DataFilter.Pagelimit, function (result) {// Lấy ds combo trong ngày.  stt 1  - đang bán
                    ModalLoaderEcommerce.hide();
                    if (result != null) {
                        if (result.success == true) {
                            $scope.CountStory = result.CountStory;
                            $scope.Products = result.data;
                            SetDigest($scope);
                        }

                    }
                })
            }
        }, 500);
    }

    $scope.SelectCate = function (Category) {
        if ($scope.ListSelectedCategory.indexOf(Category.CatCode) == -1) {
            $scope.ListSelectedCategory.push(Category.CatCode);
            $scope.ListCategory[$scope.ListCategory.indexOf(Category)].IsSelected = 1;
        } else {
            $scope.ListSelectedCategory.splice($scope.ListSelectedCategory.indexOf(Category.CatCode), 1);
            $scope.ListCategory[$scope.ListCategory.indexOf(Category)].IsSelected = 0;
        }
        SetDigest($scope);
    }

    $scope.OpenFilterPanel = function () {
        FilterProductPanel.right.open();
    }

    $scope.Cancel = function () {
        FilterProductPanel.right.close();
    }
    $scope.LoadMoreActive = function (done) {
        $scope.FlagScroll = true;
        done();
    }
    $scope.LoadMoreProduct = function (done) {
        $scope.DataFilter.Page++;
        document.getElementById("loadmorepro").style.display = "block !important";
        document.getElementsByClassName("spinner-loadmore")[0].style.height = "40px";
        if ($scope.CountStory != 0 && $scope.CountStory > $scope.Products.length) {
            GetProducts($scope.DataFilter.Page, $scope.DataFilter.Pagelimit, $scope.Sort, $scope.ListSelectedCategory, $scope.DataFilter.MinPrice, $scope.DataFilter.MaxPrice, $scope.DataFilter.KeySearch, function (result) {
                document.getElementById("loadmorepro").style.display = "none !important";
                if (result != null) {
                    if (result.success == true) {
                        $scope.CountStory = result.CountStory;
                        if (result.data.length > 0) {
                            $scope.Products = $scope.Products.concat(result.data);
                            SetDigest($scope);
                        }
                        else {
                            $scope.DataFilter.Page--;
                            document.getElementById("loadmorepro").style.display = "none !important";
                            document.getElementsByClassName("spinner-loadmore")[0].style.height = "1px";
                        }
                    }
                    else {
                        $scope.DataFilter.Page--;
                    }
                }
                else $scope.DataFilter.Page--;
            });
        }
        else {
            $scope.DataFilter.Page--;
            document.getElementById("loadmorepro").style.display = "none !important";
            document.getElementsByClassName("spinner-loadmore")[0].style.height = "1px";
        }
    }
    $scope.Back = function () {
        PopPage();
    }
    $scope.ShowCart = function () {
        PushToPage("ecommerce/cart.html");
    }
});
app.controller('discussionctrl', function ($scope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.ConvertObject = ConvertObject;
    $scope.DataDiscuss = [];
    $scope.ReplyCmtText = "";
    $scope.Avatar = RAPInfo.Avatar;
    $scope.IDCurrentDis = "";
    var item = GetParamsPage().ProCode;
    var idpro = GetParamsPage().IDPro;
    var params = {
        Page: 1,
        PageLimit: 20,
        ProCode: item,
        IDPro: idpro,
        PageAnswer: 1,
        PageLimitAnswer: 5,
    };
    $scope.Back = function () {
        PopPage();
    }
    $scope.ShowDiscuss = function (id) {
        $scope.IDCurrentDis = id;
        document.getElementById("detail_" + id).style.display = "block";
    }
    GetListDiscuss(params, function (result) {
        if (result.success) {
            $scope.DataDiscuss = result.data;
            SetDigest($scope);
        }
    });
    $scope.ReplyDiscuss = function () {
        // ShowAlert("Hệ thống đang cập nhật tính năng.", "Thông báo", function () { });
        var discuss = {
            _idComment: null,// $scope.IDCurrentDis==""?null:$scope.IDCurrentDis,
            CmType: 0,
            Content: $scope.ReplyCmtText,
            _idCustomer: RAPInfo._id,
            CustomerCode: RAPInfo.CustomerCode,
            _idProduct: params.IDPro,
            ProCode: params.ProCode,
            CreatedDate: new Date()
        };
        ShowLoading();
        SaveDiscussion(discuss, function (result) {
            HideLoading();
            discuss._idCustomer = {
                _id: RAPInfo._id,
                CustomerCode: RAPInfo.CustomerCode,
                CustomerName: RAPInfo.CustomerName,
                Avatar: RAPInfo.Avatar
            }
            $scope.DataDiscuss.splice(0, 0, discuss);
            $scope.ReplyCmtText = "";
            SetDigest($scope);
            var ctrl = document.getElementById("discuss");
            ctrl.scrollTop = 0;
        });
    }
    SetDigest($scope);
});
app.controller("productdetailctrl", function ($scope, $rootScope) {
    var Product = GetParamsPage().Product;
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.ConvertObject = ConvertObject;
    $scope.Data = null;
    $scope.RelateProducts = [];
    $scope.ListRate = [];
    $scope.ListRateShort;
    $scope.Quantity = 1;
    $scope.Rating = null;
    $scope.Comment = null;
    $scope.WeightSelected = null;
    $scope.DataDiscuss = [];
    $scope.LoadDiscuss = true;
    $scope.IndexTab = 0;
    $scope.TabName = "tabde00";
    $scope.ReplyCmtText = "";
    $scope.Avatar = RAPInfo.Avatar;
    ShowLoading();
    SetPostChangeDotCarousel("carousel");
    GetListRateProduct(Product.ProCode, 1, 3, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ListRateShort = result.Data;
                SetDigest($scope);
            }
        }
    });
    $scope.ChangeToDiscuss = function () {
        PushToPage('ecommerce/discussion.html', { ProCode: $scope.Data.ProCode, IDPro: $scope.Data._id });
    }
    $scope.ShowChild = function (id) {
        document.getElementById(id).style.display = "block";
    }
    $scope.ReplyMess = function (id) {
        var dt = $scope.DataDiscuss.filter(function (n) {
            if (n._id == id) {
                return n;
                // break;
            }
        });
        $scope.DataFilterDis = dt;
        $(".page__content").addClass("modal-open");
        ModalReplyDiscuss.show();
        SetDigest($scope);

    }
    $scope.ReplyDiscuss = function () {
        var discuss = {
            _idComment: $scope.DataFilterDis[0]._id,
            CmType: 1,
            Content: $scope.ReplyCmtText,
            _idCustomer: RAPInfo._id,
            CustomerCode: RAPInfo.CustomerCode,
            _idProduct: $scope.Data._id,
            ProCode: Product.ProCode,
        };
        ShowLoading();
        SaveDiscussion(discuss, function (result) {
            HideLoading();
            if ($scope.DataFilterDis.length > 0) {
                if ($scope.DataFilterDis[0].ListTop5Answer == undefined || $scope.DataFilterDis[0].ListTop5Answer == null)
                    $scope.DataFilterDis[0].ListTop5Answer = [];
                discuss._idCustomer = {
                    _id: RAPInfo._id,
                    CustomerCode: RAPInfo.CustomerCode,
                    CustomerName: RAPInfo.CustomerName,
                    Avatar: RAPInfo.Avatar
                }
                $scope.DataFilterDis[0].ListTop5Answer.push(discuss);
            }

            $scope.ReplyCmtText = "";
            SetDigest($scope);
            var ctrl = document.getElementsByClassName("content-discuss")[0];
            ctrl.scrollTop = ctrl.scrollHeight - ctrl.clientHeight;
        });
    }
    $scope.HideReplyDiscuss = function () {
        $(".page__content").removeClass("modal-open");
        ModalReplyDiscuss.hide();
    }
    $scope.LoadTab = function (index) {
        $scope.IndexTab = index;
        if ($scope.TabName != null)
            $("#" + $scope.TabName).removeClass("active-item-tab");
        else $("#tabde00").removeClass("active-item-tab");
        $("#" + "tabde0" + index).addClass("active-item-tab");
        $scope.TabName = "tabde0" + index;
        SetDigest($scope);
        if (index == 0) {
            $("#bottombar").show();
            $("#product-detail.html .page--product__content").removeClass("not-bottombar");
        }
        else {
            if (!$("#product-detail.html .page--product__content").hasClass("not-bottombar"))
                $("#product-detail.html .page--product__content").addClass("not-bottombar");
            $("#bottombar").hide();
        }
        if (index == 2) {
            GetListRateProduct(Product.ProCode, 1, 20, function (result) {
                if (result != null) {
                    if (result.success == true) {
                        $scope.ListRate = result.Data;
                        SetDigest($scope);
                    }
                }
            });
        }
        else if (index == 3) {
            var ctrl = document.getElementById("tabdetail");
            ctrl.scrollLeft = ctrl.scrollWidth - ctrl.clientWidth;
        }
    }
    GetDetailProduct(Product.ProCode, Product.Weight, Product.Unit, RAPInfo.CustomerCode, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.Data = result.data;
                $scope.WeightSelected = {
                    NumberActive: result.data.NumberActive,
                    PriceDetail: result.data.PriceDetail,
                    PriceWithoutTax: result.data.PriceWithoutTax,
                    ProCode: result.data.ProCode,
                    Unit: result.data.Unit,
                    Weight: result.data.Weight,
                };
                $scope.Data.ListProductExt.push($scope.WeightSelected);
                SetDigest($scope);
                HideLoading();
                // GetProductByCatCode($scope.Data.CatCode, false, 1, 100, 5, function (kq) {
                //     // lấy danh sách sản phẩm cùng danh mục
                //     if (kq != null) {
                //         if (kq.success == true) {
                //             $scope.RelateProducts = kq.data;
                //             SetDigest($scope);
                //         }
                //     }

                // })
            } else { // false

            }
        } else {//null

        }
    });
    $scope.ShowModalAddToCart = function () {
        ModalAddToCart.show();
    }
    $scope.HideModalAddToCart = function () {
        ModalAddToCart.hide();
    }
    $scope.ShowDiscussion = function () {
        ModalDiscussionProduct.show();
    }
    $scope.HideDiscuss = function () {
        ModalDiscussionProduct.hide();
    }
    $scope.ShowModalRatingProduct = function () {
        ModalRatingProduct.show();
    }
    $scope.HideModalRatingProduct = function () {
        ModalRatingProduct.hide();
    }
    $scope.ShowModalSelectWeight = function () {
        ModalSelectWeight.show();
    }
    $scope.HideModalSelectWeight = function () {
        ModalSelectWeight.hide();
    }
    $scope.SelectWeight = function (item) {
        $scope.WeightSelected = item;
        $scope.Data.NumberActive = item.NumberActive;
        $scope.Data.PriceDetail = item.PriceDetail;
        $scope.Data.PriceWithoutTax = item.PriceWithoutTax;
        $scope.Data.Weight = item.Weight
        SetDigest($scope);
    }
    $scope.AddToCart = function () {
        AddToCart($scope.Data._id, $scope.Data.ProCode, $scope.Data.ProName, $scope.Quantity, $scope.Data.PriceDetail, $scope.Data.Weight, $scope.Data.Unit, $scope.Data.LinkAvatar, $rootScope, function () {
            ModalAddToCart.hide();
            ModalSelectWeight.hide();
            ShowToastEcommerce(LanguageEcom.ADD_TO_CART_SUCCESS, null, 1000, "toast-add-cart", function () {
                SetDigest($rootScope);
            });
        });
    }
    $scope.Minus = function () {
        if ($scope.Quantity > 1) {
            $scope.Quantity--;
        }
    }
    $scope.Plus = function () {
        $scope.Quantity++;
    }
    $scope.CheckNumber = function (quantity) {
        var regex = /[^0-9]/; // not number
        if (typeof quantity != "undefined") {
            quantity = quantity.toString().replace(regex, "");
            $scope.Quantity = parseInt(quantity);
            SetDigest($scope);
        } else {
            quantity = 1;
            $scope.Quantity = quantity;
            SetDigest($scope);
        }

    }
    $scope.LoadDataDis = function () {
        if ($scope.LoadDiscuss) {
            $scope.Params = {
                Page: 1,
                PageLimit: 5,
                ProCode: $scope.Data.ProCode
            }
            GetListDiscuss($scope.Params, function (result) {
                if (result.success) {
                    $scope.LoadDiscuss = false;
                    $scope.DataDiscuss = result.data;
                    if (result.CountData > 5) {
                        $scope.ViewMoreDiscuss = true;
                    }
                    SetDigest($scope);
                }
            });
        }
    }
    $scope.SendDiscuss = function () {
        var discuss = {
            _idComment: null,
            CmType: 0,
            Content: $scope.Comment,
            _idCustomer: RAPInfo._id,
            CustomerCode: RAPInfo.CustomerCode,
            _idProduct: $scope.Data._id,
            ProCode: Product.ProCode
        };
        ShowLoading();
        SaveDiscussion(discuss, function (result) {
            HideLoading();
            if (result != null && result.success) {
                $scope.HideDiscuss();
                $scope.LoadDiscuss = true;
                SetDigest($scope);
                $scope.Params = {
                    Page: 1,
                    PageLimit: 5,
                    ProCode: $scope.Data.ProCode
                }
                GetListDiscuss($scope.Params, function (result) {
                    if (result.success) {
                        $scope.LoadDiscuss = false;
                        $scope.DataDiscuss = result.data;
                        SetDigest($scope);
                    }
                });
                ShowToastEcommerce(LanguageEcom.SEND_DISCUSSION_SUCCESS, null, 1000, "toast-add-cart", null);
            }
            else {
                ShowAlert(result.content);
            }
        });
    }
    $scope.SendRating = function () {
        if ($scope.Rating == null || $scope.Comment == null) {
            AlertNotificationEcommerce(LanguageEcom.PLEASE_ENTER_FULL_INFO, LanguageEcom.NOTIFICATION, LanguageEcom.CLOSE, null)
        } else {
            ModalRatingProduct.hide();
            ModalLoaderEcommerce.show();
            setTimeout(function () {
                Rating($scope.Data.ProCode, RAPInfo.CustomerCode, RAPInfo._id, RAPInfo.CustomerName, $scope.Rating, $scope.Comment, null, null, 1, function (result) {
                    if (result != null) {
                        if (result.success == true) {
                            $scope.Rating = null;
                            $scope.Comment = null;
                            SetDigest($scope);
                            GetListRateProduct(Product.ProCode, 1, 20, function (result) {
                                if (result != null) {
                                    if (result.success == true) {
                                        $scope.ListRate = result.Data;
                                        SetDigest($scope);
                                    }
                                }
                            });
                            ModalLoaderEcommerce.hide();
                            ShowToastEcommerce(LanguageEcom.SEND_RATING_SUCCESS, null, 1000, "toast-add-cart", null);

                        } else {
                            ModalLoaderEcommerce.hide();
                            AlertNotificationEcommerce(LanguageEcom.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN, LanguageEcom.NOTIFICATION, LanguageEcom.CLOSE, function () {
                            })
                        }
                    } else {
                        ModalLoaderEcommerce.hide();
                        AlertNotificationEcommerce(LanguageEcom.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN, LanguageEcom.NOTIFICATION, LanguageEcom.CLOSE, function () {
                        })
                    }
                })
            }, 1000)
        }
    }
    $scope.AddFavorite = function () {
        if ($scope.Data.FavoriteProduct == true) {
            RemoveFavoriteProduct(RAPInfo.CustomerCode, $scope.Data.ProCode, function (result) {
                if (result == true) {
                    $scope.Data.FavoriteProduct = false;
                    SetDigest($scope);
                }
            });
        } else {
            AddFavoriteProduct(RAPInfo.CustomerCode, $scope.Data.ProCode, function (result) {
                if (result == false) {
                    if (result.errcode && result.errcode == "ERR_000422") {
                        RemoveFavoriteProduct(RAPInfo.CustomerCode, $scope.Data.ProCode, function (result) {
                            if (result == true) {
                                $scope.Data.FavoriteProduct = false;
                                SetDigest($scope);
                            }
                        });
                    }
                } else {
                    $scope.Data.FavoriteProduct = true;
                    SetDigest($scope);
                }
            });
        }
    }
    $scope.ShowCart = function () {
        // clearInterval(intervalImage);
        PushToPage("ecommerce/cart.html");
    }
    $scope.ShowProductInCategory = function (cate) {
        ShowCategory(cate);
    }
    $scope.ShowDetailproduct = function (product) {
        // clearInterval(intervalImage);
        ReplaceToPage("ecommerce/product-detail.html", { Product: { ProCode: product.ProCode, Weight: product.Weight, Unit: product.Unit } });
    }
    $scope.Back = function () {
        if ($scope.IndexTab == 2) {
            $scope.IndexTab = 0;
            $("#bottombar").show();
            SetDigest($scope);
        } else
            PopPage();
    }
    SetDigest($scope);
});
app.controller('rateorderctrl', function ($scope) {
    $scope.ipImageEcommerce = ipImageEcommerce;
    SetDigest($scope);
});
app.controller("ordersctrl", function ($scope) {
    $scope.ListOrder = [];
    $scope.ConvertObject = ConvertObject;
    $scope.LanguageEcom = LanguageEcom;
    $scope.Tilte = LanguageEcom.NEWS;
    $scope.ipImageEcommerce = ipImageEcommerce;
    SetDigest($scope);
    $scope.ShowSortPanel = function ($event) {
        SortOrderPopover.show($event);
    }
    $scope.RatePro = function (item) {

    }
    $scope.ShowLocation = function (orderCode) {
        PushToPage("ecommerce/tracking.html", { OrderCode: orderCode });
    }
    // $scope.$on('refreshorders', function () {
    GetListOrder(RAPInfo.CustomerCode, null, 1, 20, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ListOrder = result.data;
                SetDigest($scope);
            }
        }
    });
    // });
    $scope.ShowOrder = function (item) {
        PushToPage("ecommerce/detail-order.html", { OrderCode: item.OrderCode });
    }
    $scope.Back = function () {
        PopPage();
    }
});
app.controller('trackingctrl', function ($scope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.DataDetail = [];
    $scope.Back = function () {
        PopPage();
    }
    var ordercode = GetParamsPage().OrderCode;
    $scope.Map;
    $scope.DirectionOrder = function () {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': $scope.DataDetail.WarehouseLocation }, function (results, status) {
            $scope.Map.panTo(new google.maps.LatLng(9.981797, 106.346691));
        });
    }

    TrackingOrder(ordercode);
    function TrackingOrder(ordercode) {
        $.ajax({
            url: ipEcommerce + "/OrderTracking/TrackingOrder", type: "GET", dataType: "JSON", data: { OrderCode: ordercode, CustomerCode: RAPInfo.CustomerCode },
            timeout: 4500,
            success: function (data) {
                if (data.success == true) {
                    data.data.TrackingDetail.forEach(function (element) {
                        element.CreateDate = ConvertDateToString(new Date(element.CreateDate), false, "HHmm ddMMyyyy");
                    }, this);
                    $scope.DataDetail = data.data;
                    initMap($scope.DataDetail, function (result) {
                        $scope.Map = result;
                    });
                    SetDigest($scope);
                }
            }
            , error: function (xhr) {
                CheckServer(xhr.statusText);
                callback(null);
            }
        });

    }
    SetDigest($scope);
});

app.controller("accountctrl", function ($scope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.RAPInfo = RAPInfo;
    $scope.CateIndexActive = 0;
    SetDigest($scope);
    $scope.ShowFavoriteProducts = function () {
        PushToPage("ecommerce/favoriteproducts.html");
    }
    $scope.ShowByIndex = function (index) {
        var name = document.getElementsByClassName("tabchild");
        if (name != null && name.length > 0) {
            $(name[$scope.CateIndexActive]).removeClass("active");
            $(name[index]).addClass("active");
            $scope.CateIndexActive = index;
        }
    }
    $scope.LogOut = function () {
        ons.notification.confirm({
            title: LanguageEcom.NOTIFICATION, message: LanguageEcom.SURE_LOG_OUT, buttonLabels: [LanguageEcom.CANCEL, LanguageEcom.LOG_OUT], modifier: "ecommerce", callback: function (answer) {
                if (answer == 1)
                    ResetToLogin();
            }
        });
    }
    $scope.TrackingOrder = function () {
        PushToPage("ecommerce/tracking.html");
    }
    $scope.ShowOrder = function () {
        PushToPage("ecommerce/orders.html");
    }
    $scope.GoToUpdateProfile = function () {
        PushToPage("ecommerce/updateprofile.html");
    }
    $scope.ShowNotification = function () {
        PushToPage("ecommerce/listnotification.html");
    }
    $scope.ShowVouchers = function () {
        PushToPage("ecommerce/vouchers.html");
    }
    $scope.UpdateShop = function () {
        PushToPage("ecommerce/regisshop.html",{IsEdit:true});
    }
    $scope.Back = function () {
        // var scope = angular.element(document.getElementById('maintabbar.html')).scope();
        // if (scope != null && scope.TabIndexPrevious != undefined && scope.TabIndexPrevious != null) {
        //     EcommerceTabbar.setActiveTab(scope.TabIndexPrevious);
        // }
        // else
        PopPage();
    }
});
app.controller("vouchersctrl", function ($scope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.Vouchers = null;
    $scope.DealNo = null;
    $scope.ExpireType = 1;
    $scope.ExpiredDate = null;
    $scope.ExpiredDateShow = null;
    $scope.Note = null;
    $scope.CreateBy = RAPInfo.CustomerCode;
    SetDigest($scope);

    GetListCoupon(RAPInfo.CustomerCode, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.Vouchers = result.data;
                SetDigest($scope);
            }
        }
    });

    $scope.ShowDatePicker = function () {
        datePicker.show(
            {
                date: new Date(),
                mode: 'date',
                androidTheme: 4,
                locale: "VN",
            }
            , function (date) {
                var M = parseInt(date.getMonth()) + 1;
                var Y = date.getFullYear();
                var D = parseInt(date.getDate());

                if (M < 10) {
                    M = '0' + M;
                }
                if (D < 10) {
                    D = '0' + D;
                }

                $scope.ExpiredDateShow = D + '/' + M + '/' + Y;
                $scope.ExpiredDate = Y + '/' + M + '/' + D;
                SetDigest($scope);
            }, function (error) {

            });
    }

    $scope.Copy = function (id) {
        var id = 'voucher-' + id;
        var success = CopyToClipboard(document.getElementById(id));
        if (success == true) {
            ShowModalMessageEcommerce("<div class='ecommerce-main-color'><div><i class='ion-checkmark-round'></i></div><div>ĐÃ COPY</div></div>");
            setTimeout(function () {
                HideModalMessageEcommerce();
            }, 1000);
        }
    }

    $scope.ShowModalAddVoucher = function () {
        ModalAddVoucher.show();
    }
    $scope.HideModalAddVoucher = function () {
        ModalAddVoucher.hide();
    }
    $scope.Save = function () {
        ValidVoucherByCustomer($scope.DealNo, function (kq) {
            if (kq != null) {
                if (kq.success == true) {
                    AddVoucher(RAPInfo.CustomerCode, $scope.DealNo, $scope.ExpireType, $scope.ExpiredDate, $scope.Note, $scope.CreateBy, function (result) {
                        if (result != null) {
                            if (result.success == true) {
                                ModalAddVoucher.hide();
                                ShowToastEcommerce(LanguageEcom.ADD_DISCOUNT_CODE_SUCCESSFULLY, null, 1000, "toast-add-cart", null);
                                GetListCoupon(RAPInfo.CustomerCode, function (result) {
                                    if (result != null) {
                                        if (result.success == true) {
                                            $scope.Vouchers = result.data;
                                            SetDigest($scope);
                                        }
                                    }
                                })
                            } else {
                                AlertError(result.errcode, function () {

                                });
                            }
                        }
                    })
                } else {
                    AlertError(kq.errcode, function () {

                    });
                }
            } else {

            }

        })
    }
    $scope.Back = function () {
        PopPage();
    }
});
app.controller("favoriteproductsctrl", function ($scope) {
    $scope.ConvertObject = ConvertObject;
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.RAPInfo = RAPInfo;
    $scope.ListFavoriteProducts = null;
    GetListFavoriteProduct($scope.RAPInfo.CustomerCode, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ListFavoriteProducts = result.data;
                SetDigest($scope);
            }

        }
    });
    $scope.ShowRemove = function () {
        alert("Hệ thống đang phát triển");
    }
    $scope.ShowDetailproduct = function (product) {
        PushToPage("ecommerce/product-detail.html", { Product: { ProCode: product.ProCode, Weight: product.Weight, Unit: product.Unit } });
    }
    $scope.Delete = function (item) {
        RemoveFavoriteProduct(RAPInfo.CustomerCode, item.ProCode, function (result) {
            if (result == true) {
                $scope.ListFavoriteProducts.splice($scope.ListFavoriteProducts.indexOf(item), 1);
                SetDigest($scope);
            }
        });
    }

    $scope.Back = function () {
        PopPage();
    }
})

app.controller("updateprofilectrl", function ($scope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.RAPInfo = RAPInfo;
    // $scope.RAPInfo.Avatar = "/Avatar/Customer/W740100001.jpg";
    SetDigest($scope);
    $scope.Update = function () {
        if ($scope.RAPInfo.CustomerName == "" || $scope.RAPInfo.Address == "" || $scope.RAPInfo.PhoneNumber == "" || $scope.RAPInfo.Email == "") {
            AlertError("PLEASE_ENTER_FULL_INFO", function () {
            })
        } else if (ValidateEmail($scope.RAPInfo.Email) == false) {
            AlertError("EMAIL_NOT_VALID", function () {
            })
        } else if (ValidatePhoneNumber($scope.RAPInfo.PhoneNumber) == false) {
            AlertError("PHONE_NUMBER_NOT_VALID", function () {
            })
        } else {
            UpdateProfile($scope.RAPInfo.UserName, $scope.RAPInfo.CustomerName, $scope.RAPInfo.Address, $scope.RAPInfo.PhoneNumber, $scope.RAPInfo.Gender, $scope.RAPInfo.Email, function (result) {
                if (result != null) {
                    ShowToastEcommerce(LanguageEcom.UPDATE_SUCCESSFUL, null, 1000, "toast-add-cart", null);
                } else {
                    AlertError(LanguageEcom.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN, function () {
                    });
                }
            })
        }

    }
    $scope.Back = function () {
        PopPage();
    }
});

app.controller("cartctrl", function ($scope, $rootScope, $timeout) {
    $scope.ConvertObject = ConvertObject;
    $scope.LanguageEcom = LanguageEcom;
    $scope.Edit = -1;
    $scope.CheckAll = false;
    if ($rootScope.Cart == undefined)
        $rootScope.Cart = {};
    $rootScope.Cart.CartTotal = CalcCartTotal($rootScope.Cart);
    $scope.Discount = 0;
    $scope.Coupon = null;
    $scope.TotalAfterDiscount = $rootScope.Cart.CartTotal;
    $scope.Vouchers = [];
    SetDigest($scope);
    LoadIpImage(function (ip) {
        $scope.ipImageEcommerce = ipImageEcommerce = "http://" + ip;
        SetDigest($scope);
    });
    $scope.$on("Discount", function (event, args) {
        $scope.Discount = args[0];
        $scope.Coupon = args[1];
        $scope.TotalCoupon = ConvertObject.ConvertNumberFormat(($rootScope.Cart.CartTotal * $scope.Discount / 100));
        $scope.TotalAfterDiscount = ConvertObject.ConvertNumberFormat($rootScope.Cart.CartTotal - ($rootScope.Cart.CartTotal * $scope.Discount / 100));
        SetDigest($scope);
    });
    $scope.SelectCoupon = function () {
        ShowAlert("Chức năng đang phát triển");
    }
    $scope.EditCart = function () {
        $scope.Edit = $scope.Edit * -1;
        if ($scope.Edit == 1) {
            $(".cart-list").addClass("edit");
            $(".edit-cart-btn").removeClass("ion-edit").addClass("ion-checkmark-round");
        } else {
            $(".cart-list").removeClass("edit");
            $(".edit-cart-btn").removeClass("ion-checkmark-round").addClass("ion-edit");
        }
    }
    /*Ecommerce*/
    $scope.Coupon = null;
    $scope.CheckCoupon = function () {
        $("#waitingload-btn").show();
        if ($scope.Coupon == null || $scope.Coupon == "") {
            AlertError("ERR_000495");
        }
        else {
            CheckCoupon($scope.Coupon, 1, $rootScope.Cart.CartTotal, function (result) {
                setTimeout(function () {
                    document.getElementById("waitingload-btn").style.display = "none";
                    if (result != null) {
                        if (result.success == true) {
                            setTimeout(function () {
                                document.getElementById("checkbutton").style.display = "inline-block";
                                ModalCheckCoupon.hide();
                                $rootScope.$broadcast("Discount", [result.data.Discount, $scope.Coupon]); // Truyền giá giảm vào giỏ hàng
                            }, 500);

                        }
                        else {
                            AlertError(result.errcode);
                        }
                    }
                }, 1000);
            });
        }
    }

    $scope.HideModalCheckCoupon = function () {
        ModalCheckCoupon.hide();
    }
    /*Ecommerce*/
    $scope.Delete = function (item) {
        RemoveCartItem(item, $rootScope, function () {
        })
    }
    $scope.CheckAllItem = function () {
        if ($scope.CheckAll == true) {
            for (var i = 0; i < $rootScope.Cart.Items.length; i++) {
                $rootScope.Cart.Items[i].CheckEdit = true;
            }
        } else {
            for (var i = 0; i < $rootScope.Cart.Items.length; i++) {
                $rootScope.Cart.Items[i].CheckEdit = false;
            }
        }
        SetDigest($rootScope);
        SetDigest($scope);
    }
    $scope.DeleteAll = function () {
        for (var i = $rootScope.Cart.Items.length - 1; i >= 0; i--) {
            if ($rootScope.Cart.Items[i].CheckEdit == true) {
                $rootScope.Cart.CartTotal = $rootScope.Cart.CartTotal - ($rootScope.Cart.Items[i].Quantity * $rootScope.Cart.Items[i].ProductPrice);
                $rootScope.Cart.Items.splice(i, 1);
                $rootScope.Cart.NumberCartItem = CountCartItem($rootScope.Cart);
                localStorage.setItem(KeyCartItems, JSON.stringify($rootScope.Cart.Items));
                localStorage.setItem(KeyNumberCartItem, $rootScope.Cart.NumberCartItem);
            }
        }


        SetDigest($rootScope);
    }

    $scope.Minus = function (item) {
        if (item.Quantity > 1) {
            item.Quantity--;
            $rootScope.Cart.NumberCartItem--;
            $rootScope.Cart.CartTotal = CalcCartTotal($rootScope.Cart);
            localStorage.setItem(KeyCartItems, JSON.stringify($rootScope.Cart.Items));
            localStorage.setItem(KeyNumberCartItem, $rootScope.Cart.NumberCartItem);
            SetDigest($rootScope);
        }
    }
    $scope.Plus = function (item) {
        item.Quantity++
        $rootScope.Cart.NumberCartItem++;
        $rootScope.Cart.CartTotal = CalcCartTotal($rootScope.Cart);
        localStorage.setItem(KeyCartItems, JSON.stringify($rootScope.Cart.Items));
        localStorage.setItem(KeyNumberCartItem, $rootScope.Cart.NumberCartItem);
        SetDigest($rootScope);
    }
    $scope.CheckNumber = function (quantity, index) {
        var regex = /[^0-9]/; // not number
        if (typeof quantity != "undefined") {
            quantity = quantity.toString().replace(regex, "");
            $rootScope.Cart.Items[index].Quantity = parseInt(quantity);
            $rootScope.Cart.NumberCartItem = CountCartItem($rootScope.Cart);
            $rootScope.Cart.CartTotal = CalcCartTotal($rootScope.Cart);
            localStorage.setItem(KeyCartItems, JSON.stringify($rootScope.Cart.Items));
            localStorage.setItem(KeyNumberCartItem, $rootScope.Cart.NumberCartItem);
            SetDigest($rootScope);
        } else {
            quantity = 1;
            $rootScope.Cart.Items[index].Quantity = parseInt(quantity);
            $rootScope.Cart.NumberCartItem = CountCartItem($rootScope.Cart);
            $rootScope.Cart.CartTotal = CalcCartTotal($rootScope.Cart);
            localStorage.setItem(KeyCartItems, JSON.stringify($rootScope.Cart.Items));
            localStorage.setItem(KeyNumberCartItem, $rootScope.Cart.NumberCartItem);
            SetDigest($rootScope);
        }

    }
    $scope.ContinueShopping = function () {
        PopPage();
        // if (EcommerceTabbar.getActiveTabIndex() != 1) {
        //     ResetToEcommerce("fade");
        // } else {
        //     EcommerceTabbar.setActiveTab(0, { animation: "slide" })
        // }
    }
    $scope.ShowModalCheckCoupon = function () {
        $("#waitingload-btn").hide();
        $("#checkbutton").hide();
        $scope.Coupon = "";
        SetDigest($scope);
        ModalCheckCoupon.show();
    }
    $scope.CheckOut = function () {
        PushToPage("ecommerce/shipping.html", { Coupon: $scope.Coupon })
    }
    $scope.Back = function () {
        PopPage();
    }

});

app.controller("shippingctrl", function ($scope) {
    $scope.Coupon = GetParamsPage().Coupon;
    $scope.LanguageEcom = LanguageEcom;
    $scope.ListProvince = [];
    $scope.ShipLocation = null;
    $scope.ShipPrice = 0;
    $scope.Description = "";
    GetAllProvince(function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ListProvince = result.data;
                SetDigest($scope);
            }
        }
    });
    GetCustomerAddress(RAPInfo.CustomerCode, true, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ShipLocation = result.data[0];
                SetDigest($scope);
            }
        }
    })
    $scope.ChooseProvice = function (item) {
        ModalListProvince.hide();
        $scope.ShipLocation.ProvinceCode = item.ProvinceCode;
        $scope.ShipLocation.ProvinceName = item.ProvinceName;
        SetDigest($scope);
    }
    $scope.NextToPayment = function () {
        PushToPage("ecommerce/payment.html", {
            animation: "slide",
            Coupon: $scope.Coupon,
            ShipLocation: $scope.ShipLocation,
            ShipPrice: $scope.ShipPrice,
            Description: $scope.Description,
        });
    }
    $scope.Back = function () {
        PopPage();
    }
    SetDigest($scope);
})

app.controller("paymentctrl", function ($scope, $rootScope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.Data = {
        CustomerCode: RAPInfo.CustomerCode,
        _customer: RAPInfo._id,
        ProvinceCode: RAPInfo.ProvinceCode,
        FullName: RAPInfo.CustomerName,
        Email: RAPInfo.Email,
        PhoneNumber: RAPInfo.PhoneNumber,
        Description: GetParamsPage().Description,
        OrderDetail: $rootScope.Cart.Items,
        ShipLocation: GetParamsPage().ShipLocation,
        ShipPrice: GetParamsPage().ShipPrice,
        AmountBeforeTAX: $rootScope.Cart.CartTotal,
        AmountAfterTAX: $rootScope.Cart.CartTotal,
        SumPriceDetail: null,
        TotalPrice: null,
        PayStyle: null,
        DealNo: GetParamsPage().Coupon,
        Discount: null,
    }
    $scope.Data.PayStyle = 1;
    $scope.SetMethod = function (method, $event) {
        $(".payment-method").removeClass("active");
        $($event.currentTarget).addClass("active");
        $scope.Data.PayStyle = method;
        SetDigest($scope);
    }
    $scope.CheckOut = function () {
        if ($rootScope.Cart.Items.length == 0 || $rootScope.Cart.Items == null) {
            AlertError("PLEASE_CHOOSE_PRODUCT_BEFORE_CHECKOUT", function () {
                ResetToEcommerce();
            });
        } else if ($scope.Data.PayStyle == null) {
            AlertError("PLEASE_CHOOSE_PAYMENT_METHOD");
        } else {
            if ($scope.Data.DealNo == null || $scope.Data.DealNo == "") { // Ko có mã giảm giá
                $scope.Data.SumPriceDetail = $scope.Data.AmountAfterTAX;
                $scope.Data.TotalPrice = $scope.Data.SumPriceDetail + $scope.Data.ShipPrice;
                $scope.Data.Discount = 0;
                AddOrder($scope.Data, function (kq) {
                    if (kq != null) {
                        if (kq.success == true) {
                            EmptyCart($rootScope);
                            ShowToastEcommerce(LanguageEcom.ADD_ORDER_SUCCESS, null, 1500, "toast-add-cart", null);
                            setTimeout(function () {
                                PushToPage("ecommerce/ordersuccess.html", { OrderCode: kq.OrderCode });
                            }, 1500);

                        } else {
                            AlertError(kq.errcode);
                        }
                    } else {
                        AlertError(SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
                    }
                })
            } else {// Có mã giảm giá
                CheckCoupon($scope.Data.DealNo, 1, $rootScope.Cart.CartTotal, function (result) {
                    if (result != null) {
                        if (result.success == true) {
                            $scope.Data.Discount = result.data.Discount;
                            $scope.Data.SumPriceDetail = $scope.Data.AmountAfterTAX - ($scope.Data.AmountAfterTAX * $scope.Data.Discount / 100);
                            $scope.Data.TotalPrice = $scope.Data.SumPriceDetail + $scope.Data.ShipPrice;
                            AddOrder($scope.Data, function (kq) {
                                if (kq != null) {
                                    if (kq.success == true) {
                                        EmptyCart($rootScope);
                                        ShowToastEcommerce(LanguageEcom.ADD_ORDER_SUCCESS, null, 1500, "toast-add-cart", null);
                                        setTimeout(function () {
                                            PushToPage("ecommerce/ordersuccess.html", { OrderCode: kq.OrderCode });
                                        }, 1500);

                                    } else {
                                        AlertError(kq.errcode);
                                    }
                                } else {
                                    AlertError(SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN);
                                }
                            })
                        } else {
                            AlertError(result.errcode);
                            $scope.Data.DealNo = null;
                            SetDigest($scope);
                        }

                    }
                })
            }
        }


    }
    $scope.Back = function () {
        PopPage();
    }
    SetDigest($scope);
});

app.controller("ordersuccessctrl", function ($scope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.OrderCode = GetParamsPage().OrderCode;
    $scope.ContinueShopping = function () {
        ResetToEcommerce();
    }
    SetDigest($scope);
})
app.controller("detailorderctrl", function ($scope) {
    var OrderCode = GetParamsPage().OrderCode;
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.Data = null;
    $scope.ConvertObject = ConvertObject;
    SetDigest($scope);
    GetDetailOrder(OrderCode, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.Data = result.data;
                SetDigest($scope);
            }
        }
    })
    $scope.Back = function () {
        PopPage();
    }
})
function LoadIpImage(callback) {
    $.ajax({
        url: ipEcommerce + "/SettingAppRouter/GetSettingName", type: "GET", dataType: "JSON", data: { SettingName: "SVRIMG" },
        timeout: 4500,
        success: function (data) {
            if (data.success == true) {
                callback(data.data.ValueInfo);
            } else {
                callback(null);
            }
        }
        , error: function (xhr) {
            CheckServer(xhr.statusText);
            callback(null);
        }
    });
}

function GetCategories(CatCodeParent, AppCode, callback) {
    $.ajax({
        url: ipEcommerce + "/Category/GetListByParentCode",
        type: "GET",
        dataType: "JSON",
        data: { CatCodeParent: CatCodeParent, AppCode: AppCode },
        timeout: 45000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function ShowCateByParent(catename, addpro) {
    PushToPage("ecommerce/category.html", { AddPro: addpro, Category: catename }, true);
}
function ShowCategory(cate) { // Kt nếu có danh mục con thì show danh mục/ không thì show sản phẩm
    GetCategories(cate.CatCode, AppCode, function (result) {
        if (result.success == true) {
            PushToPage("ecommerce/category.html", { Category: cate.Cat });
        } else {
            if (result.errcode == "ERR_000001") {
                PushToPage("ecommerce/listproduct.html", { Sort: 5, Category: cate.CatCode });
                // PushToPage("ecommerce/productincategory.html", { Category: cate });
            }
        }
    })
}
function GetProductSale(Page, PageLimit, callback) {
    $.ajax({
        url: ipEcommerce + "/Search/GetSalesProduct",
        type: "GET",
        dataType: "JSON",
        data: { Page: Page, PageLimit: PageLimit },
        timeout: 45000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function GetProducts(Page, PageLimit, Sort, ListCat, MinPrice, MaxPrice, KeySearch, callback) {
    var data = {
        Page: Page,
        PageLimit: PageLimit,
        Sort: Sort,
    }
    if (ListCat != null && ListCat.length > 0) {
        data["ListCat"] = JSON.stringify(ListCat);
    }
    if (MinPrice != null) {
        data["MinPrice"] = MinPrice;
    }
    if (MaxPrice != null) {
        data["MaxPrice"] = MaxPrice;
    }
    if (KeySearch != null && KeySearch != "") {
        data["KeySearch"] = KeySearch;
    }
    $.ajax({
        url: ipEcommerce + "/Product/GetListMostSell",
        type: "GET",
        dataType: "JSON",
        data: data,
        timeout: 45000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetComboInDate(Page, PageLimit, callback) {
    $.ajax({
        url: ipEcommerce + "/PromotionDay/GetListByDate",
        type: "GET",
        dataType: "JSON",
        data: {
            Page: Page,
            PageLimit: PageLimit,
        },
        timeout: 45000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetAds(CommerLocation, callback) {
    $.ajax({
        url: ipEcommerce + "/Commercial/GetBannerMobile",
        type: "GET",
        dataType: "JSON",
        data: {
            CommerLocation: CommerLocation
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetDetailProduct(ProCode, Weight, Unit, CustomerCode, callback) {
    $.ajax({
        url: ipEcommerce + "/Barcode/GetByProCode",
        type: "GET",
        dataType: "JSON",
        data: {
            ProCode: ProCode,
            Weight: Weight,
            CustomerCode: CustomerCode,
            Size: GetScreenSizeImages(),
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetProductByCatCode(CatCode, IsDeep, Page, PageLimit, Sort, callback) {
    $.ajax({
        url: ipEcommerce + "/Barcode/GetProductListByCatCode",
        type: "GET",
        dataType: "JSON",
        data: {
            CatCode: CatCode,
            IsDeep: IsDeep,
            Page: Page,
            PageLimit: PageLimit,
            Sort: Sort
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetListRateProduct(ProCode, Page, PageLimit, callback) {
    $.ajax({
        url: ipEcommerce + "/RateProduct/GetByProCode",
        type: "GET",
        dataType: "JSON",
        data: {
            ProCode: ProCode,
            Page: Page,
            PageLimit: PageLimit,
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function SaveDiscussion(data, callback) {
    $.ajax({
        url: ipEcommerce + "/CommentProduct/Ins",
        type: "POST",
        dataType: "JSON",
        data: {
            Data: JSON.stringify(data)
        },
        timeout: 25000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function Rating(ProCode, CustomerCodeReg, _idCustomer, FullName, Rate, Description, RateDetail, Title, Type, callback) {
    var Data = {
        ProCode: ProCode,
        CustomerCodeReg: CustomerCodeReg,
        _idCustomer: _idCustomer,
        FullName: FullName,
        Rate: Rate,
        Description: Description,
        RateDetail: RateDetail,
        Title: Title,
        Type: Type
    }
    $.ajax({
        url: ipEcommerce + "/RateProduct/Rate",
        type: "POST",
        dataType: "JSON",
        data: {
            Data: JSON.stringify(Data)
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function GetCurrentDateString() {
    var d = new Date();
    return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
}

function ConvertNumberFormat(value, isNum) {
    var charSeparator = ',';
    if (value != undefined && value != null) {
        if (isNum == true)
            value = decimalAdjust("round", value, -3);

        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, charSeparator);
    }
}

function GetScreenSizeImages() {
    if (window.innerWidth <= 400) {
        return "400x300";
    } else if ((window.innerWidth > 400) && (window.innerWidth <= 800)) {
        return "800x600";
    }
}

function CountCartItem(Cart) {
    var count = 0;
    for (var i = 0; i < Cart.Items.length; i++) {
        count = count + Cart.Items[i].Quantity;
    }
    return count;
}

function AddToCart(_Product, ProCode, ProName, Quantity, ProductPrice, Weight, Unit, LinkAvatar, rootScope, callback) {
    var flag = 0;
    var item = {
        _Product: _Product,
        ProCode: ProCode,
        ProName: ProName,
        Quantity: Quantity,
        ProductPrice: ProductPrice,
        Weight: Weight,
        Unit: Unit,
        LinkAvatar: LinkAvatar,
        CheckEdit: false
    }

    for (var i = 0; i < rootScope.Cart.Items.length; i++) {
        if (ProCode == rootScope.Cart.Items[i].ProCode && Weight == rootScope.Cart.Items[i].Weight && Unit == rootScope.Cart.Items[i].Unit) {
            rootScope.Cart.Items[i].Quantity = rootScope.Cart.Items[i].Quantity + Quantity;
            rootScope.Cart.NumberCartItem = CountCartItem(rootScope.Cart);
            rootScope.Cart.CartTotal = rootScope.Cart.CartTotal + (Quantity * ProductPrice);
            localStorage.setItem(KeyCartItems, JSON.stringify(rootScope.Cart.Items));
            localStorage.setItem(KeyNumberCartItem, rootScope.Cart.NumberCartItem);
            flag = 1;
            break;
        }
    }

    if (flag == 0) { // sp chưa có trong cart
        rootScope.Cart.Items.push(item);
        rootScope.Cart.NumberCartItem = CountCartItem(rootScope.Cart);
        rootScope.Cart.CartTotal = rootScope.Cart.CartTotal + (Quantity * ProductPrice);
        localStorage.setItem(KeyCartItems, JSON.stringify(rootScope.Cart.Items));
        localStorage.setItem(KeyNumberCartItem, rootScope.Cart.NumberCartItem);
    }

    callback();
}

function RemoveCartItem(item, rootScope, callback) {
    rootScope.Cart.Items.splice(rootScope.Cart.Items.indexOf(item), 1);
    rootScope.Cart.NumberCartItem = CountCartItem(rootScope.Cart);
    rootScope.Cart.CartTotal = rootScope.Cart.CartTotal - (item.Quantity * item.ProductPrice);
    localStorage.setItem(KeyCartItems, JSON.stringify(rootScope.Cart.Items));
    localStorage.setItem(KeyNumberCartItem, rootScope.Cart.NumberCartItem);
    SetDigest(rootScope);
    callback();
}

function CalcCartTotal(Cart) {
    var Total = 0;
    if (Cart != undefined && Cart != null && Cart.Items != undefined && Cart.Items != null) {
        for (var i = 0; i < Cart.Items.length; i++) {
            Total = Total + (Cart.Items[i].ProductPrice * Cart.Items[i].Quantity);
        }
    }
    return Total;
}

function ResetToEcommerce(animation) {
    ResetToPage("ecommerce/catemain.html");
    // var pages = document.querySelector('#navigator').pages;
    // for (var i = pages.length - 1; i >= 0; i--) {
    //     if (pages[i].pushedOptions.page != "ecommerce/maintabbar.html") {
    //         document.querySelector('#navigator').removePage(i, { animation: animation });
    //     } else {
    //         EcommerceTabbar.setActiveTab(0);
    //         break;
    //     }
    // }
}

function CheckCoupon(DealNo, ApplyFor, TotalBill, callback) {
    $.ajax({
        url: ipEcommerce + "/Promotion/ValidDealNo",
        type: "GET",
        dataType: "JSON",
        data:
        {
            DealNo: DealNo,
            ApplyFor: ApplyFor,
            TotalBill: TotalBill,
        },
        timeout: 25000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetCustomerAddress(CustomerCode, Default, callback) {
    var data = {
        CustomerCode: CustomerCode
    }
    if (Default) {
        data["Default"] = Default;
    }

    $.ajax({
        url: ipEcommerce + "/CustomerAddress/GetByCustomer",
        type: "GET",
        dataType: "JSON",
        timeout: 15000,
        data: data,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetAllProvince(callback) {
    $.ajax({
        url: ipEcommerce + "/Province/GetAll",
        type: "GET",
        dataType: "JSON",
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function AddOrder(Data, callback) {
    // alert(JSON.stringify(Data));
    Data.AppCode = AppCode;
    $.ajax({
        url: ipEcommerce + "/Order/PaymentMobile",
        type: "POST",
        dataType: "JSON",
        data: { Data: JSON.stringify(Data) },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetListOrder(CustomerCode, Status, Page, PageLimit, callback) {
    var data = {
        CustomerCode: CustomerCode,
        Page: Page,
        PageLimit: PageLimit,
        GetDetails: 1
    };
    if (Status != null) {
        data['Status'] = Status;
    }
    $.ajax({
        url: ipEcommerce + "/Order/GetByCustomerCodeCompactInfo",
        type: "GET",
        dataType: "JSON",
        data: data,
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function GetDetailOrder(OrderCode, callback) {
    $.ajax({
        url: ipEcommerce + "/Order/GetByOrderCode",
        type: "GET",
        dataType: "JSON",
        data: { OrderCode: OrderCode },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function RemoveFavoriteProduct(CustomerCode, ProCode, callback) {
    $.ajax({
        url: ipEcommerce + "/Customer/DeleteProductFavorite",
        type: "POST",
        dataType: "JSON",
        data: { CustomerCode: CustomerCode, ProCode: ProCode },
        timeout: 15000,
        success: function (data) {
            callback(data.success);
        }, error: function (xhr) {
            callback(false);
        }
    });
}

function AddFavoriteProduct(CustomerCode, ProCode, callback) {
    $.ajax({
        url: ipEcommerce + "/Customer/InsertProductFavorite",
        type: "POST",
        dataType: "JSON",
        data: { CustomerCode: CustomerCode, ProCode: ProCode },
        timeout: 15000,
        success: function (data) {
            callback(data.success);
        }, error: function (xhr) {
            callback(false);
        }
    });
}

function AlertError(errcode, callback) {
    if (!callback) {
        AlertNotificationEcommerce(LanguageEcom[errcode], LanguageEcom.NOTIFICATION, [LanguageEcom.CLOSE]);
    } else {
        AlertNotificationEcommerce(LanguageEcom[errcode], LanguageEcom.NOTIFICATION, [LanguageEcom.CLOSE], function () {
            callback();
        });
    }

}

function AlertNotificationEcommerce(message, title, label, callbackfunction) {// Hiển thị alert notification theo modifier ecommerce
    ons.notification.alert({
        message: message,
        title: title,
        buttonLabels: label,
        modifier: "ecommerce",
        callback: function () {
            if (callbackfunction) {
                callbackfunction();
            }
        }
    });
}

function ShowToastEcommerce(message, animation, timeout, classname, callbackfunction) {
    // alert(document.querySelector('ons-toast').is('visible'));
    // Hiển thị toast theo modifier ecommerce
    var option = {
        message: message,
        modifier: "ecommerce"
    };
    if (animation == null) {
        if(ons.platform.isIOS()){
            option["animation"] = "lift";
        }
        
    }else{
        option["animation"] = animation;
    }
        
    if (timeout != null && timeout != undefined) {
        option["timeout"] = timeout;
    }
    if (classname != null && classname != undefined) {
        option["class"] = classname;
    }
    if (callbackfunction != null && callbackfunction != undefined) {
        option["callback"] = function () {
            callbackfunction();
        };
    }
    ons.notification.toast(option);
    // alert(document.querySelector('ons-toast').is('visible'));
}

function HidePageOverlayLoader(TimeOut, element) {
    setTimeout(function () {
        $(element).find(".overlay-page-loader").remove();
    }, TimeOut)

}

function EmptyCart(rootScope) {
    rootScope.Cart = {
        NumberCartItem: 0,
        Items: [],
        CartTotal: 0,
    };
    localStorage.setItem(KeyCartItems, JSON.stringify(rootScope.Cart.Items));
    localStorage.setItem(KeyNumberCartItem, rootScope.Cart.NumberCartItem);
}

function CheckQuantityProduct(ProCode, Weight, Unit, callback) {
    $.ajax({
        url: ipEcommerce + "/Product/CheckProduct",
        type: "POST",
        dataType: "JSON",
        data: { ProCode: ProCode, Weight: Weight, Unit: Unit },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function LoadLanguageEcommerce(lcode, callback) {
    lcode = lcode.toLowerCase();
    var link = "ecommerce/language/ecommerce_" + lcode + ".json";
    $.getJSON(link, function (data) {
        LanguageEcom = data;
        callback(data);
    });

}
function GetListCoupon(CustomerCode, callback) {
    $.ajax({
        url: ipEcommerce + "/CustomerPromotion/GetListDealNoByCustomer",
        type: "GET",
        dataType: "JSON",
        data: { CustomerCode: CustomerCode },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function ValidVoucherByCustomer(DealNo, callback) {
    $.ajax({
        url: ipEcommerce + "/CustomerPromotion/ValidDealNoByCustomer",
        type: "GET",
        dataType: "JSON",
        data: { DealNo: DealNo },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function ValidatePhoneNumber(phonenumber) {
    var re = /^[0-9]{8,11}$/;
    return re.test(phonenumber);
}
function ValidateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
function ValidateUserName(userName) {
    var re = /^([a-zA-Z0-9.]+@){0,1}([a-zA-Z0-9.])+$/;
    return re.test(userName);
}
function UpdateProfile(UserName, FullName, Address, PhoneNumber, Gender, Email, callback) {
    var Data = {
        UserName: UserName,
        FullName: FullName,
        Address: Address,
        PhoneNumber: PhoneNumber,
        Gender: Gender,
        Email: Email,
    }
    $.ajax({
        url: ip + "/api/Mekong/Update_Mobile?token=" + Profile.Token,
        contentType: 'application/x-www-form-urlencoded',
        type: "POST",
        dataType: "JSON",
        data: { Data: JSON.stringify(Data) },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function CopyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.disabled = "disabled";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    // target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch (e) {
        succeed = false;
    }
    // restore original focus
    // if (currentFocus && typeof currentFocus.focus === "function") {
    //     currentFocus.focus();
    // }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}
function GetListFavoriteProduct(CustomerCode, callback) {
    $.ajax({
        url: ipEcommerce + "/Customer/GetProductFavoriteByCustomerCode",
        type: "GET",
        dataType: "JSON",
        data: { CustomerCode: CustomerCode },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
// khởi tạo google map
function initMap(Data, callback) {
    var latlng = new google.maps.LatLng(9.981797, 106.346691);
    var map = new google.maps.Map(document.getElementById('googleMap'),
        {
            center: latlng,
            scrollwheel: false,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            styles: styleMap
        });
    map.addListener('zoom_changed', function () {
        //  alert(map.zoom);
        if (map.zoom <= 13) {
            var loca = document.getElementsByClassName("rynanMaket");
            loca[0].style.height = "8vw";
            loca[0].style.width = "8vw";
            loca[0].style.marginTop = "-7%";
            loca[0].style.marginLeft = "6%";

            var loca = document.getElementsByClassName("homeUser");
            loca[0].style.height = "8vw";
            loca[0].style.width = "8vw";
            loca[0].style.marginTop = "-7%";
            loca[0].style.marginLeft = "6%";
        }
        else {
            var loca = document.getElementsByClassName("rynanMaket");
            loca[0].style.height = "14vw";
            loca[0].style.width = "14vw";
            loca[0].style.marginTop = "-9%";
            loca[0].style.marginLeft = "5%";

            var loca = document.getElementsByClassName("homeUser");
            loca[0].style.height = "14vw";
            loca[0].style.width = "14vw";
            loca[0].style.marginTop = "-9%";
            loca[0].style.marginLeft = "5%";
        }
    });
    new TxtOverlay(latlng, "<div class='iconrynan'></div>", "rynanMaket", map);
    var geocoder = new google.maps.Geocoder();
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    var lineSymbol = {
        path: 'M 0,-1 0,1',
        strokeColor: '#f7c911',
        fillColor: '#f7c911',
        fillOpacity: 1,
        strokeOpacity: 1,
        scale: 2
    };
    var line = new google.maps.Polyline({
        strokeOpacity: 0,
        icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '10px'
        }],
        map: map
    });

    directionsDisplay.setOptions({ suppressMarkers: true, polylineOptions: line });
    geocodeAddress(geocoder, Data.ShipLocation.Address, map);
    calculateAndDisplayRoute(directionsService, latlng, Data.ShipLocation.Address, directionsDisplay, map);
    SettingMQTTGoogleMap();
    callback(map);
}
// Truyen address trả về long lat
function geocodeAddress(geocoder, address, resultsMap) {
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === 'OK') {
            new TxtOverlay(results[0].geometry.location, "<div class='iconhomemap'></div>", "homeUser", resultsMap);
        }
    });
}
function getCoordinates(result) {
    var currentRouteArray = result.routes[0];
    var currentRoute = currentRouteArray.overview_path;
    var path = [];
    for (var x = 0; x < currentRoute.length; x++) {
        path.push({ lat: currentRoute[x].lat(), lng: currentRoute[x].lng() });
    }
    return path;
}
function calculateAndDisplayRoute(directionsService, addressfrom, addressto, directionsDisplay, map) {
    directionsService.route({
        origin: addressfrom,
        destination: addressto,
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {

            directionsDisplay.setDirections(response);
            // line.setMap(map);
        } else {
            // window.alert('Directions request failed due to ' + status);
            ShowAlert(LanguageEcom.CANNOT_FOUND_ADDRESS);
        }
    });
}

// Setting mqtt cho googlemap
function SettingMQTTGoogleMap() {
    // if(client==null)
    // {
    // client = new Paho.MQTT.Client("115.78.182.244", Number(1885), device.uuid);
    // client.onMessageArrived = onMessageArrived;
    // client.onConnectionLost = onConnectionLost;
    // }
    // var options = {
    //     useSSL: false,
    //     userName: "MQTT_Rynan",
    //     password: "Rynan@2020",
    //     onSuccess: onConnect,
    //     onFailure: doFail
    // }
    // if(client.isConnected())
    // client.disconnect();
    // // // connect the client
    // client.connect(options);
}
// called when the client connects
function onConnect() {
    if (sessionStorage.getItem(KeyLocalEcom.SubscribeName) != "")
        client.subscribe(sessionStorage.getItem(KeyLocalEcom.SubscribeName));
    onMessageArrived(null);
}
//var istatus = false;
function onConnectionLost(responseObject) {
    //  istatus = false;
}
function onMessageArrived(message) {
    var amsterdam;
    if (message == null) {
        amsterdam = new google.maps.LatLng(9.984494, 106.344968);
    }
    else {
        amsterdam = new google.maps.LatLng(parseFloat(message.payloadString.split('|')[1]), parseFloat(message.payloadString.split('|')[2]));
    }
    initialize(amsterdam, false);
}
function SetPostChangeDotCarousel(idcarousel) {
    setTimeout(function () {
        if ($("#0"))
            $("#0").addClass("active");
        document.getElementById(idcarousel).addEventListener("postchange", function (event) {
            $("#" + event.lastActiveIndex).removeClass("active");
            $("#" + event.activeIndex).addClass("active");
        }, false);
    }, 400);
}
function loadmoredata(pagename, el) {
    var scope = angular.element(document.getElementById(pagename)).scope();
    if ($(window).height() - 50 <= $(".spinner-loadmore").offset().top) {
        scope.LoadMoreProduct(null);
    }
}
function scrollloaddiscuss(pagename, el) {
    var scope = angular.element(document.getElementById(pagename)).scope();
    if ($("#discuss").offset().top <= window.innerHeight - 30) {
        scope.LoadDataDis();
    }
}
function GetListDiscuss(data, callback) {

    $.ajax({
        url: ipEcommerce + "/CommentProduct/GetListQuestionAndTop5AnswerByProCode",
        type: "GET",
        dataType: "JSON",
        data: { Page: data.Page, PageLimit: data.PageLimit, PageLimitAnswer: data.PageLimitAnswer, PageAnswer: data.PageAnswer, ProCode: data.ProCode },
        timeout: 25000,
        success: function (result) {
            callback(result);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function ShowModalMessageEcommerce(content) {
    $("#modal-mess").prop("innerHTML", content);
    ModalMessageEcommerce.show();
}
function HideModalMessageEcommerce() {
    ModalMessageEcommerce.hide();
}
function AddVoucher(CustomerCode, DealNo, ExpireType, ExpiredDate, Note, CreateBy, callback) {
    var Data = {
        CustomerCode: CustomerCode,
        DealNo: DealNo,
    }
    $.ajax({
        url: ipEcommerce + "/CustomerPromotion/Ins_Mobile",
        type: "POST",
        dataType: "JSON",
        data: { Data: JSON.stringify(Data) },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
app.controller("ecommercenotificationsctrl", function ($scope) {
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.ListNotification = [];
    $scope.Page = 1;
    $scope.PageLimit = 20;
    GetListNotification_RAP(RAPInfo.CustomerCode, AppCode, $scope.Page, $scope.Pagelimit, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.ListNotification = result.data;
                SetDigest($scope);
            } else {
                $scope.ListNotification = null;
                SetDigest($scope);
            }
        } else {
            $scope.ListNotification = null;
            SetDigest($scope);
        }
    });

    $scope.ShowNotification = function (item) {
        PushToPage("ecommerce/detailnotification.html", { id: item._id });
    }
    $scope.Back = function () {
        PopPage();
    }
});

app.controller("DetailEcommerceNotificationCtrl", function ($scope) {
    var id = GetParamsPage().id;
    var IsPush = GetParamsPage().IsPush;
    $scope.Data = null;
    $scope.LanguageEcom = LanguageEcom;
    SetDigest($scope);
    GetDetailEcommerceNotification(id, function (result) {
        if (result != null) {
            if (result.success == true) {
                $scope.Data = result.data;
                SetDigest($scope);
            }
        }
    });

    DeleteNewNotification(id, RAPInfo.CustomerCode, function (result) { });

    $scope.Back = function () {
        if (IsPush == 1) {
            ResetToPage("html/main.html");
        } else {
            PopPage();
        }

    }
});
function GetListNotification_RAP(CustomerCode, AppCode, Page, PageLimit, callback) {
    $.ajax({
        url: ipEcommerce + "/Notification/GetListNotificationByCusCode",
        type: "GET",
        dataType: "JSON",
        data: {
            CustomerCode: CustomerCode,
            AppCode: AppCode,
            Page: Page,
            PageLimit: PageLimit
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetDetailEcommerceNotification(Id, callback) {
    $.ajax({
        url: ipEcommerce + "/Notification/GetByIdNotifications",
        type: "GET",
        dataType: "JSON",
        data: {
            IdNotifications: Id
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function DeleteNewNotification(Id, CustomerCode, callback) {
    $.ajax({
        url: ipEcommerce + "/Notification/DeleteNewNotification",
        type: "POST",
        dataType: "JSON",
        data: {
            IdNotifications: Id,
            CustomerCode: CustomerCode
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function SynchronizeDeviceId(UserName, AppCode, callback) {
    cordova.getAppVersion.getVersionNumber(function (version) {
        var DeviceId = {
            DeviceId: localStorage.getItem(AppCode + "DeviceID"),
            OS: device.platform,
            UUID: device.uuid,
            AppCode: "RAP",
            VersionApp: version
        }
        $.ajax({
            url: ipAuthenEcommerce + "/Customer/SynchronizeDeviceIdToEcom",
            type: "POST",
            dataType: "JSON",
            // contentType: 'application/x-www-form-urlencoded',
            data: {
                UserName: UserName,
                DeviceId: JSON.stringify(DeviceId),
                AppCode: AppCode
            },
            timeout: 15000,
            success: function (data) {
                callback(data);
            }, error: function (xhr) {
                callback(null);
            }
        });
    });
}


function GetListNewNotification(CustomerCode, IsCount, callback) { // 0: lấy dữ liệu
    $.ajax({
        url: ipAuthenEcommerce + "/Notification/GetNewNotificationsByCustomerCode",
        type: "POST",
        dataType: "JSON",
        data: {
            CustomerCode: CustomerCode,
            IsCount: IsCount
        },
        timeout: 15000,
        success: function (data) {
            callback(data);
        }, error: function (xhr) {
            callback(null);
        }
    });
}
function GetRapInfo(callback) {
    var rapcus = Profile.ListApp.filter(function (n) {
        if (n.AppCode == "RAP")
            return n;
    });
    if (rapcus.length > 0) {
        $.ajax({
            url: ipEcommerce + "/Customer/GetByCustomer",
            type: "GET",
            dataType: "JSON",
            data: {
                CustomerCode: rapcus[0].AccountApp,
            },
            timeout: 25000,
            success: function (data) {
                RAPInfo = data.data;
                callback(data.success);
            }, error: function (xhr) {
                callback(null);
            }
        });
    }
    else callback(false);
}
// RegisShop
app.controller('RegisShopCtrl', function ($scope) {
    var modelshop = {
        ContactName: RAPInfo.CustomerName,
        ShoftIntroduce: "",
        BrandName: "",
        Avatar: "",
        Address: "",
        CoverAvatar: "",
        Email: "",
        PhoneNumber: "",
        Gender: "",
        Birthday: "",
        ItemCount: "",
        ItemCategory: "",
        UserName: RAPInfo.UserName,//.CustomerCode,
        CustomerCode: RAPInfo.CustomerCode,
        Password: "",
        Status: 1,
        CreateBy: "",
    }
    var isEdit = GetParamsPage().IsEdit;
    if (isEdit) {
        modelshop = RAPInfo.SellerChannel[0];
    }
    $scope.Config =
        {
            FolderParent: "Shop",
            FolderChild: "Avatar",
            ImageSample: "imgCanvasShop",
            ImageSet: "avatar-shop"
        }
    $scope.LanguageEcom = LanguageEcom;
    $scope.ipImageEcommerce = ipImageEcommerce;
    $scope.Data = modelshop;
    $scope.Back = function () {
        PopPage();
    }
    $scope.Save = function () {
        CheckValidData($scope.Data, function (rel) {
            if (rel) {
                if (isEdit) {
                    UpdateSellerChanel($scope.Data,function(rel2)
                {
                    if (rel) {
                        ShowAlert(LanguageEcom.UPDATE_SHOP_COMPLETED, LanguageEcom.INFO, function () {
                            PopPage();
                        });
                    }
                });
                }
                else {
                    RegisChannel($scope.Data, function (rel) {
                        if (rel) {
                            ShowAlert("Yêu cầu mở gian hàng của bạn đã được khởi tạo. Chúng tôi sẽ xem xét và mở tính năng trong vòng 24h", LanguageEcom.INFO, function () {
                                ResetToEcommerce();
                            });
                        }
                    });
                }
            }
        });
    }
    function CheckValidData(data, callback) {
        if (data != null) {
            var status = true;
            if (data.BrandName == "" || data.BrandName == null) {
                status = false;
            }
            else if (data.ContactName == "" || data.ContactName == null)
                status = false;
            else if (ValidateEmail(data.Email) == false) {
                status = false;
                AlertError("EMAIL_NOT_VALID", function () {
                })
            } else if (ValidatePhoneNumber(data.PhoneNumber) == false) {
                status = false;
                AlertError("PHONE_NUMBER_NOT_VALID", function () {
                });
            }
            // else if (data.ShoftIntroduce == "" || data.ShoftIntroduce == null)
            //     status = false;
            // else if (data.Gender == "" || data.Gender == null)
            //     status = false;
            callback(status);
        }
        else callback(false);
    }
    $scope.SetAvatar = function (index) {
        var options = {
            title: Language.CHOOSE_IMAGE_2,
            buttonLabels: [Language.CAPTURE_IMAGE, Language.CHOOSE_IMAGE],
            addCancelButtonWithLabel: Language.CANCEL,
            androidEnableCancelButton: true,
            winphoneEnableCancelButton: true
        };
        $scope.Config.Index = index;
        if (index == 1) {
            $scope.Config.ImageSet = "avatar-shop";
            $scope.Config.TargetWidth = 600;
            $scope.Config.TargetHeight = 600;
        }
        else {
            $scope.Config.ImageSet = "background-shop";
            $scope.Config.TargetWidth = 800;
            $scope.Config.TargetHeight = 400;
        }
        SetDigest($scope);
        window.plugins.actionsheet.show(options, function (index) {

            if (index == 1) {
                // Take picture using device camera and retrieve image as base64-encoded string
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
            else if (index == 2) {
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
    function onPhotoDataSuccessAvatar(imgData, folder, folderchild) {
        var dataUpload = {
            username: Profile.UserName,
            base64img: imgData,
            parentFol: folder,
            childFol: folderchild,
            size: '300',
        }
        UploadAvatar(dataUpload, function (rel) {
            $scope.Data.ListImage.push("/" + rel);
            SetDigest($scope);
        });
    }
    function onFail(ev) {
        // alert(JSON.stringify(ev));

    }
    function onPhotoURISuccessAvatar(imgData) {
        if ($scope.Config.Index == 1) {
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
                            username: Profile.UserName,
                            base64img: encodedBase,
                            parentFol: $scope.Config.FolderParent,
                            childFol: $scope.Config.FolderChild,
                            size: '300',
                        }
                        UploadAvatar(dataUpload, function (rel) {
                            if ($scope.Config.Index == 1)
                                $scope.Data.Avatar = "/" + rel;
                            else $scope.Data.CoverAvatar = "/" + rel;
                            SetDigest($scope);
                        });
                    };
                    document.getElementById($scope.Config.ImageSet).src = newPath;
                    img.src = newPath;
                })
                .catch(function fail(err) {

                });
        }
        else {
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
                    username: Profile.UserName,
                    base64img: encodedBase,
                    parentFol: $scope.Config.FolderParent,
                    childFol: $scope.Config.FolderChild,
                    size: '300',
                }
                UploadAvatar(dataUpload, function (rel) {
                    if ($scope.Config.Index == 1)
                        $scope.Data.Avatar = "/" + rel;
                    else $scope.Data.CoverAvatar = "/" + rel;
                    SetDigest($scope);
                });
            };
            document.getElementById($scope.Config.ImageSet).src = imgData;// newPath;
            img.src = imgData;// newPath;
        }
    }
    function RegisChannel(data, callback) {
        $.ajax({
            url: ipEcommerce + "/SellerChannel/Ins", type: "POST", dataType: "JSON", data: { Data: JSON.stringify(data) },
            timeout: 4500,
            success: function (data) {
                if (data.success == true) {
                    callback(true);
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
    function UpdateSellerChanel(data, callback) {
        $.ajax({
            url: ipEcommerce + "/SellerChannel/UpdateByAdmin", type: "POST", dataType: "JSON", data: { Data: JSON.stringify(data) },
            timeout: 4500,
            success: function (data) {
                if (data.success == true) {
                    callback(true);
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
    SetDigest($scope);
});
function IsEmptyString(str) {
    if (str == undefined || str == null || str == "")
        return true;
    else return false;
}
// Hàm convert từ Property List sang dạng Array Object JSON
function ConvertPropertyToArray(property) {
    if (!IsEmptyString(property) && Array.isArray(property)) {
        var newArray = [];
        property.forEach(function (element) {
            newArray.push({
                Name: LanguageEcom[Object.keys(element)],
                Value: Object.values(element)
            })
        }, this);
        return newArray;
    }
    else return null;
}