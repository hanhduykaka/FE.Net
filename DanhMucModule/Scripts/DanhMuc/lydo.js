$("#lydo").click(function () {
    showhideDivLyDo();

    var sl_loaicapphepDM_LyDoScr = $(".sl_loaicapphepDM_LyDoScr");
    var sl_loailydoDM_LyDoScr = $(".sl_loailydoDM_LyDoScr");
    loadLoaiCapPhep_DM_LyDoScr(sl_loaicapphepDM_LyDoScr);
    loadLoaiLyDo_DM_LyDoScr(sl_loailydoDM_LyDoScr);
    setTimeout(function () { drawTableLyDo(); }, 300)
});

function showhideDivLyDo() {
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
    $("#right_lydo").show();
    $("#right_gopy").hide();

    $("#right_themlinhvuc").hide();
    $("#right_themquytrinh").hide();
    $("#right_themthutuc").hide();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function showhideDivupdLyDo() {
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
    $("#right_themlydo").show();
    $("#right_themgoiy").hide();
}

function drawTableLyDo(LoaiCapPhepID, LoaiLyDoID, tuKhoa) {
    var tblDataTable = $('#tbldmlydo').DataTable
       ({
           "proccessing": true,
           "serverSide": true,
           "destroy": true,
           "ajax": {
               "type": "POST",
               "url": "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/DM_LyDo_List",
               "dataType": "json",
               "data": {
                   LoaiCapPhepID: LoaiCapPhepID,
                   LoaiLyDoID: LoaiLyDoID,
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
               { "data": "LoaiLyDo", "className": "text-left font-size-13" },
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
                       return '<a href="#" onclick="existLyDo(' + full.LyDoID + ')"><img src="images/u3427.png"></a>';
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

function searchLyDo() {

    var loaiCapPhepIDDM_LyDoScr = $(".sl_loaicapphepDM_LyDoScr option:selected").val();
    if (loaiCapPhepIDDM_LyDoScr == "--//--") {
        loaiCapPhepIDDM_LyDoScr = "0";
    }
    var loaiLyDoIDDM_LyDoScr = $(".sl_loailydoDM_LyDoScr option:selected").val();
    if (loaiLyDoIDDM_LyDoScr == "--//--") {
        loaiLyDoIDDM_LyDoScr = "0";
    }
    var inputsearchLyDoDM_LyDoScr = $('#inputsearchLyDoDM_LyDoScr').val();

    drawTableLyDo(loaiCapPhepIDDM_LyDoScr, loaiLyDoIDDM_LyDoScr, inputsearchLyDoDM_LyDoScr);
}

function newLyDo() {
    showhideDivupdLyDo();
    var sl_loaicapphepupdDM_LyDoScr = $(".sl_loaicapphepupdDM_LyDoScr");
    var sl_loailydoupdDM_LyDoScr = $(".sl_loailydoupdDM_LyDoScr");
    loadLoaiCapPhep_DM_LyDoScr(sl_loaicapphepupdDM_LyDoScr);
    loadLoaiLyDo_DM_LyDoScr(sl_loailydoupdDM_LyDoScr);
    $("#inputTenLyDoupdDM_LyDoScr").val('');
    $("#inputLyDoUsed").prop('checked', false);
}

function saveLyDo() {
    var loaicapphep = $(".sl_loaicapphepupdDM_LyDoScr option:selected").val();
    var loailydo = $(".sl_loailydoupdDM_LyDoScr option:selected").val();

    if (loaicapphep == "--//--") {
        window.alert_error("Vui lòng chọn Loại cấp phép!");
        return;
    }

    if (loailydo == "--//--") {
        window.alert_error("Vui lòng chọn Loại lý do!");
        return;
    }

    if ($('#inputTenLyDoupdDM_LyDoScr').val() == "") {
        window.alert_error("Vui lòng nhập Lý do!");
        $('#inputTenLyDoupdDM_LyDoScr').focus();
        return;
    }

    var fdlydo = new FormData();

    var objlydo = {};
    objlydo["LoaiCapPhepID"] = loaicapphep;
    objlydo["LoaiLyDoID"] = loailydo;
    objlydo["Ten"] = $('#inputTenLyDoupdDM_LyDoScr').val();
    objlydo["Used"] = $('#inputLyDoUsed').prop("checked");

    fdlydo.append("model", JSON.stringify(objlydo));

    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/SaveDMLyDo",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            fdlydo,
            false,
            "json",
            false).then
        ((data) => {
            if (data) {
                window.alert_success("Lưu thành công!");
                showhideDivLyDo();
                drawTableLyDo();
            }
            else
                window.alert_success("Lưu chưa thành công!");
        });
}

function existLyDo(LyDoID) {
    showhideDivupdLyDo();
    var sl_loaicapphepupdDM_LyDoScr = $(".sl_loaicapphepupdDM_LyDoScr");
    var sl_loailydoupdDM_LyDoScr = $(".sl_loailydoupdDM_LyDoScr");
    loadLoaiCapPhep_DM_LyDoScr(sl_loaicapphepupdDM_LyDoScr);
    loadLoaiLyDo_DM_LyDoScr(sl_loailydoupdDM_LyDoScr);

    var requestLyDoID = JSON.stringify({ LyDoID: LyDoID });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetLyDoByLyDoID",
          window.moduleId,
          window.tabId,
          $("input[name='__RequestVerificationToken']").val(),
          requestLyDoID,
          "application/json; charset=utf-8",
          "json",
          true)
      .then
      (function (data) {
          if (data) {
              var result = $.parseJSON(data.Content);
              setTimeout(function () {
                  $(".sl_loaicapphepupdDM_LyDoScr").val(result.LoaiCapPhepID).trigger('change.select2');
              }, 500)
              setTimeout(function () {
                  $(".sl_loailydoupdDM_LyDoScr").val(result.LoaiLyDoID).trigger('change.select2');
              }, 500)              
              $("#inputTenLyDoupdDM_LyDoScr").val(result.Ten);
              $("#inputLyDoUsed").prop('checked', result.Used);
          }
      });
}

function loadLoaiCapPhep_DM_LyDoScr(classname) {
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

function loadLoaiLyDo_DM_LyDoScr(classname) {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetLoaiLyDo",
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
                data_LoaiLyDo = [];
                $.each
               (data, (index, element) => {
                   data_LoaiLyDo.push({ ID: element.LoaiLyDoID, Ten: element.Ten });
               });
                window.LoadSelect2(classname, data_LoaiLyDo, null, true);
            }
        });
}