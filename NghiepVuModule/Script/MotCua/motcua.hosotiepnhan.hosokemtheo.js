function html_gen_new_kem_theo(data) {
    var html = "";
    html += ' <tr class="font-size-13" name="tr-edit" data-id="' + data.ID + '">';
    html += '    <td name="stt_' + data.ID + '"></td>';
    html += "    <td>";
    html += '   <input name="ten_chung_tu_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" min="0" value="' + data.TenChungTu + '" type="text" />';
    html += "   </td>";
    html += "    <td>";
    html += '   <input name="so_ban_chinh_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" min="0" value="' + data.SLBanChinh + '" type="number" onfocus="onfocusNumber(event)" />';
    html += "   </td>";
    html += "    <td>";
    html += '   <input name="so_ban_sao_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" min="0" value="' + data.SLBanSao + '" type="number" onfocus="onfocusNumber(event)" />';
    html += "   </td>";
    html += "    <td>";
    html += '   <input name="so_ban_photo_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" min="0" value="' + data.SLPhoto + '" type="number" onfocus="onfocusNumber(event)" />';
    html += "   </td>";
    html += "    <td>";
    html += '   <input name="ghi_chu_' + data.ID + '" class="width-100 syt-radius-3 min-h-30 paddingMin" value="' + data.GhiChu + '" type="text" />';
    html += "   </td>";
    html += "    <td class='text-center'>";
    if (data.AttachFile) {
        var arrAtt = data.AttachFile.split('/');
        var filename = arrAtt[arrAtt.length - 1];
        html += '<span type="button" class="hidden" id="upload_' + data.ID + '" data-id="' + data.ID + '" title="Đính kèm" onclick="fn_trigger_attract(this)"><img class="img " src="/images/btndownload_u23534.png"></span>';
        html += '<input type="file" name ="' + data.ID + '" onchange="previewTapDinhKem(event)" id="file_Dinh_kem_' + data.ID + '"'
                + 'class="hidden upload upload_tap_dinh_kem upload-destination" accept=".doc,.docx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png, .tiff, .gif, .sig, .enc"/>'
        html += '<div class="col-md-12 div_lst_tap_dinh_kem_' + data.ID + '">'
                +'<div class="parent_dinh_kem">';
        html += "<a href='" + data.AttachFile.replace('~', '') + "' download>" + (filename.length > 20 ? filename.substring(0, 20) + "..." : filename) + "</a>";
        html += "<input type='hidden' name='file_dinh_kem_" + data.ID + "' value=" + data.AttachFile + "/>";
        html +=
            '<span data-id=' +
            data.ID +
            ' class="glyphicon glyphicon-remove btn_xoa_dinh_kem cursor-pointer ml-5 color-red" > </span>';
        html += "</div></div>";
    }
    else {
        html += '<span type="button" id="upload_' + data.ID + '" data-id="' + data.ID + '" title="Đính kèm" onclick="fn_trigger_attract(this)"><img class="img " src="/images/btndownload_u23534.png"></span>';
        html += '<input type="file" name ="' + data.ID + '" onchange="previewTapDinhKem(event)" id="file_Dinh_kem_' + data.ID + '"'
                + 'class="hidden upload upload_tap_dinh_kem upload-destination" accept=".doc,.docx, .xls, .xlsx, .pdf, .jpg, .jpeg, .png, .tiff, .gif, .sig, .enc"/>'
                + '<div class="col-md-12 div_lst_tap_dinh_kem_' + data.ID + '"></div>';
        html += "   </td>";
    }
    html += '   <td class="text-center" title="Xóa">';
    html += '    <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += ' <span type="button" title="Hủy" onclick="fn_cancel_edit(this)" ';
    html += ' class="glyphicon glyphicon-remove syt-icon-cancel"></span>';
    html += "   </div>";
    html += "   </td>";
    html += "  </tr>";
    return html;
};
function onfocusNumber(e) {
    $(e.target).select();
};
function fn_cancel_edit(e) {
    var element = $(e);
    var trParent = element.closest("tr");
    trParent.remove();
    reset_stt_kem_theo();
};
function fn_trigger_attract(e) {
    var element = $(e);
    var id = element.attr("data-id");
    $('input[name="' + id + '"]').click();
};
function previewTapDinhKem(evt) {
    var id = evt.target.name;
    var multipleFile = evt.target.files;
    if (multipleFile) {
        if (multipleFile.length > 0) {
            $.each
            (multipleFile,
                function (idx, file) {
                    if (file) {
                        var extension = file.name.split(".").pop().toLowerCase(), //file extension from input file
                            isSuccess = _fileTypesDinhKem.indexOf(extension) > -1,
                            isMaxlengExec = window.Check50MB(file.size);
                        if (isSuccess) {
                            if (isMaxlengExec) {
                                var reader = new FileReader();
                                reader.onload = function () {
                                    var html = "";
                                    html += '<div class="parent_dinh_kem">';
                                    html += "<a>" + (file.name.length > 20 ? (file.name.substring(0, 20) + "...") : file.name) + "</a>";
                                    html +=
                                        '<span data-id=' +
                                        id +
                                        ' class="glyphicon glyphicon-remove btn_xoa_dinh_kem cursor-pointer ml-5 color-red" > </span>';
                                    html += "</div>";
                                    $(".div_lst_tap_dinh_kem_" + id).append(html);
                                    var fileObj = {
                                        'lastMod': file.lastModified,
                                        'lastModDate': file.lastModifiedDate,
                                        'name': file.name,
                                        'size': file.size,
                                        'type': file.type,
                                        'id': id
                                    }
                                };
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

            $('#upload_' + id).addClass("hidden");
        }
    }
};
$(document).on
("click",
    ".a_them_moi_kem_theo_index",
    (e) => {
        var obj = {
            ID: window.newGUIDFunc()
            , TenChungTu: ''
            , SLBanChinh: 0
            , SLBanSao: 0
            , SLPhoto: 0
            , GhiChu: ''
            , HoSoID: $('input[name="hdfHoSoId"]').val()
            , AttachFile: ''
        };
        $(".div_ho_so_kem_theo table tbody").append(html_gen_new_kem_theo(obj));
        reset_stt_kem_theo();
    });

function reset_stt_kem_theo() {
    var rows = $(".div_ho_so_kem_theo table tbody").children('tr');
    $.each(
        rows, (index, element) => {
            var id = $(element).attr("data-id");
            var child = $(element).find('td[name="stt_' + id + '"]');
            child.empty();
            child.append(index + 1);
        });

}
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
                    var element = $(e.target);
                    var id = element.attr("data-id");
                    var parent = element.closest(".parent_dinh_kem");
                    parent.remove();
                    $('input[name="' + id + '"]').attr("value", "");
                    $('#upload_' + id).removeClass("hidden");
                    _arrHoSoDinhKem = _arrHoSoDinhKem.filter(i=>i.ID != id);
                }).on
            ("pnotify.cancel",
                function () {
                    return "false";
                });
    });
function getChungTuKemTheo(hoSoID) {
    if (hoSoID) {
        var dataRequest = JSON.stringify({ hoSoId: hoSoID });
        //Chung tu kem theo
        window.AjaxDungChung
           ("post",
               "/DesktopModules/MVC/NghiepVu/MotCua/GetChungTuKemTheoByHoSoIDJsonResult",
               window.moduleId,
               window.tabId,
               $("input[name='__RequestVerificationToken']").val(),
               dataRequest,
               "application/json; charset=utf-8",
               "json",
               true).then
           ((data) => {
               if (data) {
                   var trParent = $(".div_ho_so_kem_theo table tbody");
                   trParent.html("");
                   $.each(
                       data, (index, element) => {
                           var obj = {
                               ID: window.newGUIDFunc()
                               , TenChungTu: element.TenChungTu ? element.TenChungTu : ''
                               , SLBanChinh: element.SLBanChinh
                               , SLBanSao: element.SLBanSao
                               , SLPhoto: element.SLPhoto
                               , GhiChu: element.GhiChu ? element.GhiChu : ''
                               , HoSoID: element.HoSoID
                               , AttachFile: element.AttachFile
                           };
                           $(".div_ho_so_kem_theo table tbody").append(html_gen_new_kem_theo(obj));
                           _arrHoSoDinhKem.push({ ID: obj.ID, AttachFile: obj.AttachFile });
                       });
                   reset_stt_kem_theo();
               }
           });
    }
    else {
        var trParent = $(".div_ho_so_kem_theo table tbody");
        trParent.html("");
    }
}
