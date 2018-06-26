
function fnSaveChungChiYCapMoi(linhVucId, thuThucId) {
    if (!validateform()) {
        return;
    }
    DisabledButtonSave();
    var formdata = PreparingSaveChungChi(linhVucId, thuThucId);
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/SaveHoSoChungChiY",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            formdata,
            false,
            "json",
            false).then
        ((data) => {
            if (data) {
                
                console.log(data);
                window.alert_success("Lưu thành công!");
                window._arrObjDinhKemPostFile = [];
                window._arrObjFile = [];
                window._arrObjDinhKem = [];
                $('input[name="hdfId"]').val(data.Content);
                fnLoadChungChiYCapMoi();
            } else
                window.alert_success("Lưu chưa thành công!");
        });
};



function fnLoadChungChiYCapMoi() {
    var hdfHoSoId = $("input[name='hdfHoSoId']").val();
    var id = $("input[name='hdfId']").val();
    if (!id && !hdfHoSoId) return;
    var request = JSON.stringify({ id: id, hoSoId: hdfHoSoId });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/LoadHoSoChungChi",
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
                var result = $.parseJSON(data.Content);
                if (result)
                    XuLyLoadDataChungChi(result);
                    //XuLyLoadDuLieu(result);
            }
        });

    //LoadChungChiBySoChungChi(soChungChi, "XuLyLoadDataChungChi");
};



$(document).on
("blur", ".so_chung_chi_cap_moi",
    (e) => {
        var element = $(e.currentTarget);
        var txtVal = element.val();
        var id = $('input[name="hdfId"]').val();
        var dataRequest = JSON.stringify({ id: id, soChungChi: txtVal });
        if (txtVal) {
            window.AjaxDungChung
                ("post",
                    "/DesktopModules/MVC/NghiepVu/HoSo/CheckExistSoChungChi",
                    window.moduleId,
                    window.tabId,
                    $("input[name='__RequestVerificationToken']").val(),
                    dataRequest,
                    "application/json; charset=utf-8",
                    "json",
                    true)
                .then
                (function (data) {
                    if (data) {
                        if (data.Content) {
                            if (data.Content === "false") {
                                window.appendValidate
                                (element,
                                    "border-color-a9",
                                    ".color-red",
                                    "<label class='color-red'> Số chứng chỉ đã tồn tại! </label>");
                            } else {
                                window.removeValidate(element, "border-color-a9", ".color-red");
                            }
                        }
                    }
                });
        } else {
            window.removeValidate(element, "", ".color-red");
        }
    });


















