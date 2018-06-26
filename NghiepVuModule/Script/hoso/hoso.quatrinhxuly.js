function loadNewQuaTrinhXuLy(hoSoID) {
    $('#tbl_danh_sach_qua_trinh tbody').html("");
    window.AjaxDungChung
          ("post",
             "/DesktopModules/MVC/NghiepVu/HoSo/MotCua_QuaTrinhXuLys_GetByHoSoID",
              window.moduleId,
              window.tabId,
              $("input[name='__RequestVerificationToken']").val(),
              JSON.stringify({ hoSoID: hoSoID }),
              "application/json; charset=utf-8",
              "json",
              true)
          .then
          (function (data) {
              if (data) {
                  if ($.fn.dataTable.isDataTable('#tbl_danh_sach_qua_trinh')) {
                      $('#tbl_danh_sach_qua_trinh').dataTable().fnClearTable();
                      if (data.length > 0)
                          $('#tbl_danh_sach_qua_trinh').dataTable().fnAddData(data);
                  }
                  else {

                      $('#tbl_danh_sach_qua_trinh').DataTable
                     ({
                         data: data,
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
                         columns: [
                             { "data": "TenTrangThaiHoSo", "width": "20%", "orderable": false, "className": "word-break cursor-pointer" }
                           , { "data": "NoiDungXuLy", "width": "20%", "orderable": false, "className": "word-break cursor-pointer" }
                           , { "data": "DisplayName", "width": "20%", "orderable": false, "className": "word-break cursor-pointer" }
                           , {
                               "render": function (data, type, full, meta) {
                                   return full.NgayNhan ? window.moment(full.NgayNhan).format("DD/MM/YYYY") : '';
                               },
                               "orderable": false,
                               "width": "5%",
                               "className": "word-break text-center cursor-pointer"
                           }
                            , {
                                "render": function (data, type, full, meta) {
                                    return full.NgayChuyen ? window.moment(full.NgayChuyen).format("DD/MM/YYYY") : '';
                                },
                                "orderable": false,
                                "width": "5%",
                                "className": "word-break text-center cursor-pointer"
                            }
                         ],
                         'lengthChange': false,
                         "ordering": false,
                         'searching': false,
                         'autoWidth': false,
                         paging: true,
                         "order": []
                     });
                  }
              }
          });
    $(document).on('click', ".btn_xuat_danh_sach_qua_trinh", (e) => {
        var notice = window.alert_success("Hệ thống đang xử lý dữ liệu!");
        window.AjaxDungChung
            ("post",
              "/DesktopModules/MVC/NghiepVu/HoSo/MotCua_HoSoTiepNhan_XuatThongTinChiTietHoSo",
                window.moduleId,
                window.tabId,
                $("input[name='__RequestVerificationToken']").val(),
                 JSON.stringify({ hoSoID: hoSoID }),
                "application/json; charset=utf-8",
                "json",
                true)
            .then
            (function (data) {
                if (data) {
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
                    if (notice) notice.remove();
                }
                else
                    window.alert_error("Xuất không thành công!");
            });
    });
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
}