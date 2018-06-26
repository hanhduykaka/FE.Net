
$(document).ready
(() => {

    window.InitDateTimePicker($(".date-picker-ngay-dieu-chinh"));
});

$(document).on
("blur", ".so_chung_chi_bo_sung",
    (e) => {
        var oldSoChungChi = $('input[name="hdfSoChungChi"]').val();
        var element = $(e.currentTarget);
        var txtVal = element.val();
        if (txtVal) {
            if (oldSoChungChi == txtVal) {
                window.removeValidate(element, "border-color-a9", ".color-red");
                return;
            }
            window.LoadChungChiBySoChungChi(txtVal, "XuLyLoadDataChungChiBoSungTruoc");
        } else {
            window.removeValidate(element, "", ".color-red");
        }
    });

function XuLyLoadDataChungChiBoSungTruoc(result) {
    var elementSoChungChi = $("input[name='SoChungChi']");
    var hdfThuTucId = $('input[name="hdfThuTucId"]').val();
    if (result) {
        //
        $('input[name="hdfId"]').val(result.chungChiHanhNgheY.ChungChiHanhNgheYID);
        $('input[name="hdfSoChungChi"]').val(result.chungChiHanhNgheY.SoChungChi);
        window._noidungtruoc = result;
        if (hdfThuTucId == "3") {
            LoadNoiDungTruoc(result);
        }
    }
};

function fnSaveChungChiYBoSung(linhVucId, thuThucId) {
 
    if (!validateform()) {
        return;
    }
    DisabledButtonSave();
    var divTren = $(".div_yeu_cau_bo_sung_tren");
    var formdata = new FormData();
    var objArr = window.GetAllInputOnDiv(divTren);
    console.log(objArr);
    var objBoSungCheck = {};
    var arrCheck = [];
    var divDuoi = $(".div_yeu_cau_bo_sung");
    var dsCheck = divDuoi.find(".chk-this");
    $(dsCheck).each((i, obj) => {
        var thisElement = $(obj);
        var check = thisElement.is(":checked");
        if (check) {
            var name = thisElement.attr("name");
            arrCheck.push({ thisElement});
            objBoSungCheck[name] = "True";
        }
    });
    var objBoSung = ColectionDuLieu(arrCheck);
    $.each
    (_arrObjDinhKemPostFile,
        function (i, item) {
            formdata.append(item.id, item.file);
        });
    var file = document.getElementById("file_Hinh_anh").files[0];
    formdata.append('img', file);
    objArr["BoSungId"] = $('input[name="hdfBoSungId"]').val();

    objBoSung["LinhVucId"] = linhVucId;
    objBoSung["ThuTucId"] = thuThucId;
    var hoSoId = $('input[name="hdfHoSoId"]').val() == "" ? "0" : $('input[name="hdfHoSoId"]').val();
    var chungChiId = $('input[name="hdfId"]').val() == ""
        ? "0"
        : $('input[name="hdfId"]').val();
    objBoSung["ChungChiHanhNgheYID"] = chungChiId;
    objBoSung["HoSoID"] = hoSoId;
    formdata.append("model", JSON.stringify(objBoSung));
    formdata.append("modelHoSo", JSON.stringify(objArr));
    formdata.append("noidungtruoc", JSON.stringify(window._noidungtruoc));
    formdata.append("objBoSungCheck", JSON.stringify(objBoSungCheck));
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/SaveHoSoChungChiYBoSung",
            window.moduleId,
            window.tabId,
            $("input[name='__RequestVerificationToken']").val(),
            formdata,
            false,
            "json",
            false).then
        ((data) => {
            if (data) {
                console.log(data);
                window.alert_success("Lưu thành công!");
                window._arrObjFile = [];
                window._arrObjDinhKem = [];
                fnLoadChungChiYBoSung();
            } else
                window.alert_success("Lưu chưa thành công!");
        });
};

function fnLoadChungChiYBoSung() {
    var hdfHoSoId = $('input[name="hdfHoSoId"]').val();
    var request = JSON.stringify({ hosoId: hdfHoSoId });
    window.AjaxDungChung
        ("post",
            "/DesktopModules/MVC/NghiepVu/HoSo/GetChungChiHanhNgheY_BoSung_GetByHoSoID",
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
                if (data.Content == "") {
                    //chờ ng ta chọn
                }
                else {
                    var result = $.parseJSON(data.Content);
                    console.log(result);
                    var chiTiet = result.chungChiHanhNgheY_dieuchinhct;
                    var fieldChange = $.parseJSON(chiTiet.FieldChange);
                    var noidungsau = result.noidungsau;
                    var noidungtruoc = result.noidungtruoc;
                    noidungsau.chungChiHanhNgheY.NoiCapChungChiID = noidungtruoc.chungChiHanhNgheY.NoiCapChungChiID;
                    var chungChiHanhNgheYDieuchinh = result.chungChiHanhNgheY_dieuchinh;
                    XuLyLoadDataChungChiBoSungTruoc(noidungtruoc);
                    XuLyLoadDataChungChiBoSungSau(noidungsau, fieldChange);
                    LoadThongTinBoSung(chungChiHanhNgheYDieuchinh);

                }
            }
        });
};

function XuLyLoadDataChungChiBoSungSau(data, fieldChange) {
    console.log(data, fieldChange);
    var lstCheck = $(".div_yeu_cau_bo_sung").find(".chk-this");
    if (fieldChange) {
        if (window.CheckLengthOfElement(lstCheck) == "1")
            lstCheck.each
            ((i, obj) => {
                var element = $(obj);
                var thisName = element.attr("name");
                if (fieldChange.hasOwnProperty(thisName)) {
                    element.prop("checked", true);
                    var parent = element.closest(".chk-parent");
                    var elementCheckDis = parent.find(".syt_u_disable");
                    var checkDis = window.CheckLengthOfElement(elementCheckDis);
                    var elementdynamic = parent.find(".chk-dynamic");
                    var btnThem = parent.find(".btn_them_edit_table");
                    $(elementdynamic).prop("disabled", false);
                    XuLyLoadDatabyCheck(element, data);
                    if (checkDis === "1") {
                        elementCheckDis.removeClass("syt_u_disable").addClass("syt_u");
                    }
                    if ($(elementdynamic).hasClass("bootstrap-multiselect")) {
                        $(elementdynamic).multiselect('enable');
                        $(elementdynamic).multiselect("refresh");
                    }
                    if ($(element).attr("data-action") == "LoadTrinhDo" || $(element).attr("data-action") == "LoadCongTac") {
                        btnThem.addClass("color-blue").removeClass("color-black").addClass("cursor-pointer");
                    }
                }
            });

    }
}


function LoadThongTinBoSung(data) {
    console.log(data);
    $('input[name="hdfBoSungId"]').val(data.DieuChinhID);
    window.LoadDataInputText("SoLanDieuChinh", data.LanDieuChinh);
    window.LoadDataSelect2("LyDoDieuChinh", data.LyDoDieuChinhID);
    window.setValueDateTimePicker("NgayDieuChinh", data.NgayCap);
}

$(document).on
("dp.change",
    ".date-picker-ngay-dieu-chinh",
    (e) => {
        var curentTarget = $(e.currentTarget);
        var date = e.date;
        var ngayCapLai = date._d;
        var ngayCapChungChi = $("input[name='NgayCapChungChi']").val();
        var datengayCapChungChi = window.parseDate(ngayCapChungChi, "full");
        var check = datengayCapChungChi > ngayCapLai;
        if (check) {
            window.appendValidate
            (curentTarget,
                "border-color-a9",
                ".color-red",
                "<label class='color-red'> Ngày điều chỉnh không được nhỏ hơn ngày cấp </label>");
        } else {
            window.removeValidate(curentTarget, "border-color-a9", ".color-red");
        }
    });


function LoadNoiDungTruoc(data) {
    $(".chk-parent .chk-this").prop("checked", false);
    $(".chk-parent .chk-dynamic").prop("disabled", true);

    window.ResetAllForm(".div_yeu_cau_bo_sung");
    window.ResetAllForm(".div_yeu_cau_bo_sung_tren");

    var chungChi = data.chungChiHanhNgheY;
    LoadNoiDungTruocChungChi(chungChi);
    var lstChungChiHanhNgheYQtth = data.lstChungChiHanhNgheY_QTTH,
        lstChungChiHanhNgheYTdcm = data.lstChungChiHanhNgheY_TDCM;
    LoadTrinhDoTruoc(lstChungChiHanhNgheYTdcm);
    LoadQuaTrinhTruoc(lstChungChiHanhNgheYQtth);
};

function LoadNoiDungTruocChungChi(chungChi) {
    console.log(chungChi);
    //

    window.LoadDataInputText("SoChungChi", chungChi.SoChungChi);
    window.LoadDataInputText("DotHoiDong", chungChi.DotHoiDong);
    window.setValueDateTimePicker("NgayHoiDong", chungChi.NgayHoiDong);
    window.setValueDateTimePicker("NgayTrinhCap", chungChi.NgayTrinhCap);
    window.setValueDateTimePicker("NgayCapChungChi", chungChi.NgayCap);
    window.LoadDataSelect2("NoiCapChungChi", chungChi.NoiCapChungChiID);
    window.setValueDateTimePicker("NgayQuyetDinh", chungChi.NgayQuyetDinh);
    window.LoadDataInputText("SoQuyetDinh", chungChi.SoQuyetDinh);
    //
    window.LoadDataSpanText("HoTen", chungChi.HoTen);
    window.LoadDataSpanText("NgaySinh", chungChi.NgaySinh);
    window.LoadDataCheckBox("gioiTinh_disabled", chungChi.GioiTinh);
    window.LoadDataSpanText("LoaiGiayTo", window.getTenfromArrayById(_data_loai_giay_to, chungChi.LoaiGiayTo));
    window.LoadDataSpanText("SoGiayTo", chungChi.SoGiayTo);
    window.LoadDataSpanDatePicker("NgayCapGiayTo", chungChi.NgayCapGiayTo);
    window.LoadDataSpanText("NoiCapGiayTo", chungChi.NoiCapGiayTo);
    window.LoadDataSpanText("DienThoai", chungChi.Phone);
    window.LoadDataSpanText("Email", chungChi.Email);
    var tinhThanh = _data.lsttinhthanh;
    var quanHuyen = _data.lstquanhuyen;
    var phuongXa = _data.lstphuongxa;
    var choOXaName = GetNameByIdSelect(chungChi.ChoO_XaID, phuongXa);
    var choOquanHuyenName = GetNameByIdSelect(chungChi.ChoO_HuyenID, quanHuyen);
    var choOTinhName = GetNameByIdSelect(chungChi.ChoO_TinhID, tinhThanh);
    var choO = stringBuilderDiaChi("", chungChi.ChoO_SoNha);
    choO = stringBuilderDiaChi(choO, choOXaName);
    choO = stringBuilderDiaChi(choO, choOquanHuyenName);
    choO = stringBuilderDiaChi(choO, choOTinhName);
    choO = window.RemoveLastNumberIndexString(choO, 2);//xóa 2 ký tự cuối
    window.LoadDataSpanText("ChoOHienNay", choO);
    var thuongTruXaName = GetNameByIdSelect(chungChi.ThuongTru_XaID, phuongXa);
    var thuongTruquanHuyenName = GetNameByIdSelect(chungChi.ThuongTru_HuyenID, quanHuyen);
    var thuongTruTinhName = GetNameByIdSelect(chungChi.ThuongTru_TinhID, tinhThanh);
    var thuongTru = stringBuilderDiaChi("", chungChi.ThuongTru_SoNha);
    thuongTru = stringBuilderDiaChi(thuongTru, thuongTruXaName);
    thuongTru = stringBuilderDiaChi(thuongTru, thuongTruquanHuyenName);
    thuongTru = stringBuilderDiaChi(thuongTru, thuongTruTinhName);
    thuongTru = window.RemoveLastNumberIndexString(thuongTru, 2);//xóa 2 ký tự cuối
    window.LoadDataSpanText("DiaChiThuongTru", thuongTru);
    window.XuLyLoadAnh(chungChi.HinhAnh, $(".img_old"));
    LoadSelectPickerTruoc($("#div_van_bang_truoc"), chungChi.PhamViHoatDongID, chungChi.PhamViHoatDongs);
    LoadSelectPickerTruoc($("#div_dieu_kien_truoc"), chungChi.DuDieuKienHanhNghe, chungChi.DuDieuKienHanhNghes);
    LoadDanhSachFileDinhKemCu(chungChi.AttachOriginalName, chungChi.AttachUploadName);

};

function LoadTrinhDoTruoc(data) {
    var table = $("#tbl_trinh_do_xem_truoc");
    if (data.length > 0) {
        var html = "";
        $.each
        (data,
            function (i, item) {
                var id = item.TrinhDoID == 0 ? i : item.TrinhDoID;
                var obj = {
                    TrinhDo: item.TrinhDoChuyenMonID,
                    truong_dao_tao: item.TenTruongDaoTao,
                    TrinhDo_Name: _dataTrinhDo.find(x => x.ID == item.TrinhDoChuyenMonID).Ten,
                    name_tot_nghiep: item.NamTotNghiep
                }
                html += html_Load_tbl_TrinhDo_bosung(id, obj);
            });

        table.find("tbody").empty().append(html);
    } else {
        table.find("tbody").empty();
    }
};

function html_Load_tbl_TrinhDo_bosung(newDataId, objData) {
    var html = "";
    html += '<tr data-id="' + newDataId + '" class="font-size-13">';
    html += '<td class="input-get line-height-1_1-Em" data-name="TrinhDoChuyenMonID" data-value=' + objData.TrinhDo + '> ' + objData.TrinhDo_Name + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em" data-name="NamTotNghiep" data-value=' + objData.name_tot_nghiep + '>' + objData.name_tot_nghiep + '</td>';
    html += '<td class="input-get line-height-1_1-Em"  data-name="TenTruongDaoTao" data-value=' + objData.truong_dao_tao + '>' + objData.truong_dao_tao + ' </td>';
    html += '</tr>';
    return html;
};

function LoadQuaTrinhTruoc(data) {
    var table = $("#tbl_qua_trinh_cong_tac_truoc");
    if (data.length > 0) {
        var html = "";
        $.each
        (data,
            function (i, item) {
                var id = item.QuaTrinhID == 0 ? i : item.QuaTrinhID;
                var obj = {
                    loai: item.IsDonViNhaNuoc == "true" ? "1" : "0",
                    don_vi_cong_tac: item.TenDonViThucHanh,
                    thoi_gian_cong_tac: item.ThoiGianThucHanh
                }
                html += html_Load_tbl_Cong_Tac_Truoc(id, obj);
            });
        table.find("tbody").empty().append(html);
    } else {
        table.find("tbody").empty();
    }
};

function html_Load_tbl_Cong_Tac_Truoc(newDataId, objData) {
    var loaiName = objData.loai == 1 ? "Nhà nước" : "Tư nhân";
    var loaiBoolean = objData.loai == 1 ? "true" : "false";
    var html = "";
    html += '<tr data-id="' + newDataId + '" class="font-size-13">';
    html += '<td   class="input-get line-height-1_1-Em"  data-name="ThoiGianThucHanh" data-value=' + objData.thoi_gian_cong_tac + '> ' + objData.thoi_gian_cong_tac + ' </td>';
    html += '<td  class="input-get line-height-1_1-Em" data-name="TenDonViThucHanh" data-value=' + objData.don_vi_cong_tac + '>' + objData.don_vi_cong_tac + '</td>';
    html += '<td class="input-get line-height-1_1-Em" data-name="IsDonViNhaNuoc" data-value=' + loaiBoolean + '>' + loaiName + ' </td>';
    html += '</tr>';
    return html;
};

function LoadSelectPickerTruoc(element, lstStringId, lstStringName) {
    var arrayId = window.SplitStringByKey(lstStringId, "-");
    var arrayName = window.SplitStringByKey(lstStringName, ";");
    var htmlGen = html_gen_selectpickerbyNameTruoc
    (arrayId,
        arrayName);
    element.empty().append(htmlGen);
};

function html_gen_selectpickerbyNameTruoc(data, dataName) {
    var html = "";
    $.each
    (data,
        (index, value) => {
            html += '<div class="ds-item">';
            html += ' <div class="sytClearFix dnnClear"></div>';
            html += ' <div class="mt-10 mb-5"></div>';
            html += "<span>";
            html += "_" + dataName[index] + "</span> </br>";
            html += " </div>";
        });
    return html;
};

function LoadDanhSachFileDinhKemCu(nameGoc, nameUpLoad) {
    var arrayGoc = window.SplitStringByKey(nameGoc, "|");
    var arrayUpLoad = window.SplitStringByKey(nameUpLoad, "|");
    //_arrDinhKem
    var pathUpLoad = $("#hdfPathUploadFile").val();
    var html = "";
    $.each(arrayGoc, function (i, item) {
        var nameGocWithoutEx = window.GetFileNameWithoutExtension(arrayUpLoad[i]);
        nameGocWithoutEx = window.SplitStringByKey(nameGocWithoutEx, "_");
        var id = nameGocWithoutEx[0];
        var objFile = { nameGoc: arrayGoc[i], nameUpload: arrayUpLoad[i], id: id };
        _arrObjFile.push(objFile);
        var fullpath = pathUpLoad + arrayUpLoad[i];
        fullpath = window.ResolveUrl(fullpath);
        html += '<div class="parent_dinh_kem">';
        html += "<a target='_blank' class='cursor-pointer' href=" + fullpath + " download=\"" + arrayGoc[i] + "\" >" + arrayGoc[i] + "</a>";
        html += "</div>";
    });
    $(".div_lst_tap_dinh_kem_truoc").empty().append(html);
};

function GetNameByIdSelect(id, obj) {
    if (obj) {
        if (id) {
            var objFind = obj.find(x => x.ID == id);
            var name = objFind ? objFind.Ten : "";
            return name;
        }
    }
    return "";
};

function stringBuilderDiaChi(stringBanDau, stringCanAppend) {
    stringBanDau += stringCanAppend != "" ? stringCanAppend + ", " : "";
    return stringBanDau;
};

$(document).on
("click",
    ".chk-this",
    (e) => {
        var element = $(e.target);
        var parent = element.closest(".chk-parent");
        var elementCheck = parent.find(".syt_u");
        var elementCheckDis = parent.find(".syt_u_disable");
        var check = window.CheckLengthOfElement(elementCheck);
        var checkDis = window.CheckLengthOfElement(elementCheckDis);
        var elementdynamic = parent.find(".chk-dynamic");
        var btnThem = parent.find(".btn_them_edit_table");
        if (element.is(":checked")) {
            $(elementdynamic).prop("disabled", false);
            XuLyLoadDatabyCheck(element, window._noidungtruoc);
            if (checkDis === "1") {
                elementCheckDis.removeClass("syt_u_disable").addClass("syt_u");
            }
            if ($(elementdynamic).hasClass("bootstrap-multiselect")) {
                $(elementdynamic).multiselect('enable');
                $(elementdynamic).multiselect("refresh");
            }
            if ($(element).attr("data-action") == "LoadTrinhDo" || $(element).attr("data-action") == "LoadCongTac") {
                btnThem.addClass("color-blue").removeClass("color-black").addClass("cursor-pointer");
            }

        } else {
            XuLyRemoveDatabyCheck(element);
            if (check === "1") {
                elementCheck.removeClass("syt_u").addClass("syt_u_disable");
            }
            $(elementdynamic).prop("disabled", true);
            if ($(elementdynamic).hasClass("bootstrap-multiselect")) {
                $(elementdynamic).multiselect('disable');
                $(elementdynamic).multiselect("refresh");
            }
            if ($(element).attr("data-action") == "LoadTrinhDo" || $(element).attr("data-action") == "LoadCongTac") {
                btnThem.addClass("color-black").removeClass("color-blue").removeClass("cursor-pointer");
            }
        }
    });

function XuLyLoadDatabyCheck(element, data) {
    var action = element.attr("data-action");
    var elementdynamic = element.closest(".chk-parent").find(".chk-dynamic");
    console.log(data);
    var name;
    if (data) {
        var chungChi = data.chungChiHanhNgheY;
        var lstTrinhDo = data.lstChungChiHanhNgheY_TDCM;
        var lstQuaTrinh = data.lstChungChiHanhNgheY_QTTH;
        switch (action) {
            case "LoadText":
                name = elementdynamic.attr("name");
                if (chungChi) {
                    window.LoadDataInputText(name, chungChi[name]);
                }
                break;
            case "LoadCheckBox":
                name = elementdynamic.attr("name");
                if (chungChi) {
                    window.LoadDataCheckBox(name, chungChi[name]);
                }
                break;
            case "LoadCombo":
                name = elementdynamic.attr("name");
                if (chungChi) {
                    window.LoadDataSelect2("LoaiGiayTo", chungChi[name]);
                }
                break;
            case "LoadDate":
                name = elementdynamic.attr("name");
                if (chungChi) {
                    window.setValueDateTimePicker(name, chungChi[name]);
                }
                break;
            case "LoadTinhThanh":
                var tinh = $(elementdynamic[0]);
                var huyen = $(elementdynamic[1]);
                var xa = $(elementdynamic[2]);
                var sonha = $(elementdynamic[3]);
                var nameTinh = tinh.attr("name");
                var nameHuyen = huyen.attr("name");
                var nameXa = xa.attr("name");
                var nameSoNha = sonha.attr("name");
                if (chungChi) {
                    window.LoadDataSelect2(nameTinh, chungChi[nameTinh]);
                    window.LoadComboHuyenByTinhId($("select[name='" + nameTinh + "']"), chungChi[nameTinh], chungChi[nameHuyen]);
                    window.LoadComboXaByHuyenId($("select[name='" + nameHuyen + "']"), chungChi[nameHuyen], chungChi[nameXa]);
                    window.LoadDataInputText(nameSoNha, chungChi[nameSoNha]);
                }
                break;
            case "LoadHinhAnh":
                if (chungChi) {
                    window.LoadHinhAnh(chungChi["HinhAnh"]);
                }
                break;
            case "LoadTrinhDo":
                if (lstTrinhDo) {
                    window.LoadTrinhDo(lstTrinhDo);
                }
                break;
            case "LoadCongTac":
                if (lstQuaTrinh) {
                    window.LoadQuaTrinh(lstQuaTrinh);
                }
                break;
            case "LoadSelectPicker":
                if (chungChi) {
                    name = elementdynamic.attr("name");
                    if (name == "hoat_dong_chuyen_mon")
                        window.LoadDataSelectPicker($("select[name='hoat_dong_chuyen_mon']"), chungChi.PhamViHoatDongID, chungChi.PhamViHoatDongs);
                    if (name == "du_dieu_kien_hanh_nghe")
                        window.LoadDataSelectPicker($("select[name='du_dieu_kien_hanh_nghe']"), chungChi.DuDieuKienHanhNghe, chungChi.DuDieuKienHanhNghes);
                }
                break;
            case "LoadFile":
                if (chungChi) {
                    window.LoadDanhSachFileDinhKem(chungChi.AttachOriginalName, chungChi.AttachUploadName);
                }
                break;

            default:
                break;
        }
    }
};

function XuLyRemoveDatabyCheck(element) {
    var action = element.attr("data-action");
    var elementdynamic = element.closest(".chk-parent").find(".chk-dynamic");
    switch (action) {
        case "LoadText":
            elementdynamic.val("");
            break;
        case "LoadCheckBox":
            break;
        case "LoadCombo":
            break;
        case "LoadDate":
            elementdynamic.val("");
            break;
        case "LoadTinhThanh":
            var tinh = $(elementdynamic[0]);
            var huyen = $(elementdynamic[1]);
            var xa = $(elementdynamic[2]);
            var sonha = $(elementdynamic[3]);
            tinh.val(null).trigger('change');
            huyen.val(null).trigger('change');
            xa.val(null).trigger('change');
            sonha.val("");
            break;
        case "LoadHinhAnh":
            var elementImg = $("#img-hinh-dai-dien");
            var parent = elementImg.closest(".div-upload-parent");
            parent.find(".upload-xoa-hinh-anh").addClass("hidden").removeClass("show");
            parent.find(".upload-this").addClass("show").removeClass("hidden");
            elementImg.attr("src", "");
            elementImg.attr("data-hinh", "");
            break;
        case "LoadTrinhDo":
            $("#tbl_trinh_do").find("tbody").find("tr").remove();
            break;
        case "LoadCongTac":
            $("#tbl_qua_trinh_cong_tac").find("tbody").empty();
            break;
        case "LoadSelectPicker":
            var divDanhSach = elementdynamic.closest(".div_selpicker_parent").find(".ds_selectpicker");
            divDanhSach.empty();
            $('option', elementdynamic).each(function (e) {
                $(this).removeAttr('selected').prop('selected', false);
            });
            elementdynamic.multiselect("refresh");
            break;
        case "LoadFile":
            $(".div_lst_tap_dinh_kem").empty();
            break;

        default:
            break;
    }

};


function ColectionDuLieu(arr) {
    if (!arr || arr.length < 1) return null;
    var arrObjColect = {};
    $(arr).each((i, obj) => {
        var thisE = obj.thisElement;
        var action = thisE.attr("data-action");
        var funcColect = "funcColect" + action;
        arrObjColect = window[funcColect](thisE, arrObjColect);
    });
    arrObjColect["DataHinh"] = $('#img-hinh-dai-dien').attr("data-hinh");
    return arrObjColect;
};

function funcColectLoadText(element, obj) {
    var parent = element.closest(".chk-parent");
    var input = parent.find(".chk-dynamic");
    var parentCheckBox = input.closest("div");
    obj = window.getValueInputText_Select2_OnDiv(obj, parentCheckBox);
    return obj;
};

function funcColectLoadCheckBox(element, obj) {
    var parent = element.closest(".chk-parent");
    var input = parent.find(".chk-dynamic");
    var parentCheckBox = input.closest("div");

    obj = window.getValueCheckboxOnDiv(obj, parentCheckBox);
    return obj;
};

function funcColectLoadCombo(element, obj) {
    var parent = element.closest(".chk-parent");
    var input = parent.find(".chk-dynamic");
    var parentCheckBox = input.closest("div");
    obj = window.getValueInputText_Select2_OnDiv(obj, parentCheckBox);
    return obj;

};

function funcColectLoadDate(element, obj) {
    var parent = element.closest(".chk-parent");
    var input = parent.find(".chk-dynamic");
    var parentCheckBox = input.closest("div");
    obj = window.getValueInputText_Select2_OnDiv(obj, parentCheckBox);
    return obj;
};

function funcColectLoadTinhThanh(element, obj) {
    var parent = element.closest(".chk-parent");
    var input = parent.find(".chk-dynamic");
    var parentCheckBox = input.closest("div");
    obj = window.getValueInputText_Select2_OnDiv(obj, parentCheckBox);
    return obj;
};

function funcColectLoadHinhAnh(element, obj) {
    var file = document.getElementById("file_Hinh_anh").files[0];
    obj["image"] = file;
    return obj;
};

function funcColectLoadTrinhDo(element, obj) {
    obj["ArrTrinhDo"] = XyLyGetTblTrinhDo();
    return obj;
};

function funcColectLoadCongTac(element, obj) {
    obj["ArrCongTac"] = XyLyGetTblCongTac();
    return obj;
};

function funcColectLoadSelectPicker(element, obj) {
    var parent = element.closest(".chk-parent");
    var input = parent.find(".chk-dynamic");
    var parentCheckBox = input.closest("div");
    obj = window.getValueMultipleSelectOnDiv(obj, parentCheckBox);
    return obj;
};

function funcColectLoadFile(element, obj) {
    var nameGoc = JoinNameByArray_Attr_Keys(_arrObjFile, "nameGoc", "|");
    var nameUpload = JoinNameByArray_Attr_Keys(_arrObjFile, "nameUpload", "|");
    obj["NameGoc"] = nameGoc;
    obj["NameUpload"] = nameUpload;
    return obj;
};






















