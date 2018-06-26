

$(document).ready
(() => {

});

function fnSaveQuangCaoTrangThietBi(linhVucId, thuThucId) {
    if (!validateform()) {
        return;
    }
    DisabledButtonSave();
    var formdata = PreparingSaveQuangCaoTrangThietBi(linhVucId, thuThucId);
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/SaveHoSoQuangCaoTrangThietBi",
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
                var id = data.Content == "-1" ? "0" : data.Content;
                if (id > 0) {
                    window.alert_success("Lưu thành công!");
                    $('input[name="hdfId"]').val(data.Content);
                    fnLoadQuangCaoTrangThietBi();
                }
                else
                    window.alert_success("Lưu chưa thành công!");
            } else
                window.alert_success("Lưu chưa thành công!");
        });
};

function PreparingSaveQuangCaoTrangThietBi(linhVucId, thuThucId) {
    var parent = $(".div_tong");
    var formdata = new FormData();
    var objArr = window.GetAllInputOnDiv(parent);
    objArr["LinhVucId"] = linhVucId;
    objArr["ThuTucId"] = thuThucId;
    var hoSoId = $('input[name="hdfHoSoId"]').val() == "" ? "0" : $('input[name="hdfHoSoId"]').val();
    var chungChiId = $('input[name="hdfId"]').val() == ""
        ? "0"
        : $('input[name="hdfId"]').val();
    objArr["Id"] = chungChiId;
    objArr["HoSoID"] = hoSoId;
    objArr["IsDauKy"] = $('input[name="hdfDauKy"]').val();
    formdata.append("model", JSON.stringify(objArr));
    console.log(JSON.stringify(objArr));
    return formdata;
}

function fnLoadQuangCaoTrangThietBi() {
    var hdfHoSoId = $("input[name='hdfHoSoId']").val();
    var id = $("input[name='hdfId']").val();
    var request = JSON.stringify({ id: id, hoSoId: hdfHoSoId });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/LoadHoSoQuangCaoTrangThietBi",
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
                    XuLyLoadDuLieu(result);
            }
        });
};

function XuLyLoadDuLieu(data) {
    console.log(data);
    $('input[name="hdfId"]').val(data.DangKyQCTrangThietBiID);
    window.LoadDataInputText("SoGiayDangKy", data.SoGiayDangKy);
    window.LoadDataInputText("SoTiepNhan", data.SoTiepNhan);
    window.setValueDateTimePicker("NgayTiepNhan", data.NgayTiepNhan);
    window.LoadDataInputText("DichVuQuangCao", data.DichVuQuangCao);
    window.LoadDataInputText("TenDonVi", data.DonViDK_Ten);
    window.LoadDataInputText("MaDoanhNghiep", data.DonViDK_MaDoanhNghiep);
    window.LoadDataSelect2("TinhThanh01", data.DonViDK_TinhID);
    window.LoadComboHuyenByTinhId($("select[name='TinhThanh01']"), data.DonViDK_TinhID, data.DonViDK_HuyenID);
    window.LoadComboXaByHuyenId($("select[name='QuanHuyen01']"), data.DonViDK_HuyenID, data.DonViDK_XaID);
    window.LoadDataInputText("SoNha01", data.DonViDK_SoNha);
    window.LoadDataInputText("DienThoai", data.DonViDK_Phone);
    window.LoadDataInputText("Email", data.DonViDK_Email);
    window.LoadDataInputText("HoTen", data.NCTN_Ten);
    window.LoadDataInputText("NgaySinh", data.NCTN_NgaySinh);
    window.LoadDataCheckBox("gioi_tinh", data.NCTN_GioiTinhID);
    window.LoadDataCheckBox("lgt", data.NCTN_LoaiGiayToID);
    window.LoadDataInputText("SoGiayTo", data.NCTN_SoGiayTo);
    window.setValueDateTimePicker("NgayCapGiayTo", data.NCTN_NgayCap);
    window.LoadDataInputText("NoiCapGiayTo", data.NCTN_NoiCap);
    window.LoadDataInputText("DienThoai2", data.NCTN_Phone);
    window.LoadDataInputText("Email2", data.NCTN_Email);
    if (data.IsDauKy == true) {
        window.LoadDataInputText("SoBienNhan", data.SoBienNhanDauKy);
        window.setValueDateTimePicker("NgayHenTra", data.NgayHenTraDauKy);
        window.setValueDateTimePicker("NgayNhan", data.NgayNhanDauKy);
    }
    EnabledButtonSave();
};


$(document).on
("dp.change",
    "input[name='NgayNhan']",
    (e) => {
 
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var to = date._d;
        var compareTarget = $("input[name='NgayTiepNhan']");
        var from = compareTarget.val();
        window.Validate_stringFrom_dateTo(curentTarget, from, to, "Ngày tiếp nhân không được nhỏ hơn ngày nhận!", compareTarget);
    });


$(document).on
("dp.change",
    ".dpk_NgayTiepNhan",
    (e) => {
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var from = date._d;
        var compareTarget = $("input[name='NgayNhan']");
        var to = compareTarget.val();
        window.Validate_dateFrom_stringTo(curentTarget, from, to, "Ngày tiếp nhân không được nhỏ hơn ngày nhận!", compareTarget);
    });

$(document).on
("blur", "input[name='SoTiepNhan']",
    (e) => {
        var element = $(e.currentTarget);
        var txtVal = element.val();
        var id = $('input[name="hdfId"]').val();
        var dataRequest = JSON.stringify({ id: id, soChungChi: txtVal });
        if (txtVal) {
            window.AjaxDungChung
                ("post",
                    "/DesktopModules/MVC/NghiepVu/HoSo/CheckExistSoTiepNhanDangKyQuangCaoNganhY",
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
                                    "<label class='color-red'> Số tiếp nhận đã tồn tại! </label>");
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
















