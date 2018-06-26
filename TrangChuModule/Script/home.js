var data_Trang_Thai = [
    {
        ID: 1,
        Ten: "Tiếp nhận hồ sơ"
    },
    {
        ID: 2,
        Ten: "Phân công xử lý"
    },
    {
        ID: 3,
        Ten: "Thẩm định hồ sơ"
    },
    {
        ID: 4,
        Ten: "Yêu cầu bổ sung"
    },
    {
        ID: 5,
        Ten: "Đề xuất"
    },
    {
        ID: 6,
        Ten: "Lãnh đạo phòng xem xét"
    },
    {
        ID: 7,
        Ten: "Lãnh đạo Sở phê duyệt"
    },
    {
        ID: 8,
        Ten: "Chuyển kết quả cho TT HCC"
    },
    {
        ID: 9,
        Ten: "Tạm ngưng thẩm định"
    },
    {
        ID: 10,
        Ten: "Không giải quyết"
    }
    ,
    {
        ID: 11,
        Ten: "Cấp phép"
    }
    ,
    {
        ID: 12,
        Ten: " Không cấp"
    }
];

$(() => {
    $(window).load(() => {
        LoadWorkList();
    });

});

$(".right-addon input").keypress((e) => {
    if (e.which == 13) {
        e.preventDefault();
        var inputSearchVal = $(".right-addon input").val();
        XuLySearch(inputSearchVal);
    }
});

$(document).on('click', ".btn_search",
(e) => {
    var element = $(e.target);
    var parent = element.closest(".right-addon");
    var inputSearch = parent.find("input");
    var inputSearchVal = inputSearch.val();
    XuLySearch(inputSearchVal);
});

$(document).on
('click',
    ".ul-disc li",
    (e) => {
        var element = $(e.target);
        var trangThai = element.attr("data-trangThai");
        var dataRequest = JSON.stringify({ module: 'NV.HoSo.Module' });
        window.AjaxDungChung("post", "/DesktopModules/MVC/Home/TrangChu/GetModule",
                window.moduleId, window.tabId, $("input[name='__RequestVerificationToken']").val()
                , dataRequest, "application/json; charset=utf-8", "json", true)
            .then((data) => {
                if (data) {
                    var url;
                    if (trangThai && trangThai.trim()) {
                        trangThai = trangThai.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                        trangThai = trangThai.trim();
                        url = data.TabID +
                            '/moduleId/' +
                            data.ModuleID +
                            '/trangThai/' +
                            trangThai +
                            '/controller/HoSo/action/Index';

                    } else {
                        url = data.TabID + '/moduleId/' + data.ModuleID
                            + '/controller/HoSo/action/Index';
                    }
                    window.location.href = url;
                }
            });
    });


function LoadWorkList() {
    window.AjaxDungChung("post", "/DesktopModules/MVC/Home/TrangChu/GetWorkList",
            window.moduleId, window.tabId, $("input[name='__RequestVerificationToken']").val()
            , null, "application/json; charset=utf-8", "json", true)
        .then((data) => {
            if (data) {
                if (data.length > 0) {
                    var html = "";
                    $.each
                    (data,
                        function (key, item) {
                            html += '<li class="cursor-pointer" data-trangThai="' + item.TrangThaiHoSoID + '">' +
                                '' + item.TenMenu + ' (' + item.SoLuong + ') </li>';

                        });
                    $(".ul-disc").empty().append(html);
                }
            }
        });
};

function XuLySearch(inputSearchVal) {
    var dataRequest = JSON.stringify({ module: 'NV.TraCuuHoSo.Module' });
    window.AjaxDungChung("post", "/DesktopModules/MVC/Home/TrangChu/GetModule",
            window.moduleId, window.tabId, $("input[name='__RequestVerificationToken']").val()
            , dataRequest, "application/json; charset=utf-8", "json", true)
        .then((data) => {
            if (data) {
                var url;
                if (inputSearchVal && inputSearchVal.trim()) {
                    inputSearchVal = inputSearchVal.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
                    inputSearchVal = inputSearchVal.trim();
                    url = data.TabID +
                        '/moduleId/' +
                        data.ModuleID +
                        '/val/' +
                        inputSearchVal +
                        '/controller/HoSo/action/TraCuuHoSo';

                } else {
                    url = data.TabID + '/moduleId/' + data.ModuleID
                        + '/controller/HoSo/action/TraCuuHoSo';
                }
                window.location.href = url;
            }
        });
};


$("#hoso").click(function () {
    window.location.href = "/Them-Ho-So";
});
$("#nganhy").click(function () {
    window.location.href = "/nganh-y";
});
$("#nganhduoc").click(function () {
    window.location.href = "/Them-Ho-So";
});
$("#mypham").click(function () {
    window.location.href = "/Quang-Cao-My-Pham";
});
$("#hoithao").click(function () {
    window.location.href = "/Giay-Dang-Ky-Hoi-Thao";
});
$("#thongke").click(function () {
    window.location.href = "/thong-ke";
});

