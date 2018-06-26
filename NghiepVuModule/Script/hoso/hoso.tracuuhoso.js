$(document).ready
    (() => {
        $(".adselect").select2();
        window.InitFromToDatePicker(".date-picker-from", ".date-picker-to");
        XuLyParam();
        $(".dataTables_wrapper .col-md-1").html("Trang");
    });
$(".btn_search").click(() => {
    CallSearchAdvanceFunc(true);
});
function loadTrangThai() {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/GetTrangThaiHoSo",
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
                var data_TrangThai = [];
                $.each
               (data, (index, element) => {
                   data_TrangThai.push({ ID: element.TrangThaiHoSoID, Ten: element.TenTrangThaiHoSo });
               });
                window.LoadSelect2($(".sl_Trang_Thai"), data_TrangThai, null, true);
            }
        });
}

function XuLyParam() {
    loadTrangThai();
    var hdfVal = $('input[name="hdfVal"]').val();
    if (hdfVal)
        CallSearchTrangChuFunc(hdfVal);
    else
        CallSearchAdvanceFunc(false);
}

function CallSearchTrangChuFunc(hdfVal) {

}
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
        showDataTable(divId, objArr["Trang_Thai"], objArr["LinhVuc_Search"], objArr["ThuTuc_Search"]
            , objArr["SoBienNhan_Search"], objArr["NgayNhanTu_Search"], objArr["NgayNhanDen_Search"], objArr["NguoiNop_Search"], objArr["SoCMND_Search"]);
    else
        showDataTable(divId);
};

function showDataTable(divId, trangThai, linhVucId, thuTucId, soBienNhan, ngayNhanTu, ngayNhanDen, nguoiNop, soCMND) {
    var tableid = $(divId).find("table");
 var tblDataTable=   $(tableid).DataTable
    ({
        "proccessing": true,
        "serverSide": true,
        "destroy": true,
        "ajax": {
            "type": "POST",
            "url": "/DesktopModules/MVC/NghiepVu/HoSo/TraCuuHoSoByPage",
            "dataType": "json",
            "data": {
                trangThai: trangThai, linhVucId: linhVucId, thuTucId: thuTucId,
                soBienNhan: soBienNhan, ngayNhanTu: ngayNhanTu,
                ngayNhanDen: ngayNhanDen, nguoiNop: nguoiNop, soCMND: soCMND
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
                "className": "word-break text-center"
            },
            {
                "render": function (data, type, full, meta) {
                    return '<span class="fa fa-sitemap font-size-20 cursor-pointer color-blue"> </span>';
                },
                "orderable": false,
                "width": "5%"
            },
            { "data": "SoBienNhan", "width": null, "orderable": false, "className": "word-break" },
            {
                "render": function (data, type, full, meta) {
                    return window.moment(full.NgayNhan).format("DD/MM/YYYY");
                },
                "orderable": false,
                "width": "5%",
                "className": "word-break text-center"
            },
            { "data": "TenLinhVuc", "width": null, "orderable": false, "className": "word-break" },
            { "data": "TenThuTuc", "width": "20%", "orderable": false, "className": "word-break" },
            { "data": "HoTenNguoiNop", "width": "20%", "orderable": false, "className": "word-break" },
            { "data": "TenTrangThaiHoSo", "width": "20%", "orderable": false, "className": "word-break" },
            {
                "render": function (data, type, full, meta) {
                    return window.moment(full.NgayHenTra).format("DD/MM/YYYY");
                },
                "orderable": false,
                "width": "5%",
                "className": "word-break text-center"
            }
        ],
        'lengthChange': true,
        "ordering": false,
        'searching': false,
        'autoWidth': false,
        responsive: true
    });
 window.ReLoadAjaxDataTable(tblDataTable);
};

