
$(document).ready
(() => {
    $('table').DataTable
      ({
          responsive: true,
          "ordering": false, "pageLength": 1,
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
          }
      });

    $(".dataTables_wrapper .col-md-1").html("Trang ");
});

$('table').on('click', ".rcm-thu-hoi-rut", (e) => {
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
             (function (data) {
                 if (data) {
                     var url = data.TabID + '/moduleId/' + data.ModuleID + '/linhVucId/' + 1 + '/thuTucId/' + 1
                         + '/trangThaiId/' + 11
                         + '/controller/HoSo/action/ThemHoSo';
                     console.log(url);
                     location.href = url;
                 }
             });
    });

