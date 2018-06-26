var YCBS = {};
$(document).ready
(() => {
    $(".adselect").select2();
    window.InitDateTimePicker('.date-picker');
});

function loadNewYeuCauBoSung(hoSoID, trangThaiHienTaiID, trangThaiTiepTheoID, listNguoiNhan, nguoiNhanID) {
    $(".btn_Thuc_Hien_YCBS").prop("disabled", false);
    $(".btn_Thuc_Hien_YCBS").removeClass("sytButtonChuyen").addClass("sytButton");
    $('input[name = "YCBS_NgayYeuCauBS"]').data("DateTimePicker").date(null);
    $('textarea[name="YCBS_YeuCauBS"]').val('');
    LoadNguoiNhanYCBS(listNguoiNhan, nguoiNhanID);
    YCBS = {};
    YCBS.hoSoID = hoSoID;
    YCBS.trangThaiHienTaiID = trangThaiHienTaiID;
    YCBS.trangThaiTiepTheoID = trangThaiTiepTheoID;
    if (YCBS.hoSoID != 0) {
        var requestHoSo = JSON.stringify({ hosoId: YCBS.hoSoID });
        window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/GetHoSoById",
               window.moduleId,
               window.tabId,
               $("input[name='__RequestVerificationToken']").val(),
               requestHoSo,
               "application/json; charset=utf-8",
               "json",
               true)
           .then
           (function (data) {
               if (data) {
                   var result = $.parseJSON(data.Content);
                   $('label[name = "YCBS_SoBienNhan"]').text(result.SoBienNhan);
                   if (result.NgayNhan) {
                       var dateNgayNhan = new Date(result.NgayNhan.match(/\d+/)[0] * 1);
                       $('label[name ="YCBS_NgayNhan"]').text(dateNgayNhan.getDate() + '/' + (dateNgayNhan.getMonth() + 1) + '/' + dateNgayNhan.getFullYear());
                   }
                   $('label[name = "YCBS_HoTenNguoiNop"]').text(result.HoTenNguoiNop);
                   $('label[name = "YCBS_SoGiayTo"]').text(result.SoGiayTo);
                   $('label[name = "YCBS_ThuTuc"]').text(result.TenThuTuc);
               }
           });
    }
}
$(document).on('click', ".btn_Thuc_Hien_YCBS", (e) => {
    if ($(".btn_chuyen").prop("disabled") == true) {
        return;
    }
    $(".btn_chuyen").prop("disabled", true);
    $(".btn_chuyen").removeClass("sytButton").addClass("sytButtonChuyen");
    var check = true;
    if ($(".sl_ycbs_nguoi_nhan_index").val() == '') {
        window.appendValidate
              ($(".sl_ycbs_nguoi_nhan_index"),
                  "border-color-a9",
                  ".color-red",
                  "<label class='color-red'>Vui lòng chọn người nhận</label>");
        check = false;
    }
    else {
        window.removeValidate($(".sl_ycbs_nguoi_nhan_index"), "border-color-a9", ".color-red");
    }
    if (!window.ValidateRequireOnDiv(".div_yeu_cau_bo_sung"))
        check = false;
    if (!check)
        return;
    var objArr = window.GetAllInputOnDiv(".div_yeu_cau_bo_sung");
    var request = JSON.stringify({ listHoSoID: YCBS.hoSoID, trangThaiHienTaiID: YCBS.trangThaiHienTaiID, trangThaiTiepTheoID: YCBS.trangThaiTiepTheoID, nguoiNhanID: objArr["YCBS_NguoiNhan"], ngay: objArr["YCBS_NgayYeuCauBS"], noiDung: objArr["YCBS_YeuCauBS"] });

    window.AjaxDungChung
        ("post",
          "/DesktopModules/MVC/NghiepVu/HoSo/MotCua_HoSoTiepNhan_ChuyenTrangThai",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            request,
            "application/json; charset=utf-8",
            "json",
            true)
        .then
        (function (data) {
            if (data) {
                if (data > 0) {
                    window.alert_success("Chuyển thành công " + data + " hồ sơ!");
                    $("#modal-yeu-cau-bo-sung").modal("toggle");
                    if (typeof (modalOnClosed) === 'function')
                        modalOnClosed();
                    if (typeof (LoadWL) === 'function') {
                        _arrThuTucDaChon = [];
                        var liActive = $("#ul_tab_Ds li.active");
                        LoadWL(liActive.attr("data-href"), false, function () { $(".btn_search").trigger('click'); });
                        window.XuLyDisabledBtnChuyen(false);
                        LoadDSTrangThaiBtnChuyen();

                    }
                }
                else
                    window.alert_error("Chuyển không thành công!");
            }
        });
});

function LoadNguoiNhanYCBS(listNguoiNhan, nguoiNhanID) {
    if (listNguoiNhan) {
        window.LoadSelect2($(".sl_ycbs_nguoi_nhan_index"), listNguoiNhan, nguoiNhanID ? nguoiNhanID : null, false);
    }
}