function DangNhap() {
    var tk = $("input[name='taiKhoan']").val();
    var mk = $("input[name='matKhau']").val();
    if (!tk) {
        alert_info("Vui lòng nhập tài khoản!");
        $("input[name='taiKhoan']").focus();
    }
    else if (!mk) {
        alert_info("Vui lòng nhập mật khẩu!");
        $("input[name='matKhau']").focus();
    } else {
        var dataRequest = JSON.stringify({ UserName: tk, Password: mk });
        window.AjaxDungChung("post", "/DesktopModules/MVC/Home/TrangChu/DangNhap",
                window.moduleId, window.tabId, $("input[name='__RequestVerificationToken']").val()
                , dataRequest, "application/json; charset=utf-8", "json", true)
            .then(function (data) {
                if (data) {
                    console.log(data);
                    if (data.results == 1)
                        window.location.href = "/trang-chu";
                    else {
                        alert_info("Mật khẩu hoặc tài khoản chưa chính xác");
                        $("input[name='taiKhoan']").focus();
                    }
                }
            });
    }
}

$(".btn_Dang_Nhap").click
((e) => {
    DangNhap();
});

$(document).ready
(() => {
    LoadInforUserLogin();
    $("input[name='taiKhoan']").keypress(function (e) {
        if (e.which == 13) {
            $("input[name='matKhau']").focus();
        }
    });
    $("input[name='matKhau']").keypress(function (e) {
        if (e.which == 13) {
            DangNhap();
        }
    });
});

function LoadInforUserLogin() {
    window.AjaxDungChung("post", "/DesktopModules/MVC/Home/TrangChu/LoadUserInfo",
            window.moduleId, window.tabId, $("input[name='__RequestVerificationToken']").val()
            , null, "application/json; charset=utf-8", "json", true)
        .then(function (data) {
            if (data) {
                if (data.results == 1) {
                    window.location.href = "/trang-chu";
                }
            }
        });
}
