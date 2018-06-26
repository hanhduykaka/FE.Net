//Function xu ly
function fnSave_Duoc_GPP(linhVucId, thuTucId) {
    if (!validateform()) {
        return;
    }
    var formdata = PreparingSave_Duoc_GPP(linhVucId, thuTucId);
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/NganhDuoc/SaveHoSoGPP",
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
                    window.LoadDataInputText("hdfId", data.Content);
                    Id = data.Content;
                    fnLoad_Duoc_GPP();
                }
                else if (data.Content == 0) 
                    window.alert_error("Số giấy chứng nhận đã tồn tại!");
                else
                    window.alert_error("Lưu không thành công!");
            } else
                window.alert_error("Lưu không thành công!");
        });
}
function PreparingSave_Duoc_GPP(linhVucId, thuTucId) {
    var parent = $(".div_tong");
    var formdata = new FormData();
    var objArr = window.GetAllInputOnDiv(parent);
    objArr["LinhVucId"] = linhVucId;
    objArr["ThuTucId"] = thuTucId;
    var hoSoId = $('input[name="hdfHoSoId"]').val() == "" ? "0" : $('input[name="hdfHoSoId"]').val();
    var THTGPPId = $('input[name="hdfId"]').val() == ""
        ? "0"
        : $('input[name="hdfId"]').val();
    objArr["THTGPPId"] = THTGPPId;
    objArr["HoSoID"] = hoSoId;
    var chungChiDuocID = $('input[name="hdfChungChiDuocId"]').val() == "" ? "0" : $('input[name="hdfChungChiDuocId"]').val();
    var trangthai = $("input[name='hdfTrangThaiId']").val() == "" ? "0" : $("input[name='hdfTrangThaiId']").val();
    objArr["ChungChiDuocID"] = chungChiDuocID;
    objArr["trangthai"] = trangthai;
    formdata.append("model", JSON.stringify(objArr));
    return formdata;
}
function fnLoad_Duoc_GPP() {
    if (Id)
        LoadGPPByID("GPP_XuLyLoadData");
    else if (HoSoID)
        LoadGPPByHoSoID("GPP_XuLyLoadData");
    else
        GPP_XuLyLoadData();
 
    $('input[name="SoChungChi"]').blur(GPP_onBlurSoChungChi);
    $('.btn_Xoa').off( "click");
    $('.btn_Xoa').click(GPP_onClickBtnXoa);
    $('.icon_search_chung_chi').addClass("GPP");
    $('.icon_search_uu_diem').addClass("GPP");
    $('.icon_search_ton_tai').addClass("GPP");
    $('.icon_search_ket_luan').addClass("GPP");
    $('.input-select-chung-chi').addClass("GPP");
    $('.input-search-chung-chi').addClass("GPP");
    $('.input-select-ttkt').addClass("GPP");
    $('.input-search-ttkt').addClass("GPP");
    window.LoadDataInputText("hdfInDeXuat", "/DesktopModules/MVC/NghiepVu/NganhDuoc/InDeXuatGPP");
    window.LoadDataInputText("hdfInChungChi", "/DesktopModules/MVC/NghiepVu/NganhDuoc/InChungChiGPP");
}
function LoadGPPByHoSoID(funcXuly) {
    var request = JSON.stringify({ HoSoID: HoSoID });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/NganhDuoc/GetCN_GPPByHoSoID",
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
function LoadGPPByID(funcXuly) {
    var request = JSON.stringify({ THTGPPID: Id });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/NganhDuoc/GetCN_GPPByID",
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
function GPP_XuLyLoadData(result) {
    if (result) {
        $(".btn_In").parent().attr('hidden', false);
        $(".btn_Xoa").parent().attr('hidden', false);
        window.LoadDataInputText("hdfId", result.THTGPPId);
        Id = result.THTGPPId;
        //THÔNG TIN GIẤY CHỨNG NHẬN
        if (!HoSoID) {
            HoSoID = result.HoSoID;
            window.LoadDataInputText("hdfHoSoId", result.HoSoID);
            window.LoadHoSoByHoSoId(HoSoID);
        }
        window.LoadDataInputText("SoGiayChungNhan", result.SoGiayChungNhan);
        window.setValueDateTimePicker("NgayCapChungNhan", result.NgayCapChungNhan);
        var optionThoiHan = $('select[Name="ThoiHan"]').children('option');
        $.each(optionThoiHan, (index, ele) => {
            if ($(ele).text()== result.ThoiHan)
                window.LoadDataSelect2("ThoiHan", $(ele).val());
        });
        window.LoadDataInputText("SoQuyetDinh", result.SoQuyetDinh);
        window.setValueDateTimePicker("NgayQuyetDinh", result.NgayQuyetDinh);
        //CƠ SỞ ĐƯỢC CẤP CHỨNG NHẬN
        window.LoadDataInputText("TenCoSo", result.TenCoSo);
        window.LoadDataInputText("SoDKKD", result.SoDKKD);
        window.LoadDataInputText("TrucThuoc", result.TrucThuoc);
        window.LoadDataSelect2("TinhThanh01", result.TinhThanhCSId);
        window.LoadComboHuyenByTinhId($("select[name='TinhThanh01']"), result.TinhThanhCSId, result.QuanCSId);
        window.LoadComboXaByHuyenId($("select[name='QuanHuyen01']"), result.QuanCSId, result.PhuongCSId);
        window.LoadDataInputText("SoNha01", result.SoNhaCS);
        window.LoadDataInputText("DienThoai", result.SoDienThoai);
        window.LoadDataInputText("Email", result.Email);
        //NGƯỜI PHỤ TRÁCH CHUYÊN MÔN
        LoadChungChiDuocBySoChungChi(result.SoChungChi, "GPP_XuLyLoadOnlyDataChungChi");
        //PHẠM VI KINH DOANH
        window.LoadDataSelectPicker($("select[name='PhamViKinhDoanh']"), result.PhamViKinhDoanhIds, result.PhamViKinhDoanhs);
        //THÔNG TIN KIỂM TRA
        window.LoadDataInputText("TruongDoan", result.TruongDoanKiemTra);
        window.setValueDateTimePicker("NgayKiemTra", result.NgayKiemTra);
        $('textarea[name="UuDiem"]').val(result.UuDiem);
        $('textarea[name="TonTai"]').val(result.TonTai);
        $('textarea[name="KetLuan"]').val(result.KetLuan);
        var listelementTo = ['input[name="NgayHenTra"]', 'input[name="NgayCapChungNhan"]', 'input[name="NgayQuyetDinh"]']
        ValidateDatePickers('input[name="NgayNhan"]', listelementTo);
        $.each(listelementTo, (index, elementTo) => {
            $(elementTo).trigger('dp.change');
        });
        $('input[name = "NgayNhan"]').trigger('dp.change');
    }
    else {
        $(".btn_In").parent().attr('hidden', true);
        $(".btn_Xoa").parent().attr('hidden', true);
        //THÔNG TIN GIẤY CHỨNG NHẬN
        GPP_XuLyLoadOnlyDataHoSo();
        window.LoadDataInputText("SoGiayChungNhan", '');
        $("input[name='NgayCapChungNhan']").val(null);
        window.LoadDataSelect2("ThoiHan", null);
        window.LoadDataInputText("SoQuyetDinh", '');
        $("input[name='NgayQuyetDinh']").val(null);
        //CƠ SỞ ĐƯỢC CẤP CHỨNG NHẬN
        window.LoadDataInputText("TenCoSo", '');
        window.LoadDataInputText("SoDKKD", '');
        window.LoadDataInputText("TrucThuoc", '');
        window.LoadDataSelect2("TinhThanh01", null);
        window.LoadComboHuyenByTinhId($("select[name='TinhThanh01']"), null, null);
        window.LoadComboXaByHuyenId($("select[name='QuanHuyen01']"), null, null);
        window.LoadDataInputText("SoNha01", '');
        window.LoadDataInputText("DienThoai", '');
        window.LoadDataInputText("Email", '');
        //NGƯỜI PHỤ TRÁCH CHUYÊN MÔN
        $('input[name="SoChungChi"]').val('');
        GPP_XuLyLoadOnlyDataChungChi();
        //PHẠM VI KINH DOANH
        window.LoadDataSelectPicker($("select[name='PhamViKinhDoanh']"), null, null);
        //THÔNG TIN KIỂM TRA
        window.LoadDataInputText("TruongDoan", '');
        $("input[name='NgayKiemTra']").val(null);
        $('textarea[name="UuDiem"]').val('');
        $('textarea[name="TonTai"]').val('');
        $('textarea[name="KetLuan"]').val('');
    }
    $('select[name="VanBangChuyenMon"]').parent().attr('hidden', true);
    $('input[name="NgayCapCCHN"]').attr('disabled', true);
    $('input[name="NoiCapCCHN"]').attr('disabled', true);
    $('input[name="HoTen"]').attr('disabled', true);
    $('input[name="gioi_tinh"]').each((index, element) => {
        $(element).attr('disabled', true)
    });
    $('input[name="NgaySinh"]').attr('disabled', true);
}
function GPP_XuLyLoadOnlyDataHoSo() {
    if (!HoSoID || HoSoID == 0) {
        HoSoID = 0;
        window.LoadDataInputText("hdfHoSoId", 0);
        window.LoadDataInputText("SoBienNhan", "");
        window.setValueDateTimePicker("NgayNhan", null);
        window.setValueDateTimePicker("NgayHenTra", null);
        $('input[name="SoBienNhan"]').attr('disabled', false);
        $('input[name="NgayNhan"]').attr('disabled', false);
        $('input[name="NgayHenTra"]').attr('disabled', false);
    }
    else {
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
                   window.LoadDataInputText("SoBienNhan", result.SoBienNhan);
                   window.setValueDateTimePicker("NgayNhan", result.NgayNhan);
                   window.setValueDateTimePicker("NgayHenTra", result.NgayHenTra);
                   window.LoadDataInputText("hdfHoSoId", result.HoSoID);
                   $('input[name="SoBienNhan"]').attr('disabled', true);
                   $('input[name="NgayNhan"]').attr('disabled', true);
                   $('input[name="NgayHenTra"]').attr('disabled', true);
               }
               else {
                   window.alert_error("Lỗi load thông tin hồ sơ!");
                   HoSoID = 0;
                   window.LoadDataInputText("hdfHoSoId", 0);
                   window.LoadDataInputText("SoBienNhan", "");
                   window.setValueDateTimePicker("NgayNhan", null);
                   window.setValueDateTimePicker("NgayHenTra", null);
                   $('input[name="SoBienNhan"]').attr('disabled', false);
                   $('input[name="NgayNhan"]').attr('disabled', false);
                   $('input[name="NgayHenTra"]').attr('disabled', false);
               }
           });
    }
}
function GPP_XuLyLoadOnlyDataChungChi(result) {
    if (result) {
        window.removeValidate($('input[name="SoChungChi"]'), "border-color-a9", ".color-red");
        var objChungChiDuoc = result.cC_Duoc
        window.LoadDataInputText("hdfChungChiDuocId", objChungChiDuoc.ChungChiDuocID);
        window.LoadDataInputText("SoChungChi", objChungChiDuoc.SoChungChi);
        window.setValueDateTimePicker("NgayCapCCHN", objChungChiDuoc.NgayCap);
        window.LoadDataInputText("NoiCapCCHN", objChungChiDuoc.NoiCapChungChi);
        window.LoadDataInputText("HoTen", objChungChiDuoc.HoTen);
        window.LoadDataInputText("NgaySinh", objChungChiDuoc.NgaySinh);
        $("input[name=gioi_tinh][value='" + objChungChiDuoc.GioiTinhID + "']").prop("checked", true);
        var stringVanBang = '';
        var arrTrinhDo = result.lstCC_Duoc_TDCM;
        if (_dataTrinhDo.length > 0)
            $.each(arrTrinhDo, (index, ele) => {
                if (stringVanBang) stringVanBang += " ; ";
                stringVanBang += _dataTrinhDo.find(x => x.ID == ele.TrinhDoChuyenMonID).Ten;
            });
        $('.lb_van_ban_chuyen_mon').empty().append(stringVanBang);
    }
    else {
        if ($('input[name="SoChungChi"]').val() && $('input[name="SoChungChi"]').val() !='')
            window.alert_error("Số chứng chỉ không tồn tại");
        window.LoadDataInputText("hdfChungChiDuocId", 0);
        window.LoadDataInputText("SoChungChi", '');
        window.LoadDataInputText("NgayCapCCHN", '');
        window.LoadDataInputText("NoiCapCCHN", '');
        window.LoadDataInputText("HoTen", '');
        window.LoadDataInputText("NgaySinh", '');
        $('input[name="gioi_tinh"]:first-child').attr('checked', true);
        $('.lb_van_ban_chuyen_mon').empty();
    }
}
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
}
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
function GPP_onBlurSoChungChi(e) {
    var element = $(e.currentTarget);
    var txtVal = element.val();
    LoadChungChiDuocBySoChungChi(txtVal, "GPP_XuLyLoadOnlyDataChungChi");
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
function GPP_onClickBtnXoa(e) {

    var request = JSON.stringify({ THTGPPID: Id });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/NganhDuoc/DeleteHoSoGPPByTHTGPPI",
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
                  fnLoad_Duoc_GPP();
              }
              else
                  window.alert_error("Xóa không thành công!");
          } else
              window.alert_error("Xóa không thành công!");

      });
}
//Function modal chung chi
function GPP_CallSearchAdvanceFunc(isSearch) {
    var parent = $("#modal-ds-chung-chi");
    var divId = ".div_edit_table_parent";
    if (isSearch) {
        var objArr = window.GetAllInputOnDiv(parent);
        GPP_XuLyCall_showDataTable_Func(divId, objArr);
    } else {
        GPP_XuLyCall_showDataTable_Func(divId);
    }
}
function GPP_XuLyCall_showDataTable_Func(divId, objArr) {
    if (objArr)
        GPP_showDataTable(divId, objArr);
    else
        GPP_showDataTable(divId);
}
function GPP_showDataTable(divId, chungchi) {
    var tableid = $(divId).find("#tbl_chung_chi");
    var dataRequest = JSON.stringify(chungchi);
    var tblDataTable = $(tableid).DataTable
       ({
           "proccessing": true,
           "serverSide": true,
           "destroy": true,
           "ajax": {
               "type": "Post",
               "url": "/DesktopModules/MVC/NghiepVu/NganhDuoc/TraCuuChungChiByPage",
               "dataType": "json",
               "data": chungchi,
               "headers": {
                   "ModuleId": moduleId,
                   "TabId": tabId,
                   "RequestVerificationToken": rvtoken
               }
           },
           dom: "<'row'<'col-md-8 col-sm-10' <'col-lg-3 col-md-3 col-sm-6  text-left  font-size-13 mt-mobile-5'i><'col-lg-3 col-md-4 col-sm-6  text-left nopadding  font-size-13 mt-mobile-5'l><'col-lg-1 col-md-1 col-sm-2 font-size-13  mt-mobile-5 col-xs-2 text-center padding-all-5'> <'col-lg-5 col-md-4 col-sm-10  col-xs-10 nopadding text-left no-border decrease-padding  font-size-13 syt-label mt-mobile-5'p>><'col-md-4 col-sm-2'>><t>",
           "language": {
               "lengthMenu": "_MENU_ &nbsp;dòng trên trang <spanstyle='padding-left: 25px;'>Trang<span>",
               "zeroRecords": "Không tìm thấy",
               "info": "Tổng số dòng:&nbsp;  _TOTAL_",
               "infoEmpty": "STT 0 - 0 / 0",
               "paginate": {
                   "previous": "",
                   "next": "",
                   "first": "",
                   "last": ""
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
                   "className": "text-center  cursor-pointer GPP_chk_chon_chung_chi "
               },
               {
                   "render": function (data, type, full, meta) {
                       return full.RowNo;
                   },
                   "orderable": false,
                   "className": "word-break text-center cursor-pointer GPP_xem_chi_tiet"
               },
               { "data": "SoChungChi", "width": null, "orderable": false, "className": "word-break cursor-pointer GPP_xem_chi_tiet" },
               {
                   "render": function (data, type, full, meta) {
                       if (full.NgayCap)
                           return window.moment(full.NgayCap).format("DD/MM/YYYY");
                       else
                           return "";
                   },
                   "orderable": false,
                   "width": "5%",
                   "className": "word-break text-center cursor-pointer GPP_xem_chi_tiet"
               },
               { "data": "HoTen", "width": "10%", "orderable": false, "className": "word-break cursor-pointer GPP_xem_chi_tiet" },
               { "data": "SoGiayTo", "width": null, "orderable": false, "className": "word-break cursor-pointer GPP_xem_chi_tiet" },
               { "data": "ChoO_DiaChi", "width": "20%", "orderable": false, "className": "word-break cursor-pointer xGPP_em_chi_tiet" },
               { "data": "PhamViHoatDongChuyenMons", "width": "20%", "orderable": false, "className": "word-break cursor-pointer GPP_xem_chi_tiet" },
               //{ "data": "TrangThaiGiayPhep", "width": "20%", "orderable": false, "className": "word-break cursor-pointer GPP_xem_chi_tiet" }
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
}
function GPP_XuLyChonSoChungChi(soChungChi) {
    $('#modal-ds-chung-chi').modal('hide');
    LoadChungChiDuocBySoChungChi(soChungChi, "GPP_XuLyLoadOnlyDataChungChi");
}
$(document).on
("click",
    ".GPP_xem_chi_tiet",
    (e) => {
        var element = $(e.target);
        var parentTr = element.closest("tr");
        var checkBox = parentTr.find("input[type='radio']");
        var soChungChi = parentTr.attr("data-sochungchi");
        if (checkBox.is(":checked")) {
            checkBox.prop("checked", false);
            $(".input-select-chung-chi").attr("data-sochungchi", "");
        } else {
            $(".input-select-chung-chi").attr("data-sochungchi", soChungChi);
            checkBox.prop("checked", true);
        }
    });
$(document).on
("change",
    ".GPP_chk_chon_chung_chi",
    (e) => {
        var element = $(e.target);
        var parentTr = element.closest("tr");
        var checkBox = parentTr.find("input[type='radio']");
        var soChungChi = parentTr.attr("data-sochungchi");
        if (!checkBox.is(":checked")) {
            $(".input-select-chung-chi").attr("data-sochungchi", "");
        } else {
            $(".input-select-chung-chi").attr("data-sochungchi", soChungChi);
        }
    });
$(document).on
("click",
    ".input-search-chung-chi.GPP",
    (e) => {
        $(".input-select-chung-chi").attr("data-sochungchi", "");
        GPP_CallSearchAdvanceFunc(true);
    });
$(document).on
("dblclick",
    ".GPP_xem_chi_tiet",
    (e) => {
        var element = $(e.target);
        var parentTr = element.closest("tr");
        var soChungChi = parentTr.attr("data-sochungchi");
        GPP_XuLyChonSoChungChi(soChungChi);
    });
$(document).on
("click",
    ".input-select-chung-chi.GPP",
    (e) => {
        var element = $(e.target);
        var soChungChi = element.attr("data-sochungchi");
        if (soChungChi) {
            GPP_XuLyChonSoChungChi(soChungChi);
            $('#modal-ds-goi-y').modal('hide');
        }
        else
            window.alert_info("Vui lòng chọn số chứng chỉ!");
    });
$(document).on
("click", ".icon_search_chung_chi.GPP", (e) => {
    $('#modal-ds-chung-chi').modal('toggle');
    $(".input-select-chung-chi").attr("data-sochungchi", "");
    GPP_CallSearchAdvanceFunc(false);
});
//Fuction modal goi y
function GPP_LoadDataGoiY(loaiGoiYID, funcXuly) {
    var request = JSON.stringify({ loaiGoiYID: loaiGoiYID, thuTucId: ThuTucId, search: $('input[name="goi_y_seacrh"]').val() });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/NghiepVu/NganhDuoc/GetDanhMucGoiYByLoaiGoiYID",
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
              window[funcXuly](result, loaiGoiYID);
          }
      });
};
function GPP_LoadTableGoiY(data, loaiGoiYID) {
    var table = $("#tbl_danh_sach_goi_y");
    var checkAll = table.find('.chk-tbl-all');
    $(checkAll).attr('checked', false);
    if (data.length > 0) {
        var html = "";
        $.each
        (data,
            function (i, item) {
                var obj = {
                    Ten: item.Ten,
                    GoiYID: item.GoiYID ? item.GoiYID : 0,
                    ID: window.newGUIDFunc(),
                }
                html += html_Load_tbl_GoiY(loaiGoiYID, obj);
            });
        table.find("tbody").empty().append(html);
        reset_stt_goi_y();
    } else {
        table.find("tbody").empty();
    }
};
function reset_stt_goi_y() {
    var rows = $("#tbl_danh_sach_goi_y tbody").children('tr');
    $.each(
        rows, (index, element) => {
            var id = $(element).attr("data-rowid");
            var child = $(element).find('td[name="stt_' + id + '"]');
            child.empty();
            child.append(index + 1);
        });

}
function html_Load_tbl_GoiY(loaiGoiYID, objData) {
    var html = "";
    html += '<tr data-rowid="' + objData.ID + '" data-id="' + objData.GoiYID + '" class="font-size-13">';
    html += ' <td><input id="check' + objData.ID + '" type="checkbox" value="checkbox"></td>';
    html += '    <td name="stt_' + objData.ID + '"></td>';
    html += '<td class="input-get line-height-1_1-Em" data-name="Ten"> ' + objData.Ten + ' </td>';
    html += '<td class="fa fa-edit cursor-pointer color-blue font-size-20 table-cell syt-edit-btn line-height-1_1-Em"';
    html += ' data-id="' + objData.GoiYID + '"  data-ten="' + window.escapeHtml(objData.Ten) + '" data-loaigoiy="' + loaiGoiYID + '"';
    html += ' data-rowid="' + objData.ID + '" title="Sửa"></td>';
    html += ' <td class="glyphicon glyphicon-trash cursor-pointer color-blue  font-size-18  position-inherit line-height-1_1-Em" title="Xóa"';
    html += 'onclick="fn_Xoa_Dong(this)"></td>';
    html += '</tr>';
    return html;
};
function html_gen_edit_danh_sach_goi_y(data) {
    var html = "";
    html += '   <tr class="font-size-13" data-id="' + (data ? +data.id : '0') + '" data-rowid="' + (data ? +data.rowid : window.newGUIDFunc()) + '" data-loaigoiy="' + (data ? +data.loaigoiy : $('input[name="hdfLoaiGoiYID"]').val()) + '"  name="tr-edit">';
    html += '<td> </td>';
    html += '<td> </td>';
    html += '   <td>';
    html += '<input class="width-100 syt-radius-3 min-h-30 paddingMin txt_noi_dung"' +
        ' type="text" ' + (data ? "value=\"" + window.escapeHtml(data.ten) + "\"" : '') + '/>';
    html += '    </td>';
    html += '   <td>';
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
}
function save_edit_danh_sach_goi_y(element) {
    var parentTr = $(element).closest("tr");
    var obj = {
        goiYID: parentTr.attr('data-id')
        , ten: (parentTr.find('.txt_noi_dung')).val()
        , thuTucId: ThuTucId
        , loaiGoiYID: parentTr.attr('data-loaigoiy')
    };
    var request = JSON.stringify(obj);
    window.AjaxDungChung
     ("post",
         "/DesktopModules/MVC/NghiepVu/NganhDuoc/DBMaster_DM_GoiY_PopupUpd",
         window.moduleId,
         window.tabId,
         $("input[name='__RequestVerificationToken']").val(),
         request,
         "application/json; charset=utf-8",
         "json",
         true)
     .then
     (function (data) {
         if (data && (data >= 0 || data.Content >= 0)) {
             window.alert_success("Lưu gợi ý thành công!");
             GPP_LoadDataGoiY($('input[name="hdfLoaiGoiYID"]').val(), 'GPP_LoadTableGoiY');
         }
         else {
             window.alert_success("Lưu không thành công!");
         }
     });
}
function del_tr_danh_sach_goi_y(element) {
    var parentTr = $(element).closest("tr");
    var request = JSON.stringify({ goiYID: parentTr.attr('data-id') });
    window.AjaxDungChung
    ("post",
        "/DesktopModules/MVC/NghiepVu/NganhDuoc/DBMaster_DM_GoiY_PopupDel",
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
            window.alert_success("Xóa gợi ý thành công!");
            GPP_LoadDataGoiY($('input[name="hdfLoaiGoiYID"]').val(), 'GPP_LoadTableGoiY');
        }
        else {
            window.alert_success("Xóa không thành công!");
        }
    });
    return true;
}
function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}
$(document).on
("click", ".icon_search_uu_diem.GPP", (e) => {
    $('#modal-ds-goi-y').modal('toggle');
    window.LoadDataInputText("goi_y_seacrh", '');
    window.LoadDataInputText("hdfLoaiGoiYID", 2);
    GPP_LoadDataGoiY(2, 'GPP_LoadTableGoiY');
});
$(document).on
("click", ".icon_search_ton_tai.GPP", (e) => {
    $('#modal-ds-goi-y').modal('toggle');
    window.LoadDataInputText("goi_y_seacrh", '');
    window.LoadDataInputText("hdfLoaiGoiYID", 6);
    GPP_LoadDataGoiY(6, 'GPP_LoadTableGoiY');
});
$(document).on
("click", ".icon_search_ket_luan.GPP", (e) => {
    $('#modal-ds-goi-y').modal('toggle');
    window.LoadDataInputText("goi_y_seacrh", '');
    window.LoadDataInputText("hdfLoaiGoiYID", 5);
    GPP_LoadDataGoiY(5, 'GPP_LoadTableGoiY');
});
$(document).on
("click",
    ".input-search-ttkt.GPP",
    (e) => {
        GPP_LoadDataGoiY($('input[name="hdfLoaiGoiYID"]').val(), 'GPP_LoadTableGoiY');
    });
$(document).on
("click",
    ".input-select-ttkt.GPP",
    (e) => {
        var parent = $("#tbl_danh_sach_goi_y tbody");
        var listCheck = parent.find("td input[type='checkbox']:checked ");
        var element = $(e.target);
        var parent = element.closest(".div-select-parent");
        var listCheck = parent.find("td input[type='checkbox']:checked");
        if (listCheck.length > 0) {
            var text = '';
            $.each(listCheck, (index, element) => {
                var tr = element.closest("tr");
                var dataEle = $(tr).find('.syt-edit-btn');
                if (dataEle)
                    text += ' - ' + dataEle.attr('data-ten') + '\n';
            });
            switch ($('input[name="hdfLoaiGoiYID"]').val()) {
                case '2':
                    $('textarea[name="UuDiem"]').val(text);
                    break;
                case '6':
                    $('textarea[name="TonTai"]').val(text);
                    break;
                case '5':
                    $('textarea[name="KetLuan"]').val(text);
                    break;
            }
            $('#modal-ds-goi-y').modal('hide');
        } else {
            window.alert_info("Vui lòng chọn 1 đối tượng!");
        }
    });
$(document).on('change', "#tbl_danh_sach_goi_y .chk-tbl-all", (e) => {
    var element = $(e.currentTarget);
    var parent = element.closest("table");
    var listCheck = parent.find("td input[type='checkbox']");
    var check = window.CheckLengthOfElement(listCheck);
    if (check === "1") {
        window.XuLyCheckAll(listCheck, element.is(':checked'));
    }
});

$(document).on('change', "#tbl_danh_sach_goi_y tbody td input[type='checkbox']", (e) => {
    var check = $(e.currentTarget);
    check.attr('checked', !check.is(':checked'));
    var element = $('#tbl_danh_sach_goi_y .chk-tbl-all');
    var parent = element.closest("table");
    var countAll = parent.find("tbody tr").length;
    var countCheck = parent.find("td input[type='checkbox']:checked").length;
    $(element).attr('checked', countAll === countCheck);
});
$(document).on('click', "#tbl_danh_sach_goi_y tbody tr", (e) => {
    var element = $(e.currentTarget);
    var tr = element.closest("tr");
    var checkBox = tr.find("td input[type='checkbox']")
    $(checkBox).attr('checked', !checkBox.is(':checked'));
    var checkAll = $('#tbl_danh_sach_goi_y .chk-tbl-all');
    var parent = checkAll.closest("table");
    var countAll = parent.find("tbody tr").length;
    var countCheck = parent.find("td input[type='checkbox']:checked").length;
    $(checkAll).attr('checked', countAll === countCheck);
});

