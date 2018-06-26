$("#gopy").click(function () {
    showhideDivGoiY();

    var sl_loaicapphepDM_GoiYScr = $(".sl_loaicapphepDM_GoiYScr");
    var sl_loaigoiyDM_GoiYScr = $(".sl_loaigoiyDM_GoiYScr");
    loadLoaiCapPhep_DM_GoiYScr(sl_loaicapphepDM_GoiYScr);
    loadLoaiGoiY_DM_GoiYScr(sl_loaigoiyDM_GoiYScr);
    setTimeout(function () { drawTableGoiY(); }, 300)
});

function showhideDivGoiY() {
    $("#right_quytrinhthutuc").hide();
    $("#right_thutuc").hide();
    $("#right_linhvuc").hide();
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
    $("#right_gopy").show();

    $("#right_themlinhvuc").hide();
    $("#right_themquytrinh").hide();
    $("#right_themthutuc").hide();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function showhideDivupdGoiY() {
    $("#right_quytrinhthutuc").hide();
    $("#right_thutuc").hide();
    $("#right_linhvuc").hide();
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
    $("#right_themgoiy").show();
}

function drawTableGoiY(LoaiCapPhepID, LoaiGoiYID, tuKhoa) {
    var tblDataTable = $('#tbldmgoiy').DataTable
       ({
           "proccessing": true,
           "serverSide": true,
           "destroy": true,
           "ajax": {
               "type": "POST",
               "url": "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/DM_GoiY_List",
               "dataType": "json",
               "data": {
                   LoaiCapPhepID: LoaiCapPhepID,
                   LoaiGoiYID: LoaiGoiYID,
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
               { "data": "LoaiCapPhep", "className": "text-left font-size-13" },
               { "data": "LoaiGoiY", "className": "text-left font-size-13" },
               { "data": "Ten", "className": "text-left font-size-13" },
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
                       return '<a href="#" onclick="existGoiY(' + full.GoiYID + ')"><img src="images/u3427.png"></a>';
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

function searchGoiY() {

    var loaiCapPhepIDDM_GoiYScr = $(".sl_loaicapphepDM_GoiYScr option:selected").val();
    if (loaiCapPhepIDDM_GoiYScr == "--//--") {
        loaiCapPhepIDDM_GoiYScr = "0";
    }
    var loaiGoiYIDDM_GoiYScr = $(".sl_loaigoiyDM_GoiYScr option:selected").val();
    if (loaiGoiYIDDM_GoiYScr == "--//--") {
        loaiGoiYIDDM_GoiYScr = "0";
    }
    var inputsearchGoiYDM_GoiYScr = $('#inputsearchGoiYDM_GoiYScr').val();

    drawTableGoiY(loaiCapPhepIDDM_GoiYScr, loaiGoiYIDDM_GoiYScr, inputsearchGoiYDM_GoiYScr);
}

function newGoiY() {
    showhideDivupdGoiY();
    var sl_loaicapphepupdDM_GoiYScr = $(".sl_loaicapphepupdDM_GoiYScr");
    var sl_loaigoiyupdDM_GoiYScr = $(".sl_loaigoiyupdDM_GoiYScr");
    loadLoaiCapPhep_DM_GoiYScr(sl_loaicapphepupdDM_GoiYScr);
    loadLoaiGoiY_DM_GoiYScr(sl_loaigoiyupdDM_GoiYScr);
    $("#inputTenGoiYupdDM_GoiYScr").val('');
    $("#inputGoiYUsed").prop('checked', false);
}

function saveGoiY() {
    var loaicapphep = $(".sl_loaicapphepupdDM_GoiYScr option:selected").val();
    var loaigoiy = $(".sl_loaigoiyupdDM_GoiYScr option:selected").val();

    if (loaicapphep == "--//--") {
        window.alert_error("Vui lòng chọn Loại cấp phép!");
        return;
    }

    if (loaigoiy == "--//--") {
        window.alert_error("Vui lòng chọn Loại gợi ý!");
        return;
    }

    if ($('#inputTenGoiYupdDM_GoiYScr').val() == "") {
        window.alert_error("Vui lòng nhập Gợi ý!");
        $('#inputTenGoiYupdDM_GoiYScr').focus();
        return;
    }

    var fdgoiy = new FormData();

    var objgoiy = {};
    objgoiy["LoaiCapPhepID"] = loaicapphep;
    objgoiy["LoaiGoiYID"] = loaigoiy;
    objgoiy["Ten"] = $('#inputTenGoiYupdDM_GoiYScr').val();
    objgoiy["Used"] = $('#inputGoiYUsed').prop("checked");

    fdgoiy.append("model", JSON.stringify(objgoiy));

    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/SaveDMGoiY",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            fdgoiy,
            false,
            "json",
            false).then
        ((data) => {
            if (data) {
                window.alert_success("Lưu thành công!");
                showhideDivGoiY();
                drawTableGoiY();
            }
            else
                window.alert_success("Lưu chưa thành công!");
        });
}

function existGoiY(GoiYID) {
    showhideDivupdGoiY();
    var sl_loaicapphepupdDM_GoiYScr = $(".sl_loaicapphepupdDM_GoiYScr");
    var sl_loaigoiyupdDM_GoiYScr = $(".sl_loaigoiyupdDM_GoiYScr");
    loadLoaiCapPhep_DM_GoiYScr(sl_loaicapphepupdDM_GoiYScr);
    loadLoaiGoiY_DM_GoiYScr(sl_loaigoiyupdDM_GoiYScr);

    var requestGoiYID = JSON.stringify({ GoiYID: GoiYID });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetGoiYByGoiYID",
          window.moduleId,
          window.tabId,
          $("input[name='__RequestVerificationToken']").val(),
          requestGoiYID,
          "application/json; charset=utf-8",
          "json",
          true)
      .then
      (function (data) {
          if (data) {
              var result = $.parseJSON(data.Content);
              setTimeout(function () {
                  $(".sl_loaicapphepupdDM_GoiYScr").val(result.LoaiCapPhepID).trigger('change.select2');
              }, 500)
              setTimeout(function () {
                  $(".sl_loaigoiyupdDM_GoiYScr").val(result.LoaiGoiYID).trigger('change.select2');
              }, 500)
              $("#inputTenGoiYupdDM_GoiYScr").val(result.Ten);
              $("#inputGoiYUsed").prop('checked', result.Used);
          }
      });
}

function loadLoaiCapPhep_DM_GoiYScr(classname) {
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
                window.LoadSelect2(classname, data_LoaiCapPhep, null, true);
            }
        });
}

function loadLoaiGoiY_DM_GoiYScr(classname) {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetLoaiGoiY",
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
                data_LoaiGoiY = [];
                $.each
               (data, (index, element) => {
                   data_LoaiGoiY.push({ ID: element.LoaiGoiYID, Ten: element.Ten });
               });
                window.LoadSelect2(classname, data_LoaiGoiY, null, true);
            }
        });
}