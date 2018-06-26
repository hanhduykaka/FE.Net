//Khai bao
var _fileTypesImg = ["jpg", "jpeg", "png", "tiff", "gif"];
var _fileTypesDinhKem = ["doc", "docx", "xls", "xlsx", "pdf", "jpg", "jpeg", "png", "tiff", "gif", "sig", "enc"];

var _formDataDinhKem = new FormData();
var _arrHoSoDinhKem = [];
var _valid_image = false;
var data_Gioi_Tinh = [
    {
        ID: 1,
        Ten: " Nam"
    },
    {
        ID: 2,
        Ten: " Nữ"
    },
     {
         ID: 3,
         Ten: " Không xác định"
     }
];
var data_LoaiGiayTo = [
    {
        ID: 1,
        Ten: " Chứng minh nhân dân"
    },
    {
        ID: 2,
        Ten: " Hộ chiếu"
    },
     {
         ID: 3,
         Ten: " Căn cước công dân"
     },
     {
         ID: 4,
         Ten: " Khác"
     }
];
var isFirstLoad = false;
$(document).ready
(() => {
    InitControl();
    LoadHoSo();
});
function LoadHoSo() {
    var hoSoId = $('input[name="hdfHoSoId"]').val();
    if (hoSoId == '') {
        hoSoId = 0;
        $('input[name="hdfHoSoId"]').val(0);
        var btnXoa = $(".btn_Xoa_Ho_So");
        btnXoa.parent().addClass("hidden");
        var btnIn = $(".btn_In_Bien_Nhan");
        btnIn.parent().addClass("hidden");
    }
    if (hoSoId != 0) {
        var btnXoa = $(".btn_Xoa_Ho_So");
        btnXoa.parent().removeClass("hidden");
        var btnIn = $(".btn_In_Bien_Nhan");
        btnIn.parent().removeClass("hidden");
        var requestHoSo = JSON.stringify({ hosoId: hoSoId });
        window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/GetHoSoById",
               window.moduleId,
               window.tabId,
               $("input[name='__RequestVerificationToken']").val(),
               requestHoSo,
               "application/json; charset=utf-8",
               "json",
               true)
           .then
           (function (data) {
               if (data) {
                   isFirstLoad = true;
                   var result = $.parseJSON(data.Content);
                   if (result) {
                       loadLinhVuc(result.LinhVucID);
                       //Thong tin ho so
                       $('input[name="hdfSoBienNhan"]').val(result.SoBienNhan);
                       $('input[name="hdfTrangThaiHoSoID"]').val(result.TrangThaiHoSoID);
                       $('input[name = "SoBienNhan"]').val(result.SoBienNhan);
                       loadThuTuc(result.LinhVucID, result.ThuTucID);
                       loadThongTinHoSo(result.ThuTucID);
                       if (result.NgayNhan)
                           $('input[name ="NgayNhan"]').data("DateTimePicker").date(new Date(result.NgayNhan.match(/\d+/)[0] * 1));
                       if (result.NgayHenTra)
                           $('input[name="NgayHenTra"]').data("DateTimePicker").date(new Date(result.NgayHenTra.match(/\d+/)[0] * 1));
                       $('input[name = "LePhi"]').val(result.LePhi);
                       //Thong tin nguoi nop
                       $('input[name = "HoTenNguoiNop"]').val(result.HoTenNguoiNop);
                       $("input[name=GioiTinh][value='" + result.GioiTinhID + "']").prop("checked", true);
                       $("input[name=LoaiGiayTo][value='" + result.LoaiGiayToID + "']").prop("checked", true);
                       $('input[name = "SoGiayTo"]').val(result.SoGiayTo);
                       $('input[name = "NoiCap"]').val(result.NoiCapGiayTo);
                       $('input[name ="NgaySinh"]').val(result.NgaySinh);
                       if (result.NgayCapGiayTo)
                           $('input[name="NgayCap"]').data("DateTimePicker").date(new Date(result.NgayCapGiayTo.match(/\d+/)[0] * 1));
                       $('input[name = "ThuongTruSoNha"]').val(result.SoNha);
                       $('input[name = "HienNaySoNha"]').val(result.HienNaySoNha);
                       loadTinhThanh(result.TinhThanhID, result.HienNayTinhThanhID);
                       loadThuongTruHuyen(result.TinhThanhID, result.QuanHuyenID);
                       loadHienNayHuyen(result.HienNayTinhThanhID, result.HienNayQuanHuyenID);
                       loadThuongTruPhuong(result.QuanHuyenID, result.PhuongXaID);
                       loadHienNayPhuong(result.HienNayQuanHuyenID, result.HienNayPhuongXaID);
                       $('input[name = "DienThoai"]').val(result.Phone);
                       $('input[name = "Email"]').val(result.Email);
                       //Chung tu kem theo
                       getChungTuKemTheo(result.HoSoID);
                       //Thong Tin Khac
                       loadTrinhDo(result.TrinhDoChuyenMonID);
                       loadHinhThucToChuc(result.HinhThucToChucID);
                       loadNoiNhanKetQua(result.NoiNhanKetQuaID);
                       $('textarea[name = "GhiChu"]').val(result.GhiChu);
                   }
                   else
                       setNewForm();
                   isFirstLoad = false;
               }
           });
    }
    else
        setNewForm();
}

function InitControl() {
    $(".adselect").select2();
    window.InitFromToDatePicker(".date-picker-from", ".date-picker-to");
    window.InitNgaySinhNgayCapGiayToDatePickerAndString(".date-picker-ngay-sinh", ".date-picker-ngay-cap");

    var rdGioiTinh = $(".rd_gioi_tinh");
    var htmlGenGioiTinh = html_gen_radio(data_Gioi_Tinh, "GioiTinh");
    rdGioiTinh.empty().append(htmlGenGioiTinh);

    var rdLoaiGiayTo = $(".rd_loai_giay_to");
    var htmlGenLoaiGiayTo = html_gen_radio(data_LoaiGiayTo, "LoaiGiayTo");
    rdLoaiGiayTo.empty().append(htmlGenLoaiGiayTo);
}


function html_gen_radio(dataFind, name) {
    var html = "";
    $.each
    (dataFind, (index, element) => {
        html += '<input type="radio" name="' + name + '" value="' + element.ID + '" ><span class="sknadTitle-gray-normal font-size-13"> ' + element.Ten + ' </span>&nbsp;';
    });
    return html;
};
function setNewForm() {
    //Thong tin ho so
    $('input[name="hdfTrangThaiHoSoID"]').val(1);
    loadLinhVuc();
    $('input[name = "SoBienNhan"]').val("");
    window.LoadSelect2($(".sl_thu_tuc_ho_so_index"), [], null, true);
    $('input[name = "SoNgayGiaiQuyet"]').val(0);
    $('input[name = "NgayNhan"]').data("DateTimePicker").date(new Date());
    $('input[name="NgayHenTra"]').data("DateTimePicker").date(new Date());
    $('input[name = "TuDong"]').prop("checked", true);
    //Nguoi nop ho so
    loadTinhThanh();
    window.LoadSelect2($(".sl_thuong_tru_huyen_index"), [], null, true);
    window.LoadSelect2($(".sl_thuong_tru_phuong_index"), [], null, true);
    window.LoadSelect2($(".sl_hien_nay_huyen_index"), [], null, true);
    window.LoadSelect2($(".sl_hien_nay_phuong_index"), [], null, true);
    $('input[name = "HoTenNguoiNop"]').val("");
    $("input[name=GioiTinh]:first").prop("checked", true);
    $("input[name=LoaiGiayTo]:first").prop("checked", true);
    $('input[name = "SoGiayTo"]').val("");
    $('input[name = "NoiCap"]').val("");
    $('input[name ="NgaySinh"]').val("");
    $('input[name="NgayCap"]').data("DateTimePicker").date(null);
    $('input[name = "ThuongTruSoNha"]').val("");
    $('input[name = "HienNaySoNha"]').val("");
    $('input[name = "DienThoai"]').val("");
    $('input[name = "Email"]').val("");
    //Chung tu kem theo
    getChungTuKemTheo();
    //Thong tin khac
    loadTrinhDo();
    loadHinhThucToChuc();
    loadNoiNhanKetQua();
    $("input[name=NoiNhanKetQua]:first").prop("checked", true);
    $('textarea[name = "GhiChu"]').val("");
}
function checkForm() {
    var check = true;
    if ($(".sl_linh_vuc_ho_so_index").val() == '' || $(".sl_linh_vuc_ho_so_index").val() == '--//--') {
        window.appendValidate
             ($(".sl_linh_vuc_ho_so_index"),
                 "border-color-a9",
                 ".color-red",
                 "<label class='color-red'>Vui lòng chọn lĩnh vực</label>");
        check = false;
    }
    else {
        window.removeValidate($(".sl_linh_vuc_ho_so_index"), "border-color-a9", ".color-red");
    }
    if ($(".sl_thu_tuc_ho_so_index").val() == '' || $(".sl_thu_tuc_ho_so_index").val() == '--//--') {
        window.appendValidate
              ($(".sl_thu_tuc_ho_so_index"),
                  "border-color-a9",
                  ".color-red",
                  "<label class='color-red'>Vui lòng chọn thủ tục</label>");
        check = false;
    }
    else {
        window.removeValidate($(".sl_thu_tuc_ho_so_index"), "border-color-a9", ".color-red");
    }
    if (!window.ValidateRequireOnDiv(".div_them_ho_so"))
        check = false;
    if ($('input[name = "Email"]').val() != "" && !window.ValidateEmailOnDiv(".div-email"))
        check = false;
    return check;
}
$(".btn_Luu").click
((e) => {
    if (!checkForm()) {
        return;
    }
    var obj = window.GetAllInputOnDiv(".div_them_ho_so")
    var formdata = new FormData();
    var HoSoID = $('input[name = "hdfHoSoId"]').val();
    obj.HoSoID = HoSoID != '' ? HoSoID : 0;
    formdata.append("hoso", JSON.stringify(obj));
    //chung tu kem theo
    var chungtukemtheo = [];
    var rows = $(".div_ho_so_kem_theo table tbody").children('tr');
    $.each(
        rows, (index, element) => {
            var id = $(element).attr("data-id");
            var item = _arrHoSoDinhKem.filter(x => x.ID == id);
            var objKemTheo = {
                TenChungTu: obj['ten_chung_tu_' + id]
                , SLBanChinh: obj['so_ban_chinh_' + id]?obj['so_ban_chinh_' + id]:0
                , SLBanSao: obj['so_ban_sao_' + id] ? obj['so_ban_sao_' + id] : 0
                , SLBanPhoTo: obj['so_ban_photo_' + id] ? obj['so_ban_photo_' + id] : 0
                , GhiChu: obj['ghi_chu_' + id]
                , AttachFile: item && item[0] != undefined ? item[0].AttachFile : ''
                , DinhKemID: id

            };
            if (objKemTheo.TenChungTu != "") {
                chungtukemtheo.push(objKemTheo);
                formdata.append(id, $('input[name="' + id + '"]')[0].files[0]);
            }
        });
    formdata.append('chungtukemtheo', JSON.stringify(chungtukemtheo));
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/MotCua/SaveHoSo",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            formdata,
            false,
            "json",
            false).then
        ((data) => {
            if (data) {
                if ($('input[name="hdfHoSoId"]').val() == 0) {
                    var hoSoId = data;
                    if (hoSoId == -1) {
                        window.alert_error("Lưu không thành công!");
                        return;
                    }
                    var btnTroVe = $('.btn_Tro_Ve');
                    var prev = $('.btn_Tro_Ve').attr("data-prev")
                    window.alert_success("Lưu thành công!");
                    setTimeout(e=> {
                        location.href = window.location.origin + "?TabID=" + window.tabId + "&hoSoID=" + hoSoId + (prev ? ("&prev=" + prev) : "");
                    }, 1000);
                }
                else {
                    if (data <= 0) {
                        window.alert_error("Lưu không thành công!");
                        return;
                    }
                    window.alert_success("Lưu thành công!");
                    LoadHoSo();
                }
            } else
                window.alert_error("Lưu không thành công!");
        });

});
$(".btn_Tro_Ve").click
((e) => {
    var element = $(e.target);
    var prev = element.attr("data-prev");
    if (prev) {
        prev = prev.replace(/_/g, '/');
        window.location.href = (prev.indexOf('/') < 0 ? '/':'') + prev;
    }
    else {
        window.AjaxDungChung
          ("post",
              "/DesktopModules/MVC/NghiepVu/HoSo/GetModule",
              window.moduleId,
              window.tabId,
              $("input[name='__RequestVerificationToken']").val(),
              JSON.stringify({ module: 'NV.HoSo.Module' }),
              "application/json; charset=utf-8",
              "json",
              true)
          .then
          (function (data) {
              if (data) {
                  var uri = window.location.pathname;
                  var url = data.TabID;
                  location.href = url;
              }
          });
    }
});
$(".btn_Them_Moi").click
((e) => {
    location.href = window.location.origin + "?TabID=" + window.tabId;
});
$(".btn_Xoa_Ho_So").click
((e) => {
   
    var hoSoId = $('input[name = "hdfHoSoId"]').val();
 
    if (!hoSoId || hoSoId == 0) {
        //reset form
        setNewForm();
    }
    else {
       
        var requestHoSo = JSON.stringify({ hosoId: hoSoId, trangThaiHoSoID: $('input[name="hdfTrangThaiHoSoID"]').val() });
        window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/XoaHoSoByHoSoID",
               window.moduleId,
               window.tabId,
               $("input[name='__RequestVerificationToken']").val(),
               requestHoSo,
               "application/json; charset=utf-8",
               "json",
               true)
           .then
           (function (data) {
               if (data && data.Content == 'true') {
                   $(".btn_Tro_Ve").trigger("click");
               }
               else
                   window.alert_error("Xóa không thành công!");
           });

    }

});
$(".btn_In_Bien_Nhan").click
((e) => {
    var hoSoId = $('input[name = "hdfHoSoId"]').val();
    if (!hoSoId || hoSoId == 0) {
    }
    else {
        var requestHoSo = JSON.stringify({ hosoId: hoSoId });
        window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/InBienNhan",
               window.moduleId,
               window.tabId,
               $("input[name='__RequestVerificationToken']").val(),
               requestHoSo,
               "application/json; charset=utf-8",
               "json",
               true)
           .then
           (function (data) {
               if (data) {
                   // var blob = new File(data.Data, data.FileName, 'data:application/vnd.ms-excel;base64');
                   var blob = convertDataURItoFile('data:application/vnd.ms-word;base64,' + data.Data, data.FileName)
                   var URL = window.URL || window.webkitURL;
                   var downloadUrl = URL.createObjectURL(blob);

                   if (data.FileName) {
                       // use HTML5 a[download] attribute to specify filename
                       var a = document.createElement("a");
                       // safari doesn't support this yet
                       if (typeof a.download === 'undefined') {
                           window.location = downloadUrl;
                       } else {
                           a.href = downloadUrl;
                           a.download = data.FileName;
                           document.body.appendChild(a);
                           a.click();
                           document.body.removeChild(a);
                       }
                   } else {
                       window.location = downloadUrl;
                   }
               }
           });

    }

});
$('input[name = "SoBienNhan"]').blur
((e) => {
    var SoBienNhanNew = $('input[name = "SoBienNhan"]').val();
    if (SoBienNhanNew && $('input[name="hdfSoBienNhan"]').val() != SoBienNhanNew) {

        var request = JSON.stringify({ SoBienNhan: SoBienNhanNew });
        window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/MotCua_KiemTraSoBienNhan",
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
               }
               else {
                   if ($('input[name = "TuDong"]').is(':checked')) {
                       window.alert_error("Số biên nhận đã tồn tại!<br\>Hệ thống tự động tạo số mới");
                       GenSoBienNhan($(".sl_thu_tuc_ho_so_index").val());
                   }
                   else
                       window.alert_error("Số biên nhận đã tồn tại!");
               }
           });

    }
});

function convertDataURItoFile(dataURI, fileName) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ia], { type: mimeString });

    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
}

