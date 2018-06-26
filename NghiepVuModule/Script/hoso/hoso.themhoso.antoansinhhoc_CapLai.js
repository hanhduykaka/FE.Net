$(document).ready
(() => {
    $("input[name='CapDoAnToanSinhHoc']").attr("disabled", true);
    $("input[name='NgayCap']").attr("readonly", true);
});


function fnLoadAnToanSinhHocCapLai() {
    var hoSoId = $('input[name="hdfHoSoId"]').val();
    var request = JSON.stringify({ hoSoId: hoSoId });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/LoadGiayChungNhanATSH_CapLai",
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
                XuLyLoadCapLaiATSH(result);
            }
        }); 
};


function XuLyLoadCapLaiATSH(result) {
    var giay = result.giayChungNhanATSH_caplai;
    var noidungsau = result.noidungsau;
    console.log(giay);
    console.log(noidungsau);
    window._noidungtruoc = result.noidungtruoc;
    $('input[name="hdfCapLaiId"]').val(giay.CapLaiID);
    window.LoadDataInputText("LanCapLai", giay.LanCapLai);
    window.LoadDataSelect2("LyDoCapLai", giay.LyDoCapLaiID);
    window.setValueDateTimePicker("NgayCapLai", giay.NgayCap);
    XuLyLoadDataATSH(noidungsau);
}

function fnSaveAnToanSinhHocCapLai(linhVucId, thuThucId) {
    if (!validateform()) {
        return;
    }
    var obj = ColectionFormATSH(linhVucId, thuThucId);
    DisabledButtonSave();

    var formdata = new FormData();
    formdata.append("model", JSON.stringify(obj));
    formdata.append("modelTruoc", JSON.stringify(window._noidungtruoc));
    var parent = $("._form_thong_tin_lan_cap_lai");
    var modelCapLai = window.GetAllInputOnDiv(parent);
    modelCapLai["CapLaiId"] = $('input[name="hdfCapLaiId"]').val();
    formdata.append("modelCapLai", JSON.stringify(modelCapLai));

    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/SaveHoSoATSHCapLai",
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
                fnLoadAnToanSinhHocCapLai();
            } else
                window.alert_success("Lưu chưa thành công!");
        });
};

$(document).on
("blur", ".SoGiayChungNhan_CapLai",
    (e) => {
        var oldSoChungChi = $('input[name="hdfSoChungChi"]').val();
        var element = $(e.currentTarget);
        var txtVal = element.val();
        if (txtVal) {
            if (oldSoChungChi == txtVal) {
                window.removeValidate(element, "border-color-a9", ".color-red");
                return;
            }
            window.LoadATSHBySoChungNhan(element, txtVal);
        } else {
            window.removeValidate(element, "border-color-a9", ".color-red");
        }
    });


function LoadATSHBySoChungNhan(element, soChungNhan) {
    var request = JSON.stringify({ soChungNhan: soChungNhan });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/LoadATSHBySoChungNhan",
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
                if (result) {
                    window.removeValidate(element, "border-color-a9", ".color-red");
                    window.ResetAllForm("._form_thong_tin_lan_cap_lai");
                    window._noidungtruoc = result;
                    XuLyLoadDataATSH(result);
                }
                else {
                    window.appendValidate
                    (element,
                        "border-color-a9",
                        ".color-red", "<label class='color-red'> Số chứng chỉ không tồn tại! </label>");
                }
            } else {
                window.appendValidate
                (element,
                    "border-color-a9",
                    ".color-red",
                    "<label class='color-red'> Số chứng chỉ không tồn tại! </label>");
            }
        });
};


$(document).on
("dp.change",
    ".dp-ngay-cap-lai",
    (e) => {
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var from = date._d;
        var compareTarget = $("input[name='NgayCap']");
        var to = compareTarget.val();
        window.Validate_dateFrom_stringTo(curentTarget, from, to, "Ngày cấp lại không được nhỏ hơn ngày cấp!", compareTarget);
    });


