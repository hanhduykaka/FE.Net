
function fnSaveCCDuocCapMoi(linhVucId, thuThucId) {
    if (!validateform()) {
        return;
    }
    var formdata = PreparingSaveChungChi(linhVucId, thuThucId);
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/NganhDuoc/SaveHoSoCCDuoc",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            formdata,
            false,
            "json",
            false).then
        ((data) => {
            if (data) {
                if (data.Content > 0) {
                    window.alert_success("Lưu thành công!");
                    window._arrObjFile = [];
                    window._arrObjDinhKem = [];
                    $('input[name="hdfId"]').val(data.Content);
                    Id = data.Content;
                    fnLoadCCDuocCapMoi();
                }
                else if (data.Content == 0)
                    window.alert_error("Số chứng chỉ đã tồn tại!");
                else
                    window.alert_error("Lưu không thành công!");
            } else
                window.alert_error("Lưu không thành công!");
        });
};

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
    var trangthai = $("input[name='hdfTrangThaiId']").val() == "" ? "0" : $("input[name='hdfTrangThaiId']").val();
    objArr["TrangThaiHoSoID"] = trangthai;
    objArr["ChungChiDuocID"] = chungChiId;
    objArr["HoSoID"] = hoSoId;
    objArr["IsDauKy"] = $('input[name="hdfDauKy"]').val();
    objArr["DataHinh"] = $('#img-hinh-dai-dien').attr("data-hinh");
    var nameGoc = JoinNameByArray_Attr_Keys(_arrObjFile, "nameGoc", "|");
    var nameUpload = JoinNameByArray_Attr_Keys(_arrObjFile, "nameUpload", "|");
    objArr["NameGoc"] = nameGoc;
    objArr["NameUpload"] = nameUpload;
    objArr["ArrTrinhDo"] = XyLyGetTblTrinhDo();
    objArr["ArrCongTac"] = XyLyGetTblCongTac();
    var file = document.getElementById("file_Hinh_anh").files[0];
    formdata.append("model", JSON.stringify(objArr));
    formdata.append('img', file);
    $.each
    (_arrObjDinhKemPostFile,
        function (i, item) {
            formdata.append(item.id, item.file);
        });
    return formdata;
}

function fnLoadCCDuocCapMoi() {
    if (Id)
        LoadCCDuocByID("CCDuoc_XuLyLoadDataChungChi");
    else if (HoSoID)
        LoadCCDuocByHoSoID("CCDuoc_XuLyLoadDataChungChi");
    else
        CCDuoc_XuLyLoadDataChungChi();
    $('.btn_Xoa').off("click");
    $('.btn_Xoa').click(CCDuoc_onClickBtnXoa);
    window.LoadDataInputText("hdfInDeXuat", "/DesktopModules/MVC/NghiepVu/NganhDuoc/InDeXuatCCDuoc");
    window.LoadDataInputText("hdfInChungChi", "/DesktopModules/MVC/NghiepVu/NganhDuoc/InChungChiCCDuoc");
};
function LoadCCDuocByHoSoID(funcXuly) {
    var request = JSON.stringify({ HoSoID: HoSoID });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/NganhDuoc/GetCCDuocByHoSoID",
          window.moduleId,
          window.tabId,
          $("input[name='__RequestVerificationToken']").val(),
          request,
          "application/json; charset=utf-8",
          "json",
          true)
      .then
      (function (data) {
          if (data && data.Content) {
              var result = $.parseJSON(data.Content);
              window[funcXuly](result);
          }
          else {
              window[funcXuly]();
          }
      }, function (err) {
          window[funcXuly]();
      });
}
function LoadCCDuocByID(funcXuly) {
    var request = JSON.stringify({ ChungChiDuocID: Id });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/NganhDuoc/GetCCDuocByID",
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
              window[funcXuly](result);
          }
          else {
              window[funcXuly]();
          }
      }, function (err) {
          window[funcXuly]();
      });
}
function LoadChungChiDuocBySoChungChi(soChungChi, funcXuly) {
    var requestSoChungChi = JSON.stringify({ soChungChi: soChungChi });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/NganhDuoc/GetChungChiBySoChungChi",
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

function CCDuoc_XuLyLoadDataChungChi(result) {
    var elementSoChungChi = $("input[name='SoChungChi']");
    var hdfThuTucId = $('input[name="hdfThuTucId"]').val();
    if (!result)
        result = {
            cC_Duoc: {},
            lstCC_Duoc_QTTH: [],
            lstCC_Duoc_TDCM: []
        }
    var chungChiObj = result.cC_Duoc;
    //
    Id = chungChiObj.ChungChiDuocId || 0;
    $('input[name="hdfId"]').val(Id);
    $('input[name="hdfSoChungChi"]').val(chungChiObj.SoChungChi || '');
    //
    if (Id) {
        HoSoID = chungChiObj.HoSoID;
        window.LoadDataInputText("hdfHoSoId", chungChiObj.HoSoID);
        $(".btn_In").parent().attr('hidden', false);
        $(".btn_Xoa").parent().attr('hidden', false);
    }
    else {
        $(".btn_In").parent().attr('hidden', true);
        $(".btn_Xoa").parent().attr('hidden', true);
        
    }
    if (HoSoID)
        CCDuoc_XuLyLoadOnlyDataHoSo();
    else {
        window.LoadDataInputText("SoBienNhan", chungChiObj.SoBienNhanDauKy);
        window.setValueDateTimePicker("NgayNhan", chungChiObj.NgayNhanDauKy);
        window.setValueDateTimePicker("NgayHenTra", chungChiObj.NgayHenTraDauKy);
    }
    CCDuoc_DisableDataHoSo(HoSoID != 0);
   
    window.removeValidate(elementSoChungChi, "border-color-a9", ".color-red");
    var lstCCDuocQtth = result.lstCC_Duoc_QTTH;
    LoadQuaTrinh(lstCCDuocQtth);
    var lstCCDuocTdcm = result.lstCC_Duoc_TDCM;
    LoadTrinhDo(lstCCDuocTdcm);
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
    if (chungChiObj.HinhAnh)
        window.LoadHinhAnh(chungChiObj.HinhAnh);
    window.LoadDanhSachFileDinhKem(chungChiObj.AttachOriginalName, chungChiObj.AttachUploadName);
    window.LoadDataSelectPicker($("select[name='hoat_dong_chuyen_mon']"), chungChiObj.PhamViHoatDongID, chungChiObj.PhamViHoatDongs);
    window.LoadDataSelectPicker($("select[name='du_dieu_kien_hanh_nghe']"), chungChiObj.DuDieuKienHanhNghe, chungChiObj.DuDieuKienHanhNghes);
    var listelementTo = ['input[name="NgayHenTra"]', 'input[name="NgayCapChungChi"]', 'input[name="NgayQuyetDinh"]', 'input[name="NgayHoiDong"]', 'input[name="NgayTrinhCap"]'];
        ValidateDatePickers('input[name="NgayNhan"]', listelementTo);
        $.each(listelementTo, (index, elementTo) => {
            $(elementTo).trigger('dp.change');
        });
        $('input[name = "NgayNhan"]').trigger('dp.change');

}
function CCDuoc_onClickBtnXoa(e) {
    var request = JSON.stringify({ ChungChiDuocID: Id });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/NganhDuoc/DeleteHoSoCCDuocByChungChiDuocID",
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
              if (data.Content) {
                  window.alert_success("Xóa thành công!");
                  window.LoadDataInputText("hdfId", '');
                  Id = '';
                  fnLoadCCDuocCapMoi();
              }
              else
                  window.alert_error("Xóa không thành công!");
          } else
              window.alert_error("Xóa không thành công!");

      });
}
function CCDuoc_DisableDataHoSo(disabled) {
    $('input[name="SoBienNhan"]').attr('disabled', disabled);
    $('input[name="NgayNhan"]').attr('disabled', disabled);
    $('input[name="NgayHenTra"]').attr('disabled', disabled);
}
function CCDuoc_XuLyLoadOnlyDataHoSo() {
    var request = JSON.stringify({ hosoId: HoSoID });
    window.AjaxDungChung
       ("post",
           "/DesktopModules/MVC/NghiepVu/HoSo/GetHoSoById",
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
                   window.LoadDataInputText("SoBienNhan", result.SoBienNhan);
                   window.setValueDateTimePicker("NgayNhan", result.NgayNhan);
                   window.setValueDateTimePicker("NgayHenTra", result.NgayHenTra);
                   window.LoadDataInputText("hdfHoSoId", result.HoSoID);
               }
               else {
                   HoSoID = 0;
                   window.LoadDataInputText("hdfHoSoId", 0);
                   window.LoadDataInputText("SoBienNhan", "");
                   window.setValueDateTimePicker("NgayNhan", null);
                   window.setValueDateTimePicker("NgayHenTra", null);
               }
           }
           else {
               window.alert_error("Lỗi load thông tin hồ sơ!");
               HoSoID = 0;
               window.LoadDataInputText("hdfHoSoId", 0);
               window.LoadDataInputText("SoBienNhan", "");
               window.setValueDateTimePicker("NgayNhan", null);
               window.setValueDateTimePicker("NgayHenTra", null);
           }
       });
}
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
                    truong_dao_tao: window.escapeHtml(item.TenTruongDaoTao),
                    TrinhDo_Name: _dataTrinhDo.find(x => x.ID == item.TrinhDoChuyenMonID).Ten,
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
                    don_vi_cong_tac: window.escapeHtml(item.TenDonViThucHanh),
                    thoi_gian_cong_tac: window.escapeHtml(item.ThoiGianThucHanh)
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
    var tr = table.find("tbody tr:visible");
    return window.GetAllItemInARow(tr);
};

function XyLyGetTblCongTac() {
    var table = $("#tbl_qua_trinh_cong_tac");
    var tr = table.find("tbody tr:visible");
    return window.GetAllItemInARow(tr);
};

function LoadDataSelectPicker(element, lstStringId, lstStringName) {
    var arrayId = window.SplitStringByKey(lstStringId, "-");
    var arrayName = window.SplitStringByKey(lstStringName, ";");
    var divDanhSach = element.closest(".div_selpicker_parent").find(".ds_selectpicker");
    var htmlGen = html_gen_selectpickerbyName
    (arrayId,
        arrayName);
    divDanhSach.empty().append(htmlGen);
    $.each
    (arrayId,
        function (i, item) {
            $(element).find("[value=" + item + "]").prop("selected", true);
        });
    $(element).multiselect("refresh");
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

function LoadHinhAnh(hinhAnh) {
    var element = $("#img-hinh-dai-dien");
    XuLyLoadAnh(hinhAnh, element);
    var parent = element.closest(".div-upload-parent");
    parent.find(".upload-xoa-hinh-anh").removeClass("hidden").addClass("show");
    parent.find(".upload-this").removeClass("show").addClass("hidden");
};

function XuLyLoadAnh(hinhAnh, element) {
    if (hinhAnh) {
        var pathUpLoad = $("#hdfPathUploadFile").val();
        var fullpath = window.ResolveUrl(pathUpLoad + hinhAnh);
        element.attr("data-hinh", hinhAnh);
        element.attr("src", fullpath);
    }
    else
        element.attr("src", "");
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
    objData.truong_dao_tao = window.escapeHtml(objData.truong_dao_tao);
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
    html += '<td class="input-get line-height-1_1-Em" data-name="TrinhDoChuyenMonID" data-value="' + objData.TrinhDo + '"> ' + objData.TrinhDo_Name + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em" data-name="NamTotNghiep" data-value="' + objData.name_tot_nghiep + '">' + objData.name_tot_nghiep + '</td>';
    html += '<td class="input-get line-height-1_1-Em"  data-name="TenTruongDaoTao" data-value="' + objData.truong_dao_tao + '">' + objData.truong_dao_tao + ' </td>';
    html += '<td class="fa fa-edit cursor-pointer color-blue font-size-20 table-cell syt-edit-btn line-height-1_1-Em"';
    html += ' data-trinhdoId="' + objData.TrinhDo + '"  data-trinh-do="' + objData.TrinhDo_Name + '" data-nam_tot_nghiep="' + objData.name_tot_nghiep + '"';
    html += ' data-id="' + newDataId + '"  data-truong_dao_tao="' + objData.truong_dao_tao + '" title="Sửa"></td>';
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
    objData.thoi_gian_cong_tac = window.escapeHtml(objData.thoi_gian_cong_tac);
    objData.don_vi_cong_tac = window.escapeHtml(objData.don_vi_cong_tac);
    if (objData) {
        var html = html_Load_tbl_CongTac(newDataId, objData);
        if (dataId == 0)
            table.find("tbody").append(html);
        else {
            trParent.after(html);
            tbody.find("tr[class='font-size-13 hidden']").remove();
        }
        trParent.remove();
    }
};

function html_Load_tbl_CongTac(newDataId, objData) {
    var loaiName = objData.loai == 1 ? "Nhà nước" : "Tư nhân";
    var loaiBoolean = objData.loai == 1 ? "true" : "false";
    var html = "";
    html += '<tr data-id="' + newDataId + '" class="font-size-13">';
    html += '<td   class="input-get line-height-1_1-Em"  data-name="ThoiGianThucHanh" data-value="' + objData.thoi_gian_cong_tac + '"> ' + objData.thoi_gian_cong_tac + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em" data-name="TenDonViThucHanh" data-value="' + objData.don_vi_cong_tac + '">' + objData.don_vi_cong_tac + '</td>';
    html += '<td class="input-get line-height-1_1-Em" data-name="IsDonViNhaNuoc" data-value="' + loaiBoolean + '">' + loaiName + ' </td>';
    html += '<td class="fa fa-edit cursor-pointer color-blue font-size-20 table-cell syt-edit-btn line-height-1_1-Em"';
    html += ' data-thoi_gian_cong_tac="' + objData.thoi_gian_cong_tac + '"  data-don_vi_cong_tac="' + objData.don_vi_cong_tac + '"';
    html += ' data-id="' + newDataId + '"  data-loai="' + objData.loai + '" title="Sửa"></td>';
    html += ' <td class="glyphicon glyphicon-trash cursor-pointer color-blue  font-size-18 position-inherit line-height-1_1-Em" title="Xóa"';
    html += 'onclick="fn_Xoa_Dong(this)"></td>';
    html += '</tr>';
    return html;
}

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
function ValidateDatePickers(elementFrom, listelementTo) {
    $(elementFrom).on("dp.change", function (e) {
        $.each(listelementTo, (index, elementTo) => {
            $(elementTo).data("DateTimePicker").minDate(e.date);
        });
    });
    $.each(listelementTo, (index, elementTo) => {
        $(elementTo).on("dp.change", function (e) {
            if ($(elementFrom).data("DateTimePicker").maxDate() > e.date)
                $(elementFrom).data("DateTimePicker").maxDate(e.date);
        });
    });
};











