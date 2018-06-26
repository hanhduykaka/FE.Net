$("#quytrinhthutuc").click(function () {
    showhideDivQuyTrinhThuTuc();

    setTimeout(function () { drawTableQuyTrinhThuTuc('0'); }, 300)
});

var thuTucID = "";
$(".sl_thutuc_quytrinhthutuc").change
((e) => {
    var element = $(e.target);
    thuTucID = e.target.value;
    if (thuTucID == "--//--")
        thuTucID = "0";
    drawTableQuyTrinhThuTuc(thuTucID);
});

function showhideDivQuyTrinhThuTuc() {
    $("#right_quytrinhthutuc").show();
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
    $("#right_themgoiy").hide();
}

function showhideDivupdQuyTrinhThuTuc() {
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
    $("#right_themquytrinh").show();
    $("#right_themthutuc").hide();
    $("#right_themlydo").hide();
    $("#right_themgoiy").hide();
}

function drawTableQuyTrinhThuTuc(thuTucID) {
    var tblDataTable = $('#tbldmquytrinhthutuc').DataTable
       ({
           "proccessing": true,
           "serverSide": true,
           "destroy": true,
           "ajax": {
               "type": "POST",
               "url": "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/DM_QuyTrinh_Buoc_NguoiNhanList",
               "dataType": "json",
               "data": {
                   thuTucID: thuTucID
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
               { "data": "TrangThaiHienTai", "className": "text-left font-size-13" },
               { "data": "TrangThaiTiepTheo", "className": "text-left font-size-13" },
               { "data": "NguoiXuLyTiepTheo", "className": "text-left font-size-13" },
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
                       return '<a href="#" onclick="existQuyTrinhThuTuc(' + full.BuocID + ')"><img src="images/u3427.png"></a>';
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

function newQuytrinhThuTuc() {
    showhideDivupdQuyTrinhThuTuc();
    var cbotrangthaihientai = $('.sl_trangthaihientai_quytrinhthutuc');
    var cbotrangthaitieptheo = $('.sl_trangthaitieptheo_quytrinhthutuc');
    var cbonguoixulytieptheo = $('.sl_nguoixulytieptheo');
    loadTrangThai(cbotrangthaihientai);
    loadTrangThai(cbotrangthaitieptheo);
    loadUserRole(cbonguoixulytieptheo);
}

function backtoDSQuyTrinhThuTuc() {
    $("#right_linhvuc").hide();
    $("#right_thutuc").hide();
    $("#right_quytrinhthutuc").show();
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

function saveQuyTrinhThuTuc() {
    var trangthaihientai = $(".sl_trangthaihientai_quytrinhthutuc option:selected").val();
    var trangthaitieptheo = $(".sl_trangthaitieptheo_quytrinhthutuc option:selected").val();
    var nguoixuly = $(".sl_nguoixulytieptheo option:selected");

    if (thuTucID == 0 || thuTucID == "" || thuTucID == null || thuTucID == "undefined") {
        window.alert_error("Vui lòng chọn thủ tục từ màn hình danh sách!");
        return;
    }

    if (trangthaihientai == "--//--") {
        window.alert_error("Vui lòng chọn trạng thái hiện tại!");
        return;
    }

    if (trangthaitieptheo == "--//--") {
        window.alert_error("Vui lòng chọn trạng thái tiếp theo!");
        return;
    }

    if (nguoixuly.length == 0) {
        window.alert_error("Vui lòng chọn người xử lý!");
        return;
    }

    var fdquytrinhthutuc = new FormData();

    var objquytrinh = {};
    objquytrinh["ThuTucID"] = thuTucID;
    objquytrinh["TrangThaiHienTaiID"] = trangthaihientai;
    objquytrinh["TrangThaiTiepTheoID"] = trangthaitieptheo;
    objquytrinh["Used"] = $('#inputquytrinhthutucUsed').prop("checked");

    fdquytrinhthutuc.append("nguoixulylength", nguoixuly.length);
    fdquytrinhthutuc.append("modelquytrinh", JSON.stringify(objquytrinh));
    var i = 0;
    nguoixuly.each(function () {
        var nguoinhan = {};
        nguoinhan["NguoiNhanID"] = $(this).val();
        fdquytrinhthutuc.append("model" + i.toString(), JSON.stringify(nguoinhan));
        i++;
    });

    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/SaveDMQuyTrinhThuTuc",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            fdquytrinhthutuc,
            false,
            "json",
            false).then
        ((data) => {
            if (data) {
                window.alert_success("Lưu thành công!");
                backtoDSQuyTrinhThuTuc();
                drawTableQuyTrinhThuTuc(thuTucID);
            }
            else
                window.alert_success("Lưu chưa thành công!");
        });
}

function existQuyTrinhThuTuc(BuocID) {
    showhideDivupdQuyTrinhThuTuc();
    var cbotrangthaihientai = $('.sl_trangthaihientai_quytrinhthutuc');
    var cbotrangthaitieptheo = $('.sl_trangthaitieptheo_quytrinhthutuc');
    var cbonguoixulytieptheo = $('.sl_nguoixulytieptheo');
    loadTrangThai(cbotrangthaihientai);
    loadTrangThai(cbotrangthaitieptheo);
    loadUserRole(cbonguoixulytieptheo);

    var requestBuocID = JSON.stringify({ BuocID: BuocID });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetQuyTrinhBuocByBuocID",
          window.moduleId,
          window.tabId,
          $("input[name='__RequestVerificationToken']").val(),
          requestBuocID,
          "application/json; charset=utf-8",
          "json",
          true)
      .then
      (function (data) {
          if (data) {
              var result = $.parseJSON(data.Content);
              $("#inputquytrinhthutucUsed").prop('checked', result.Used);
              setTimeout(function () {
                  $(".sl_trangthaihientai_quytrinhthutuc").val(result.TrangThaiHienTaiID).trigger('change.select2');
              }, 500)
              setTimeout(function () {
                  $(".sl_trangthaitieptheo_quytrinhthutuc").val(result.TrangThaiTiepTheoID).trigger('change.select2');
              }, 500)
              setTimeout(function () {
                  existQuyTrinhThuTucNguoiNhan(result.BuocID);
              }, 300)              
          }
      });
}

function existQuyTrinhThuTucNguoiNhan(BuocID) {
    var requestBuocNguoiNhanID = JSON.stringify({ BuocID: BuocID });
    window.AjaxDungChung
      ("post",
          "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetQuyTrinhBuocNguoiNhanByBuocID",
          window.moduleId,
          window.tabId,
          $("input[name='__RequestVerificationToken']").val(),
          requestBuocNguoiNhanID,
          "application/json; charset=utf-8",
          "json",
          true)
      .then
      (function (data) {
          if (data) {
              var result = $.parseJSON(data.Content);
              var arr = [];
              for (var i = 0; i < result.length; i++) {
                  arr.push(result[i].NguoiNhanID.toString());
              }
              $('.sl_nguoixulytieptheo').select2().val(arr).trigger('change')
          }
      });
}