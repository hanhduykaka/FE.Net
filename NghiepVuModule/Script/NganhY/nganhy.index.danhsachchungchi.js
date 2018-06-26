var data_Trang_Thai = [
    {
        ID: 1,
        Ten: "Đang hoạt động"
    },
    {
        ID: 2,
        Ten: "Đã thu hồi"
    },
    {
        ID: 3,
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
                    var uri = window.location.pathname;
                    console.log(uri);
                    var url = data.TabID + '/moduleId/' + data.ModuleID + '/linhVucId/' + 1 + '/thuTucId/' + 1
                        + '/trangThaiId/' + 11 + '/dauKy/' + 1 + '/prev/' + uri
                        + '/controller/HoSo/action/ThemHoSo';
                    console.log(url);
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
    var tableid = $(divId).find("table");
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
               { "data": "TrangThaiGiayPhep", "width": "20%", "orderable": false, "className": "word-break cursor-pointer xem_chi_tiet" },
               {
                   "render": function (data, type, full, meta) {
                       return ' <span class="glyphicon glyphicon-triangle-bottom dropdown-toggle  cursor-pointer  rcm-thu-hoi-rut"' +
                           ' data-toggle="dropdown"></span>' +
                           ' <ul class="dropdown-menu">  ' +
                           '<li><a href="#" target="_self">Thu hồi </a></li> ' +
                           ' <li><a href="#" target="_self">Rút chứng chỉ</a></li>' +
                           '</ul>';
                   },
                   "orderable": false,
                   "width": "5%",
                   "className": "text-center  relative"
               }

           
           ],
           'createdRow': function (row, data) {
               $(row).attr('data-id', data.ChungChiHanhNgheYID);
               $(row).attr('data-sochungchi', data.SoChungChi);
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
    var chungChiId = parentTr.attr("data-id");
    var soChungChi = parentTr.attr("data-sochungchi");
    console.log(chungChiId + soChungChi);
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
                var uri = window.location.pathname;
                var url = data.TabID + '/moduleId/' + data.ModuleID  + '/linhVucId/'
                    + 1 + '/thuTucId/' + 1 + "/id/" + chungChiId + "/soChungChi/" + soChungChi+
                    '/dauKy/' + 1 + '/prev/' + uri
                    + '/controller/HoSo/action/ThemHoSo';
                location.href = url;
            }
        });
});

