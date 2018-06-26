
$(document).ready
(() => {

    window.InitDateTimePicker($(".date-picker-ngay-cap-lai"));
});

$(document).on
("blur", ".so_chung_chi_cap_lai",
    (e) => {
        var oldSoChungChi = $('input[name="hdfSoChungChi"]').val();
        var element = $(e.currentTarget);
        var txtVal = element.val();

        if (txtVal) {
            if (oldSoChungChi == txtVal) {
                window.removeValidate(element, "", ".color-red");
                return;
            }
            window.LoadChungChiBySoChungChi(txtVal, "XuLyLoadDataChungChi");
        } else {
            window.removeValidate(element, "", ".color-red");
        }
    });


function fnLoadCCDuocCapLai() {
    var hdfHoSoId = $('input[name="hdfHoSoId"]').val();
    var request = JSON.stringify({ hoSoID: hdfHoSoId });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/GetChungChiDuoc_CapLai_GetByHoSoID",
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
                if (data.Content == "") {
                    //chờ ng ta chọn
                }
                else
                {
                    var result = $.parseJSON(data.Content);
                    var noidungsau = result.noidungsau;
                    var noidungtruoc = result.noidungtruoc;
                    noidungsau.chungChiHanhNgheY.NoiCapChungChiID = noidungtruoc.chungChiHanhNgheY.NoiCapChungChiID;
                    var chungChiHanhNgheYCaplai = result.chungChiHanhNgheY_caplai;
                    LoadThongTinCapLai(chungChiHanhNgheYCaplai);
                    XuLyLoadDataChungChi(noidungsau);

                }
            } 
        });
};

function LoadThongTinCapLai(data) {
    $('input[name="hdfCapLaiId"]').val(data.CapLaiID);
    window.LoadDataInputText("LanCapLai", data.LanCapLai);
    window.LoadDataSelect2("LyDoCapLaiId", data.LyDoCapLaiID);
    window.setValueDateTimePicker("NgayCapLai", data.NgayCap);
}

function fnSaveCCDuocCapLai(linhVucId, thuThucId) {
    if (!validateform()) {
        return;
    }
    var formdata = PreparingSaveChungChi(linhVucId, thuThucId);
    formdata.append("noidungtruoc", JSON.stringify(window._noidungtruoc));
    console.log(JSON.stringify(window._noidungtruoc));
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/SaveHoSoChungChiYCapLai",
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
                window._arrObjFile = [];
                window._arrObjDinhKem = [];
                ////$('input[name="hdfId"]').val(data.Content);
                fnLoadCCDuocCapLai();
            } else
                window.alert_success("Lưu chưa thành công!");
        });
};

$(document).on
("dp.change",
    ".date-picker-ngay-cap-lai",
    (e) => {
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var ngayCapLai=date._d;
        var ngayCapChungChi = $("input[name='NgayCapChungChi']").val();
        var datengayCapChungChi=window.parseDate(ngayCapChungChi, "full");
        var check = datengayCapChungChi > ngayCapLai;
        if (check) {
            window.appendValidate
            (curentTarget,
                "border-color-a9",
                ".color-red",
                "<label class='color-red'> Ngày cấp lại không được nhỏ hơn ngày cấp </label>");
        } else {
            window.removeValidate(curentTarget, "border-color-a9", ".color-red");
        }
    });















