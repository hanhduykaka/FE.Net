$(".sl_thuong_tru_tinh_index").change
((e) => {
    if (!isFirstLoad) {
        $(".sl_thuong_tru_huyen_index").val($("#sl_thuong_tru_huyen_index option:first-child").val());
        var element = $(e.target);
        var tinhId = e.target.value;
        loadThuongTruHuyen(tinhId);
        window.LoadSelect2($(".sl_thuong_tru_phuong_index"), [], null, true);
    }
});
function loadTinhThanh(tinhThanhID, hienNayTinhThanhID) {
    window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/GetDanhMucTinhThanh",
               window.moduleId,
               window.tabId,
               $("input[name='__RequestVerificationToken']").val(),
               null,
               "application/json; charset=utf-8",
               "json",
               true)
           .then
           (function (data) {
               if (data) {
                   window.LoadSelect2($(".sl_thuong_tru_tinh_index"), data, tinhThanhID ? tinhThanhID : null, true);
                   window.LoadSelect2($(".sl_hien_nay_tinh_index"), data, hienNayTinhThanhID ? hienNayTinhThanhID : null, true);
               }
           });
}
function loadThuongTruHuyen(tinhId, huyenId) {
    if (!isNaN(tinhId * 1)) {
        var dataRequest = JSON.stringify({ tinhId: tinhId });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/MotCua/GetQuanHuyenByTinhIdJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {

                if (data && data != '') {
                    window.LoadSelect2($(".sl_thuong_tru_huyen_index"), data, huyenId ? huyenId : null, true);
                }
                else window.LoadSelect2($(".sl_thuong_tru_huyen_index"), [], null, true);
            });
    } else {
        window.LoadSelect2($(".sl_thuong_tru_huyen_index"), [], null, true);
    }
}
$(".sl_thuong_tru_huyen_index").change
((e) => {
    if (!isFirstLoad) {
        $(".sl_thuong_tru_phuong_index").val($("#sl_thuong_tru_phuong_index option:first-child").val());
        var element = $(e.target);
        var quanId = e.target.value;
        loadThuongTruPhuong(quanId);
    }
});
function loadThuongTruPhuong(quanId, phuongId) {
    if (!isNaN(quanId * 1)) {
        var dataRequest = JSON.stringify({ quanId: quanId });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/MotCua/GetPhuongXaByQuanIdJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {

                if (data && data != '') {
                    window.LoadSelect2($(".sl_thuong_tru_phuong_index"), data, phuongId ? phuongId : null, true);
                }
                else window.LoadSelect2($(".sl_thuong_tru_phuong_index"), [], null, true);
            });
    } else
        window.LoadSelect2($(".sl_thuong_tru_phuong_index"), [], null, true);
}
$(".sl_hien_nay_tinh_index").change
((e) => {
    if (!isFirstLoad) {
        $(".sl_hien_nay_huyen_index").val($("#sl_hien_nay_huyen_index option:first-child").val());
        var element = $(e.target);
        var tinhId = e.target.value;
        loadHienNayHuyen(tinhId);
        window.LoadSelect2($(".sl_hien_nay_phuong_index"), [], null, true);
    }

});
function loadHienNayHuyen(tinhId, huyenId) {
    if (!isNaN(tinhId * 1)) {
        var dataRequest = JSON.stringify({ tinhId: tinhId });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/MotCua/GetQuanHuyenByTinhIdJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {

                if (data && data != '') {
                    window.LoadSelect2($(".sl_hien_nay_huyen_index"), data, huyenId ? huyenId : null, true);
                }
                else window.LoadSelect2($(".sl_hien_nay_huyen_index"), [], null, true);
            });
    } else {
        window.LoadSelect2($(".sl_hien_nay_huyen_index"), [], null, true);
    }
}
$(".sl_hien_nay_huyen_index").change
((e) => {
    if (!isFirstLoad) {
        $(".sl_hien_nay_phuong_index").val($("#sl_hien_nay_phuong_index option:first-child").val());
        var element = $(e.target);
        var quanId = e.target.value;
        loadHienNayPhuong(quanId);
    }
});
function loadHienNayPhuong(quanId, phuongId) {

    if (!isNaN(quanId * 1)) {
        var dataRequest = JSON.stringify({ quanId: quanId });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/MotCua/GetPhuongXaByQuanIdJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {

                if (data) {
                    window.LoadSelect2($(".sl_hien_nay_phuong_index"), data, phuongId ? phuongId : null, true);
                }
            });
    } else
        window.LoadSelect2($(".sl_hien_nay_phuong_index"), [], null, true);
}
$("input[name='NgaySinh']").keypress((key)=> {
    var keycode = (key.which) ? key.which : key.keyCode;
    if (!(keycode == 47 || keycode == 45) && keycode > 31 && (keycode < 48 || keycode > 57)) {
        return false;
    }
    return true;
});
$("input[name='NgaySinh']").on("input",(e) => {
    var ngaySinh = $("input[name='NgaySinh']");
    var valueElement = ngaySinh.val();
    if (valueElement) {
        var validateDinhDang = window.ValidateDinhDangNgaySinh(valueElement);
        if (validateDinhDang.valid === "valid") {
            window.removeValidate(ngaySinh, "border-color-a9", ".color-red");
            var kieuDate = validateDinhDang.kieuDate;
            var stringNgayCap = $(".date-picker-ngay-cap").val();
            var validTuoi = window.ValidateTuoi(valueElement, stringNgayCap, kieuDate);
            if (validTuoi !== "True") {
                window.appendValidate
                (ngaySinh,
                    "border-color-a9",
                    ".color-red",
                    "<label class='color-red'>" + validTuoi + " </label>");
            } else {
                window.removeValidate(ngaySinh, "border-color-a9", ".color-red");
            }
        } else {
            window.appendValidate
            (ngaySinh,
                "border-color-a9",
                ".color-red",
                "<label class='color-red'>Ngày nhập chưa đúng định dạng! </label>");
        }
    } else {
        window.removeValidate(ngaySinh, "border-color-a9", ".color-red");
    }
});