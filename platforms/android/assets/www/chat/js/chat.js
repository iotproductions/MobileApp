var IpChat = "http://apidemo.diamond.local:3132";
var IpSocket = "http://apidemo.diamond.local:3131";
var socketChat=io(IpSocket);
// var IpChat ="http://192.168.50.60:3132";
// var IpSocket ="http://192.168.50.60:3131";
var countRequestFriend = 0;
document.addEventListener("pause", function () {
    setTimeout(function () {
        socketChat.disconnect();
    }, 100);
}, false);
app.directive('whenScrolled', ['$timeout', function($timeout) {
    return function(scope, elm, attr) {
        var raw = elm[0];
        var str=raw.scrollTop;
        elm.bind('scroll', function() {
            // $("#loader").css({"display":"block"});
            if (raw.scrollTop <= 10) {
               var sh = raw.scrollHeight
                scope.$apply(attr.whenScrolled).then(function() {
                    $timeout(function() {
                        // $("#loader").css({"display":"none"});
                        // raw.scrollTop = 100;
                        raw.scrollTop =sh-str;// window.innerHeight-20;
                    })
                });
            }
        });
    };}])
document.addEventListener("resume", function () {
    if (socketChat != null && typeof socketChat != "undefined") {
        socketChat.connect();
    } else {
        socketChat = io.connect(IpSocket);
    }

    var d = new Date();
    var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

    socketChat.emit('adduser', { Name: UserInfo.data.AccountChat, FullName: UserInfo.data.SWMPInfo.NameReg, Avatar: Profile.Avatar, DateOnline: datestring, Topic: UserInfo.data.AccountChat });
}, false);

app.controller('chatctrl', function ($scope, $rootScope) {
    $scope.NumberNewRequest = 0;
    $rootScope.NumberNewMess = 0;
    $scope.LoadTabbar = function (page) {
        document.querySelector('#chat-tab-bar').loadPage(page); // Load lại page khi chuyển tab
        if (page == "chat/requestfriend.html") { // Clear số request mới khi click xem
            ClearNumberNewRequestFriend(UserInfo.data.AccountChat, function (result) {
                if (result != null) {
                    $scope.NumberNewRequest = 0;
                    SetDigest($scope);
                }
            })
        }
    };
    GetNumberNewRequestFriend(UserInfo.data.AccountChat, function (result) {
        $scope.NumberNewRequest = result;
        SetDigest($scope);
    });

    GetNewRequestFriendRealTime(UserInfo.data.AccountChat, function (result) {
        setTimeout(function () {
            $scope.NumberNewRequest++;
            SetDigest($scope);
        }, 200);
    });

    GetNewMessRealTime(UserInfo.data.AccountChat, function (result) {
        setTimeout(function(){
            // if (document.querySelector('#navigator').topPage.pushedOptions.page != "chat/detailchat.html"); {
                $rootScope.NumberNewMess++;
                SetDigest($rootScope);
            // }
        },200);
        
    });

    GetNumberNewMess(UserInfo.data.AccountChat, function (result) {
        $rootScope.NumberNewMess = result;
        SetDigest($rootScope);
    })
});
app.controller("requestfriendctrl", function ($scope) {
    $scope.Language = Language;
    $scope.ipImage = ipImage;
    $scope.ListRequest = [];
    GetListRequestFriend(UserInfo.data.AccountChat, function (result) {
        if (result != null) {
            $scope.ListRequest = result;
            SetDigest($scope);
        }
    });

    $scope.Accept = function (AccountSend, $event) {
        var target=$event.currentTarget;
        AcceptFriend(AccountSend, UserInfo.data.AccountChat, function (result) {
            if (result == true) {
                // setTimeout(function () {
                $(target.parentElement.parentElement).fadeOut(200, function () {
                    this.remove();
                });

                // }, 300);
            }
        });
    }

    $scope.Back = function () {
        PopPage();
    }
})
app.controller("chatlogctrl", function ($scope, $rootScope) {
    // $scope.Language = Language;
     $scope.LanguageChat = LanguageChat;
    $scope.ipImage = ipImage;
    $scope.ListLog = [];
    $scope.Account = UserInfo.data.AccountChat;
    $scope.$on("GetlogMess",function(){
        GetlogMess($scope.Account,1,1000,function(result)
        {
            if (result != null) {
            for (var i = 0; i < result.length; i++) {
                result[i].TimeSince = timeSince(result[i].LastSendDate);
            }
            $scope.ListLog = result;
            SetDigest($scope);
        }
        });
    });
    GetlogMess($scope.Account, 1, 1000, function (result) {
        if (result != null) {
            for (var i = 0; i < result.length; i++) {
                result[i].TimeSince = timeSince(result[i].LastSendDate);
            }
            $scope.ListLog = result;
            SetDigest($scope);
        }
    });

    $scope.GoToChat = function (Name, Avatar, FullName, $event) {
        ClearNumberNewMessByFriend(Name, UserInfo.data.AccountChat, function (result) {
            var totalMess = parseInt($("#number-new-mess").text()) - parseInt($($event.currentTarget).find(".chat-log-name > div:nth-child(2) > span:nth-child(2)").text());
            $rootScope.NumberNewMess = totalMess;
            $($event.currentTarget).find(".chat-log-name > div:nth-child(2) > span:nth-child(2)").remove();
            SetDigest($rootScope);

        });
        PushToPage('chat/detailchat.html', { UserName: Name, Avatar: Avatar, FullName: FullName });
    }

    $scope.Back = function () {
        PopPage();
    }
})
app.controller('listfriendctrl', function ($scope, $timeout) {
    $scope.LanguageChat = LanguageChat;

    $scope.ipImage = ipImage;
    $scope.Account = UserInfo.data.AccountChat;
    $scope.ListFriend = [];
    $.ajax({
        url: IpChat + "/Friends/GetListFriend",
        type: "GET",
        data: { Account: $scope.Account },
        dataType: "JSON",
        async: false,
        timeout: 45000,
        success: function (data) {
            if (data.data != null) {
                // for (var i = 0; i < data.data.length; i++) {
                //     if (data.data[i].Avatar.search('http://image.rynanmobile.com/') > -1) {
                //         data.data[i].Avatar = data.data[i].Avatar.substring(28, data.data[i].Avatar.length);
                //     }
                // }
                $scope.ListFriend = data.data;
                SetDigest($scope);
            }

        }, error: function (xhr) {
        }
    });
    GetOnlineCustomer(function (result) {
        $timeout(function () {
            for (var i = 0; i < $scope.ListFriend.length; i++) {
                if ($scope.ListFriend[i].Account == result.Account) {
                    $scope.ListFriend[i].Online = 1;
                    var element = "#users > li:nth-child(" + (i + 1) + ") > .user-online-avatar > span";
                    $(element).addClass("online");
                }
            }
            SetDigest($scope);
        }, 3000)
    });

    GetOflineCustomer(function (result) {
        $timeout(function () {
            for (var i = 0; i < $scope.ListFriend.length; i++) {
                if ($scope.ListFriend[i].Account == result.Account) {
                    $scope.ListFriend[i].Online = 0;
                    var element = "#users > li:nth-child(" + (i + 1) + ") > .user-online-avatar > span";
                    $(element).removeClass("online");
                }
            }
            SetDigest($scope);
        }, 3000)
    });

    $scope.GoToChat = function (Name, Avatar, FullName) {
        PushToPage('chat/detailchat.html', { UserName: Name, Avatar: Avatar, FullName: FullName });
    }

    $scope.DeleteFriend = function (AccountDelete, $event) {
        var target=$event.currentTarget;
        DeleteFriend(UserInfo.data.AccountChat, AccountDelete, function (result) {
            $(target.parentElement).fadeOut(200, function () {
                this.remove();
            })
        })
    }
    $scope.Back = function () {
        PopPage();
    }
})
app.controller('detailchatctrl', function ($scope, $timeout, $q) {
    // $scope.Language = Language;
     $scope.LanguageChat = LanguageChat;
    $scope.ipImage = ipImage;
    $scope.ChatMes = "";
    $scope.FromUserName = UserInfo.data.AccountChat;
    $scope.ToUserName = GetParamsPage().UserName;
    $scope.ToFullName = GetParamsPage().FullName;
    $scope.ToAvatar = GetParamsPage().Avatar;
    $scope.Avatar = Profile.Avatar;
    $scope.Page = 1;
    SetDigest($scope);

    $.ajax({
        url: IpChat + "/Chats/GetDetailHistoryChat",
        type: "GET",
        data: { Page: $scope.Page, PageLimit: 25, AccountSend: $scope.FromUserName, AccountTo: $scope.ToUserName },
        dataType: "JSON",
        async: false,
        timeout: 45000,
        success: function (data) {
            $scope.ListChat = data.data;
            SetDigest($scope);
            $timeout(function () {
                $("#messages").scrollTop(document.getElementById("messages").scrollHeight);
            }, 200);
        }, error: function (xhr) {
            // alert(JSON.stringify(xhr));          
        }
    });

    if ($scope.FromUserName.toString().valueOf() > $scope.ToUserName.toString().valueOf()) {
        var topic = $scope.FromUserName + $scope.ToUserName;
    } else {
        var topic = $scope.ToUserName + $scope.FromUserName;
    }

    if (socketChat._callbacks["$"+topic] == undefined || socketChat._callbacks["$"+topic].length < 1) {
        socketChat.on(topic, function (username, data) {

            setTimeout(function () {

                if (data.From != $scope.FromUserName) {
                    var mess = '<li>' +
                        '<div>' +
                        '<div class="left-mess-avatar">' +
                        '<img src="' + $scope.ipImage + $scope.ToAvatar + '" />' +
                        '</div>' +
                        '<div class="left-mess-content">' +
                        '<div>' + data.Content + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>';
                } else {
                    var mess = '<li>' +
                        '<div>' +
                        '<div class="right-mess-avatar">' +
                        '<img src="' + $scope.ipImage + $scope.Avatar + '" />' +
                        '</div>' +
                        '<div class="right-mess-content">' +
                        '<div>' + data.Content + '</div>' +
                        '</div>' +
                        '</div>' +
                        '</li>';
                }


                $("#messages").append(mess);
                SetDigest($scope);
                // if (document.querySelector('#chat-tab-bar').getActiveTabIndex() == 0) { // 0 - tab chatlog.html
                //     document.querySelector('#chat-tab-bar').loadPage("chat/chatlog.html"); // Load lại page chatlog.html khi có tin nhắn mới
                // }

                $timeout(function () {
                    $("#messages").scrollTop(document.getElementById("messages").scrollHeight);
                },250);
            }, 0)

        })
    }

    SetDigest($scope);
    $scope.loadMore = function () {
        var deferred = $q.defer();
        $.ajax({
            url: IpChat + "/Chats/GetDetailHistoryChat",
            type: "GET",
            data: { Page: ++$scope.Page, PageLimit: 25, AccountSend: $scope.FromUserName, AccountTo: $scope.ToUserName },
            dataType: "JSON",
            async: false,
            timeout: 45000,
            success: function (data) {
                if (data.data.length > 0) {
                    setTimeout(function () {
                        for (var i = 0; i < data.data.length; i++) {
                            $scope.ListChat.unshift({
                                Content: data.data[i].Content,
                                SendDate: data.data[i].SendDate,
                                AccountSend: data.data[i].AccountSend,
                            });
                        }

                        SetDigest($scope);
                        // $("#loader").removeClass("active");
                        deferred.resolve();
                    }, 0);
                } else {
                    // $("#loader").remove();
                }

            }, error: function (xhr) {
                // alert(JSON.stringify(xhr));          
            }
        });

        return deferred.promise;
    }
    $scope.SendMes = function ($event) {
        if ($event == null || $event == undefined || $event.keyCode == 13) {
            if ($scope.ChatMes != "") {
                socketChat.emit('sendchat', { From: UserInfo.data.AccountChat, To: $scope.ToUserName, Content: $scope.ChatMes, Topic: topic });
            }

            $scope.ChatMes = "";
            SetDigest($scope);
        }
    }

    $scope.Back = function () {
        PopPage();
    }
})

app.controller("findfriendctrl", function ($scope) {
    // $scope.Language = Language;
    $scope.LanguageChat=LanguageChat;
    $scope.ipImage = ipImage;
    $scope.keysearch=null;
    $scope.IsShow=true;
    $scope.FromUserName = UserInfo.data.AccountChat;
    $scope.ListFriendSearch = [];
    $.ajax({
                url: IpChat + "/Friends/SearchAccount",
                type: "GET",
                data: { KeySearch: $scope.keysearch, Account: $scope.FromUserName },
                dataType: "JSON",
                timeout: 45000,
                success: function (data) 
                {
                   setTimeout(function() 
                   {
                    $scope.IsShow=false;
                    $scope.ListFriendSearch=data.data.filter(function(n)
                    {
                        return n.Status!==3;
                        });
                    SetDigest($scope);
                   }, 500); 
                }, error: function (xhr) {

                }
            });

    $scope.QuickSearch = function () {
        // if ($scope.keysearch == "") {
        //     $scope.ListFriendSearch = [];
        //     SetDigest($scope);
        // } else {
            $.ajax({
                url: IpChat + "/Friends/SearchAccount",
                type: "GET",
                data: { KeySearch: $scope.keysearch, Account: $scope.FromUserName },
                dataType: "JSON",
                timeout: 45000,
                success: function (data) {
                    $scope.ListFriendSearch=data.data.filter(function(n)
                    {
                        return n.Status!==3;
                        });
                    SetDigest($scope);
                }, error: function (xhr) {
                }
            });
        // }
    }
    $scope.Add = function (AccountTo, Index) {
        SendRequest($scope.FromUserName, AccountTo, function (result) {
            if (result == true) {
                socketChat.emit('addfriend', { AccountSend: $scope.FromUserName, AccountTo: AccountTo }); // Add thành công, thông báo cho user dc gửi lời mời 
                setTimeout(function () {
                    $("#li-find-"+Index).addClass("requested");
                    $scope.ListFriendSearch[Index].Status = 1;
                    SetDigest($scope);
                }, 100);
            }

        })
    }
    $scope.Accept = function (AccountSend, Index) {
        AcceptFriend(AccountSend, $scope.FromUserName, function (result) {
            if (result == true) {
                setTimeout(function () {
                    $scope.ListFriendSearch[Index].Status = 3;
                    SetDigest($scope);
                }, 100)
            }
        })
    }
    $scope.Back = function () {
        PopPage();
    }
})

function CheckAccountChat(UserName, AccountApp, AppCode, FullName, Avatar, DeviceID, callback) {
    if (Avatar.search('http://image.rynanmobile.com/') > -1) {
        Avatar = Avatar.substring(28, Avatar.length);
    }
    $.ajax({
        url: IpChat + "/AccountChat/CheckAccount",
        type: "POST",
        data: { Data: JSON.stringify({ UserName: UserName, AccountApp: AccountApp, AppCode: AppCode, FullName: FullName, Avatar: Avatar, DeviceID: JSON.stringify(DeviceID) }) },
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            if (data.success == true) {
                callback(data.data);
            } else {
                callback(null);
            }
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetOnlineCustomer(callback) {// update friend online
    if (socketChat._callbacks["getonline"] == undefined || socketChat._callbacks["getonline"].length < 1) {
        socketChat.on("getonline", function (data) {
            callback(data);

        });
    }
}

function GetOflineCustomer(callback) { // update friend offline
    if (socketChat._callbacks["getofline"] == undefined || socketChat._callbacks["getofline"].length < 1) {
        socketChat.on("getofline", function (data) {
            callback(data);

        });
    }
}

function GetNewRequestFriendRealTime(UserName, callback) { // Nhận yêu cầu kb realtime
    if (socketChat._callbacks["addfriend_" + UserName] == undefined || socketChat._callbacks["addfriend_" + UserName].length < 1) {
        socketChat.on("addfriend_" + UserName, function (data) {
            callback(data);
        });
    }
}

function GetNewMessRealTime(UserName, callback) { // Nhận tin nhắn mới realtime
    if (socketChat._callbacks["pushmessages_" + UserName] == undefined || socketChat._callbacks["pushmessages_" + UserName].length < 1) {
        socketChat.on("pushmessages_" + UserName, function (data) {
            callback(data);
        });
    }
}
function GetlogMess(Account, Page, PageLimit, callback) { // Lịch sử chat
    $.ajax({
        url: IpChat + "/Chats/GetListHistoryByAccount",
        type: "GET",
        data: { Account: Account, Page: Page, PageLimit: PageLimit },
        dataType: "JSON",
        async: false,
        timeout: 45000,
        success: function (data) {
            if (data.success == true) {
                callback(data.data);
            } else {
                callback(null);
            }
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function SendRequest(AccountSend, AccountTo, callback) { // Gửi yêu cầu kb
    $.ajax({
        url: IpChat + "/FriendInvitation/Ins",
        type: "POST",
        data: { Data: JSON.stringify({ AccountSend: AccountSend, AccountTo: AccountTo }) },
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            callback(data.success);
        }, error: function (xhr) {
        }
    });
}

function AcceptFriend(AccountSend, AccountTo, callback) { // Đồng ý kb
    $.ajax({
        url: IpChat + "/FriendInvitation/AgreedAddFriend",
        type: "POST",
        data: { Data: JSON.stringify({ AccountSend: AccountSend, AccountTo: AccountTo }) },
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            callback(data.success);
        }, error: function (xhr) {
        }
    });
}

function GetListRequestFriend(Account, callback) { // DS yêu cầu kb
    $.ajax({
        url: IpChat + "/FriendInvitation/GetListByAccountTo",
        type: "GET",
        data: { Account: Account },
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            if (data.success == true && data.data.length > 0) {
                callback(data.data)
            } else {
                callback(null)
            }
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetNumberNewRequestFriend(Account, callback) { // Số yêu cầu kb mới
    $.ajax({
        url: IpChat + "/FriendInvitation/CountUnReadByAccountTo",
        type: "GET",
        data: { AccountTo: Account },
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            if (data.success == true) {
                callback(data.CountData);
            } else {
                callback(null)
            }
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function ClearNumberNewRequestFriend(Account, callback) { // Xoá số yêu cầu kb mới khi đã xem
    $.ajax({
        url: IpChat + "/FriendInvitation/UpdateStatusByAccountTo",
        type: "GET",
        data: { AccountTo: Account },
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            if (data.success == true) {
                callback(data.success);
            } else {
                callback(null)
            }
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function DeleteFriend(AccountSend, AccountTo, callback) { // Xoá số yêu cầu kb mới khi đã xem
    $.ajax({
        url: IpChat + "/Friends/CancelFriend",
        type: "POST",
        data: { Data: JSON.stringify({ AccountSend: AccountSend, AccountTo: AccountTo }) },
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            if (data.success == true) {
                callback(data.success);
            } else {
                callback(null);
            }
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function GetNumberNewMess(Account, callback) { // Lấy số tn mới
    $.ajax({
        url: IpChat + "/Chats/CountMessUnReadByAccount",
        type: "GET",
        data: { Account: Account },
        dataType: "JSON",
        timeout: 45000,
        success: function (data) {
            if (data.success == true) {
                callback(data.CountData);
            } else {
                callback(null);
            }
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function ClearNumberNewMessByFriend(AccountSend, AccountTo, callback) { // Xoá số tn mới
    $.ajax({
        url: IpChat + "/Chats/UpdateCountUnRead",
        type: "POST",
        data: { AccountSend: AccountSend, AccountTo: AccountTo },
        dataType: "JSON",
        
        timeout: 45000,
        success: function (data) {
            if (data.success == true) {
                callback(data.success);
            } else {
                callback(null);
            }
        }, error: function (xhr) {
            callback(null);
        }
    });
}

function timeSince(date) {
    date = new Date(date);
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval;

    if (seconds < 60) {
        return Math.floor(seconds) + " giây";
    }

    if (seconds < 3600) {
        interval = Math.floor(seconds / 60);
        return interval + " phút";
    }

    if (seconds < 86400) {
        interval = Math.floor(seconds / 3600);
        return interval + " giờ";
    }

    if (seconds < 2592000) {
        interval = Math.floor(seconds / 86400);
        return interval + " ngày";
    }

    if (seconds < 2592000) {
        interval = Math.floor(seconds / 86400);
        return interval + " ngày";
    }

    if (seconds < 31536000) {
        interval = Math.floor(seconds / 2592000);
        return interval + " tháng";
    }

    if (seconds > 31536000) {
        interval = Math.floor(seconds / 31536000);
        return interval + " năm";
    }
}
