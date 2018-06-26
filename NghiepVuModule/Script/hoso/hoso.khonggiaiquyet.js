var KGQ = {};
$(document).ready
(() => {
    $(".adselect").select2();
    window.InitDateTimePicker('.date-picker');
});

function loadNewKhongGiaiQuyet(hoSoID, trangThaiHienTaiID, trangThaiTiepTheoID, listNguoiNhan, nguoiNhanID) {
    $(".btn_Thuc_Hien_KGQ").prop("disabled", false);
    $(".btn_Thuc_Hien_KGQ").removeClass("sytButtonChuyen").addClass("sytButton");
    $('textarea[name="KGQ_LyDo"]').val('');
    LoadNguoiNhanKGQ(listNguoiNhan, nguoiNhanID);
    KGQ = {};
    KGQ.hoSoID = hoSoID;
    KGQ.trangThaiHienTaiID = trangThaiHienTaiID;
    KGQ.trangThaiTiepTheoID = trangThaiTiepTheoID;
    if (KGQ.hoSoID != 0) {
        var requestHoSo = JSON.stringify({ hosoId: KGQ.hoSoID });
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
                   $('label[name = "KGQ_SoBienNhan"]').text(result.SoBienNhan);
                   if (result.NgayNhan) {
                       var dateNgayNhan = new Date(result.NgayNhan.match(/\d+/)[0] * 1);
                       $('label[name ="KGQ_NgayNhan"]').text(dateNgayNhan.getDate() + '/' + (dateNgayNhan.getMonth() + 1) + '/' + dateNgayNhan.getFullYear());
                   }
                   $('label[name = "KGQ_HoTenNguoiNop"]').text(result.HoTenNguoiNop);
                   $('label[name = "KGQ_SoGiayTo"]').text(result.SoGiayTo);
                   $('label[name = "KGQ_ThuTuc"]').text(result.TenThuTuc);
               }
           });
    }
}
$(document).on('click', ".btn_Thuc_Hien_KGQ", (e) => {
    var check = true;
    if ($(".sl_KGQ_nguoi_nhan_index").val() == '') {
        window.appendValidate
              ($(".sl_KGQ_nguoi_nhan_index"),
                  "border-color-a9",
                  ".color-red",
                  "<label class='color-red'>Vui lòng chọn người nhận</label>");
        check = false;
    }
    else {
        window.removeValidate($(".sl_KGQ_nguoi_nhan_index"), "border-color-a9", ".color-red");
    }
    if (!window.ValidateRequireOnDiv(".div_khong_giai_quyet"))
        check = false;
    if (!check)
        return;
    var objArr = window.GetAllInputOnDiv(".div_khong_giai_quyet");
    var request = JSON.stringify({ listHoSoID: KGQ.hoSoID, trangThaiHienTaiID: KGQ.trangThaiHienTaiID, trangThaiTiepTheoID: KGQ.trangThaiTiepTheoID, nguoiNhanID: objArr["KGQ_NguoiNhan"], ngay: '', noiDung: objArr["KGQ_LyDo"] });

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
                    $("#modal-khong-giai-quyet").modal("toggle");
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

function LoadNguoiNhanKGQ(listNguoiNhan, nguoiNhanID) {
    if (listNguoiNhan) {
        window.LoadSelect2($(".sl_KGQ_nguoi_nhan_index"), listNguoiNhan, nguoiNhanID ? nguoiNhanID : null, false);
    }
}