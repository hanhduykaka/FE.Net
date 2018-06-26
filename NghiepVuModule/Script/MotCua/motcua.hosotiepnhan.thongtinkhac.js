
function loadTrinhDo(trinhDoChuyenMonID) {
    window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/GetDanhMucTrinhDoChuyenMon",
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
                   window.LoadSelect2($(".sl_trinh_do_chuyen_mon_index"), data, trinhDoChuyenMonID ? trinhDoChuyenMonID : null, true);
               }
           });
}
function loadHinhThucToChuc(hinhThucToChucID) {
    window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/GetDanhMucHinhThucToChuc",
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
                   window.LoadSelect2($(".sl_hinh_thuc_to_chuc_index"), data, hinhThucToChucID ? hinhThucToChucID : null, true);
               }
           });
}
function loadNoiNhanKetQua(noiNhanKetQuaID) {
    window.AjaxDungChung
          ("post",
              "/DesktopModules/MVC/NghiepVu/MotCua/GetDanhMucNoiNhanKetQua",
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
                  var data_NoiNhan = [];
                  $.each(data, (index, elm) => {

                      data_NoiNhan.push({ ID: elm.NoiNhanKetQuaID, Ten: elm.Ten });
                  });
                  var rdNoiNhan = $(".rd_noi_nhan_ket_qua");
                  var htmlGenNoiNhan = html_gen_radio(data, "NoiNhanKetQua");
                  rdNoiNhan.empty();
                  rdNoiNhan.bind('DOMSubtreeModified', function (e) {
                      $("input[name=NoiNhanKetQua][value='" + noiNhanKetQuaID + "']").prop("checked", true);
                      rdNoiNhan.unbind("DOMSubtreeModified");
                  });
                  rdNoiNhan.append(htmlGenNoiNhan);
              }
          });
}
$(document).ready(e=> {
    if (html_gen_radio) {
        function html_gen_radio(dataFind, name) {
            var html = "";
            $.each
            (dataFind, (index, element) => {
                html += '<input type="radio" name="' + name + '" value="' + element.ID + '" ><span class="sknadTitle-gray-normal font-size-13"> ' + element.Ten + ' </span>&nbsp;';
            });
            return html;
        };
    }
})