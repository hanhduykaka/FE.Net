var data_Hoat_dong_chuyen_mon = [];
var data_Dieu_kien_hanh_nghe = [];
var data_Hinh_thuc_to_chuc = [
    {
        ID: 1,
        Ten: " Thuốc thành phẩm, sinh phẩm y tế, nguyên liệu làm thuốc bảo quản ở điều kiện thường"
    },
    {
        ID: 2,
        Ten: " Khác"
    }
];
var data_Pham_vi = [
    {
        ID: 1,
        Ten: "Doanh nghiệp xuất khẩu, nhập khẩu thuốc"
    },
    {
        ID: 2,
        Ten: "Doanh nghiệp bán buôn thuốc"
    },
    {
        ID: 3,
        Ten: "Bán lẻ thuốc thành phẩm"
    }
];
var data_Pham_vi_kinh_doanh = [];
var data_Dang_san_pham = [
    {
        ID: 1,
        Ten: " Kem, nhũ tương, sữa, gel hoặc dùng dầu trên da (tay, mặt, chân, ...)"
    },
    {
        ID: 2,
        Ten: "Mặt nạ (chỉ trừ sản phẩm làm bong da nguồn gốc hóa học)"
    },
    {
        ID: 3,
        Ten: " Chất phủ màu (lỏng, nhão, bột)"
    },
    {
        ID: 4,
        Ten: " Phấn trang điểm, phấn dùng sau khi tắm, bột vệ sinh, ..."
    },
    {
        ID: 5,
        Ten: " Xà phòng tắm, xà phòng khử mùi, ..."
    },
    {
        ID: 6,
        Ten: "Nước hoa, nước thơm dùng vệ sinh"
    },
    {
        ID: 7,
        Ten: "Sản phẩm tẩy lông"
    },
    {
        ID: 8,
        Ten: " Sản phẩm chăm sóc tóc"
    },
    {
        ID: 9,
        Ten: "Sản phẩm dùng cho môi"
    }
];
var data_Trang_Thai = [];

var _data_loai_giay_to = [
    {
        ID: "1",
        Ten: "Chứng minh nhân dân"
    },
    {
        ID: "2",
        Ten: "Hộ chiếu"
    },
    {
        ID: "3",
        Ten: "Căn cước công dân"
    },
    {
        ID: "4",
        Ten: "Khác"
    }
];
var _fileTypesImg = ["jpg", "jpeg", "png", "tiff", "gif"];
var _fileTypesDinhKem = ["doc", "docx", "xls", "xlsx", "pdf", "jpg", "jpeg", "png", "tiff", "gif", "sig", "enc"];

var _arrObjDinhKemPostFile = [];
var Id = $("input[name='hdfId']").val();
var HoSoID = $("input[name='hdfHoSoId']").val();
var ThuTucId = $("input[name='hdfThuTucId']").val();
var TrangThaiId = $("input[name='hdfTrangThaiId']").val();
var DauKy = $("input[name='hdfDauKy']").val();
var SoChungChi = $("input[name='hdfSoChungChi']").val();
var _arrObjFile = [];

var _valid_image = false;

var _data = {};
var _dataTrinhDo = [];

var _noidungtruoc;

var _data_ly_do_cap_lai = [
    {
        ID: "1",
        Ten: "Bị mất, hư hỏng"
    },
    {
        ID: "2",
        Ten: "Bị thu hồi điểm a,b"
    },
    {
        ID: "3",
        Ten: "Bị thu hồi điểm c,d"
    }
];

var _data_ly_do_cap_lai_ATSH = [
    {
        ID: "1",
        Ten: "Hết hạn"
    },
    {
        ID: "2",
        Ten: "Bị hỏng"
    },
    {
        ID: "3",
        Ten: "Bị mất"
    }
    ,
    {
        ID: "4",
        Ten: "Thay đổi tên cơ sở"
    }
];

var _data_thoi_han_ATSH = [
    {
        ID: "1",
        Ten: "3 năm"
    },
    {
        ID: "2",
        Ten: "5 Năm"
    }
];

var _data_ly_do_dieu_chinh = [
    {
        ID: "1",
        Ten: "Thay đổi phạm vi hoạt động chuyên môn"
    },
    {
        ID: "2",
        Ten: "Khác"
    }
];

var data_Linh_Vuc = [];

var data_Thu_Tuc = [];

var _flag_dont_Init_Binding = false;

$(document).ready
(() => {
    fn_Xu_Ly_Param();
    $(".btn_chuyen .next_menu").on
    ("click",
        function (e) {
            $(this).next("ul").toggle();
            e.stopPropagation();
            e.preventDefault();
        });

});

function fn_Xu_Ly_Param() {
    var hdfLinhVucId = $('input[name="hdfLinhVucId"]').val();
    var hdfThuTucId = $('input[name="hdfThuTucId"]').val();
    var hdfDauKy = $('input[name="hdfDauKy"]').val();
    var hdfPrev = $('input[name="hdfPrev"]').val();
    GetDMLinhVuc(hdfLinhVucId);
    GetDMThuTuc(hdfLinhVucId, hdfThuTucId, hdfDauKy);
    if (hdfPrev) {
        $(".btn_Tro_Ve").attr("data-prev", hdfPrev);
    }
    if (hdfDauKy) {
        $(".btn_chuyen").removeClass("show").addClass("hidden");
    }

};
function GetDMLinhVuc(linhvucID) {
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/GetDanhMucLinhVuc",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            null,
            "application/json; charset=utf-8",
            "json",
            true)
        .then
        (function (result) {
            if (result) {
                $.each(result, (index, ele) => {
                    data_Linh_Vuc.push({ ID: ele.LinhVucID, Ten: ele.TenLinhVuc });
                });
                window.LoadSelect2($(".sl_linh_vuc_ho_so_index"), data_Linh_Vuc, linhvucID ? linhvucID : $("#sl_linh_vuc_ho_so_index option:first-child").val(), true);
                var dataFindLinhVuc = data_Linh_Vuc.find(x => x.ID == linhvucID);
                $(".lbl_Linh_vuc_index").text(dataFindLinhVuc ? dataFindLinhVuc.Ten : "");
            }
        });
};
function GetDMThuTuc(linhvucID, thutucID, dauky) {
    if (!isNaN(linhvucID * 1)) {
        var dataRequest = JSON.stringify({ linhvucID: linhvucID });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/MotCua/GetThuTucByLinhVucIDJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {
                if (data) {
                    data_Thu_Tuc = [];
                    $(".sl_thu_tuc_ho_so_index").val($("#sl_thu_tuc_ho_so_index option:first-child").val());
                    $.each(data, (index, elm) => {
                        data_Thu_Tuc.push({
                            parentid: linhvucID,
                            ID: elm.ThuTucID,
                            Ten: elm.TenThuTuc,
                            dataid: "syt-dnm-lv" + linhvucID + "-tt" + elm.ThuTucID,
                            funcSave: elm.funcSave,
                            funcLoad: elm.funcLoad
                        });
                    });
                    window.LoadSelect2($(".sl_thu_tuc_ho_so_index"), data_Thu_Tuc, thutucID ? thutucID : $("#sl_thu_tuc_ho_so_index option:first-child").val(), true);
                    var dataFindThuTuc = data_Thu_Tuc.find(x => x.ID == thutucID);
                    $(".lbl_Thu_tuc_index").text(dataFindThuTuc ? dataFindThuTuc.Ten : "");
                    GetPartialByThuTucId(thutucID, dauky);
                }
            });
    } else {
        window.LoadSelect2($(".sl_thu_tuc_ho_so_index"), [], null, true);
    }
}
function GetTrangThaiHoSo(hdfTrangThaiId) {
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
        (function (result) {
            if (result) {
                    $.each(result, (index, ele) => {
                        data_Trang_Thai.push({ ID: ele.TrangThaiHoSoID, Ten: ele.TenTrangThaiHoSo });
                    });
                    var dataTrangThai = data_Trang_Thai.find(x => x.ID == hdfTrangThaiId);
                    if (dataTrangThai) {
                        $(".lbl_Trang_Thai_Ho_So").html(dataTrangThai.Ten);
                    }
            }
        });
};

function LoadHoSoByHoSoId(hoSoId) {
    var requestHoSo = JSON.stringify({ hosoId: hoSoId });
    var hdfDauKy = $('input[name="hdfDauKy"]').val();
    if (hdfDauKy) return;
    //$(".btn_chuyen").removeClass("hidden").addClass("show");
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/GetHoSoById",
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
                var result = $.parseJSON(data.Content);
                if (result) {
                    window.LoadDataInputText("SoBienNhan", result.SoBienNhan);
                    window.setValueDateTimePicker("NgayNhan", result.NgayNhan);
                    window.setValueDateTimePicker("NgayHenTra", result.NgayHenTra);
                    $('input[name = "SoBienNhan"]').attr('disabled', true);
                    $('input[name = "NgayNhan"]').attr('disabled', true);
                    $('input[name = "NgayHenTra"]').attr('disabled', true);
                }
            }
        });
};

function disableForm() {
    var formName = ".div_AbleDisable";
    window.DisableInputInForm(formName);
    window.RemoveClassInputInForm(formName, "require");
    window.RemoveClassInputInForm(formName, "background-require");
}

function LoadData() {
    var hdfTrangThaiId = $('input[name="hdfTrangThaiId"]').val();
    var hdfDauKy = $('input[name="hdfDauKy"]').val();
    if (hdfTrangThaiId && hdfTrangThaiId != 7 && hdfTrangThaiId != 11 && hdfDauKy != "1") {
        disableForm();
    }
    var hdfThuTucId = $('input[name="hdfThuTucId"]').val();
    var dataFindThuTuc = data_Thu_Tuc.find(x => x.ID == hdfThuTucId);
    var funcLoad;
    if (dataFindThuTuc) {
        funcLoad = dataFindThuTuc.funcLoad;
        if (funcLoad)
            window[funcLoad]();//call func
    }

};

function Init(thuTucId) {
    var hdfHoSoId = $('input[name="hdfHoSoId"]').val();
    var hdfTrangThaiId = $('input[name="hdfTrangThaiId"]').val();
    if (_dataTrinhDo.length == 0) {
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/HoSo/GetDanhMucTrinhDo",
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
                    _dataTrinhDo = data;
                }
            });
    }
   
    if (!jQuery.isEmptyObject(_data)) {
        _flag_dont_Init_Binding = true;
        LoadInit(_data);
        LoadData();
        LoadHoSoByHoSoId(hdfHoSoId);
        GetTrangThaiHoSo(hdfTrangThaiId);
    } else {
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/HoSo/GetParamJsonResult",
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
                    _flag_dont_Init_Binding = true;
                    _data = data;
                    LoadInit(data);
                    LoadData();
                    LoadHoSoByHoSoId(hdfHoSoId);
                    GetTrangThaiHoSo(hdfTrangThaiId);
                }
            });
    }
};

function LoadInit(data) {
    $(".adselect").select2();
    if (data.lstnoiCapChungChi) {
        window.LoadSelect2($('select[name="NoiCapChungChi"]'), data.lstnoiCapChungChi, null, true);
    }
    window.LoadSelect2($(".slTinhThanh"), data.lsttinhthanh, null, true);
    window.LoadSelect2($(".sl_LyDoCapLai"), _data_ly_do_cap_lai, null, true);
    window.LoadSelect2($(".sl_LyDoDieuChinh"), _data_ly_do_dieu_chinh, null, true);
    window.LoadSelect2($(".sl_LoaiGiayTo"), _data_loai_giay_to, null, false);


    data_Hoat_dong_chuyen_mon = data.lsttrinhdochuyenmon;
    data_Dieu_kien_hanh_nghe = data.lstphamViHoatDongChuyenMon;
    data_Pham_vi_kinh_doanh = data.lstphamViKinhDoanh;
    var check = window.CheckLengthOfElement($(".div_tong").find(".bootstrap-multiselect:not(':hidden')"));
    if (check === "1") {
        $(".bootstrap-multiselect:not(':hidden')").each
        ((e, obj) => {
            var thisElement = $(obj);
            var dataAttribute = thisElement.attr("data-data");
            LoadSelectPicker(thisElement, window[dataAttribute]); // call global variable
        });
    }
    $(".date-time-picker").datetimepicker
    ({
        locale: "vi",
        keepOpen: false
    });
    $(".date-picker").datetimepicker
    ({
        locale: "vi",
        format: "DD/MM/YYYY",
        useCurrent: false
    });
    // Node : Cancel hàm init này vì lý do validate nhiều date picker với nhau
    //window.InitFromToDatePicker(".date-picker-from", ".date-picker-to");//
    // Đồng nghĩa với việc mỗi màn hình cấp lại hay cấp mới sẽ có validate khác nhau
    window.InitNgaySinhNgayCapGiayToDatePickerAndString(".ngaySinh", ".date-picker-ngay-cap");
};

function InitElement() {
    LoadSelectPicker($("#grSel_hoat_dong_chuyen_mon_luong_y"), data_Hoat_dong_chuyen_mon);
};

$(".sl_linh_vuc_ho_so_index").change
((e) => {
    GetDMThuTuc(e.target.value);
    $(".div_tong").removeClass("show").addClass("hidden");
    $(".syt-content-div-icon-search").removeClass("show").addClass("hidden");

});

$(".sl_thu_tuc_ho_so_index").change
((e) => {
    GetPartialByThuTucId(e.target.value);
});

function GetPartialByThuTucId(thuTucId, isDauKy) {
    var dataRequest = JSON.stringify({ ID: thuTucId });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/ThuTucOnchange",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            dataRequest,
            "application/json; charset=utf-8",
            "html",
            true).then
        ((data) => {
            if (data) {
                $(".div_tong").removeClass("hidden");
                $(".div_tong").empty().html(data).hide();
                $(".div_tong").show("fast");
                $(".syt-content-div-icon-search").removeClass("hidden").addClass("show");
                window.ResetAllForm(".div_tong");
                //ResetHidenField();
                Init(thuTucId);
                $(".chk-parent .chk-dynamic").prop("disabled", true);
                if (isDauKy) {
                    $(".lbl_Trang_Thai_Ho_So").closest(".col-md-12").remove();
                }
            } else {
                $(".div_tong").removeClass("show").addClass("hidden");
                $(".syt-content-div-icon-search").removeClass("show").addClass("hidden");
            }
        });
};

$(document).on
("select2:select",
    ".address-parent .slTinhThanh",
    (e) => {
        var element = $(e.target);
        var tinhId = e.target.value;
        LoadComboHuyenByTinhId(element, tinhId);
    });

function LoadComboHuyenByTinhId(elementTinh, tinhId, selectedHuyenId) {
    if (!isNaN(tinhId * 1)) {
        var dataRequest = JSON.stringify({ tinhId: tinhId });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/HoSo/GetQuanHuyenByTinhIdJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {
                if (data) {
                    window.LoadSelect2(elementTinh.closest(".address-parent").find(".slQuanHuyen"), data, selectedHuyenId, true);
                }
            });
    } else {
        window.LoadSelect2(elementTinh.closest(".address-parent").find(".slQuanHuyen"), [], null, true);
    }
    window.LoadSelect2(elementTinh.closest(".address-parent").find(".slPhuongXa"), [], null, true);
}


$(document).on
("select2:select",
    ".address-parent .slQuanHuyen",
    (e) => {
        var element = $(e.target);
        var quanId = e.target.value;
        LoadComboXaByHuyenId(element, quanId);
    });

function LoadComboXaByHuyenId(elementHuyen, quanId, selectedXaId) {
    if (!isNaN(quanId * 1)) {
        var dataRequest = JSON.stringify({ quanId: quanId });
        window.AjaxDungChung
            ("post",
                "/DesktopModules/MVC/NghiepVu/HoSo/GetPhuongXaByQuanIdJsonResult",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                dataRequest,
                "application/json; charset=utf-8",
                "json",
                true).then
            ((data) => {
                if (data) {
                    window.LoadSelect2(elementHuyen.closest(".address-parent").find(".slPhuongXa"), data, selectedXaId, true);
                }
            });
    } else
        window.LoadSelect2(elementHuyen.closest(".address-parent").find(".slPhuongXa"), [], null, true);
}


function ResetHidenField() {
    $("input[name='hdfChungChiHanhNgheYID']").val("");
    $("input[name='hdfHoSoId']").val("");
};

$(document).on
("changed",
    ".selectpicker_checkbox",
    (e) => {
        var divDanhSach = $(e.currentTarget).closest(".div_selpicker_parent").find(".ds_selectpicker");
        var selected = $(e.currentTarget).val();
        if (selected) {
            if (selected.length > 0) {
                var html = html_gen_selectpicker
                (selected,
                    window[$(e.currentTarget).attr("data-data")]); // call global variable
                // sau này có thể thay = ajax lấy data dynamically
                divDanhSach.empty().append(html);
            }
        } else {
            divDanhSach.empty();
        }
    });

function LoadSelectPicker(element, data) {
    if (data) {
        if (element) {
            var html = "";
            var width = element.parent("div").width();
            $.each
            (data,
                function (key, item) {
                    html += '<option  value="' + item.ID + '">' + item.Ten + "</option>";
                });
            element.html(html);
            element.multiselect
            ({
                nonSelectedText: "Chưa lựa chọn",
                allSelectedText: "Chọn tất cả",
                buttonWidth: width < 50 ? 350 : width + 'px',
                onChange: function () {
                    var brands = element.find('option:selected');
                    var selected = [];
                    $(brands).each(function () {
                        selected.push([$(this).val()]);
                    });
                    var divDanhSach = element.closest(".div_selpicker_parent").find(".ds_selectpicker");
                    var htmlGen = html_gen_selectpicker
                    (selected,
                        window[element.attr("data-data")]); // call global variable
                    // sau này có thể thay = ajax lấy data dynamically
                    divDanhSach.empty().append(htmlGen);
                }
            });
            element.multiselect("refresh");
        }
    }
};

function LoadDataSelectPicker(element, lstStringId, lstStringName) {
    var arrayId = window.SplitStringByKey(lstStringId, "-");
    var arrayName = window.SplitStringByKey(lstStringName, ";");
    var divDanhSach = element.closest(".div_selpicker_parent").find(".ds_selectpicker");
    var htmlGen = html_gen_selectpickerbyName
    (arrayId,
        arrayName);
    divDanhSach.empty().append(htmlGen);
    $.each
    (arrayId,
        function (i, item) {
            $(element).find("[value=" + item + "]").prop("selected", true);
        });
    $(element).multiselect("refresh");
};

function LoadHinhAnh(hinhAnh) {
    var element = $("#img-hinh-dai-dien");
    XuLyLoadAnh(hinhAnh, element);
    var parent = element.closest(".div-upload-parent");
    parent.find(".upload-xoa-hinh-anh").removeClass("hidden").addClass("show");
    parent.find(".upload-this").removeClass("show").addClass("hidden");
};

function XuLyLoadAnh(hinhAnh, element) {
    if (hinhAnh) {
        var pathUpLoad = $("#hdfPathUploadFile").val();
        var fullpath = window.ResolveUrl(pathUpLoad + hinhAnh);
        element.attr("data-hinh", hinhAnh);
        element.attr("src", fullpath);
    }
    else
        element.attr("src", "");
}

function fn_delete_seleted_picker(ev) {
    var element = $(ev);
    var parent = element.closest(".div_selpicker_parent");
    var selpicker = parent.find(".selectpicker_checkbox");
    $(selpicker).find("[value=" + element.attr("data-id") + "]").prop("selected", false);
    $(selpicker).multiselect("refresh");
    element.closest(".ds-item").remove();
};

$(document).on
("click",
    ".tbl-dynamic .syt-edit-btn",
    (e) => {
        var element = $(e.target);
        var dataArr = element.data();
        var table = element.closest("table");
        var tbody = element.closest("tbody");
        var elementCheck = $(table).find('tr[name="tr-edit"]');
        var check = window.CheckLengthOfElement(elementCheck);
        if (check === "-1") return;
        else {
            if (check === "0") {
                XuLyEditFunc(table, dataArr, tbody);
            } else {
                window.alert_info
                    ("Bạn đang có dòng dữ liệu chưa được lưu, Vui lòng lưu hoặc đóng trước khi thực hiện thao tác mới!");
            }
        }
    });

$(document).on
("click",
    ".div_edit_table_parent .btn_them_edit_table",
    (e) => {
        var element = $(e.target);
        if (element.hasClass("color-black")) return;
        var parent = element.closest(".div_edit_table_parent");
        var table = parent.find("table");
        var tbody = $(table).find("tbody");
        var elementCheck = $(table).find('tr[name="tr-edit"]');
        var check = window.CheckLengthOfElement(elementCheck);
        if (check === "-1") return;
        else {
            if (check === "0") {
                XuLyEditFunc(table, null, tbody);
            } else {
                window.alert_info
                    ("Bạn đang có dòng dữ liệu chưa được lưu, Vui lòng lưu hoặc đóng trước khi thực hiện thao tác mới!");
            }
        }
    });

function XuLyEditFunc(table, dataArr, tbody) {
    var fnhtmlName = $(table).attr("data-html");
    var html = window[fnhtmlName](dataArr); // call function dynamic
    if (dataArr) {
        tbody.find("tr[name!='tr-edit']").each
        ((index, obj) => {
            var thisElement = $(obj);
            if (dataArr.id == thisElement.attr("data-id")) {
                thisElement.after(html);
                thisElement.addClass("hidden");
            }
        });
    } else {
        window.AppendDiv(tbody, html);
    }
    var select2FunctionName = table.attr("data-select2Func");
    if (select2FunctionName) {
        window[select2FunctionName](dataArr);
    }
};

function fn_cancel_edit(e) {
    var element = $(e);
    var table = element.closest("table");
    var tbody = element.closest("tbody");
    var trParent = element.closest("tr");
    var dataId = trParent.attr("data-id");
    trParent.remove();
    if (dataId != 0) {
        tbody.find("tr[class='font-size-13 hidden']").removeClass("hidden");
    }
};

function fn_save_edit(element) {
    var table = $(element).closest("table");
    var saveFunctionName = table.attr("data-save");
    window[saveFunctionName](element);
};

function fn_Xoa_Dong(ev) {
    var table = $(ev).closest("table");
    var deleteFunctionName = table.attr("data-del");
    var tr = $(ev).closest("tr");
    var msg = "Bạn có chắc chắn xóa dòng này không?";
    var notice = new PNotify
        ({
            title: "Cảnh báo",
            text: msg,
            icon: "glyphicon glyphicon-question-sign",
            hide: false,
            confirm: {
                confirm: true
            },
            buttons: {
                closer: false,
                sticker: false
            },
            history: {
                history: false
            },
            addclass: "stack-modal",
            stack: { 'dir1': "down", 'dir2': "right", 'modal': true }
        }).get().on
        ("pnotify.confirm",
            function () {
                if (deleteFunctionName)
                    window[deleteFunctionName](ev);
                else
                    tr.remove();
            }).on
        ("pnotify.cancel",
            function () {
                return "false";
            });

};

function SelectedElementByData(element, data) {
    element.val(data).trigger("change");
};

function CheckedElementByData(element, data) {
    //
    $.each
    (element,
        function () {
            if ($(this).val() === data) {
                $(this).prop("checked", true);
            }
        });
};

function XyLyselect2TrinhDo(data) {
    window.LoadSelect2($(".sl_trinh_do"), _dataTrinhDo, data ? data.trinhdoid : null, false);
};

function html_gen_selectpicker(data, dataFind) {
    var html = "";
    $.each
    (data,
        (index, value) => {
            html += '<div class="ds-item">';
            html += ' <div class="sytClearFix dnnClear"></div>';
            html += ' <div class="mt-10 mb-5"></div>';
            html += "<span>";
            html += ' <span type="button" title="Xóa" data-id=' + value + ' onclick="fn_delete_seleted_picker(this)" ';
            html +=
                ' class="glyphicon glyphicon-remove syt-icon-cancel icon-gray cursor-pointer"></span> &nbsp; &nbsp;';
            html += "" + dataFind.find(x => x.ID == value).Ten + "</span> </br>";
            html += " </div>";
        });
    return html;
};

function html_gen_selectpickerbyName(data, dataName) {
    var html = "";
    $.each
    (data,
        (index, value) => {
            html += '<div class="ds-item">';
            html += ' <div class="sytClearFix dnnClear"></div>';
            html += ' <div class="mt-10 mb-5"></div>';
            html += "<span>";
            html += ' <span type="button" title="Xóa" data-id=' + value + ' onclick="fn_delete_seleted_picker(this)" ';
            html +=
                ' class="glyphicon glyphicon-remove syt-icon-cancel icon-gray cursor-pointer"></span> &nbsp; &nbsp;';
            html += "" + dataName[index] + "</span> </br>";
            html += " </div>";
        });
    return html;
};

function html_gen_edit_trinh_do(data) {
    var html = "";
    html += '   <tr ' + (data ? "data-id=\"" + data.id + "\"" : "data-id=0") + ' class="font-size-13"  name="tr-edit">';
    html += "    <td>";
    html += '    <select class="sknadSelect width-100 adselect sl_trinh_do" name ="TrinhDo">';
    html += "    </select>";
    html += "    </td>";
    html += "   <td>";
    html += '<input  min = 1 step="1" name="name_tot_nghiep" oninput="validity.valid||(value=\'\');" class="width-100 syt-radius-3 min-h-30 paddingMin txt_nam_tot_nghiep"' +
        ' type="number"' +
        (data ? "value=\"" + data.nam_tot_nghiep + "\"" : "") +
        "/>";
    html += "    </td>";
    html += "   <td>";
    html += '    <input name="truong_dao_tao" class="width-100 syt-radius-3 min-h-30 paddingMin txt_truong_dao_tao"' +
        ' type="text" ' +
        (data ? "value=\"" + escapeHtml(data.truong_dao_tao) + "\"" : "") +
        " />";
    html += "   </td>";
    html += "  <td>";
    html += '   <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += '   <span class="glyphicon glyphicon-ok syt-icon-save" ' +
        'title="Lưu" onclick="fn_save_edit(this)"></span>';
    html += "   </div>";
    html += "  </td>";
    html += "   <td >";
    html += '    <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += '    <span type="button" title="Hủy"  onclick="fn_cancel_edit(this)"' +
        ' class="glyphicon glyphicon-remove syt-icon-cancel"/>';
    html += "  </div>";
    html += "   </td>";
    html += "   </tr> ";
    return html;
};

function html_gen_edit_qua_trinh_cong_tac(data) {
    var html = "";
    html += ' <tr class="font-size-13" name="tr-edit">';
    html += "    <td>";
    html += '   <input name="thoi_gian_cong_tac" class="width-100 syt-radius-3 min-h-30 paddingMin txt_thoi_gian_cong_tac"' +
        "" +
        (data ? "value=\"" + escapeHtml(data.thoi_gian_cong_tac) + "\"" : "") +
        ' type="text" />';
    html += "   </td>";
    html += "   <td>";
    html += '   <input name="don_vi_cong_tac" class="width-100 syt-radius-3 min-h-30 paddingMin txt_don_vi_cong_tac" ' +
        " " +
        (data ? "value=\"" + escapeHtml(data.don_vi_cong_tac) + "\"" : "") +
        '  type="text" />';
    html += "   </td>";
    html += "  <td>";
    if (data && data.loai != 1) {
        html += '  <input  type="radio" name="loai"  value="1" class="nha_nuoc"/>';
        html += "  <span> Nhà nước</span>";
        html += '  <input  type="radio" name="loai"  value="2" class="tu_nhan"  checked="checked"/>';
        html += "  <span> Tư nhân</span>";
    } else {
        html += '  <input  type="radio" name="loai"  value="1" class="nha_nuoc" checked="checked"/>';
        html += "  <span> Nhà nước</span>";
        html += '  <input  type="radio" name="loai"  value="2" class="tu_nhan" />';
        html += "  <span> Tư nhân</span>";
    }
    html += "  </td>";
    html += '  <td title="Sửa">';
    html += '   <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += ' <span class="glyphicon glyphicon-ok syt-icon-save" title="Lưu" ';
    html += ' onclick="fn_save_edit(this)"></span>';
    html += "   </div>";
    html += "    </td>";
    html += '   <td title="Xóa">';
    html += '    <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += ' <span type="button" title="Hủy" onclick="fn_cancel_edit(this)" ';
    html += ' class="glyphicon glyphicon-remove syt-icon-cancel"></span>';
    html += "   </div>";
    html += "   </td>";
    html += "  </tr>";
    return html;
};

$(document).on
("click",
    ".div-upload-parent .upload-this",
    (e) => {
        e.preventDefault();
        var element = $(e.target);
        var parent = element.closest(".div-upload-parent");
        var upload = parent.find("input[type='file']:not(:disabled)");
        $(upload).trigger("click");
    });

$(document).on
("change",
    "#file_Hinh_anh",
    (e) => {
        var element = $(e.target);
        var file = element[0].files[0];
        var parent = element.closest(".div-upload-parent");
        var output = document.getElementById("img-hinh-dai-dien");
        if (file) {
            var extension = file.name.split(".").pop().toLowerCase(), //file extension from input file
                isSuccess = _fileTypesImg.indexOf(extension) > -1;
            if (isSuccess) {
                var reader = new FileReader();
                reader.onload = function () {
                    output.src = reader.result;
                };
                reader.readAsDataURL(file);
                parent.find(".upload-xoa-hinh-anh").removeClass("hidden").addClass("show");
                parent.find(".upload-this").removeClass("show").addClass("hidden");
                _valid_image = true;
            } else {
                window.alert_info("File đính kèm có định dạng không hợp lệ");
                _valid_image = false;
            }
        }
    });

function previewTapDinhKem() {
    var multipleFile = document.getElementById("file_Dinh_kem").files;
    if (multipleFile) {
        if (multipleFile.length > 0) {
            $.each
            (multipleFile,
                function (idx, file) {
                    if (file) {
                        var extension = window.GetExtensionFileByFileName(file.name), //file extension from input file
                            isSuccess = _fileTypesDinhKem.indexOf(extension) > -1,
                            isMaxlengExec = window.Check50MB(file.size);
                        if (isSuccess) {
                            if (isMaxlengExec) {
                                var reader = new FileReader();
                                reader.onload = function () {
                                    var id = window.newGUIDFunc();
                                    var html = "";
                                    html += '<div class="parent_dinh_kem">';
                                    html += "<a class='cursor-pointer'>" + file.name + "</a>";
                                    html +=
                                        '<span data-id=' +
                                        id +
                                        ' class="glyphicon glyphicon-remove btn_xoa_dinh_kem cursor-pointer ml-5 color-red"> </span>';
                                    html += "</div>";
                                    $(".div_lst_tap_dinh_kem").append(html);
                                    _arrObjDinhKemPostFile.push({ id, file});
                                    };
                                console.log(_arrObjDinhKemPostFile);
                                reader.readAsDataURL(file);
                                    } else {
                                window.alert_info("Vui lòng chọn file dưới 50MB");
                                    }

                                    } else {
                            window.alert_info("File đính kèm có định dạng không hợp lệ");
                        }
                    }
                }
            );
            $("#file_Dinh_kem").attr("value", "");
        }
    }
};

$(document).on
("click",
    ".div-upload-parent .upload-xoa-hinh-anh",
    (e) => {
        e.preventDefault();
        var element = $(e.target);
        var sytUDisable = element.attr("class");
        var checkHasClass = window.IndexOfString(sytUDisable, "syt_u_disable");
        if (checkHasClass !== "1") {
            var msg = "Bạn có chắc chắn xóa ảnh đính kèm này không?";
            var notice = new PNotify
                ({
                    title: "Cảnh báo",
                    text: msg,
                    icon: "glyphicon glyphicon-question-sign",
                    hide: false,
                    confirm: {
                        confirm: true
                    },
                    buttons: {
                        closer: false,
                        sticker: false
                    },
                    history: {
                        history: false
                    },
                    addclass: "stack-modal",
                    stack: { 'dir1': "down", 'dir2': "right", 'modal': true }
                }).get().on
                ("pnotify.confirm",
                    function () {
                        $(".upload-xoa-hinh-anh").removeClass("show").addClass("hidden");
                        $(".upload-this").removeClass("hidden").addClass("show");
                        $("#img-hinh-dai-dien").attr("data-hinh", "");
                        $("#img-hinh-dai-dien").attr("src", "");
                        $("input[name='hdfDelHinhAnh']").val("1");
                    }).on
                ("pnotify.cancel",
                    function () {
                        return "false";
                    });
        }
    });

$(document).on
("click",
    ".parent_dinh_kem .btn_xoa_dinh_kem",
    (e) => {
        e.preventDefault();
        var msg = "Bạn có chắc chắn xóa file đính kèm này không?";
        var notice = new PNotify
            ({
                title: "Cảnh báo",
                text: msg,
                icon: "glyphicon glyphicon-question-sign",
                hide: false,
                confirm: {
                    confirm: true
                },
                buttons: {
                    closer: false,
                    sticker: false
                },
                history: {
                    history: false
                },
                addclass: "stack-modal",
                stack: { 'dir1': "down", 'dir2': "right", 'modal': true }
            }).get().on
            ("pnotify.confirm",
                function () {
                    window._flag_Changing_listFile = true;
                    var element = $(e.target);
                    var id = element.attr("data-id");
                    if (_arrObjDinhKemPostFile.length > 0) {
                        _arrObjDinhKemPostFile = _arrObjDinhKemPostFile.filter(item => item.id !== id);
                    }
                    if (_arrObjFile.length > 0) {
                        _arrObjFile = _arrObjFile.filter(item => item.id !== id);
                    }
                    console.log(_arrObjDinhKemPostFile);
                    var parent = element.closest(".parent_dinh_kem");
                    parent.remove();
                }).on
            ("pnotify.cancel",
                function () {
                    return "false";
                });
    });


$(".chk-hide-this").click
((e) => {
    var element = $(e.target);
    var elementCheck = element.closest(".div-chk-hide-parent").find(".chk-hide-destination");
    var check = window.CheckLengthOfElement(elementCheck);
    if (element.is(":checked")) {
        if (check === "1") {
            elementCheck.removeClass("show").addClass("hidden");
        }
    } else {
        elementCheck.removeClass("hidden").addClass("show");
    }
});

$(".btn_Luu").click
((e) => {
    var element = $(e.target);
    var linhVucId = $('input[name="hdfLinhVucId"]').val();
    var thuThucId = $('input[name="hdfThuTucId"]').val();
    var dataFindThuTuc = data_Thu_Tuc.find(x => x.ID == thuThucId);
    var funcSave;
    if (dataFindThuTuc) {
        funcSave = dataFindThuTuc.funcSave;
        window[funcSave](linhVucId, thuThucId);//call func
    }
});
$(".btn_InDeXuat").click
((e) => {
    var requestUrl = $('input[name="hdfInDeXuat"]').val();
    if (requestUrl)
        printFile(requestUrl);
});
$(".btn_InChungChi").click
((e) => {
    var requestUrl = $('input[name="hdfInChungChi"]').val();
    if (requestUrl)
        printFile(requestUrl);
});
function printFile(requestUrl) {
    var request = JSON.stringify({
        Id: Id
    });

    window.AjaxDungChung
        ("post",
          requestUrl,
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
                var blob = convertDataURItoFile('data:application/vnd.ms-word;base64,' + data.Data, data.FileName)
                var URL = window.URL || window.webkitURL;
                var downloadUrl = URL.createObjectURL(blob);

                if (data.FileName) {
                    var a = document.createElement("a");
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
}
function convertDataURItoFile(dataURI, fileName) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ia], { type: mimeString });
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
}
function validateform() {
    var check = window.ValidateRequireOnDiv(".div_tong");
    if (check) {
        check = window.ValidateEmailOnDiv(".div_tong");
        if (check) {
            check = window.ValidateErrorOnDiv(".div_tong");
        }
    }
    return check;
};

$(document).on
("input",
    ".background-require",
    (e) => { // event when input changing text
        var element = $(e.currentTarget);
        var valueElement = element.val();
        if (valueElement) {
            element.removeClass("border-color-a9");
        } else
            element.addClass("border-color-a9");
    });

$(document).on
("input",
    ".require",
    (e) => { // event when input changing text
        var element = $(e.currentTarget);
        var valueElement = element.val();
        if (valueElement) {
            element.removeClass("border-color-a9");
        } else
            element.addClass("border-color-a9");
    });

$(document).on
("input",
    ".email",
    (e) => { // event when input changing text
        var element = $(e.currentTarget);
        var valueElement = element.val();
        if (valueElement) {
            if (window.validateEmail(valueElement)) {
                window.removeValidate(element, "border-color-a9", ".color-red");
            } else {
                window.appendValidate
                (element,
                    "border-color-a9",
                    ".color-red",
                    "<label class='color-red'> Email chưa đúng định dạng! </label>");
            }
        } else {
            window.removeValidate(element, "border-color-a9", ".color-red");
        }
    });

$(document).on
("input",
    ".ngaySinh",
    (e) => { // event when input changing text
        var element = $(e.currentTarget);
        var valueElement = element.val();
        if (valueElement) {
            var validateDinhDang = window.ValidateDinhDangNgaySinh(valueElement);
            if (validateDinhDang.valid === "valid") {
                window.removeValidate(element, "border-color-a9", ".color-red");
                var kieuDate = validateDinhDang.kieuDate;
                var stringNgayCap = $(".date-picker-ngay-cap").val();
                var validTuoi = window.ValidateTuoi(valueElement, stringNgayCap, kieuDate);
                if (validTuoi !== "True") {
                    window.appendValidate
                    (element,
                        "border-color-a9",
                        ".color-red",
                        "<label class='color-red'>" + validTuoi + " </label>");
                } else {
                    window.removeValidate(element, "border-color-a9", ".color-red");
                }
            } else {
                window.appendValidate
                (element,
                    "border-color-a9",
                    ".color-red",
                    "<label class='color-red'>Ngày nhập chưa đúng định dạng! </label>");
            }
        } else {
            window.removeValidate(element, "border-color-a9", ".color-red");
        }
    });

$(document).on
("input",
    ".varchar",
    (e) => { // event when input changing text
        var element = $(e.currentTarget);
        var valueElement = element.val();
        if (valueElement) {
            valueElement = window.UnUnicode(valueElement);
            element.val(valueElement);
        }
    });


$("table .chk-tbl-all").change
(function () {
    var element = $($(this)[0]);
    var parent = element.closest("table");
    var listCheck = parent.find("td input[type='checkbox']");
    var check = window.CheckLengthOfElement(listCheck);
    if (check === "1") {
        if (this.checked) {
            listCheck.each
            ((e, obj) => {
                $(obj).prop("checked", true);
            });
        } else {
            listCheck.each
            ((e, obj) => {
                $(obj).prop("checked", false);
            });
        }
    }
});

$(".div-select-parent .input-select").click
((e) => {
    var element = $(e.target);
    var parent = element.closest(".div-select-parent");
    var listCheck = parent.find("td input[type='checkbox']");
    var check = window.CheckLengthOfElement(listCheck);
    var modalParent = parent.closest(".modal");
    var arraySelect = [];
    if (check) {
        listCheck.each
        ((e, obj) => {
            if ($(obj).is(":checked")) {
                var checkElement = $(obj)[0];
                var trCheck = checkElement.closest("tr");
                var noiDungCheck = $(trCheck).find(".td-noi-dung");
                arraySelect.push("-" + noiDungCheck[0].innerText + "\n");
            }
        });
        if (arraySelect.length > 0) {
            modalParent.modal("toggle");
            var parentArea = element.closest(".div-select-parent-area");
            var areaShow = parentArea.find(".area-show");
            areaShow.val(arraySelect);
        } else {
            window.alert_info("Vui lòng chọn 1 đối tượng!");
        }
    } else {
        window.alert_info("Không có đối tượng để chọn!");
    }
});
$(".chon-goi-y").click
((e) => {
    var element = $(e.target);
    var parent = element.closest(".div-select-parent-area");
    var modal = parent.find(".modal");
    var tbl = modal.find("table");
    var elementCheck = $(tbl).find('tr[name="tr-edit"]');
    var check = window.CheckLengthOfElement(elementCheck);
    if (check === "1") {
        elementCheck.remove();
    }
    tbl.find("input[type='checkbox']").prop("checked", false);
    modal.modal("show");

});

$(".btn_Tro_Ve").click
((e) => {
    var element = $(e.target);
    var prev = element.attr("data-prev");
    if (prev) {
        prev = prev.replace(/_/g, '/');
        window.location.href = prev;
    }
    else {
        window.location.href = "/danh-Sach-Ho-So";
    }
});

function escapeHtml(text) {
    if(!text)
        return "";
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function (m) { return map[m]; });
}


function DisabledButtonSave() {
    $(".btn_Luu").attr("disabled", true);
};
function EnabledButtonSave() {
    $(".btn_Luu").attr("disabled", false);
};

//$(document).on('input', ".date-picker-ngay-cap", (e) => {
//    console.log( window.moment(e.timeStamp).format("DD/MM/YYYY"));
//});
