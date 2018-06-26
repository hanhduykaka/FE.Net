$(".sl_linh_vuc_ho_so_index").change
((e) => {
    $(".sl_thu_tuc_ho_so_index").val($("#sl_thu_tuc_ho_so_index option:first-child").val());
    var element = $(e.target);
    var linhvucID = e.target.value;
    if (!isFirstLoad)
        loadThuTuc(linhvucID);
});
function loadLinhVuc(linhvucID) {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/MotCua/GetDanhMucLinhVuc",
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
                var data_Linh_Vuc = [];
                $.each
               (data, (index, element) => {
                   data_Linh_Vuc.push({ ID: element.LinhVucID, Ten: element.TenLinhVuc });
               });
                window.LoadSelect2($(".sl_linh_vuc_ho_so_index"), data_Linh_Vuc, linhvucID ? linhvucID : null, true);
            }
        });
}
function loadThuTuc(linhvucID, thutucID) {
    if (!isNaN(linhvucID * 1)) {
        var dataRequest = JSON.stringify({ linhvucID: linhvucID });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/MotCua/GetThuTucByLinhVucIDJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {
                if (data) {
                    var data_Thu_Tuc = [];
                    $.each(data, (index, elm) => {

                        data_Thu_Tuc.push({ ID: elm.ThuTucID, Ten: elm.TenThuTuc });
                    });
                    window.LoadSelect2($(".sl_thu_tuc_ho_so_index"), data_Thu_Tuc, thutucID ? thutucID: null, true);

                }
            });
    } else {
        window.LoadSelect2($(".sl_thu_tuc_ho_so_index"), [], null, true);
    }
}
function toDate(dateStr, splitStr) {
    var parts = dateStr.split(splitStr);
    return new Date(parts[2], parts[1] - 1, parts[0]);
}
$(".sl_thu_tuc_ho_so_index").change
((e) => {
    var element = $(e.target);
    var thutucID = e.target.value;
    loadThongTinHoSo(thutucID);

});

function loadThongTinHoSo(thutucID) {
    if (!isNaN(thutucID * 1)) {
        var cancelLoad = isFirstLoad;
        var dataRequest = JSON.stringify({ thutucID: thutucID });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/MotCua/GetThuTucByThuTucIDJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {
                if (data) {
                    $('input[name="SoNgayGiaiQuyet"]').val(data.SoNgayGiaiQuyet);
                    if (cancelLoad == false) {
                        var result = toDate($('input[name="NgayNhan"]').val(), "/");
                        result.setDate(result.getDate() + data.SoNgayGiaiQuyet)
                        $('input[name="NgayHenTra"]').data("DateTimePicker").date(result);
                    }
                }
            });
        if (!cancelLoad) {
            if ($('input[name = "TuDong"]').prop("checked"))
                GenSoBienNhan(thutucID);
            //Chung tu kem theo
            window.AjaxDungChung
               ("post",
                   "/DesktopModules/MVC/NghiepVu/MotCua/GetDMChungTuKemTheoByThuTucIDJsonResult",
                   window.moduleId,
                   window.tabId,
                   $("input[name='__RequestVerificationToken']").val(),
                   dataRequest,
                   "application/json; charset=utf-8",
                   "json",
                   true).then
               ((data) => {
                   if (data) {
                       var trParent = $(".div_ho_so_kem_theo table tbody");
                       trParent.html("");
                       $.each(
                           data, (index, element) => {
                               var obj = {
                                   ID: window.newGUIDFunc()
                                   , TenChungTu: element.TenChungTu
                                   , SLBanChinh: element.SLBanChinh ? element.SLBanChinh : 0
                                   , SLBanSao: element.SLBanSao ? element.SLBanSao : 0
                                   , SLPhoto: element.SLPhoto ? element.SLPhoto : 0
                                   , GhiChu: ''
                                   , HoSoID: $('input[name="hdfHoSoId"]').val()
                                   , AttachFile: ''
                               };
                               $(".div_ho_so_kem_theo table tbody").append(html_gen_new_kem_theo(obj));

                           });
                       reset_stt_kem_theo();
                   }
               });
        }
    } else {
        $('input[name="SoNgayGiaiQuyet"]').val(0);
        $('input[name="NgayHenTra"]').val($('input[name="NgayNhan"]').val());
    }
}
function GenSoBienNhan(thutucID) {
    if (!isNaN(thutucID * 1)) {
        var dataRequest = JSON.stringify({ thutucID: thutucID });
        window.AjaxDungChung
              ("post",
                  "/DesktopModules/MVC/NghiepVu/MotCua/MotCua_GenSoBienNhanByThuTucIDJsonResult",
                  window.moduleId,
                  window.tabId,
                  $("input[name='__RequestVerificationToken']").val(),
                  dataRequest,
                  "application/json; charset=utf-8",
                  "json",
                  true).then
              ((data) => {
                  if (data) {
                      $('input[name = "SoBienNhan"]').val(data);
                  }
              });
    }
}
$('input[name = "TuDong"]').click(function () {
    if ($(this).is(':checked'))
        GenSoBienNhan($(".sl_thu_tuc_ho_so_index").val());
});
