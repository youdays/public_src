var highchartCDN = 'http://code.highcharts.com/highcharts.js';
var nicoGraph = {
    'drawAreaId' : 'drawArea',/*描画エリアのID*/
    'graphId'    : 'drawGraph',/*highchart描画のID*/
    'comLoadBtn' : '',/*動画情報取得ボタン*/
    'drawBtn'    : '',/*グラフ描画ボタン*/
    'closeBtn'    : '',/*閉じるボタン*/
}
var comPort = $('.slick-viewport');/*コメントエリア*/
var videoLength = null;

var comArray = [];/*コメント情報を格納する*/
var idArray = [];/*idのリスト*/
var m;/*コメントタグ*/
var myTim = null;
var beforeTop = null;

/* 関数群 */
/*ライブラリを取得し，完了後に描画エリアを作成する*/
init();
function init(){
    if(!$('body').highcharts){
        var script = document.createElement('script');
        script.src = highchartCDN;
        script.onload = function() {
            createDrawArea();
        }
        document.body.appendChild(script);
    }else{
        createDrawArea();
    }
}
/*描画エリア作成*/
function createDrawArea(){
    if($('#'+nicoGraph.drawAreaId).length < 1){
        var drawAreaDiv = $('<div>',{'id': nicoGraph.drawAreaId})
                            .css({
                                'bottom'           : '0px',
                                'position'         : 'fixed',
                                'z-index'          : '1',
                                'width'            : '100%',
                                'height'           : '200px',
                                'background-color' : '#fff'
                            });
        /*閉じるボタン*/
        nicoGraph.closeBtn = $('<button>')
                                .text('閉じる')
                                .click(function(){
                                    $('#'+nicoGraph.drawAreaId).hide();
                                });
        drawAreaDiv.append(nicoGraph.closeBtn);
        /*コメント取得ボタン*/
        nicoGraph.closeBtn = $('<button>')
                                .text('動画情報取得')
                                .click(function(){
                                    /*動画時間取得*/
                                    if($("li.playlistItem.playing a div.thumbContainer p.videoLength").length < 1){
                                        alert('動画時間取得失敗');
                                        return false;
                                    }
                                    videoLength = $("li.playlistItem.playing a div.thumbContainer p.videoLength").text();

                                    /*コメント欄取得*/
                                    if($('.ui-widget-content.slick-row').length < 1){
                                        alert('コメント欄取得失敗');
                                        return false;
                                    }
                                    getMessages();

                                    /*コメントロード中は選択不可*/
                                    $(this).prop('disabled',true);
                                });
        drawAreaDiv.append(nicoGraph.closeBtn);
        /*描画ボタン*/
        nicoGraph.drawBtn = $('<button>')
                                .text('描画')
                                .click(function(){
                                    drawData(5);
                                });
        drawAreaDiv.append(nicoGraph.drawBtn);

        drawAreaDiv.append(
            $('<div>',{'id': nicoGraph.graphId})
        );
        $('body').append(drawAreaDiv);
    }else{
        $('#'+drawAreaId).show();
    }
}

/*「＜分＞:＜秒＞」をインデックスへ変更*/
function time2idx(time,division){
    var timeArray = time.split(':');
    var time = parseInt((timeArray[0] * 60 )) + parseInt(timeArray[1]);
    return time == 0 ? 0 : Math.floor(time / division);
}

/*インデックスから「＜分＞:＜秒＞」へ変更*/
function idx2time(idx,division){
    var time = idx * division;
    var sec  = ('0' + (time % 60)).substr(-2);
    return Math.floor(time / 60) + ':' + sec;
}
/*コメントエリア内の情報を取得*/
/*表示されているコメント欄をスクロールしながら取得*/
/*読み込み完了時に「NICO_COM_COMPLETE」イベント発火*/
function getMessages() {
    console.log('call : getMessage');
    /*コメントエリア取得タイマー*/
    if(myTim === null){
        comPort.scrollTop(0);
        myTim = setInterval('getMessages()',200);
    }
    if (comPort.scrollTop() === beforeTop) {
        clearInterval(myTim);
        myTim = null;
        beforeTop = null;
        console.log('コメント欄取得完了');
        $(document).trigger('NICO_COMMENT_COMPLETE');
    }
    m = $('.ui-widget-content.slick-row');
    m.each(function(){
        var message = $(this).children('div.slick-cell.r0').text();
        var time    = $(this).children('div.slick-cell.r1').text();
        var id      = $(this).children('div.slick-cell.r3').text();
        if(message === '' || time === '' || id === ''){
            return ;
        }
        if($.inArray($(this).children('div.slick-cell.r3').text(),idArray) !== -1){
            return ;
        }
        comArray.push({
            'message' : $(this).children('div.slick-cell.r0').text(),
            'time'    : $(this).children('div.slick-cell.r1').text(),
            'id'    : $(this).children('div.slick-cell.r3').text()
        });
        idArray.push($(this).children('div.slick-cell.r3').text());
    });
    beforeTop = comPort.scrollTop();
    comPort.scrollTop(beforeTop+300);
}
function drawData(division){
    var maxIdx = time2idx(videoLength,division);
    var categories = [];
    var seriesData = [];
    /*カテゴリーと0フィルデータ作成*/
    for (var i=0 ; i <= maxIdx; i++) {
        categories.push(idx2time(i,division));
        seriesData[i] = 0;
    }
    console.log(seriesData.length)
    /*出現回数計算*/
    for(var i=0; i < comArray.length ; i++){
        seriesData[time2idx(comArray[i].time,division)]++;
    }
    $('#'+nicoGraph.graphId).highcharts({
        chart: {
            height : 200,
            type   : 'line'
        },
        title : {
            text : 'コメント推移'
        },
        xAxis: {
            categories: categories
        },
        series: [
            {
                name : 'コメント量',
                data : seriesData
            }
        ]
    });
}
