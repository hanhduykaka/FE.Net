var datasetKCB = [
    { name: 'Bệnh viện', y: 150 },
    { name: 'Phòng khám đa khoa', y: 256 },
    { name: 'Phòng khám chuyên khoa', y: 111 },
    { name: 'Phòng chẩn chị YHCT', y: 333 },
    { name: 'Nhà hộ sinh', y: 367 },
    { name: 'Dịch vụ răng giả', y: 89 },
    { name: 'Phòng xét nghiệm', y: 199 }

];
var datasetThuoc = [
    { name: 'Doanh nghiệp kinh doanh thuốc', y: 124 },
    { name: 'Nhà thuốc', y: 256 },
    { name: 'Phòng khám chuyên khoa', y: 330 },
    { name: 'Cơ sở buôn bán dược liệu', y: 656 },
    { name: 'Cơ sở bán lẻ dược liệu, thuốc thành phẩm', y: 587 },
    { name: 'Cơ sở sản xuất dược liệu', y: 430 }

];
var datasetNhanLuc = [
    { name: 'Bác sỹ', y: 124 },
    { name: 'Y Tá', y: 256 },
    { name: 'Y Sỹ', y: 30 },
    { name: 'Điều dưỡng', y: 998 },
    { name: 'Nha tá', y: 587 },
    { name: 'Dược tá', y: 40 }

];
var colorPastel = ['#E7A39A', '#FBC8D9', '#C2D995', '#9CBEE1', '#CBCBCB', '#90879C', '#FAE19F', '#759422'];


////https://github.com/d3/d3/blob/master/CHANGES.md
//https://leanpub.com/d3-t-and-t-v4/read
//http://devdocs.io/d3~4/
//https://iros.github.io/d3-v4-whats-new/#17
//http://rajapradhan.com/blogs/d3-js-v4-essentials/shapes/
///http://jsbin.com/sotopigica/edit?html,css,output


$(document).ready
(() => {

    DrawPieChartHightChart(window.Highcharts, 'chartCSKCB', datasetKCB, "Cơ sở KCB");
    DrawPieChartHightChart(window.Highcharts, 'chartCSThuoc', datasetThuoc, "Cơ sở KD");
    var colorChartNgheY = ['#FAE1A0', '#9CBEE1'];
    var colorChartNgheDuoc = ['#63B0BE', '#B6DBE0'];

    var dataYSaiGon = [77, 100, 266, 399, 405];
    var dataYKhac = [66, 155, 201, 302, 275];

    var dataDuocSaiGon = [66, 155, 201, 302, 888];
    var dataDuocKhac = [99, 666, 309, 188, 999];

    DrawbarstackedHightChart(window.Highcharts, 'chartNgheY', colorChartNgheY, dataYSaiGon, dataYKhac);
    DrawbarstackedHightChart(window.Highcharts, 'chartNgheDuoc', colorChartNgheDuoc, dataDuocSaiGon, dataDuocKhac);
    DrawPieChartHightChart(window.Highcharts, 'chartNhanLuc', datasetNhanLuc, "Nhân lực");
});

function DrawbarstackedHightChart(Highcharts, divElement, colorChart, dataSG, dataKhac) {
    Highcharts.chart(divElement, {
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        colors: colorChart,
        exporting: { enabled: false },
        title: {
            text: ''
        },
        xAxis: {
            categories: ['Năm 2014', 'Năm 2015', 'Năm 2016', 'Năm 2017', 'Năm 2018']
        },
        yAxis: {
            min: 0,
            title: {
                text: ''
            }
        },
        legend: {
            reversed: false,
            symbolRadius: 0
        },
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            name: 'Cấp tại Sở Y tế Đồng Nai',
            data: dataSG
        }, {
            name: 'Cấp tại nơi khác',
            data: dataKhac
        }]
    });
}


function DrawPieChartHightChart(Highcharts, divElement, dataset, seriesName) {
    var autoWidth = screen.width;
    var autoWidthDiv = $("#" + divElement).width();
    var usingWidth = autoWidthDiv / 1.8;
    console.log(colorPastel);
    Highcharts.chart
    (divElement, {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            spacingBottom: autoWidthDiv < 375 ? 180 : 5
        },
        credits: {
            enabled: false
        },
        exporting: { enabled: false },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colors: colorPastel,
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },

        legend: {
            width: autoWidthDiv < 375 ? autoWidthDiv / (1.2) : usingWidth,
            enabled: true,
            layout: autoWidthDiv < 375 ? "horizontal" : 'vertical',
            symbolRadius: 0,
            floating: autoWidthDiv < 375,
            verticalAlign: autoWidthDiv < 375 ? 'bottom' : 'middle',
            align: autoWidthDiv < 375 ? 'center' : 'right',
            useHTML: true,
            margin: 0,
            y: autoWidthDiv < 375 ? 176 : 0,
            itemMarginBottom: 10,
            labelFormatter: function () {
                return '<div style="text-align: left; width: 90px; display:inline-block;font-style:normal;font-family:arial; color: #4394A3">' +
                    JoinAdding_br_tag(splitStringByLengthWithSpace(this.name)) +
                    '</div>' +
                    '<div style="width: 90px;display:inline-block; text-align:right; color:black ;font-style:normal;font-family:arial">' +
                    this.y +
                    '</div>';

            }
        },
        series: [{
            states: {
                hover: {
                    enabled: false
                }
            },
            point: {
                events: {
                    mouseOver: function () {
                        this.options.oldColor = this.color;
                        this.graphic.attr("fill", colorLuminance(this.color, -0.3));
                    },
                    mouseOut: function () {
                        this.graphic.attr("fill", this.options.oldColor);
                    }
                }
            },
            name: seriesName,
            data: dataset
        }]
  
    });
}

function splitStringByLengthWithSpace(stringInput) {
    return stringInput.replace(/.{22}\S*\s+/g, "$&@").split(/\s+@/);
}

function JoinAdding_br_tag(arrayWord) {
    var numWordsPerLine = 1;
    var str = [];
    for (var i in arrayWord) {
        if (arrayWord.hasOwnProperty(i)) {
            if (i > 0 && i % numWordsPerLine === 0)
                str.push('<br>');
            str.push(arrayWord[i]);
        }
    }
    return str.join(' ');
}

function colorLuminance(hex, lum) {
    // Validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, "");
    if (hex.length < 6) {
        hex = hex.replace(/(.)/g, '$1$1');
    }
    lum = lum || 0;
    // Convert to decimal and change luminosity
    var rgb = "#",
        c;
    for (var i = 0; i < 3; ++i) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}



