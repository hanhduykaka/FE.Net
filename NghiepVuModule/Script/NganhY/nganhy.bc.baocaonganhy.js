
var data_ky_bao_cao = [
    {
        ID: "1",
        Ten: "Năm"
    },
    {
        ID: "2",
        Ten: "Quý"
    },
    {
        ID: "3",
        Ten: "Tháng"
    },
    {
        ID: "4",
        Ten: "Tuần"
    },
    {
        ID: "5",
        Ten: "Từ ngày-đến ngày"
    }
];
var data_Quy_4_Quy = [
    {
        ID: "1",
        Ten: "1"
    },
    {
        ID: "2",
        Ten: "2"
    },
    {
        ID: "3",
        Ten: "3"
    },
    {
        ID: "4",
        Ten: "4"
    }
];
var data_month_12_Thang = [
    {
        ID: "1",
        Ten: "1"
    },
    {
        ID: "2",
        Ten: "2"
    },
    {
        ID: "3",
        Ten: "3"
    },
    {
        ID: "4",
        Ten: "4"
    }
    ,
    {
        ID: "5",
        Ten: "5"
    },
    {
        ID: "6",
        Ten: "6"
    },
    {
        ID: "7",
        Ten: "7"
    },
    {
        ID: "8",
        Ten: "8"
    },
    {
        ID: "9",
        Ten: "9"
    }
    ,
    {
        ID: "10",
        Ten: "10"
    },
    {
        ID: "11",
        Ten: "11"
    }
    ,
    {
        ID: "12",
        Ten: "12"
    }
];

$(document).ready
(() => {
    window.LoadSelect2($('.sl-tu-den-this'), data_ky_bao_cao, null, false);
    window.LoadSelect2($('.slNam'), getYear(4), null, false);
   
});

$(".sl-tu-den-this").on
("select2:select",
    (e) => {
        var element = $(e.target);
        var parent = element.closest(".sl-tu-den-parent");
        var destination = parent.find(".sl-tu-den-destination");
        var id = e.target.value;
        if (!isNaN(id * 1)) {
            var html = html_Onchange_Ky_Bao_cao(id);
            $(destination).empty().append(html);
            XuLyReInitElement(id);
        }
    });

function XuLyReInitElement(id) {
    switch (id) {
        case "1":
            window.LoadSelect2($('.slNam'), getYear(4), null, false);
            break;
        case "2":
            window.LoadSelect2($('.slQuy'), data_Quy_4_Quy, null, false);
            window.LoadSelect2($('.slNam'), getYear(4), null, false);
            
            break;
        case "3":
            window.LoadSelect2($('.slThang'), data_month_12_Thang, null, false);
            window.LoadSelect2($('.slNam'), getYear(4), null, false);
           
            break;
        case "4":
            window.LoadSelect2($('.slTuan'), genArraySelect2(window.weeksInYear(((new Date()).getFullYear()) * 1)), null, false);
            window.LoadSelect2($('.slNam'), getYear(4), null, false);
          
            break;
        case "5":
            $(".date-picker-from").datetimepicker({
                locale: 'vi',
                format: 'DD/MM/YYYY'
            });
            $(".date-picker-to").datetimepicker({
                locale: 'vi',
                format: 'DD/MM/YYYY',
                useCurrent: false
            });
            $(".date-picker-from").on("dp.change", function (e) {
                $('.date-picker-to').data("DateTimePicker").minDate(e.date);
            });
            $(".date-picker-to").on("dp.change", function (e) {
                $('.date-picker-from').data("DateTimePicker").maxDate(e.date);
            });
            break;
        default:
           
    }
}

function html_Onchange_Ky_Bao_cao(id) {
    var html = "";
    if (id == 1) {
        html += '  <div class="col-md-2">';
        html += '   <select class="sknadSelect width-100 adselect slNam">';
        html += '     </select>';
        html += '   </div>';
    }
    else if (id == 2
    ) {
        html += '  <div class="col-md-2">';
        html += '   <select class="sknadSelect width-100 adselect slQuy">';
        html += '     </select>';
        html += '   </div>';
        html += '  <div class="col-md-1">';
        html += ' <span class="sknadTitle-gray-normal font-size-13"> năm </span>';
        html += '   </div>';
        html += '  <div class="col-md-2">';
        html += '   <select class="sknadSelect width-100 adselect slNam">';
        html += '     </select>';
        html += '   </div>';
    }
    else if (id == 3
    ) {
        html += '  <div class="col-md-2">';
        html += '   <select class="sknadSelect width-100 adselect slThang">';
        html += '     </select>';
        html += '   </div>';
        html += '  <div class="col-md-1">';
        html += ' <span class="sknadTitle-gray-normal font-size-13"> năm </span>';
        html += '   </div>';
        html += '  <div class="col-md-2">';
        html += '   <select class="sknadSelect width-100 adselect slNam">';
        html += '     </select>';
        html += '   </div>';
    }
    else if (id == 4
    ) {
        html += '  <div class="col-md-2">';
        html += '   <select class="sknadSelect width-100 adselect slTuan">';
        html += '     </select>';
        html += '   </div>';
        html += '  <div class="col-md-1">';
        html += ' <span class="sknadTitle-gray-normal font-size-13"> năm </span>';
        html += '   </div>';
        html += '  <div class="col-md-2">';
        html += '   <select class="sknadSelect width-100 adselect slNam">';
        html += '     </select>';
        html += '   </div>';
    }
    else if (id == 5
    ) {
        html += '  <div class="col-md-4">';
        html += '<input class="width-100 syt-radius-3 min-h-30 paddingMin date-picker date-picker-from"  type="text" />';
        html += '   </div>';
        html += '  <div class="col-md-1">';
        html += ' <span class="sknadTitle-gray-normal font-size-13"> - </span>';
        html += '   </div>';
        html += '  <div class="col-md-4">';
        html += '<input class="width-100 syt-radius-3 min-h-30 paddingMin date-picker  date-picker-to" type="text" />';
        html += '   </div>';
    }
    return html;

}

function getYear(numberYearPast) {
    var dataArr = [];
    var thisYear = (new Date()).getFullYear();
    if (numberYearPast > 0) {
        for (var i = 0; i < numberYearPast; i++) {
            var obj = {
                ID: i,
                Ten: thisYear - i
            }
            dataArr.push(obj);
        }
    }
    return dataArr;
}

function genArraySelect2(number) {
    var dataArr = [];
    if (number > 0) {
        for (var i = 0; i < number; i++) {
            var obj = {
                ID: i,
                Ten: number - i
            }
            dataArr.push(obj);
        }
    }
    return dataArr;
}

$(".sl-tu-den-destination").on
("select2:select",
    ".slNam",
    (e) => {
        var element = $(e.target);
        var parent = element.closest(".sl-tu-den-destination");
        var slTuan = parent.find(".slTuan");
        var check = window.CheckLengthOfElement(slTuan);
        if (check === "1") {
            var data = element.select2('data');
            if (data) {
                var thisYear = data[0].text;
                var dataWeek = genArraySelect2(window.weeksInYear(thisYear));
                window.LoadSelect2($('.slTuan'), dataWeek, null, false);
            }
           
        }
    });
