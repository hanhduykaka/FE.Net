var data_TrangThai;
$(document).ready
(() => {
    loadLinhVuc();
    window.LoadSelect2($(".sl_thutuc_quytrinhthutuc"), [], null, true);
});

$(".sl_linhvuc_quytrinhthutuc").change
((e) => {
    var element = $(e.target);
    var linhvucID = e.target.value;
    loadThuTuc(linhvucID);
});

function loadLinhVuc(linhvucID) {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetDanhMucLinhVuc",
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
                var data_Linh_Vuc = [];
                $.each
               (data, (index, element) => {
                   data_Linh_Vuc.push({ ID: element.LinhVucID, Ten: element.TenLinhVuc });
               });
                window.LoadSelect2($(".sl_linhvuc_quytrinhthutuc"), data_Linh_Vuc, linhvucID ? linhvucID : null, true);
            }
        });
}

function loadThuTuc(linhvucID, thutucID) {
    if (!isNaN(linhvucID * 1)) {
        var dataRequest = JSON.stringify({ linhvucID: linhvucID });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetThuTucByLinhVucIDJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
               "application/json; charset=utf-8",
            "json",
            true).then
            ((data) => {
                if (data) {
                    var data_Thu_Tuc = [];
                    $.each(data, (index, elm) => {

                        data_Thu_Tuc.push({ ID: elm.ThuTucID, Ten: elm.TenThuTuc });
                    });
                    window.LoadSelect2($(".sl_thutuc_quytrinhthutuc"), data_Thu_Tuc, thutucID ? thutucID : null, true);

                }
            });
    } else {
        window.LoadSelect2($(".sl_thutuc_quytrinhthutuc"), [], null, true);
    }
}

function loadTrangThai(classname) {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/GetTrangThai",
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
                data_TrangThai = [];
                $.each
               (data, (index, element) => {
                   data_TrangThai.push({ ID: element.TrangThaiHoSoID, Ten: element.TenTrangThaiHoSo });
               });
                window.LoadSelect2(classname, data_TrangThai, null, true);
            }
        });
}

function loadUserRole(classname) {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/DanhMuc/DMLoaiHoSo/ListUserRole",
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
                var html = "";
                var arrRole = [];
                for (var i = 0; i < data.length; i++) {
                    arrRole.push(data[i].TenPhongBan);
                }

                var disRole = arrRole.filter(function (item, i, ar) { return ar.indexOf(item) === i; });

                for (var i = 0; i < disRole.length; i++) {
                    html += '<optgroup label="' + disRole[i] + '">';
                    for (var k = 0; k < data.length; k++) {
                        if (disRole[i] == data[k].TenPhongBan) {
                            html += '<option class="sknadTitle-gray-normal font-size-13" value="' + data[k].CanBoID + '">' + data[k].DisplayName + "</option>";
                        }
                    }
                    html += '</optgroup>';
                }
                classname.html(html);
            }
        });
}