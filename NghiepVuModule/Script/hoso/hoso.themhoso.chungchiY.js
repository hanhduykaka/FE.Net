
function PreparingSaveChungChi(linhVucId, thuThucId) {
    var parent = $(".div_tong");
    var formdata = new FormData();
    var objArr = window.GetAllInputOnDiv(parent);
    objArr["LinhVucId"] = linhVucId;
    objArr["ThuTucId"] = thuThucId;
    var hoSoId = $('input[name="hdfHoSoId"]').val() == "" ? "0" : $('input[name="hdfHoSoId"]').val();
    var chungChiId = $('input[name="hdfId"]').val() == ""
        ? "0"
        : $('input[name="hdfId"]').val();
    objArr["ChungChiHanhNgheYID"] = chungChiId;
    objArr["HoSoID"] = hoSoId;
    objArr["IsDauKy"] = $('input[name="hdfDauKy"]').val();
    objArr["DataHinh"] = $('#img-hinh-dai-dien').attr("data-hinh");
    var nameGoc = JoinNameByArray_Attr_Keys(_arrObjFile, "nameGoc", "|");
    var nameUpload = JoinNameByArray_Attr_Keys(_arrObjFile, "nameUpload", "|");
    objArr["NameGoc"] = nameGoc;
    objArr["NameUpload"] = nameUpload;
    objArr["ArrTrinhDo"] = XyLyGetTblTrinhDo();
    objArr["ArrCongTac"] = XyLyGetTblCongTac();
    objArr["CapLaiId"] = $('input[name="hdfCapLaiId"]').val();
    var file = document.getElementById("file_Hinh_anh").files[0];
   
    formdata.append("model", JSON.stringify(objArr));
    console.log("Ins");
    console.log(JSON.stringify(objArr));
    formdata.append('img', file);
    $.each
    (_arrObjDinhKemPostFile,
        function (i, item) {
            formdata.append(item.id, item.file);
        });
    if (!nameGoc) {
        console.log("Có sự thay đổi");
    }
    return formdata;
}

function LoadChungChiBySoChungChi(soChungChi, funcXuly) {
    var requestSoChungChi = JSON.stringify({ soChungChi: soChungChi });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/HoSo/GetChungChiBySoChungChi",
          window.moduleId,
          window.tabId,
          $("input[name='__RequestVerificationToken']").val(),
          requestSoChungChi,
          "application/json; charset=utf-8",
          "json",
          true)
      .then
      (function (data) {
          if (data) {
              var result = $.parseJSON(data.Content);
              window[funcXuly](result);
          }
      });
}

function XuLyLoadDataChungChi(result) {
    var elementSoChungChi = $("input[name='SoChungChi']");
    var hdfThuTucId = $('input[name="hdfThuTucId"]').val();
    if (result) {
        //
        $('input[name="hdfId"]').val(result.chungChiHanhNgheY.ChungChiHanhNgheYID);
        $('input[name="hdfSoChungChi"]').val(result.chungChiHanhNgheY.SoChungChi);
        window._noidungtruoc = result;
        if (hdfThuTucId == "3") {
            LoadNoiDungTruoc(result);
        }
        //
        window.removeValidate(elementSoChungChi, "border-color-a9", ".color-red");
        var lstChungChiHanhNgheYQtth = result.lstChungChiHanhNgheY_QTTH;
        LoadQuaTrinh(lstChungChiHanhNgheYQtth);
        var lstChungChiHanhNgheYTdcm = result.lstChungChiHanhNgheY_TDCM;
        LoadTrinhDo(lstChungChiHanhNgheYTdcm);
        var chungChiObj = result.chungChiHanhNgheY;
        window.LoadDataInputText("SoChungChi", chungChiObj.SoChungChi);
        window.LoadDataInputText("DotHoiDong", chungChiObj.DotHoiDong);
        window.LoadDataInputText("HoTenRequire", chungChiObj.HoTen);
        window.LoadDataInputText("SoGiayToRequire", chungChiObj.SoGiayTo);
        window.LoadDataInputText("NoiCapGiayTo", chungChiObj.NoiCapGiayTo);
        window.LoadDataInputText("DienThoai", chungChiObj.Phone);
        window.LoadDataInputText("Email", chungChiObj.Email);
        window.LoadDataInputText("SoQuyetDinh", chungChiObj.SoQuyetDinh);
        window.LoadDataInputText("SoNha01", chungChiObj.ThuongTru_SoNha);
        window.LoadDataInputText("SoNha02", chungChiObj.ChoO_SoNha);
        window.LoadDataInputText("NgaySinh", chungChiObj.NgaySinh);// cái này string không phải datepicker
        window.LoadDataSelect2("NoiCapChungChi", chungChiObj.NoiCapChungChiID);
        window.LoadDataSelect2("TinhThanh01", chungChiObj.ThuongTru_TinhID);
        if (chungChiObj.IsDauKy && hdfThuTucId == "1") {
            window.LoadDataInputText("SoBienNhan", chungChiObj.SoBienNhanDauKy);
            window.setValueDateTimePicker("NgayNhan", chungChiObj.NgayNhanDauKy);
            window.setValueDateTimePicker("NgayHenTra", chungChiObj.NgayHenTraDauKy);
        } else {
            console.log("vào else");
        }
        window.LoadComboHuyenByTinhId($("select[name='TinhThanh01']"), chungChiObj.ThuongTru_TinhID, chungChiObj.ThuongTru_HuyenID);
        window.LoadComboXaByHuyenId($("select[name='QuanHuyen01']"), chungChiObj.ThuongTru_HuyenID, chungChiObj.ThuongTru_XaID);
        window.LoadDataSelect2("TinhThanh02", chungChiObj.ChoO_TinhID);
        window.LoadComboHuyenByTinhId($("select[name='TinhThanh02']"), chungChiObj.ChoO_TinhID, chungChiObj.ChoO_HuyenID);
        window.LoadComboXaByHuyenId($("select[name='QuanHuyen02']"), chungChiObj.ChoO_HuyenID, chungChiObj.ChoO_XaID);
        window.setValueDateTimePicker("NgayHoiDong", chungChiObj.NgayHoiDong);
        window.setValueDateTimePicker("NgayTrinhCap", chungChiObj.NgayTrinhCap);
        window.setValueDateTimePicker("NgayCapChungChi", chungChiObj.NgayCap);
        window.setValueDateTimePicker("NgayQuyetDinh", chungChiObj.NgayQuyetDinh);
        window.setValueDateTimePicker("NgayCapGiayTo", chungChiObj.NgayCapGiayTo);
        window.LoadDataCheckBox("gioi_tinh", chungChiObj.GioiTinh);
        window.LoadDataCheckBox("lgt", chungChiObj.LoaiGiayTo);
        window.LoadHinhAnh(chungChiObj.HinhAnh);
        console.log("data LoadDanhSachFileDinhKem");
        console.log(chungChiObj.AttachOriginalName, chungChiObj.AttachUploadName);

        window.LoadDanhSachFileDinhKem(chungChiObj.AttachOriginalName, chungChiObj.AttachUploadName);
        window.LoadDataSelectPicker($("select[name='hoat_dong_chuyen_mon']"), chungChiObj.PhamViHoatDongID, chungChiObj.PhamViHoatDongs);
        window.LoadDataSelectPicker($("select[name='du_dieu_kien_hanh_nghe']"), chungChiObj.DuDieuKienHanhNghe, chungChiObj.DuDieuKienHanhNghes);

    } else {
        if (hdfThuTucId != "1")
            window.appendValidate
                  (elementSoChungChi,
                      "border-color-a9",
                      ".color-red",
                      "<label class='color-red'> Số chứng chỉ không tồn tại! </label>");
    }
    EnabledButtonSave();
};

function LoadTrinhDo(data) {
    
    var table = $("#tbl_trinh_do");
    if (data.length > 0) {
        var html = "";
        $.each
        (data,
            function (i, item) {
                var id = item.TrinhDoID == 0 ? i : item.TrinhDoID;
                var obj = {
                    TrinhDo: item.TrinhDoChuyenMonID,
                    truong_dao_tao: item.TenTruongDaoTao,
                    TrinhDo_Name:_dataTrinhDo? _dataTrinhDo.find(x => x.ID == item.TrinhDoChuyenMonID).Ten:"",
                    name_tot_nghiep: item.NamTotNghiep
                }
                html += html_Load_tbl_TrinhDo(id, obj);
            });

        table.find("tbody").empty().append(html);
    } else {
        table.find("tbody").empty();
    }
};

function LoadQuaTrinh(data) {
    var table = $("#tbl_qua_trinh_cong_tac");
    if (data.length > 0) {
        var html = "";
        $.each
        (data,
            function (i, item) {
                var id = item.QuaTrinhID == 0 ? i : item.QuaTrinhID;
                var obj = {
                    loai: item.IsDonViNhaNuoc == "true" ? "1" : "0",
                    don_vi_cong_tac: item.TenDonViThucHanh,
                    thoi_gian_cong_tac: item.ThoiGianThucHanh
                }
                html += html_Load_tbl_CongTac(id, obj);
            });
        table.find("tbody").empty().append(html);
    } else {
        table.find("tbody").empty();
    }
};

function XyLyGetTblTrinhDo() {
    var table = $("#tbl_trinh_do");
    var tr = table.find("tbody tr");
    return window.GetAllItemInARow(tr);
};

function XyLyGetTblCongTac() {
    var table = $("#tbl_qua_trinh_cong_tac");
    var tr = table.find("tbody tr");
    return window.GetAllItemInARow(tr);
};


function LoadDanhSachFileDinhKem(nameGoc, nameUpLoad) {
    var arrayGoc = window.SplitStringByKey(nameGoc, "|");
    var arrayUpLoad = window.SplitStringByKey(nameUpLoad, "|");
    //_arrDinhKem
    var pathUpLoad = $("#hdfPathUploadFile").val();
    var html = "";
    $.each(arrayGoc, function (i, item) {
        var nameGocWithoutEx = window.GetFileNameWithoutExtension(arrayUpLoad[i]);
        nameGocWithoutEx = window.SplitStringByKey(nameGocWithoutEx, "_");
        var id = nameGocWithoutEx[0];
        var objFile = { nameGoc: arrayGoc[i], nameUpload: arrayUpLoad[i], id: id };
        _arrObjFile.push(objFile);
        var fullpath = pathUpLoad + arrayUpLoad[i];
        fullpath = window.ResolveUrl(fullpath);
        html += '<div class="parent_dinh_kem">';
        html += "<a class='cursor-pointer' href=" + fullpath + " download=\"" + arrayGoc[i] + "\" >" + arrayGoc[i] + "</a>";
        html +=
            '<span data-id=' +
            id +
            ' class="glyphicon glyphicon-remove btn_xoa_dinh_kem cursor-pointer ml-5 color-red"> </span>';
        html += "</div>";
    });

    $(".div_lst_tap_dinh_kem").empty().append(html);
};

function JoinNameByArray_Attr_Keys(arrObj, attr, keys) {
    var stringbuilder = "";
    $.each
    (arrObj,
        function (i, item) {
            stringbuilder += item[attr] + keys;
        });
    return window.RemoveLastNumberIndexString(stringbuilder, 1);
}


function XyLySaveTrinhDo(e) {
    var element = $(e);
    var table = element.closest("table");
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
        var namHienTai = window.getCurrentYear();
        if (namHienTai < objData.name_tot_nghiep) {
            window.alert_info("Năm tốt nghiệp không được lớn hơn năm hiện tại chớ!");
        }
        else {
            var html = html_Load_tbl_TrinhDo(newDataId, objData);
            if (dataId == 0)
                tbody.append(html);
            else {
                trParent.after(html);
                tbody.find("tr[class='font-size-13 hidden']").remove();
            }
            trParent.remove();
        }
    }
};

function html_Load_tbl_TrinhDo(newDataId, objData) {
    var html = "";
    html += '<tr data-id="' + newDataId + '" class="font-size-13">';
    html += '<td class="input-get line-height-1_1-Em work-break" data-name="TrinhDoChuyenMonID" data-value=' + objData.TrinhDo + '> ' + objData.TrinhDo_Name + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em work-break" data-name="NamTotNghiep" data-value=' + objData.name_tot_nghiep + '>' + objData.name_tot_nghiep + '</td>';
    html += '<td class="input-get line-height-1_1-Em work-break"  data-name="TenTruongDaoTao" data-value=' + escapeHtml(objData.truong_dao_tao) + '>' + objData.truong_dao_tao + ' </td>';
    html += '<td class="fa fa-edit cursor-pointer color-blue font-size-20 table-cell syt-edit-btn line-height-1_1-Em"';
    html += ' data-trinhdoId="' + objData.TrinhDo + '"  data-trinh-do="' + objData.TrinhDo_Name + '" data-nam_tot_nghiep="' + objData.name_tot_nghiep + '"';
    html += ' data-id="' + newDataId + '"  data-truong_dao_tao="' + escapeHtml(objData.truong_dao_tao) + '" title="Sửa"></td>';
    html += ' <td class="glyphicon glyphicon-trash cursor-pointer color-blue  font-size-18  position-inherit line-height-1_1-Em" title="Xóa"';
    html += 'onclick="fn_Xoa_Dong(this)"></td>';
    html += '</tr>';
    return html;
};

function XyLySaveCongTac(e) {
    var element = $(e);
    var table = element.closest("table");
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
        var html = html_Load_tbl_CongTac(newDataId, objData);
        if (dataId == 0)
            table.find("tbody").append(html);
        else {
            trParent.after(html);
        }
        trParent.remove();
    }
};

function html_Load_tbl_CongTac(newDataId, objData) {
    var loaiName = objData.loai == 1 ? "Nhà nước" : "Tư nhân";
    var loaiBoolean = objData.loai == 1 ? "true" : "false";
    var html = "";
    html += '<tr data-id="' + newDataId + '" class="font-size-13">';
    html += '<td   class="input-get line-height-1_1-Em work-break"  data-name="ThoiGianThucHanh" data-value=' + escapeHtml(objData.thoi_gian_cong_tac) + '> ' + objData.thoi_gian_cong_tac + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em work-break" data-name="TenDonViThucHanh" data-value=' + escapeHtml(objData.don_vi_cong_tac) + '>' + objData.don_vi_cong_tac + '</td>';
    html += '<td class="input-get line-height-1_1-Em work-break" data-name="IsDonViNhaNuoc" data-value=' + loaiBoolean + '>' + loaiName + ' </td>';
    html += '<td class="fa fa-edit cursor-pointer color-blue font-size-20 table-cell syt-edit-btn line-height-1_1-Em"';
    html += ' data-thoi_gian_cong_tac="' + escapeHtml(objData.thoi_gian_cong_tac) + '"  data-don_vi_cong_tac="' + escapeHtml(objData.don_vi_cong_tac) + '"';
    html += ' data-id="' + newDataId + '"  data-loai="' + objData.loai + '" title="Sửa"></td>';
    html += ' <td class="glyphicon glyphicon-trash cursor-pointer color-blue  font-size-18 position-inherit line-height-1_1-Em" title="Xóa"';
    html += 'onclick="fn_Xoa_Dong(this)"></td>';
    html += '</tr>';
    return html;
}



$(document).on
("click", "#icon_search_chung_chi", (e) => {
    $('#modal-ds-chung-chi').modal('toggle');
    CallSearchAdvanceFunc(false);
});


function CallSearchAdvanceFunc(isSearch) {
    console.log(isSearch);
    var parent = $("#modal-ds-chung-chi");
    var divId = ".div_edit_table_parent";
    if (isSearch) {
        var objArr = window.GetAllInputOnDiv(parent);
        console.log(objArr);
        XuLyCall_showDataTable_Func(divId, objArr);
    } else {
        XuLyCall_showDataTable_Func(divId);
    }
}
function XuLyCall_showDataTable_Func(divId, objArr) {
    if (objArr)
        showDataTable(divId, objArr);
    else
        showDataTable(divId);
};

function showDataTable(divId, chungchi) {
    var tableid = $(divId).find("#tbl_chung_chi");
    console.log(tableid);
    var dataRequest = JSON.stringify(chungchi);
    console.log(dataRequest);
    var tblDataTable = $(tableid).DataTable
       ({
           "proccessing": true,
           "serverSide": true,
           "destroy": true,
           "ajax": {
               "type": "Post",
               "url": "/DesktopModules/MVC/NghiepVu/NganhY/TraCuuChungChiByPage",
               "dataType": "json",
               data: chungchi,
               headers: {
                   "ModuleId": moduleId,
                   "TabId": tabId,
                   "RequestVerificationToken": rvtoken
               }
           },
           dom: "<'row'<'col-md-8 col-sm-10' <'col-lg-3 col-md-3 col-sm-6  text-left  font-size-13 mt-mobile-5'i><'col-lg-3 col-md-4 col-sm-6  text-left nopadding  font-size-13 mt-mobile-5'l><'col-lg-1 col-md-1 col-sm-2 font-size-13  mt-mobile-5 col-xs-2 text-center padding-all-5'> <'col-lg-5 col-md-4 col-sm-10  col-xs-10 nopadding text-left no-border decrease-padding  font-size-13 syt-label mt-mobile-5'p>><'col-md-4 col-sm-2'>><t>",
           "language": {
               "lengthMenu": "_MENU_ &nbsp;dòng trên trang",
               "zeroRecords": "Không tìm thấy",
               "info": "Tổng số dòng:&nbsp;  _TOTAL_",
               "infoEmpty": "STT 0 - 0 / 0",
               paginate: {
                   first: "|<",
                   previous: "",
                   next: "",
                   last: ">|"
               },
               search: "Tìm Kiếm"

           },
           columns: [
               {
                   "render": function (data, type, full, meta) {
                       return '<input type="radio" name="chk_chon_chung_chi"/>';
                   },
                   "orderable": false,
                   "width": "5%",
                   "className": "text-center  cursor-pointer xem_chi_tiet"
               },
               {
                   "render": function (data, type, full, meta) {
                       return full.RowNo;
                   },
                   "orderable": false,
                   "className": "word-break text-center cursor-pointer xem_chi_tiet"
               },
               {
                   "render": function (data, type, full, meta) {
                       if (full.NgayCap)
                           return window.moment(full.NgayCap).format("DD/MM/YYYY");
                       else
                           return "";
                   },
                   "orderable": false,
                   "width": "5%",
                   "className": "word-break text-center cursor-pointer xem_chi_tiet"
               },
               { "data": "SoChungChi", "width": null, "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               { "data": "HoTen", "width": "10%", "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               { "data": "SoGiayTo", "width": null, "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               { "data": "ChoO_DiaChi", "width": "20%", "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               { "data": "PhamViHoatDongChuyenMons", "width": "20%", "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               { "data": "TrangThaiGiayPhep", "width": "20%", "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" }
           ],
           'createdRow': function (row, data) {
               $(row).attr('data-id', data.ChungChiHanhNgheYID);
               $(row).attr('data-sochungchi', data.SoChungChi);
           },
           'lengthChange': true,
           "ordering": false,
           'searching': false,
           'autoWidth': false
       });
    window.ReLoadAjaxDataTable(tblDataTable);
};

$(document).on
("click",
    ".xem_chi_tiet",
    (e) => {
        var element = $(e.target);
        var parentTr = element.closest("tr");
        var checkBox = parentTr.find("input[type='radio']");
        var soChungChi = parentTr.attr("data-sochungchi");
        if (checkBox.is(":checked")) {
            checkBox.prop("checked", false);
            $(".input-select").attr("data-sochungchi", "");
        } else {
            $(".input-select").attr("data-sochungchi", soChungChi);
            checkBox.prop("checked", true);

        }
    });
$(document).on
("dblclick",
    ".xem_chi_tiet",
    (e) => {
        var element = $(e.target);
        var parentTr = element.closest("tr");
        var soChungChi = parentTr.attr("data-sochungchi");
        XuLyChonSoChungChi(soChungChi);
    });

$(document).on
("click",
    ".input-select",
    (e) => {
        var element = $(e.target);
        var soChungChi = element.attr("data-sochungchi");
        XuLyChonSoChungChi(soChungChi);
    });

function XuLyChonSoChungChi(soChungChi) {
    var hdfThuTucId = $('input[name="hdfThuTucId"]').val();
    $('#modal-ds-chung-chi').modal('hide');
    window.LoadChungChiBySoChungChi(soChungChi,
        hdfThuTucId == "3" ?
        "XuLyLoadDataChungChiBoSungTruoc" : "XuLyLoadDataChungChi");

}












