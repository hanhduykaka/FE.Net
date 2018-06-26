$(document).ready
(() => {
    drawTableLinhVuc('');
});

$("#linhvuc").click(function(){
    showhideDivLinhVuc();

    setTimeout(function () { drawTableLinhVuc(''); }, 300)
});

function searchLinhVuc() {
    var inputsearchLinhVuc = $('#inputsearchLinhVuc').val();
    drawTableLinhVuc(inputsearchLinhVuc);
}

function drawTableLinhVuc(tuKhoa) {
    var tblDataTable = $('#tbldmlinhvuc').DataTable
       ({
           "proccessing": true,
           "serverSide": true,
           "destroy": true,
           "ajax": {
               "type": "POST",
               "url": "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/DM_LinhVucList",
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
               { "data": "MaLinhVuc", "className": "text-left font-size-13" },
               { "data": "TenLinhVuc", "className": "text-left font-size-13" },
               { "data": "MoTa", "className": "text-left font-size-13" },
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
                       return '<a href="#" onclick="existLinhVuc(' + full.LinhVucID + ')"><img src="images/u3427.png"></a>';
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

function showhideDivupdLinhVuc() {
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

    $("#right_themlinhvuc").show();
    $("#right_themquytrinh").hide();
    $("#right_themthutuc").hide();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function showhideDivLinhVuc() {
    $("#right_linhvuc").show();
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
    $("#right_themthutuc").hide();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function backtoDSLinhVuc() {
    $("#right_linhvuc").show();
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
    $("#right_themthutuc").hide();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function newLinhVuc() {
    showhideDivupdLinhVuc();
    $("#inputMaLinhVuc").val('');
    $("#inputTenLinhVuc").val('');
    $("#inputMoTa").val('');
    $("#inputUsed").prop('checked', false);
}

function saveLinhVuc() {

    if ($('#inputMaLinhVuc').val() == "") {
        window.alert_error("Vui lòng nhập Mã lĩnh vực!");
        $('#inputMaLinhVuc').focus();
        return;
    }
    if ($('#inputTenLinhVuc').val() == "") {
        window.alert_error("Vui lòng nhập Tên lĩnh vực!");
        $('#inputTenLinhVuc').focus();
        return;
    }

    var obj = {};
    obj["MaLinhVuc"] = $('#inputMaLinhVuc').val();
    obj["TenLinhVuc"] = $('#inputTenLinhVuc').val();
    obj["MoTa"] = $('#inputMoTa').val();
    obj["Used"] = $('#inputUsed').prop("checked");
    var formdata = new FormData();
    formdata.append("model", JSON.stringify(obj));
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/SaveDMLinhVuc",
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
                backtoDSLinhVuc();
                drawTableLinhVuc('');
            } else
                window.alert_success("Lưu chưa thành công!");
        });
}

function existLinhVuc(LinhVucID) {
    showhideDivupdLinhVuc();

    var requestLinhVucID = JSON.stringify({ LinhVucID: LinhVucID });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetLinhVucByLinhVucID",
          window.moduleId,
          window.tabId,
          $("input[name='__RequestVerificationToken']").val(),
          requestLinhVucID,
          "application/json; charset=utf-8",
          "json",
          true)
      .then
      (function (data) {
          if (data) {
              var result = $.parseJSON(data.Content);
              $("#inputMaLinhVuc").val(result.MaLinhVuc);
              $("#inputTenLinhVuc").val(result.TenLinhVuc);
              $("#inputMoTa").val(result.MoTa);
              $("#inputUsed").prop('checked', result.Used);
          }
      });
}