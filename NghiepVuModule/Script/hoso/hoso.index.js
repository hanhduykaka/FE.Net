var _arr = [];
var _objFieldSeachArr = {};
var _doneLazy = false;
var _alreadySearch = false;
var _arrThuTucDaChon = [];
var _arrNguoiNhanModal = [];
var _tabFirstClick = $('input[name="hdfTrangThai"]').val();
$(document).ready
(() => {
    XuLyParam(LazyLoadingDivTabContent);
});

$(".btn_Them_Ho_So").click
((e) => {
    window.AjaxDungChung
         ("post",
             "/DesktopModules/MVC/NghiepVu/HoSo/GetModule",
             window.moduleId,
             window.tabId,
             $("input[name='__RequestVerificationToken']").val(),
             JSON.stringify({ module: 'NV.MotCua.Index' }),
             "application/json; charset=utf-8",
             "json",
             true)
         .then
         (function (data) {
             if (data) {
                 var uri = window.location.pathname;
                 var url = data.TabID + '/prev' + uri;
                 location.href = url;
             }
         });
});

$(".btn_search").click
(() => {
    _doneLazy = false;
    _alreadySearch = true;
    var parent = $(".syt-content-div-box-search");
    var objArr = window.GetAllInputOnDiv(parent);
    _objFieldSeachArr = objArr;
    var liActive = $("#ul_tab_Ds li.active");
    var divId = "#" + liActive.attr("data-href");
    var trangThai = liActive.attr("data-trangthai");
    _arrThuTucDaChon = [];
    window.XuLyDisabledBtnChuyen(false);
    LoadDSTrangThaiBtnChuyen();
    LoadWL(trangThai, true);
    $('table .chk-tbl-all.' + trangThai).attr('checked', false);
    // XuLyCall_showDataTable_Func(divId, trangThai, objArr);
});

$(document).on('click', "#ul_tab_Ds  a", (e) => {
    var target = $(e.target); // activated tab
    var parent = target.closest("li");
    var parentDivContent = $(".syt-content-div-tab-content");
    var thisTrangThai = parent.attr("data-trangthai");
    var thisnameDestination = parent.attr("data-href");
    if (_tabFirstClick == thisTrangThai) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    parentDivContent.find(".tab-pane").removeClass("in").removeClass("active");
    //GenDivTabContent(thisTrangThai, thisnameDestination, "0");
    LoadWL(thisTrangThai, true);
    var isDisable = _arrThuTucDaChon.length > 0 && _arrThuTucDaChon.filter(i=>i.TrangThaiID == thisTrangThai).length > 0;
    if (isDisable)
        LoadDSTrangThaiBtnChuyen(function () { window.XuLyDisabledBtnChuyen(isDisable); });
    else {
        window.XuLyDisabledBtnChuyen(isDisable);
        LoadDSTrangThaiBtnChuyen();
    }
});


$(document).on('change', "table .chk-tbl-all", (e) => {
    var element = $(e.currentTarget);
    var parent = element.closest("table");
    var listCheck = parent.find("td input[type='checkbox']");
    var check = window.CheckLengthOfElement(listCheck);
    if (check === "1") {
        var liActive = $("#ul_tab_Ds li.active");
        var trangThai = liActive.attr("data-trangthai");
        var isDisable = element.is(':checked');

        window.XuLyCheckAll(listCheck, isDisable);
        if (isDisable) {
            $.each(listCheck, (index, ele) => {
                var thuTucID = $(ele).attr('data-id');
                var hoSoID = $(ele).attr('value');
                var _arrFilter = _arrThuTucDaChon.filter(i =>i.TrangThaiID == trangThai && i.ThuTucID == thuTucID);
                var length = _arrFilter.length;
                if (length > 0) {
                    $.each(_arrFilter, (index, data) => {
                        if (data.ThuTucID && data.ThuTucID == thuTucID && data.listHoSoID.indexOf(hoSoID) === -1) {
                            data.listHoSoID += "," + hoSoID;
                        }
                    });
                }
                else
                    _arrThuTucDaChon.push({ TrangThaiID: trangThai, ThuTucID: thuTucID, listHoSoID: hoSoID });
            });
        }
        else
            _arrThuTucDaChon = _arrThuTucDaChon.filter(i =>i.TrangThaiID != trangThai);
        if (isDisable)
            LoadDSTrangThaiBtnChuyen(function () { window.XuLyDisabledBtnChuyen(isDisable); });
        else {
            window.XuLyDisabledBtnChuyen(isDisable);
            LoadDSTrangThaiBtnChuyen();
        }
    }
});


$(document).on('change', "table td input[type='checkbox']", (e) => {
    var element = $(e.currentTarget);
    var liActive = $("#ul_tab_Ds li.active");
    var trangThai = liActive.attr("data-trangthai");
    //Kiem tra
    var parent = element.closest("table");
    var listCheck = parent.find("td input[type='checkbox']:checked ");
    var isDisable = listCheck.length > 0;
    var thuTucID = element.attr('data-id');
    var hoSoID = element.attr('value');
    var lengthThuTuc = _arrThuTucDaChon.length;
    var _arrFilter = _arrThuTucDaChon.filter(i =>i.TrangThaiID == trangThai && i.ThuTucID == thuTucID);
    if (element.is(':checked')) {
        var length = _arrFilter.length;
        if (length > 0) {
            $.each(_arrFilter, (index, data) => {
                if (data.ThuTucID && data.ThuTucID == thuTucID) {
                    data.listHoSoID += "," + hoSoID;
                }
            });
        }
        else
            _arrThuTucDaChon.push({ TrangThaiID: trangThai, ThuTucID: thuTucID, listHoSoID: hoSoID });
    }
    else {
        $.each(_arrFilter, (index, data) => {
            if (data.ThuTucID && data.ThuTucID == thuTucID) {
                if (data.listHoSoID.indexOf(',' + hoSoID) >= 0) 
                    data.listHoSoID = data.listHoSoID.replace(',' + hoSoID, '')
                else if (data.listHoSoID.indexOf(hoSoID + ',') >= 0)
                    data.listHoSoID = data.listHoSoID.replace(hoSoID + ',', '');
                else
                    data.listHoSoID = data.listHoSoID.replace(hoSoID, '');
            }
        });
        _arrThuTucDaChon = _arrThuTucDaChon.filter(i => i.listHoSoID != '');
    }
    if (_arrThuTucDaChon.length != lengthThuTuc) {//Co thay doi
        if (isDisable)
            LoadDSTrangThaiBtnChuyen(function () { window.XuLyDisabledBtnChuyen(isDisable); });
        else {
            window.XuLyDisabledBtnChuyen(isDisable);
            LoadDSTrangThaiBtnChuyen();
        }

    }
    LoadCheckedALL();
});

$(document).on('click', "table  td .glyphicon-star", (e) => {
    var element = $(e.target);
    var hoSoID = element.attr('data-id');
    var isHasClass = element.hasClass("color-yellow");
    window.AjaxDungChung
    ("post",
        "/DesktopModules/MVC/NghiepVu/HoSo/MotCua_HoSoTiepNhan_TheoDoiHoSo",
        window.moduleId,
        window.tabId,
        $("input[name='__RequestVerificationToken']").val(),
        JSON.stringify({ hoSoID: hoSoID, isTheoDoi: !isHasClass }),
        "application/json; charset=utf-8",
        "json",
        true)
    .then
    (function (data) {
        if (data) {
            if (isHasClass)
                element.removeClass("color-yellow").addClass("color-7B");
            else
                element.removeClass("color-7B").addClass("color-yellow");
        }
    });

});

$(document).on('click', "table  td .fa-sitemap", (e) => {
    var element = $(e.target);
    var parentTr = element.closest("tr");
    var hoSoId = parentTr.attr("data-id");
    loadNewQuaTrinhXuLy(hoSoId);
    $("#modal-qua-trinh-xu-ly").modal("toggle");
});
$(document).on('click', "tbody .xem_chi_tiet", (e) => {
    var element = $(e.target);
    var parentTr = element.closest("tr");
    var hoSoId = parentTr.attr("data-id");
    var thuTucID = parentTr.attr("data-thutucid");
    var linhVucID = parentTr.attr("data-linhvucid");
    var liActive = $("#ul_tab_Ds li.active");
    var trangThaiHienTaiID = liActive.attr("data-trangthai");
    if (trangThaiHienTaiID == 1 || trangThaiHienTaiID == 4) {
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/HoSo/GetModule",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                JSON.stringify({ module: 'NV.MotCua.Index' }),
                "application/json; charset=utf-8",
                "json",
                true)
            .then
            (function (data) {
                if (data) {
                    var uri = window.location.pathname;
                    var isExist = false;
                    var query = window.location.pathname.split('/');
                    for (var i = 2; i < query.length; i += 2) {
                        if (query[i - 1].toLowerCase() == 'trangThai'.toLowerCase()) {
                            query[i] = trangThaiHienTaiID;
                            isExist = true;
                        }
                    }
                    if (!isExist)
                        uri += '/trangthai/' + trangThaiHienTaiID;
                    else
                        uri = query.join('/');
                    var uri = uri.replace(/[/]/g, '_');
                    var url = data.TabID + '/hoSoId/' + hoSoId + '/prev' + uri;
                    location.href = url;
                }
            });
    }
    else if (trangThaiHienTaiID == 7 || trangThaiHienTaiID == 3) {
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
                   var isExist = false;
                   var query = window.location.pathname.split('/');
                   for (var i = 2; i < query.length; i += 2) {
                       if (query[i - 1].toLowerCase() == 'trangThai'.toLowerCase()) {
                           query[i] = trangThaiHienTaiID;
                           isExist = true;
                       }
                   }
                   if (!isExist)
                       uri += '/trangthai/' + trangThaiHienTaiID;
                   else
                       uri = query.join('/');
                   uri = uri.replace(/[/]/g, '_');
                   console.log(uri);
                   var url = data.TabID + '/moduleId/' + data.ModuleID + '/hoSoId/' + hoSoId + '/linhVucId/' + linhVucID + '/thuTucId/' + thuTucID
                       + '/trangThaiId/' + trangThaiHienTaiID  + '/prev/' + uri
                      + '/controller/HoSo/action/ThemHoSo';
                   location.href = url;
               }
           });
    }
});
$(document).on('click', ".btn_chuyen_nguoi_nhan", (e) => {
    if (_arrThuTucDaChon.length == 0)
        return;
    var element = $(e.target);
    var trangThaiTiepTheoID = element.find('input[name="hdfTrangThaiTiepTheo"]').val();
    if (!trangThaiTiepTheoID) {//i click
        element = element.parent();
        trangThaiTiepTheoID = element.find('input[name="hdfTrangThaiTiepTheo"]').val();
    }
    var nguoiNhanID = element.find('input[name="hdfNguoiNhan"]').val();
    var liActive = $("#ul_tab_Ds li.active");
    var trangThaiHienTaiID = liActive.attr("data-trangthai");
    var table = $('#' + liActive.attr("data-href") + ' .dataTable');
    if (trangThaiTiepTheoID == 4 || trangThaiTiepTheoID == 5) {
        var listThuTuc = _arrThuTucDaChon.filter(i=>i.TrangThaiID == trangThaiHienTaiID)
        if (listThuTuc.length == 1 && listThuTuc[0].listHoSoID != "" && listThuTuc[0].listHoSoID.split(",").length == 1) {
            var listNguoiNhan = [];
            $.each(_arrNguoiNhanModal.filter(i=>i.TrangThaiTiepTheoID == trangThaiTiepTheoID), (index, element) => {
                listNguoiNhan.push({
                    ID: element.NguoiNhanID,
                    Ten: element.Displayname
                })
            });
            if (trangThaiTiepTheoID == 4) {
                loadNewYeuCauBoSung(listThuTuc[0].listHoSoID.split(",")[0], trangThaiHienTaiID, trangThaiTiepTheoID, listNguoiNhan, nguoiNhanID);
                $("#modal-yeu-cau-bo-sung").modal("toggle");
            }
            if (trangThaiTiepTheoID == 5) {
                loadNewKhongGiaiQuyet(listThuTuc[0].listHoSoID.split(",")[0], trangThaiHienTaiID, trangThaiTiepTheoID, listNguoiNhan, nguoiNhanID);
                $("#modal-khong-giai-quyet").modal("toggle");
            }
        }
        else
            window.alert_error("Vui lòng chỉ chọn một hồ sơ!");
        return;
    }
    var listHoSoID = "";
    $.each(_arrThuTucDaChon.filter(i=>i.TrangThaiID == trangThaiHienTaiID), (index, element) => {
        if (element.listHoSoID)
            listHoSoID += (listHoSoID != "" ? "," : "") + element.listHoSoID;
    });
    var request = JSON.stringify({ listHoSoID: listHoSoID, trangThaiHienTaiID: trangThaiHienTaiID, trangThaiTiepTheoID: trangThaiTiepTheoID, nguoiNhanID: nguoiNhanID });

    window.AjaxDungChung
        ("post",
          "/DesktopModules/MVC/NghiepVu/HoSo/MotCua_HoSoTiepNhan_ChuyenTrangThai",
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
                if (data > 0) {
                    window.alert_success("Chuyển thành công " + data + " hồ sơ!");
                    _arrThuTucDaChon = [];
                    LoadWL(liActive.attr("data-trangthai"), true);
                    window.XuLyDisabledBtnChuyen(false);
                    LoadDSTrangThaiBtnChuyen();

                }
                else
                    window.alert_error("Chuyển không thành công!");
            }
        });
});
$(document).on('click', ".btn_xuat_danh_sach", (e) => {

    var objArr = window.GetAllInputOnDiv(parent);
    var liActive = $("#ul_tab_Ds li.active");
    var divId = "#" + liActive.attr("data-href");
    var trangThai = liActive.attr("data-trangthai");
    var listHoSoID = "";
    $.each(_arrThuTucDaChon.filter(i=>i.TrangThaiID == trangThai), (index, element) => {
        if (element.listHoSoID)
            listHoSoID += (listHoSoID != "" ? "," : "") + element.listHoSoID;
    });
    var request = JSON.stringify({
        trangThai: trangThai, linhVucId: objArr["LinhVuc_Search"] ? "" : "", thuTucId: objArr["ThuTuc_Search"] ? "" : "",
        soBienNhan: objArr["SoBienNhan_Search"] ? "" : "", ngayNhanTu: objArr["NgayNhanTu_Search"] ? "" : "",
        ngayNhanDen: objArr["NgayNhanDen_Search"] ? "" : "", nguoiNop: objArr["NguoiNop_Search"] ? "" : "", soCMND: objArr["SoCMND_Search"] ? "" : "", listHoSoID: listHoSoID
    });

    window.AjaxDungChung
        ("post",
          "/DesktopModules/MVC/NghiepVu/HoSo/MotCua_HoSoTiepNhan_XuatDanhSachHoSo",
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
            else
                window.alert_error("Xuất không thành công!");
        });
});

function LoadChecked() {
    var liActive = $("#ul_tab_Ds li.active");
    var trangThai = liActive.attr("data-trangthai");
    var element = $('table .chk-tbl-all.' + trangThai);
    var parent = element.closest("table");
    var listCheck = parent.find("td input[type='checkbox']");
    var check = window.CheckLengthOfElement(listCheck);
    if (check === "1") {
        $.each(listCheck, (index, ele) => {
            var thuTucID = $(ele).attr('data-id');
            var hoSoID = $(ele).attr('value');
            var _arrFilter = _arrThuTucDaChon.filter(i =>i.TrangThaiID == trangThai && i.ThuTucID == thuTucID && i.listHoSoID.indexOf(hoSoID) !== -1);
            var length = _arrFilter.length;
            if (length > 0) {
                $(ele).attr('checked', true);
            }
        });
    }
}
function LoadCheckedALL() {
    var liActive = $("#ul_tab_Ds li.active");
    var trangThai = liActive.attr("data-trangthai");
    var element = $('table .chk-tbl-all.' + trangThai);
    var parent = element.closest("table");
    var countAll = parent.find("tbody tr").length;
    var countCheck = parent.find("td input[type='checkbox']:checked").length;
    $(element).attr('checked', countAll === countCheck);
}

function XuLyParam(func) {
    var hdfTrangThai = $('input[name="hdfTrangThai"]').val();
    LoadWL(hdfTrangThai, true, func);

}

function LoadWL(trangThai, isLoad, func) {
    var request = null;
    if (_alreadySearch)
        request = JSON.stringify({
            isFilter: _alreadySearch, linhVucId: _objFieldSeachArr["LinhVuc_Search"], thuTucId: _objFieldSeachArr["ThuTuc_Search"],
            soBienNhan: _objFieldSeachArr["SoBienNhan_Search"], ngayNhanTu: _objFieldSeachArr["NgayNhanTu_Search"],
            ngayNhanDen: _objFieldSeachArr["NgayNhanDen_Search"], nguoiNop: _objFieldSeachArr["NguoiNop_Search"], soCMND: _objFieldSeachArr["SoCMND_Search"]
        });

    window.AjaxDungChung("post", "/DesktopModules/MVC/NghiepVu/HoSo/GetWorkList",
            window.moduleId, window.tabId, $("input[name='__RequestVerificationToken']").val()
            , request, "application/json; charset=utf-8", "json", true)
        .then((data) => {
            if (data) {
                if (data.length > 0) {
                    var html = "";
                    var joinTenDungChung;
                    var trangThaiDungChung;
                    $.each
                    (data,
                        function (key, item) {
                            item.TenDanhSach = item.TenDanhSach.replace(/\r?\n|\r/g, '');
                            var tenUnicode = window.UnUnicode(item.TenDanhSach);
                            var joinTen = window.JoinArrayToStringByKey(window.SplitStringByKey(tenUnicode, " "), "_");
                            _arr.push
                                ({ tenUnicode: tenUnicode, joinTen: joinTen, TrangThaiHoSoID: item.TrangThaiHoSoID });
                            html += htmlWL(trangThai, item, joinTen);
                            if (trangThai == item.TrangThaiHoSoID) {
                                joinTenDungChung = joinTen;
                            }
                        });
                    $("#ul_tab_Ds").empty();
                    $("#ul_tab_Ds").one('DOMSubtreeModified', e => {
                        var liActice;
                        if (!trangThai) {
                            liActice = "#ul_tab_Ds li:first-child";

                        } else {
                            liActice = "#ul_tab_Ds li[data-trangthai='" + trangThai + "']";
                        }
                        $(liActice + " a").tab("show");
                        trangThaiDungChung = $(liActice).attr("data-trangthai");
                        joinTenDungChung = $(liActice).attr("data-href");
                        _tabFirstClick = trangThaiDungChung;
                        if (isLoad) {
                            GenDivTabContent(trangThaiDungChung, joinTenDungChung, "0");
                            if (_alreadySearch)
                                XuLyCall_showDataTable_Func("#" + joinTenDungChung, trangThaiDungChung, _objFieldSeachArr);
                            else
                                XuLyCall_showDataTable_Func("#" + joinTenDungChung, trangThaiDungChung);
                            _arr.push({ tenUnicode: "!@#$_done_!@#$", joinTen: joinTenDungChung, TrangThaiHoSoID: trangThaiDungChung });
                        }

                        if (func)
                            func();
                    });
                    $("#ul_tab_Ds").append(html);
                }
            }
        });

};

function GenDivTabContent(trangThai, nameDestination, isLazy) {
    var html = "";
    var check = window.CheckLengthOfElement($(".syt-content-div-tab-content").find("#" + nameDestination));
    if (check !== "1")// tức là trong element check chưa có cái nameDestination thì mới gen còn không thì khỏi//
    {
        if (isLazy === "0") {
            html += ' <div id="' + nameDestination + '" class="tab-pane fade in active">';
        } else {
            html += ' <div id="' + nameDestination + '" class="tab-pane fade">';
        }
        html += '      <div class="panel panel-default">';
        html += '    <div class="panel-body">';
        html += '    <table width="100%" class="table table-striped table-data" id="">';
        html += '    <thead class="font-size-13">';
        html += "  <tr>";
        html += '     <th class="text text-center bgth">';
        html += '       <input id="" type="checkbox" value="checkbox" class="chk-tbl-all ' + trangThai + '">';
        html += "   </th>";
        if (trangThai == 1 || trangThai == 4 || trangThai == 11)
            html += '  <th class="text text-center bgth"></th>';
        html += '  <th class="text text-center bgth"></th>';
        html += '   <th class="text text-center bgth">Số BN';
        html += "</th>";
        html += '         <th class="text text-center bgth">Ngày Nhận</th>';
        html += '  <th class="text text-center bgth">Lĩnh vực</th>';
        html += ' <th class="text text-center bgth">Thủ tục</th>';
        html += '  <th class="text text-center bgth">Người nộp</th>';
        var column = {};
        switch (trangThai) {
            case 4:
                html += '  <th class="text text-center bgth">Yêu cầu bổ sung</th>';
                break;
            case 5:
                html += '  <th class="text text-center bgth">Lý do</th>';
                break;
            default:
                html += '  <th class="text text-center bgth">Trạng thái</th>';
        }
        html += ' <th class="text text-center bgth">Ngày hẹn trả</th>';
        html += " </tr>";
        html += " </thead>";
        html += '<tbody class="font-size-13">';
        html += " </tbody>";
        html += " </table>";
        html += " </div>";
        html += " </div>";
        html += "</div>";
        $(".syt-content-div-tab-content").append(html);
    }

};

function showDataTable(divId, trangThai, linhVucId, thuTucId, soBienNhan, ngayNhanTu, ngayNhanDen, nguoiNop, soCMND) {
    var tableid = $(divId).find("table");
    var xemchitiet = "";
   
    if ([1, 4, 7,3].filter(i=>i == trangThai).length > 0)
        xemchitiet = 'xem_chi_tiet';
    var column = [];
    column.push({
        "render": function (data, type, full, meta) {
            return '<input id="txtIsActive" value="' +
                full.HoSoID +
                '" name="txtIsActive" type="checkbox" data-id="' +
                full.ThuTucID + '" />';
        },
        "orderable": false,
        "width": "5%",
        "className": "word-break text-center"
    });
    if (trangThai == 1 || trangThai == 4 || trangThai == 11)
        column.push({
            "render": function (data, type, full, meta) {
                return '<span class="fa fa-sitemap font-size-20 cursor-pointer color-blue"> </span>';
            },
            "orderable": false,
            "width": "5%"
        });
    column.push({
        "render": function (data, type, full, meta) {
            return '<span class="glyphicon glyphicon-star ' + (full.Star ? 'color-yellow' : 'color-7B') + ' font-size-20 cursor-pointer" data-id="' + full.HoSoID + '"> </span>';
        },
        "orderable": false,
        "width": "5%"
    },
            { "data": "SoBienNhan", "width": null, "orderable": false, "className": "word-break " + xemchitiet + " cursor-pointer" },
            {
                "render": function (data, type, full, meta) {
                    return window.moment(full.NgayNhan).format("DD/MM/YYYY");
                },
                "orderable": false,
                "width": "5%",
                "className": "word-break text-center  " + xemchitiet + " cursor-pointer"
            },
            { "data": "TenLinhVuc", "width": null, "orderable": false, "className": "word-break " + xemchitiet + " cursor-pointer" },
            { "data": "TenThuTuc", "width": "20%", "orderable": false, "className": "word-break " + xemchitiet + " cursor-pointer" },
            { "data": "HoTenNguoiNop", "width": "20%", "orderable": false, "className": "word-break " + xemchitiet + " cursor-pointer" });
    switch (trangThai) {
        case 4: case 5:
            column.push({ "data": "NoiDungXuLy", "width": "20%", "orderable": false, "className": "word-break " + xemchitiet + " cursor-pointer" });
            break;
        default:
            column.push({ "data": "TenTrangThaiHoSo", "width": "20%", "orderable": false, "className": "word-break " + xemchitiet + " cursor-pointer" });
    }
    column.push({
        "render": function (data, type, full, meta) {
            return window.moment(full.NgayHenTra).format("DD/MM/YYYY");
        },
        "orderable": false,
        "width": "5%",
        "className": "word-break text-center " + xemchitiet + " cursor-pointer"
    });
    $(tableid).on('draw.dt', function (e, settings) {
        LoadCheckedALL();
        if (_arrThuTucDaChon.length > 0) {
            LoadChecked();
        }
    })
        .one('page.dt', pageChange)
        .DataTable
    ({
        "proccessing": true,
        "serverSide": true,
        "destroy": true,
        "ajax": {
            "type": "POST",
            "url": "/DesktopModules/MVC/NghiepVu/HoSo/DanhSachHoSoByPage",
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
        "language": {
            "search": "",
            "searchPlaceholder": "Tên hồ sơ..",
            "zeroRecords": "Không có dữ liệu",
            "info": "Hiển thị  _PAGE_ trên tổng số _PAGES_ trang",
            "paginate": {
                "previous": "<",
                "next": ">",
                "first": "|<",
                "last": ">|"
            },
            "infoEmpty": "STT 0 - 0 / 0"
        },
        'createdRow': function (row, data) {
            $(row).attr('data-id', data.HoSoID);
            $(row).attr('data-thutucid', data.ThuTucID);
            $(row).attr('data-linhvucid', data.LinhVucID);
            if (data.Alert == 1)
                $(row).addClass('color-yellow');
            if (data.Alert == 2)
                $(row).addClass('color-red');
        },
        columns: column,
        'lengthChange': false,
        "ordering": false,
        'searching': false,
        'autoWidth': false,
        "order": []
    });
    function pageChange() {
        var liActive = $("#ul_tab_Ds li.active");
        LoadWL(liActive.attr("data-trangthai"), false, function () {
            $(tableid).one('page.dt', pageChange);
        });
    };
};
function XuLyCall_showDataTable_Func(divId, trangThai, objArr) {
    if (objArr)
        showDataTable(divId, trangThai, objArr["LinhVuc_Search"], objArr["ThuTuc_Search"]
            , objArr["SoBienNhan_Search"], objArr["NgayNhanTu_Search"], objArr["NgayNhanDen_Search"], objArr["NguoiNop_Search"], objArr["SoCMND_Search"]);
    else
        showDataTable(divId, trangThai);
};

function htmlWL(trangThai, item, joinTen) {
    var html = "";
    if (item) {
        if (trangThai == item.TrangThaiHoSoID)
            html += '<li class="active title-color" data-trangThai="' +
                item.TrangThaiHoSoID +
                '" data-href="' +
                joinTen +
                '">';
        else {
            html += '<li class="title-color" data-trangThai="' +
                item.TrangThaiHoSoID +
                '" data-href="' +
                joinTen +
                '">';
        }
        html += '<a data-toggle="tab" class="font-weight-700 font-size-13 ten_trang_thai"  href="#' +
            joinTen +
            '"> ' +
            item.TenDanhSach +
            "(" +
            item.SoLuong +
            ")";
        html += "</a>";
        html += "</li>";
    }

    return html;
};

function LazyLoadingDivTabContent() {
    var arr = _arr.filter(function (el) {
        return el.tenUnicode !== "!@#$_done_!@#$";
    });
    if (arr) {
        if (arr.length > 0) {
            $.each
            (arr,
                (index, data) => {
                    GenDivTabContent(data.TrangThaiHoSoID, data.joinTen, "1");
                    if(_alreadySearch)
                        XuLyCall_showDataTable_Func("#" + data.joinTen, data.TrangThaiHoSoID, _objFieldSeachArr);
                    else
                        XuLyCall_showDataTable_Func("#" + data.joinTen, data.TrangThaiHoSoID);
                });
        }
    }
    _doneLazy = true;
};

function LoadDSTrangThaiBtnChuyen(func) {
    _arrNguoiNhanModal = [];
    var liActive = $("#ul_tab_Ds li.active");
    var trangThai = liActive.attr("data-trangthai");
    var listThuTuc = "";
    $.each(_arrThuTucDaChon.filter(i=>i.TrangThaiID == trangThai), (index, element) => {
        listThuTuc += (listThuTuc != "" ? ";" : "") + element.ThuTucID;
    });
    var request = JSON.stringify({ listThuTuc: listThuTuc, trangThaiID: trangThai });
    window.AjaxDungChung
        ("post",
          "/DesktopModules/MVC/NghiepVu/HoSo/MotCua_QuyTrinhs_GetByThuTucIDandTrangThaiHienTaiID",
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
                if (func) {
                    $('.ul_chuyen_trang_thai').bind('DOMSubtreeModified', function (e) {
                        $('.ul_chuyen_trang_thai').unbind("DOMSubtreeModified");
                        func();
                    });
                }
                var listTrangThai = [];
                var listNguoiNhan = [];
                $.each(data, (index, element) => {
                    if (listTrangThai.filter(i=>i.TrangThaiTiepTheoID == element.TrangThaiTiepTheoID).length > 0) {
                        if (listNguoiNhan.filter(i=>i.TrangThaiTiepTheoID == element.TrangThaiTiepTheoID && i.NguoiNhanID == element.NguoiNhanID).length == 0)
                            listNguoiNhan.push({ TrangThaiTiepTheoID: element.TrangThaiTiepTheoID, NguoiNhanID: element.NguoiNhanID, Displayname: element.Displayname });
                    }
                    else {
                        listTrangThai.push({
                            TrangThaiTiepTheoID: element.TrangThaiTiepTheoID,
                            TenTrangThaiHoSo: element.TenTrangThaiHoSo,
                        });
                        listNguoiNhan.push({ TrangThaiTiepTheoID: element.TrangThaiTiepTheoID, NguoiNhanID: element.NguoiNhanID, Displayname: element.Displayname });
                    }
                });
                GenChuyenTrangThai(listTrangThai, listNguoiNhan);
                if (listTrangThai.filter(i=>i.TrangThaiTiepTheoID == 4 || i.TrangThaiTiepTheoID == 5).length > 0)
                    _arrNguoiNhanModal = listNguoiNhan.filter(i=>i.TrangThaiTiepTheoID == 4 || i.TrangThaiTiepTheoID == 10);
            }
          
                
        });
}
function onmouseLi(e) {
    if (e.target.className == 'next_menu cursor-pointer')
        $('.ul_chuyen_trang_thai li ul:visible').each(function (index, element) {
            $(element).toggle();
        });
    $(e.target).next("ul").toggle();
}
function GenChuyenTrangThai(listTrangThai, listNguoiNhan) {
    var ulTrangThai = $('.ul_chuyen_trang_thai');
    var html = "";
    $.each(listTrangThai, (index, trangthai) => {
        html += ' <li class="dropdown-submenu" onmouseover="onmouseLi(event)">'
            + ' <a class="next_menu cursor-pointer" tabindex="-1">' + trangthai.TenTrangThaiHoSo + '</a>';

        var listNguoiNhanByTrangThai = listNguoiNhan.filter(i=>i.TrangThaiTiepTheoID == trangthai.TrangThaiTiepTheoID);
        html += '  <ul class="dropdown-menu">';
        $.each(listNguoiNhanByTrangThai, (index, nguoinhan) => {
            if (nguoinhan.Displayname) {
                html += '   <li class="cursor-pointer">'
                + '  <a class="btn_chuyen_nguoi_nhan" tabindex="-1" >'
                + '<input type="hidden" name="hdfTrangThaiTiepTheo" value="' + nguoinhan.TrangThaiTiepTheoID + '" />'
                + '<input type="hidden" name="hdfNguoiNhan" value="' + nguoinhan.NguoiNhanID + '" />'
                + '    <i class="fa fa-user-o syt-icon-user" aria-hidden="true"></i>'
                + nguoinhan.Displayname + ' </a></li>';
            }
        });
        html += '</ul>';
        + ' </li>';
    });
    ulTrangThai.html("");
    ulTrangThai.append(html);
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

function modalOnClosed() {
    var liActive = $("#ul_tab_Ds li.active");
    _arrThuTucDaChon = [];
    //LoadWL(liActive.attr("data-href"), false, function () { $(".btn_search").trigger('click'); });
    LoadWL(liActive.attr("data-trangthai"), true);
    window.XuLyDisabledBtnChuyen(false);
    LoadDSTrangThaiBtnChuyen();
}












