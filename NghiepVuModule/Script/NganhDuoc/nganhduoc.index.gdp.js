var data_Trang_Thai = [
    {
        ID: 2,
        Ten: "Đã cấp phép"
    },
    {
        ID: 3,
        Ten: "Đã thu hồi"
    },
    {
        ID: 4,
        Ten: "Đã rút"
    }
];

$(document).ready
(() => {
    window.LoadSelect2($("select[name='TrangThai']"), data_Trang_Thai, null, true);

  $(".dataTables_wrapper .col-md-1").html("Trang ");
    CallSearchAdvanceFunc(false);
});

$('table').on('click', ".rcm-thu-hoi-rut",  (e)=> {
    var element = $(e.target);
    var parent = element.closest("tr");
});

$(".btn_nhap_dau_ky").on
('click',
    () => {

       window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/HoSo/GetModule",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                JSON.stringify({ module: 'NV.ThemHoSo.Module' }),
                "application/json; charset=utf-8",
                "json",
                true)
            .then
            (function(data) {
                if (data) {
                    var uri = window.location.pathname.replace(/[/]/g, '_');
                    var url = data.TabID + '/moduleId/' + data.ModuleID + '/linhVucId/' + 2 + '/thuTucId/' + 19
                        + '/trangThaiId/' + 11 + '/dauKy/' + 1 + '/prev/' + uri
                        + '/controller/HoSo/action/ThemHoSo'
                  location.href = url;
                }
            });
    });

$(".btn_search").click
((e) => {
    //syt-content-div-box-search
    CallSearchAdvanceFunc(true);
});

function CallSearchAdvanceFunc(isSearch) {
    var parent = $(".syt-content-div-box-search");
    var divId = "#div_results";
    if (isSearch) {
        var objArr = window.GetAllInputOnDiv(parent);
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
    var tableid = $(divId).find("table");
    var dataRequest = JSON.stringify(chungchi);
    var tblDataTable = $(tableid).DataTable
       ({
           "proccessing": true,
           "serverSide": true,
           "destroy": true,
           "ajax": {
               "type": "Post",
               "url": "/DesktopModules/MVC/NghiepVu/NganhDuoc/TraCuuGDPByPage",
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
                   previous: "Trang <",
                   next: ">",
                   last: ">|"
               },
               search: "Tìm Kiếm"

           },
           columns: [
               {
                   "render": function (data, type, full, meta) {
                       return full.RowNo;
                   },
                   "orderable": false,
                   "className": "word-break text-center cursor-pointer xem_chi_tiet"
               },
               
               { "data": "SoGiayChungNhan", "width": null, "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
                {
                     "render": function (data, type, full, meta) {
                         if (full.NgayCapChungNhan)
                             return window.moment(full.NgayCapChungNhan).format("DD/MM/YYYY");
                         else
                             return "";
                     },
                     "orderable": false,
                     "width": "5%",
                     "className": "word-break text-center cursor-pointer xem_chi_tiet"
                 },
               { "data": "TenCoSo", "width": "10%", "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               { "data": "SoDKKD", "width": null, "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               { "data": "NguoiPTCM", "width": "20%", "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               { "data": "SoChungChi", "width": "20%", "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },

           
           ],
           'createdRow': function (row, data) {
               $(row).attr('data-id', data.THTGDPId);
           },
           'lengthChange': true,
           "ordering": false,
           'searching': false,
           'autoWidth': false,
           responsive: true
       });
    window.ReLoadAjaxDataTable(tblDataTable);
};


$(document).on('click', "tbody .xem_chi_tiet", (e) => {
    var element = $(e.target);
    var parentTr = element.closest("tr");
    var THTGDPId = parentTr.attr("data-id");
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/GetModule",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            JSON.stringify({ module: 'NV.ThemHoSo.Module' }),
            "application/json; charset=utf-8",
            "json",
            true)
        .then
        (function (data) {
            if (data) {
                var uri = window.location.pathname.replace(/[/]/g, '_');
                var url = data.TabID + '/moduleId/' + data.ModuleID  + '/linhVucId/'
                    + 2+ '/thuTucId/' + 19 + "/id/" + THTGDPId +'/prev/' + uri
                    + '/controller/HoSo/action/ThemHoSo';
                location.href = url;
            }
        });
});
$(".btn_xuat_danh_sach").click
((e) => {
    var objArr = window.GetAllInputOnDiv($('#div_results'));
    var request = JSON.stringify(objArr);
    window.AjaxDungChung
       ("post",
         "/DesktopModules/MVC/NghiepVu/NganhDuoc/NganhDuoc_CN_GDP_XuatDanhSach",
           window.moduleId,
           window.tabId,
           $("input[name='__RequestVerificationToken']").val(),
           request,
           //"application/vnd.ms-excel",
           "application/json; charset=utf-8",
           "json",
           true)
       .then
       (function (data) {
           if (data) {
               XuLyXuatExcel(data);
           }
           else
               window.alert_error("Xuất không thành công!");
       });
});
$(".btn_cong_bo_website").click
((e) => {
    var objArr = window.GetAllInputOnDiv($('#div_results'));
    var request = JSON.stringify(objArr);
    window.AjaxDungChung
       ("post",
         "/DesktopModules/MVC/NghiepVu/NganhDuoc/NganhDuoc_CN_GDP_CongBoWebsite",
           window.moduleId,
           window.tabId,
           $("input[name='__RequestVerificationToken']").val(),
           request,
           //"application/vnd.ms-excel",
           "application/json; charset=utf-8",
           "json",
           true)
       .then
       (function (data) {
           if (data) {
               XuLyXuatExcel(data);
           }
           else
               window.alert_error("Xuất không thành công!");
       
       });
});
function XuLyXuatExcel(data) {

    // var blob = new File(data.Data, data.FileName, 'data:application/vnd.ms-excel;base64');
    var blob = convertDataURItoFile('data:application/vnd.ms-excel;base64,' + data.Data, data.FileName)
    var URL = window.URL || window.webkitURL;
    var downloadUrl = URL.createObjectURL(blob);

    if (data.FileName) {
        // use HTML5 a[download] attribute to specify filename
        var a = document.createElement("a");
        // safari doesn't support this yet
        if (typeof a.download === 'undefined') {
            window.open(downloadUrl, '_blank');
        } else {
            a.href = downloadUrl;
            a.download = data.FileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    } else {
        window.open(downloadUrl, '_blank');
    }
}
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

