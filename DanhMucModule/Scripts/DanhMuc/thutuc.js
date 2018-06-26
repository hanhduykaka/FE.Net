var _arrHoSoDinhKem = [];

$("#thutuc").click(function () {
    showhideDivThuTuc();

    setTimeout(function () { drawTableThuTuc(''); }, 300)
});

function searchThuTuc() {
    var inputsearchThuTuc = $('#inputsearchThuTucDM_ThuTucScr').val();
    drawTableThuTuc(inputsearchThuTuc);
}

function drawTableThuTuc(tuKhoa) {
    var tblDataTable = $('#tbldmthutuc').DataTable
       ({
           "proccessing": true,
           "serverSide": true,
           "destroy": true,
           "ajax": {
               "type": "POST",
               "url": "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/DM_ThuTucList",
               "dataType": "json",
               "data": {
                   tuKhoa: tuKhoa
               },
               "headers": {
                   "ModuleId": moduleId,
                   "TabId": tabId,
                   "RequestVerificationToken": rvtoken
               }
           },
           dom: "<'row'<'col-md-8 col-sm-10' <'col-lg-3 col-md-3 col-sm-6  text-left  font-size-13 mt-mobile-5'i><'col-lg-3 col-md-4 col-sm-6  text-left nopadding  font-size-13 mt-mobile-5'l><'col-lg-1 col-md-1 col-sm-2 font-size-13  mt-mobile-5 col-xs-2 text-center padding-all-5'> <'col-lg-5 col-md-4 col-sm-10  col-xs-10 nopadding text-left no-border decrease-padding  font-size-13 syt-label mt-mobile-5'p>><'col-md-4 col-sm-2'>><t>",
           "language": {
               "lengthMenu": "_MENU_ &nbsp;dòng trên trang",
               "zeroRecords": "Không có dữ liệu",
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
               { "data": "RowNo", "className": "text-center font-size-13" },
               { "data": "TenLinhVuc", "className": "text-left font-size-13" },
               { "data": "MaThuTuc", "className": "text-left font-size-13" },
               { "data": "TenThuTuc", "className": "text-left font-size-13" },
               { "data": "SoNgayGiaiQuyet", "className": "text-left font-size-13" },
               { "data": "ThoiGianNhacDenHan", "className": "text-left font-size-13" },
               { "data": "LePhi", "className": "text-left font-size-13" },
               {
                   "data": "Used",
                   "render": function (data, type, row) {
                       if (type === 'display') {
                           return '<input type="checkbox" ' + ((data == true) ? 'checked' : '') + '/>';
                       }
                       return data;
                   },
                   "className": "text-center"
               },
               {
                   "render": function (data, type, full, meta) {
                       return '<a href="#" onclick="existThuTuc(' + full.ThuTucID + ')"><img src="images/u3427.png"></a>';
                   }
               }
           ],
           'lengthChange': true,
           "ordering": false,
           'searching': false,
           'autoWidth': false,
           responsive: true
       });
    window.ReLoadAjaxDataTable(tblDataTable);
}

function showhideDivupdThuTuc() {
    $("#right_linhvuc").hide();
    $("#right_thutuc").hide();
    $("#right_quytrinhthutuc").hide();
    $("#right_tinhthanh").hide();
    $("#right_huyenthi").hide();
    $("#right_phuongxa").hide();
    $("#right_noicapphep").hide();
    $("#right_trinhdochuyenmon").hide();
    $("#right_vitrichuyenmon").hide();
    $("#right_phamvihanhngheduoc").hide();
    $("#right_phamvihoatdongKCB").hide();
    $("#right_phamvikinhdoanhthuoc").hide();
    $("#right_dangsanphammypham").hide();
    $("#right_hinhthuctochuc").hide();
    $("#right_dieukienhanhnghe").hide();
    $("#right_loaibaocao").hide();
    $("#right_lydo").hide();
    $("#right_gopy").hide();

    $("#right_themlinhvuc").hide();
    $("#right_themquytrinh").hide();
    $("#right_themthutuc").show();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function showhideDivThuTuc() {
    $("#right_linhvuc").hide();
    $("#right_thutuc").show();
    $("#right_quytrinhthutuc").hide();
    $("#right_tinhthanh").hide();
    $("#right_huyenthi").hide();
    $("#right_phuongxa").hide();
    $("#right_noicapphep").hide();
    $("#right_trinhdochuyenmon").hide();
    $("#right_vitrichuyenmon").hide();
    $("#right_phamvihanhngheduoc").hide();
    $("#right_phamvihoatdongKCB").hide();
    $("#right_phamvikinhdoanhthuoc").hide();
    $("#right_dangsanphammypham").hide();
    $("#right_hinhthuctochuc").hide();
    $("#right_dieukienhanhnghe").hide();
    $("#right_loaibaocao").hide();
    $("#right_lydo").hide();
    $("#right_gopy").hide();

    $("#right_themlinhvuc").hide();
    $("#right_themquytrinh").hide();
    $("#right_themthutuc").hide();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function backtoDSThuTuc() {
    $("#right_linhvuc").hide();
    $("#right_thutuc").show();
    $("#right_quytrinhthutuc").hide();
    $("#right_tinhthanh").hide();
    $("#right_huyenthi").hide();
    $("#right_phuongxa").hide();
    $("#right_noicapphep").hide();
    $("#right_trinhdochuyenmon").hide();
    $("#right_vitrichuyenmon").hide();
    $("#right_phamvihanhngheduoc").hide();
    $("#right_phamvihoatdongKCB").hide();
    $("#right_phamvikinhdoanhthuoc").hide();
    $("#right_dangsanphammypham").hide();
    $("#right_hinhthuctochuc").hide();
    $("#right_dieukienhanhnghe").hide();
    $("#right_loaibaocao").hide();
    $("#right_lydo").hide();
    $("#right_gopy").hide();

    $("#right_themlinhvuc").hide();
    $("#right_themquytrinh").hide();
    $("#right_themthutuc").hide();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function newThuTuc() {
    showhideDivupdThuTuc();

    $('#inputMaThuTucDM_ThuTucScr').val('');
    $('#inputTenThuTucDM_ThuTucScr').val('');
    loadLinhVuc_DM_ThuTucScreen();
    loadLoaiCapPhep_DM_ThuTucScr();
    $('#inputThoiGianGQThuTucDM_ThuTucScr').val('');
    $('#inputThoiGianNhacThuTucDM_ThuTucScr').val('');
    $('#inputLePhiDM_ThuTucScr').val('');
    $('#inputUsedDM_ThuTucScr').prop('checked', false);
    $(".div_ho_so_kem_theo table tbody").html("");
}

function saveThuTuc() {
    if ($('#inputMaThuTucDM_ThuTucScr').val() == "") {
        window.alert_error("Vui lòng nhập Mã thủ tục!");
        $('#inputMaThuTuc').focus();
        return;
    }

    if ($('#inputTenThuTucDM_ThuTucScr').val() == "") {
        window.alert_error("Vui lòng nhập Tên thủ tục!");
        $('#inputTenThuTuc').focus();
        return;
    }

    var thuoclinhvuc = $(".sl_thuoclinhvucDM_ThuTucScr option:selected").val();
    if (thuoclinhvuc == "--//--") {
        window.alert_error("Vui lòng chọn lĩnh vực!");
        return;
    }

    if ($('#inputThoiGianGQThuTucDM_ThuTucScr').val() == "") {
        window.alert_error("Vui lòng nhập Thời gian giải quyết!");
        $('#inputThoiGianGQThuTuc').focus();
        return;
    }

    if ($('#inputThoiGianGQThuTucDM_ThuTucScr').val() <= 0) {
        window.alert_error("Vui lòng nhập Thời gian giải quyết hợp lệ!");
        $('#inputThoiGianGQThuTuc').focus();
        return;
    }

    var obj = {};
    obj["LinhVucID"] = $(".sl_thuoclinhvucDM_ThuTucScr option:selected").val();
    obj["TenLinhVuc"] = $('#inputTenLinhVucDM_ThuTucScr').val();
    obj["MaThuTuc"] = $('#inputMaThuTucDM_ThuTucScr').val();
    obj["TenThuTuc"] = $('#inputTenThuTucDM_ThuTucScr').val();
    obj["SoNgayGiaiQuyet"] = $('#inputThoiGianGQThuTucDM_ThuTucScr').val();
    obj["ThoiGianNhacDenHan"] = $('#inputThoiGianNhacThuTucDM_ThuTucScr').val();
    obj["LoaiCapPhepID"] = $(".sl_loaicapphepDM_ThuTucScr option:selected").val();
    obj["LePhi"] = $('#inputLePhiDM_ThuTucScr').val();
    obj["Used"] = $('#inputUsedDM_ThuTucScr').prop("checked");

    var formdata = new FormData();
    formdata.append("model", JSON.stringify(obj));
    
    var chungtukemtheo = [];
    var rows = $(".div_ho_so_kem_theo table tbody").children('tr');
    $.each(
        rows, (index, element) => {
            var id = $(element).attr("data-id");
            var item = _arrHoSoDinhKem.filter(x => x.ID == id);
                
            obj['ten_chung_tu_' + id] = $("input[name='ten_chung_tu_" + id + "']").val();
            obj['so_ban_chinh_' + id] = $("input[name='so_ban_chinh_" + id + "']").val();
            obj['so_ban_sao_' + id] = $("input[name='so_ban_sao_" + id + "']").val();
            obj['so_ban_photo_' + id] = $("input[name='so_ban_photo_" + id + "']").val();
            var objKemTheo = {
                TenChungTu: obj['ten_chung_tu_' + id]
                , SLBanChinh: obj['so_ban_chinh_' + id] ? obj['so_ban_chinh_' + id] : 0
                , SLBanSao: obj['so_ban_sao_' + id] ? obj['so_ban_sao_' + id] : 0
                , SLPhoTo: obj['so_ban_photo_' + id] ? obj['so_ban_photo_' + id] : 0
            };
            if (objKemTheo.TenChungTu != "") {
                chungtukemtheo.push(objKemTheo);
            }
        });

    formdata.append('chungtukemtheo', JSON.stringify(chungtukemtheo));

    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/SaveDMThuTuc",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            formdata,
            false,
            "json",
            false).then
        ((data) => {
            if (data) {
                
                window.alert_success("Lưu thành công!");
                backtoDSThuTuc();
                drawTableThuTuc('');
            } else
                window.alert_success("Lưu chưa thành công!");
        });
}

function existThuTuc(ThuTucID) {
    showhideDivupdThuTuc();
    loadLinhVuc_DM_ThuTucScreen();
    loadLoaiCapPhep_DM_ThuTucScr();

    var requestThuTucID = JSON.stringify({ ThuTucID: ThuTucID });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetThuTucByThuTucID",
          window.moduleId,
          window.tabId,
          $("input[name='__RequestVerificationToken']").val(),
          requestThuTucID,
          "application/json; charset=utf-8",
          "json",
          true)
      .then
      (function (data) {
          if (data) {
              var result = $.parseJSON(data.Content);
              $("#inputMaThuTucDM_ThuTucScr").val(result.MaThuTuc);
              $("#inputTenThuTucDM_ThuTucScr").val(result.TenThuTuc);
              setTimeout(function () {
                  $(".sl_thuoclinhvucDM_ThuTucScr").val(result.LinhVucID).trigger('change.select2');
              }, 500)
              setTimeout(function () {
                  $(".sl_loaicapphepDM_ThuTucScr").val(result.LoaiCapPhepID).trigger('change.select2');
              }, 500)
              $("#inputThoiGianGQThuTucDM_ThuTucScr").val(result.SoNgayGiaiQuyet);
              $("#inputThoiGianNhacThuTucDM_ThuTucScr").val(result.ThoiGianNhacDenHan);
              $("#inputLePhiDM_ThuTucScr").val(result.LePhi);
              $("#inputUsedDM_ThuTucScr").prop('checked', result.Used);
              setTimeout(function () {
                  getChungTuKemTheo(result.ThuTucID);
              }, 300)
          }
      });
}

function html_gen_new_kem_theo(data) {
    var html = "";
    html += ' <tr class="font-size-13" name="tr-edit" data-id="' + data.ID + '">';
    html += '    <td name="stt_' + data.ID + '"></td>';
    html += "    <td>";
    html += '   <input name="ten_chung_tu_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" min="0" value="' + data.TenChungTu + '" type="text" />';
    html += "   </td>";
    html += "    <td>";
    html += '   <input name="so_ban_chinh_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" min="0" value="' + data.SLBanChinh + '" type="number" onfocus="onfocusNumber(event)" />';
    html += "   </td>";
    html += "    <td>";
    html += '   <input name="so_ban_sao_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" min="0" value="' + data.SLBanSao + '" type="number" onfocus="onfocusNumber(event)" />';
    html += "   </td>";
    html += "    <td>";
    html += '   <input name="so_ban_photo_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" min="0" value="' + data.SLPhoto + '" type="number" onfocus="onfocusNumber(event)" />';
    html += "   </td>";
    html += '   <td class="text-center" title="Xóa">';
    html += '    <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += ' <span type="button" title="Hủy" onclick="fn_cancel_edit(this)" ';
    html += ' class="glyphicon glyphicon-remove syt-icon-cancel"></span>';
    html += "   </div>";
    html += "   </td>";
    html += "  </tr>";
    return html;
};

function onfocusNumber(e) {
    $(e.target).select();
};

function fn_cancel_edit(e) {
    var element = $(e);
    var trParent = element.closest("tr");
    trParent.remove();
    reset_stt_kem_theo();
};

$(document).on
("click",
    ".a_them_moi_kem_theo_index",
    (e) => {
        var obj = {
            ID: window.newGUIDFunc()
            , TenChungTu: ''
            , SLBanChinh: 0
            , SLBanSao: 0
            , SLPhoto: 0
        };
        $(".div_ho_so_kem_theo table tbody").append(html_gen_new_kem_theo(obj));
        reset_stt_kem_theo();
    });

function reset_stt_kem_theo() {
    var rows = $(".div_ho_so_kem_theo table tbody").children('tr');
    $.each(
        rows, (index, element) => {
            var id = $(element).attr("data-id");
            var child = $(element).find('td[name="stt_' + id + '"]');
            child.empty();
            child.append(index + 1);
        });
}

function loadLinhVuc_DM_ThuTucScreen() {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetDanhMucLinhVuc",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            null,
            "application/json; charset=utf-8",
            "json",
            true)
        .then
        (function (data) {
            if (data) {
                var data_Linh_Vuc = [];
                $.each
               (data, (index, element) => {
                   data_Linh_Vuc.push({ ID: element.LinhVucID, Ten: element.TenLinhVuc });
               });
                window.LoadSelect2($(".sl_thuoclinhvucDM_ThuTucScr"), data_Linh_Vuc, null, true);
            }
        });
}

function loadLoaiCapPhep_DM_ThuTucScr() {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetLoaiCapPhep",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            null,
            "application/json; charset=utf-8",
            "json",
            true)
        .then
        (function (data) {
            if (data) {
                data_LoaiCapPhep = [];
                $.each
               (data, (index, element) => {
                   data_LoaiCapPhep.push({ ID: element.LoaiCapPhepID, Ten: element.Ten });
               });
                window.LoadSelect2($(".sl_loaicapphepDM_ThuTucScr"), data_LoaiCapPhep, null, true);
            }
        });
}

function getChungTuKemTheo(thuTucID) {
    if (thuTucID) {
        var dataRequest = JSON.stringify({ thuTucID: thuTucID });
        //Chung tu kem theo
        window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetDMChungTuKemTheoByThuTucID",
               window.moduleId,
               window.tabId,
               $("input[name='__RequestVerificationToken']").val(),
               dataRequest,
               "application/json; charset=utf-8",
               "json",
               true).then
           ((data) => {
               if (data) {
                   var result = $.parseJSON(data.Content);
                   var trParent = $(".div_ho_so_kem_theo table tbody");
                   trParent.html("");
                   $.each(
                       result, (index, element) => {
                           var obj = {
                               ID: window.newGUIDFunc()
                               , TenChungTu: element.TenChungTu
                               , SLBanChinh: element.SLBanChinh
                               , SLBanSao: element.SLBanSao
                               , SLPhoto: element.SLPhoto                               
                           };
                           $(".div_ho_so_kem_theo table tbody").append(html_gen_new_kem_theo(obj));
                       });
                   reset_stt_kem_theo();
               }
           });
    }
    else {
        var trParent = $(".div_ho_so_kem_theo table tbody");
        trParent.html("");
    }
}