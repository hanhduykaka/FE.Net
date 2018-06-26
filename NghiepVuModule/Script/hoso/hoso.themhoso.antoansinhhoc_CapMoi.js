

function fnLoadAnToanSinhHocCapMoi() {
    var id = $('input[name="hdfId"]').val();
    var hoSoId = $('input[name="hdfHoSoId"]').val();
    var request = JSON.stringify({ id: id, hoSoId: hoSoId });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/LoadHoSoATSHCapMoi",
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
                    XuLyLoadDataATSH(result);
            }
        });
}



function fnSaveAnToanSinhHocCapMoi(linhVucId, thuThucId) {
    if (!validateform()) {
        return;
    }
    DisabledButtonSave();
    var obj = ColectionFormATSH(linhVucId, thuThucId);
    var formdata = new FormData();
    formdata.append("model", JSON.stringify(obj));
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/SaveHoSoATSHCapMoi",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            formdata,
            false,
            "json",
            false).then
        ((data) => {
            if (data && data.Content != "-1") {
                console.log(data);
                window.alert_success("Lưu thành công!");
                $('input[name="hdfId"]').val(data.Content);
                fnLoadAnToanSinhHocCapMoi();
            } else
                window.alert_success("Lưu chưa thành công!");
        });
    //
}

$(document).on
("blur", "input[name='SoChungNhan']",
    (e) => {
        var element = $(e.currentTarget);
        var txtVal = element.val();
        var id = $('input[name="hdfId"]').val();
        var dataRequest = JSON.stringify({ id: id, soChungChi: txtVal });
        if (txtVal) {
            window.AjaxDungChung
                ("post",
                    "/DesktopModules/MVC/NghiepVu/HoSo/CheckExistSoGiayChungNhanATSH",
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
                                    "<label class='color-red'> Số giấy chứng nhận đã tồn tại! </label>");
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