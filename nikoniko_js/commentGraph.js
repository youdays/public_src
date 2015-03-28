var highchartCDN = 'http://code.highcharts.com/highcharts.js';
var comPort = $('.slick-viewport');/*コメントエリア*/
if (comPort.length < 0) {
    alert('コメントエリアの取得失敗');
}
var videoLength = $("li.playlistItem.playing a div.thumbContainer p.videoLength").text();
if(videoLength === 0){
    alert('動画時間の取得失敗');
}
/* 関数群 */
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
/*すべて取得*/
var comArray = [];/*コメント情報を格納する*/
var idArray = [];/*idのリスト*/
var beforeTop = -1;/*直前に読み込ん高さ*/
var m;/*コメントタグ*/
var myTim = null;

comPort.scrollTop(0);
/*表示されているコメント欄をスクロールしながら取得*/
/*読み込み完了時に「NICO_COM_COMPLETE」イベント発火*/
function getMessages() {
    /*コメントエリア取得タイマー*/
    if(myTim === null){
        myTim = setInterval('getMessages()',200);
    }
    if (comPort.scrollTop() === beforeTop) {
        clearInterval(myTim);
        myTim = null;
        console.log('コメント欄取得完了')
        $(document).trigger('NICO_COM_COMPLETE');
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
getMessages();

$(document).off('NICO_COM_COMPLETE');
$(document).on('NICO_COM_COMPLETE',function(){
    /*カテゴリー作成*/
    console.log(comArray);
    console.log('length:'+comArray.length);
    $('body').append('<script>',{script : highchartCDN});/*highchartライブラリ取得*/
    drawData(5);
})
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
    console.log(categories);
    console.log(seriesData);
}
