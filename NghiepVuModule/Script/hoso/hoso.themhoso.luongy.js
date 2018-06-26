
function fnSaveLuongY(linhVucId, thuThucId) {
    if (!validateform()) {
        return;
    }
    DisabledButtonSave();
    var obj = ColectionFormLuongY(linhVucId, thuThucId);
    console.log(obj);
    var formdata = new FormData();
    obj["DataHinh"] = $('#img-hinh-dai-dien').attr("data-hinh");
    formdata.append("model", JSON.stringify(obj));
    var file = document.getElementById("file_Hinh_anh").files[0];
    formdata.append('img', file);
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/SaveHoSoLuongY",
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
                fnLoadLuongY();
            } else
                window.alert_success("Lưu chưa thành công!");
        });
}

function ColectionFormLuongY(linhVucId, thuThucId) {
        var parent = $(".div_tong");
        var objArr = window.GetAllInputOnDiv(parent);
        objArr["LinhVucId"] = linhVucId;
        objArr["ThuTucId"] = thuThucId;
        var hoSoId = $('input[name="hdfHoSoId"]').val() == "" ? "0" : $('input[name="hdfHoSoId"]').val();
        var id = $('input[name="hdfId"]').val() == ""
            ? "0"
            : $('input[name="hdfId"]').val();
        objArr["Id"] = id;
        objArr["HoSoID"] = hoSoId;
        objArr["IsDauKy"] = $('input[name="hdfDauKy"]').val();
        objArr["ArrLuongY"] = XyLyGetTblLuongY();
        return objArr;
}

function fnLoadLuongY() {
    var hdfHoSoId = $("input[name='hdfHoSoId']").val();
    var id = $("input[name='hdfId']").val();
    var request = JSON.stringify({ id: id, hoSoId: hdfHoSoId });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/LoadHoSoLuongY",
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
}

function XuLyLoadDuLieu(result) {
    console.log(result);
    var data = result.giayChungNhanLuongY;
    $('input[name="hdfId"]').val(data.GiayChungNhanLuongYID);
    window.LoadDataInputText("SoChungNhan", data.SoGiayChungNhan);
    window.LoadDataInputText("SoQuyetDinh", data.SoQuyetDinh);
    window.setValueDateTimePicker("NgayQuyetDinh", data.NgayQuyetDinh);
    window.setValueDateTimePicker("NgayCapChungChi", data.NgayCap);
    window.LoadDataInputText("HoTenRequire", data.HoTen);
    window.LoadDataInputText("NgaySinh", data.NgaySinh);
    window.LoadDataCheckBox("gioi_tinh", data.GioiTinh);
    window.LoadDataCheckBox("lgt", data.LoaiGiayTo);
    window.LoadDataInputText("SoGiayToRequire", data.SoGiayTo);
    window.setValueDateTimePicker("NgayCapGiayTo", data.NgayCapGiayTo);
    window.LoadDataInputText("NoiCapGiayTo", data.NoiCapGiayTo);
    window.LoadDataInputText("DienThoai", data.Phone);
    window.LoadDataInputText("Email", data.Email);

    window.LoadDataSelect2("TinhThanh01", data.ThuongTru_TinhID);
    if (data.IsDauKy) {
        window.LoadDataInputText("SoBienNhan", data.SoBienNhanDauKy);
        window.setValueDateTimePicker("NgayNhan", data.NgayNhanDauKy);
        window.setValueDateTimePicker("NgayHenTra", data.NgayHenTraDauKy);
    }
    window.LoadComboHuyenByTinhId($("select[name='TinhThanh01']"), data.ThuongTru_TinhID, data.ThuongTru_HuyenID);
    window.LoadComboXaByHuyenId($("select[name='QuanHuyen01']"), data.ThuongTru_HuyenID, data.ThuongTru_XaID);
    window.LoadDataSelect2("TinhThanh02", data.ChoO_TinhID);
    window.LoadComboHuyenByTinhId($("select[name='TinhThanh02']"), data.ChoO_TinhID, data.ChoO_HuyenID);
    window.LoadComboXaByHuyenId($("select[name='QuanHuyen02']"), data.ChoO_HuyenID, data.ChoO_XaID);
    window.LoadDataInputText("SoNha01", data.ThuongTru_SoNha);
    window.LoadDataInputText("SoNha02", data.ChoO_SoNha);
    window.LoadDataSelectPicker($("select[name='du_dieu_kien_hanh_nghe']"),
        data.PhamViHoatDongID, data.PhamViHoatDongs);
    window.LoadHinhAnh(data.HinhAnh);
    var quatrinh = result.lstgiayChungNhanLuongY_QTHanhNghe;
    LoadTblLuongY(quatrinh);
    EnabledButtonSave();
}


function XyLySaveTblLuongY(e) {
    var element = $(e);
    var tbody = element.closest("tbody");
    var trParent = element.closest("tr");
    var dataId = trParent.attr("data-id");
    var arrId = [];
    var newDataId;
    tbody.find("tr[name!='tr-edit']").each((index, obj) => {
        var thisElement = $(obj);
        arrId.push(thisElement.attr("data-id"));
    });
    if (arrId.length > 0) {
        var maxOfArray = Math.max.apply(Math, arrId);
        var checkExist = arrId.indexOf(dataId) > -1;
        if (checkExist) {
            newDataId = dataId;
        } else {
            newDataId = maxOfArray + 1;
        }
    } else {
        newDataId = 1;
    }
    var objData = window.GetAllInputOnDiv(trParent);
    if (objData) {
        var html = html_Load_tbl_LuongY(newDataId, objData);
        if (dataId == 0)
            tbody.append(html);
        else {
            trParent.after(html);
            tbody.find("tr[class='font-size-13 hidden']").remove();
        }
        trParent.remove();

    }
};

function XyLyGetTblLuongY() {
    var table = $("#tbl_qua_trinh_hanh_nghe_luong_y");
    var tr = table.find("tbody tr");
    return window.GetAllItemInARow(tr);
};

function html_gen_edit_qua_trinh_hanh_nghe_luong_y(data) {
    var html = "";
    html += '   <tr class="font-size-13"  name="tr-edit">';
    html += '    <td>';
    html += '<input name="nam" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + escapeHtml(data.nam) + "\"" : '') + '/>';
    html += '    </td>';
    html += '   <td>';
    html += '<input name="phamvi" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + escapeHtml(data.phamvi) + "\"" : '') + '/>';
    html += '    </td>';
    html += '   <td>';
    html += '    <input name="noilam" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + escapeHtml(data.noilam) + "\"" : '') + ' />';
    html += '   </td>';
    html += '   <td>';
    html += '    <input name="chucvu" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + escapeHtml(data.chucvu) + "\"" : '') + ' />';
    html += '   </td>';
    html += '  <td>';
    html += '   <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += '   <span class="glyphicon glyphicon-ok syt-icon-save" ' +
        'title="Lưu" onclick="fn_save_edit(this)"></span>';
    html += '   </div>';
    html += '  </td>';
    html += '   <td >';
    html += '    <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += '    <span type="button" title="Hủy"  onclick="fn_cancel_edit(this)"' +
        ' class="glyphicon glyphicon-remove syt-icon-cancel"/>';
    html += '  </div>';
    html += '   </td>';
    html += '   </tr> ';
    return html;
};

function html_Load_tbl_LuongY(newDataId, objData) {
    console.log(objData);
    var html = "";
    html += '<tr data-id="' + newDataId + '" class="font-size-13">';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="ThoiGian" data-value=' + escapeHtml(objData.nam) + '>' + objData.nam + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em work-break" data-name="PhamViHoatDong" data-value=' + escapeHtml(objData.phamvi) + '>' + objData.phamvi + '</td>';
    html += '<td class="input-get line-height-1_1-Em work-break" data-name="NoiLamViec" data-value=' + escapeHtml(objData.noilam) + '> ' + objData.noilam + ' </td>';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="ChucVu" data-value=' + escapeHtml(objData.chucvu) + '>' + objData.chucvu + ' </td>';
    html += '<td class="fa fa-edit cursor-pointer color-blue font-size-20 table-cell syt-edit-btn line-height-1_1-Em"';
    html += ' data-nam="' + escapeHtml(objData.nam) + '"  data-phamvi="' + escapeHtml(objData.phamvi) + '" data-noilam="' + escapeHtml(objData.noilam) + '"';
    html += ' data-id="' + escapeHtml(newDataId) + '"    data-chucvu="' + escapeHtml(objData.chucvu) + '" title="Sửa"></td>';
    html += ' <td class="glyphicon glyphicon-trash cursor-pointer color-blue  font-size-18  position-inherit line-height-1_1-Em" title="Xóa"';
    html += 'onclick="fn_Xoa_Dong(this)"></td>';
    html += '</tr>';
    return html;
};

function LoadTblLuongY(data) {
    var table = $("#tbl_qua_trinh_hanh_nghe_luong_y");
    if (data.length > 0) {
        var html = "";
        $.each
        (data,
            function (i, item) {
                var id = item.QuaTrinhID == 0 ? i : item.QuaTrinhID;
                var obj = {
                    chucvu: item.ChucVu,
                    noilam: item.NoiLamViec,
                    phamvi: item.PhamViHoatDong,
                    nam: item.ThoiGian
                }
                html += html_Load_tbl_LuongY(id, obj);
            });
        table.find("tbody").empty().append(html);
    } else {
        table.find("tbody").empty();
    }
};


$(document).on
("dp.change",
    "input[name='NgayNhan']",
    (e) => {
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var to = date._d;
        var compareTarget = $("input[name='NgayCapChungChi']");
        var from = compareTarget.val();
        window.Validate_stringFrom_dateTo(curentTarget, from, to, "Ngày  nhận không được nhỏ hơn ngày cấp!", compareTarget);
    });


$(document).on
("dp.change",
    "input[name='NgayCapChungChi']",
    (e) => {
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var from = date._d;
        var compareTarget = $("input[name='NgayNhan']");
        var to = compareTarget.val();
        window.Validate_dateFrom_stringTo(curentTarget, from, to, "Ngày cấp không được nhỏ hơn ngày nhận!", compareTarget);
    });

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
                    "/DesktopModules/MVC/NghiepVu/HoSo/CheckExistSoChungNhanLuongY",
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
                                    "<label class='color-red'> Số chứng nhận đã tồn tại! </label>");
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








