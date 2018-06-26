$(document).ready
(() => {
    window.LoadSelect2($("select[name='ThoiHan']"), _data_thoi_han_ATSH, null, true);
    window.LoadSelect2($("select[name='LyDoCapLai']"), _data_ly_do_cap_lai_ATSH, null, false);
});


function XyLySaveNhanSu(e) {
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
        var html =html_Load_tbl_NhanSu(newDataId, objData);
        if (dataId == 0)
            tbody.append(html);
        else {
            trParent.after(html);
            tbody.find("tr[class='font-size-13 hidden']").remove();
        }
        trParent.remove();

    }
};

function XyLyGetTblNhanSu() {
    var table = $("#tbl_NhanSu");
    var tr = table.find("tbody tr");
    return window.GetAllItemInARow(tr);
}

function XyLySaveTrangThietBi(e) {
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

        var html = html_Load_tbl_TrangThietBi(newDataId, objData);
        if (dataId == 0)
            tbody.append(html);
        else {
            trParent.after(html);
            tbody.find("tr[class='font-size-13 hidden']").remove();
        }
        trParent.remove();

    }
}

function XyLyGetTblTrangThietBi() {
    var table = $("#tbl_TrangThietBi");
    var tr = table.find("tbody tr");
    return window.GetAllItemInARow(tr);
};

function html_gen_edit_ban_ke_nhan_su(data) {
    console.log(data);
    var html = "";
    html += '   <tr ' + (data ? "data-id=\"" + data.id + "\"" : "data-id=0") + ' class="font-size-13"  name="tr-edit">';

    html += "   <td>";
    html += '<input  name="ho_ten"  class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        (data ? "value=\"" + data.ho_ten + "\"" : "") +
        "/>";
    html += "    </td>";

    html += "   <td>";
    html += '    <input name="chuc_danh" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' +
        (data ? "value=\"" + data.chuc_danh + "\"" : "") +
        " />";
    html += "   </td>";

    html += "    <td>";
    html += '    <select class="sknadSelect width-100 adselect sl_trinh_do" name ="TrinhDo">';
    html += "    </select>";
    html += "    </td>";

    html += '   <td>';
    html += '    <input name="cong_viec" class="width-100 syt-radius-3 min-h-30 paddingMin txt_cong_viec"' +
        ' type="text" ' + (data ? "value=\"" + data.cong_viec + "\"" : '') + ' />';
    html += '   </td>';
    html += "  <td>";
    html += '   <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += '   <span class="glyphicon glyphicon-ok syt-icon-save" ' +
        'title="Lưu" onclick="fn_save_edit(this)"></span>';
    html += "   </div>";
    html += "  </td>";
    html += "   <td >";
    html += '    <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += '    <span type="button" title="Hủy"  onclick="fn_cancel_edit(this)"' +
        ' class="glyphicon glyphicon-remove syt-icon-cancel"/>';
    html += "  </div>";
    html += "   </td>";
    html += "   </tr> ";
    return html;
}

function html_Load_tbl_NhanSu(newDataId, objData) {
    var html = "";
    html += '<tr data-id="' + newDataId + '" class="font-size-13">';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="HoTen" data-value=' + objData.ho_ten + '>' + objData.ho_ten + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em work-break" data-name="ChucDanh" data-value=' + objData.chuc_danh + '>' + objData.chuc_danh + '</td>';
    html += '<td class="input-get line-height-1_1-Em work-break" data-name="TrinhDoChuyenMonID" data-value=' + objData.TrinhDo + '> ' + objData.TrinhDo_Name + ' </td>';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="CongViecPhuTrach" data-value=' + objData.cong_viec + '>' + objData.cong_viec + ' </td>';
    html += '<td class="fa fa-edit cursor-pointer color-blue font-size-20 table-cell syt-edit-btn line-height-1_1-Em"';
    html += ' data-trinhdoId="' + objData.TrinhDo + '"  data-trinh-do="' + objData.TrinhDo_Name + '" data-cong_viec="' + objData.cong_viec + '"';
    html += ' data-id="' + newDataId + '"  data-ho_ten="' + objData.ho_ten + '"    data-chuc_danh="' + objData.chuc_danh + '" title="Sửa"></td>';
    html += ' <td class="glyphicon glyphicon-trash cursor-pointer color-blue  font-size-18  position-inherit line-height-1_1-Em" title="Xóa"';
    html += 'onclick="fn_Xoa_Dong(this)"></td>';
    html += '</tr>';
    return html;
};

function html_gen_edit_trang_thiet_bi(data) {
    var html = "";
    html += '   <tr class="font-size-13"  name="tr-edit">';
    html += '    <td>';
    html += '<input name="ten" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + data.ten + "\"" : '') + '/>';
    html += '    </td>';
    html += '   <td>';
    html += '<input name="kyhieu" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + data.kyhieu + "\"" : '') + '/>';
    html += '    </td>';
    html += '   <td>';
    html += '    <input  name="hang" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + data.hang + "\"" : '') + ' />';
    html += '   </td>';
    html += '   <td>';
    html += '    <input name="nuoc"  class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + data.nuoc + "\"" : '') + ' />';
    html += '   </td>';

    html += '    <td>';
    html += '<input  name="nam" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + data.nam + "\"" : '') + '/>';
    html += '    </td>';
    html += '   <td>';
    html += '<input name="tinhtrang"  class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + data.tinhtrang + "\"" : '') + '/>';
    html += '    </td>';
    html += '   <td>';
    html += '    <input  name="baoduong" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + data.baoduong + "\"" : '') + ' />';
    html += '   </td>';
    html += '   <td>';
    html += '    <input  name="ghichu" class="width-100 syt-radius-3 min-h-30 paddingMin"' +
        ' type="text" ' + (data ? "value=\"" + data.ghichu + "\"" : '') + ' />';
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

function html_Load_tbl_TrangThietBi(newDataId, objData) {
    console.log(objData);
    var html = "";
    html += '<tr data-id="' + newDataId + '" class="font-size-13">';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="TenThietBi" data-value=' + objData.ten + '>' + objData.ten + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em work-break" data-name="KyHieu" data-value=' + objData.kyhieu + '>' + objData.kyhieu + '</td>';
    html += '<td class="input-get line-height-1_1-Em work-break" data-name="HangSX" data-value=' + objData.hang + '> ' + objData.hang + ' </td>';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="NuocSX" data-value=' + objData.nuoc + '>' + objData.nuoc + ' </td>';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="NamSX" data-value=' + objData.nam + '>' + objData.nam + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em work-break" data-name="TinhTrangSuDung" data-value=' + objData.tinhtrang + '>' + objData.tinhtrang + '</td>';
    html += '<td class="input-get line-height-1_1-Em work-break" data-name="BaoDuong" data-value=' + objData.baoduong + '> ' + objData.baoduong + ' </td>';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="GhiChu" data-value=' + objData.ghichu + '>' + objData.ghichu + ' </td>';
    html += '<td class="fa fa-edit cursor-pointer color-blue font-size-20 table-cell syt-edit-btn line-height-1_1-Em"';
    html += ' data-ten="' + objData.ten + '"  data-kyhieu="' + objData.kyhieu + '" data-hang="' + objData.hang + '"';
    html += ' data-id="' + newDataId + '"  data-nuoc="' + objData.nuoc + '"' +
        'data-ghichu="' + objData.ghichu + '" data-baoduong="' + objData.baoduong + '" data-tinhtrang="' + objData.tinhtrang + '" data-nam="' + objData.nam + '"' +
        ' title="Sửa"></td>';
    html += ' <td class="glyphicon glyphicon-trash cursor-pointer color-blue  font-size-18  position-inherit line-height-1_1-Em" title="Xóa"';
    html += 'onclick="fn_Xoa_Dong(this)"></td>';
    html += '</tr>';
    return html;
};

function XyLyselect2NhanSu(data) {
    window.LoadSelect2($(".sl_trinh_do"), _dataTrinhDo, data ? data.trinhdoid : null, false);
};

function ColectionFormATSH(linhVucId, thuThucId) {
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
    objArr["ArrNhanSu"] = XyLyGetTblNhanSu();
    objArr["ArrTrangThietBi"] = XyLyGetTblTrangThietBi();
    return objArr;
};


$(document).on
("dp.change",
    "input[name='NgayNhan']",
    (e) => {
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var to = date._d;
        var compareTarget = $("input[name='NgayCap']");
        var from = compareTarget.val();
        window.Validate_stringFrom_dateTo(curentTarget, from, to, "Ngày nhận không được lớn hơn ngày cấp!", compareTarget);
    });


$(document).on
("dp.change",
    ".dpk_NgayCap",
    (e) => {
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var from = date._d;
        var compareTarget = $("input[name='NgayNhan']");
        var to = compareTarget.val();
        window.Validate_dateFrom_stringTo(curentTarget, from, to, "Ngày cấp không được nhỏ hơn ngày nhận!", compareTarget);
    });



function XuLyLoadDataATSH(data) {
   
    var giay = data.giayChungNhanATSH;
    var lstNhanSu = data.lstGiayChungNhanATSH_DSNhanSu;
    var lstThietBi = data.lstGiayChungNhanATSH_DSThietBi;
    $('input[name="hdfId"]').val(giay.GiayChungNhanATSHID);
    $('input[name="hdfSoChungChi"]').val(giay.SoGiayChungNhan);
    window.LoadDataInputText("SoChungNhan", giay.SoGiayChungNhan);
    window.setValueDateTimePicker("NgayCap", giay.NgayCap);
    window.LoadDataSelect2("ThoiHan", giay.ThoiHan);
    window.LoadDataCheckBox("CapDoAnToanSinhHoc", giay.Cap);
    window.LoadDataInputText("TenCoSo", giay.TenCoSo);
    window.LoadDataInputText("PhongXetNghiem", giay.TenPhongXetNghiem);
    window.LoadDataSelect2("TinhThanh01", giay.TinhID);
    window.LoadComboHuyenByTinhId($("select[name='TinhThanh01']"), giay.TinhID, giay.HuyenID);
    window.LoadComboXaByHuyenId($("select[name='QuanHuyen01']"), giay.HuyenID, giay.XaID);
    window.LoadDataInputText("SoNha01", giay.SoNha);
    window.LoadDataInputText("DienThoai", giay.Phone);
    window.LoadDataInputText("Email", giay.Email);
    if (data.IsDauKy == true) {
        window.LoadDataInputText("SoBienNhan", giay.SoBienNhanDauKy);
        window.setValueDateTimePicker("NgayHenTra", giay.NgayHenTraDauKy);
        window.setValueDateTimePicker("NgayNhan", giay.NgayNhanDauKy);
    }
    LoadNhanSu(lstNhanSu);
    LoadThietBi(lstThietBi);
    EnabledButtonSave();
}

function LoadNhanSu(data) {
    var table = $("#tbl_NhanSu");
    if (data.length > 0) {
        var html = "";
        $.each
        (data,
            function (i, item) {
                var id = item.NhanSuID == 0 ? i : item.NhanSuID;
                var obj = {
                    TrinhDo: item.TrinhDoChuyenMonID,
                    ho_ten: item.HoTen,
                    TrinhDo_Name: _dataTrinhDo.find(x => x.ID == item.TrinhDoChuyenMonID).Ten,
                    chuc_danh: item.ChucDanh,
                    cong_viec: item.CongViecPhuTrach
                }
                html += html_Load_tbl_NhanSu(id, obj);
            });
        table.find("tbody").empty().append(html);
    } else {
        table.find("tbody").empty();
    }
};

function LoadThietBi(data) {
    var table = $("#tbl_TrangThietBi");
    if (data.length > 0) {
        var html = "";
        $.each
        (data,
            function (i, item) {
                var id = item.ThietBiID == 0 ? i : item.ThietBiID;
                var obj = {
                    ten: item.TenThietBi,
                    baoduong: item.BaoDuong,
                    ghichu: item.GhiChu,
                    hang: item.HangSX,
                    kyhieu: item.KyHieu,
                    nam: item.NamSX,
                    nuoc: item.NuocSX,
                    tinhtrang: item.TinhTrangSuDung
                }
                html += html_Load_tbl_TrangThietBi(id, obj);
            });
        table.find("tbody").empty().append(html);
    } else {
        table.find("tbody").empty();
    }
};