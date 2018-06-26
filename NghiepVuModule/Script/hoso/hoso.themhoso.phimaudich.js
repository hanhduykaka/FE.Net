function html_gen_edit_danh_sach_thuoc_phi_mau_dich(data) {
    var html = "";
    html += '   <tr class="font-size-13"  name="tr-edit">';
    html += '<td> </td>';
    html += '   <td>';
    html += '<input class="width-100 syt-radius-3 min-h-30 paddingMin txt_trinh_do"' +
        ' type="text" ' + (data ? "value=\"" + data.tenThuoc + "\"" : '') + '/>';
    html += '    </td>';
    html += '    <td>';
    html += '<input class="width-100 syt-radius-3 min-h-30 paddingMin txt_ho_ten"' +
        ' type="text" ' + (data ? "value=\"" + data.thanhPhan + "\"" : '') + '/>';
    html += '    </td>';
    html += '   <td>';
    html += '    <input class="width-100 syt-radius-3 min-h-30 paddingMin txt_cong_viec"' +
        ' type="text" ' + (data ? "value=\"" + data.dongGoi + "\"" : '') + ' />';
    html += '   </td>';
    html += '   <td>';
    html += '    <input class="width-100 syt-radius-3 min-h-30 paddingMin txt_chuc_danh"' +
        ' type="text" ' + (data ? "value=\"" + data.soLuong + "\"" : '') + ' />';
    html += '   </td>';
    html += '  <td>';
    html += '   <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += '   <span class="glyphicon glyphicon-ok syt-icon-save" ' +
        'title="Lưu" onclick="fn_save_edit(this)"></span>';
    html += '   </div>';
    html += '  </td>';
    html += '   <td >';
    html += '    <div class="show-inline cursor-pointer min-h-30 mt-mobile-5">';
    html += '    <span type="button" title="Hủy"  onclick="fn_cancel_edit(this)"' +
        ' class="glyphicon glyphicon-remove syt-icon-cancel"/>';
    html += '  </div>';
    html += '   </td>';
    html += '   </tr> ';
    return html;
}