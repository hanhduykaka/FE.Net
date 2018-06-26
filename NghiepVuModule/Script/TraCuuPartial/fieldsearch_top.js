$(document).ready
(() => {
    loadLinhVuc();
    window.LoadSelect2($(".sl_Thu_Tuc"), [], null, true);
    window.InitFromToDatePicker(".date-picker-from", ".date-picker-to");
});
$(".sl_Linh_Vuc").change
((e) => {
    var element = $(e.target);
    var linhvucID = e.target.value;
    loadThuTuc(linhvucID);
});
function loadLinhVuc(linhvucID) {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/GetDanhMucLinhVuc",
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
                window.LoadSelect2($(".sl_Linh_Vuc"), data_Linh_Vuc, linhvucID ? linhvucID : null, true);
            }
        });
}
function loadThuTuc(linhvucID, thutucID) {
    if (!isNaN(linhvucID * 1)) {
        var dataRequest = JSON.stringify({ linhvucID: linhvucID });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/HoSo/GetThuTucByLinhVucIDJsonResult",
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
                    window.LoadSelect2($(".sl_Thu_Tuc"), data_Thu_Tuc, thutucID ? thutucID : null, true);

                }
            });
    } else {
        window.LoadSelect2($(".sl_Thu_Tuc"), [], null, true);
    }
}