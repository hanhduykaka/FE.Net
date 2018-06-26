$(() => {
    $(window).load(() => {
        LoadInforUserLogin();
        LoadMenuUser();
    });

    $("#ThongBao").click(() => {
        $("#div_taikhoan").addClass("hidden");
        $("#div_thongbao").toggleClass("hidden");
    });

    $("#taikhoan").click(() => {
        $("#div_thongbao").addClass("hidden");
        $("#div_taikhoan").toggleClass("hidden");
    });
});

function LoadInforUserLogin() {
    window.AjaxDungChung("post", "/DesktopModules/MVC/Home/TrangChu/LoadUserInfo",
            window.moduleId, window.tabId, $("input[name='__RequestVerificationToken']").val()
            , null, "application/json; charset=utf-8", "json", true)
        .then(function (data) {
            if (data) {
                if (data.results != 1) {
                    window.location.href = "/";
                } else {
                    $("#div_taikhoan .tentaikhoan").text(data.DisplayName);
                }
            }
        });
};

function LoadMenuUser() {
    var curTabId = $("#hdcurTabID").val();
    var curTabIdParent = $("#hdcurTabIDParent").val();
    var dataRquest = JSON.stringify({ tabId: curTabId, tabIdParent: curTabIdParent });
    window.AjaxDungChung("post", "/DesktopModules/MVC/Home/TrangChu/MenuDesklist",
            window.moduleId, window.tabId, $("input[name='__RequestVerificationToken']").val()
            , dataRquest, "application/json; charset=utf-8", "json", true)
        .then(function (data) {
            if (data) {
                $("#syt_Menu .navbar-nav").empty().html(data.listPage);
            }
        });
};