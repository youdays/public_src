/*コメント関連のオブジェクト*/
var NicoComent = (function(w,$){
    var _sleepTime   = 100;/*コメント取得時のスリープ秒*/
    var _scrollWidth = 300;/*コメント取得時のスクロール量*/

    var _initOption = {
        'division' : 5
    };

    var constructor = function(option){
        this.originMessage = [];
        this.message = [];
        this.option = $.extend({},_initOption,option);
        this.videoLength = 0;
    }

    /*コメント欄から値を取得する*/
    function _getComObj(comObj) {
        var message = $('div.slick-cell.r0',comObj).text();
        var time    = $('div.slick-cell.r1',comObj).text();
        var id      = $('div.slick-cell.r3',comObj).text();

        if(message === '' || time === '' || id === ''){
            return false;
        }

        return {
            'message' : message,
            'time'    : time,
            'id'      : id
        };
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


    constructor.prototype = {
        load: function(callback) {
            console.log('コメント欄取得開始');
            var scope = this;
            scope.originMessage = [];
            scope.videoLength = $("li.playlistItem.playing a div.thumbContainer p.videoLength").text();

            var comPort = $('.slick-viewport');/*コメントエリア*/
            var beforeTop = null;
            var idArray = [];/*取得済みのidリスト*/
            var myTimer = null;

            comPort.scrollTop(0);
            myTimer = setInterval(function(){
                if(comPort.scrollTop() === beforeTop) { /*コメント取得完了*/
                    clearInterval(myTimer);
                    myTimer = null;
                    console.log('コメント取得完了')
                    callback();
                }
                else { /*コメント取得*/
                    var m = $('.ui-widget-content.slick-row');
                    m.each(function(){
                        var com = _getComObj($(this));
                        if(com) {
                            if($.inArray(com.id,idArray) !== -1){
                                return ;
                            }
                            idArray.push(com.id);
                            scope.originMessage.push(com);
                        }
                    });
                    beforeTop = comPort.scrollTop();
                    comPort.scrollTop(beforeTop+_scrollWidth);
                }

            },_sleepTime);
        },
        getSeriesData : function(division) {
            var scope = this;
            if(!division) {
                division = scope.option.division;
            }
            var maxIdx = time2idx(scope.videoLength,division);
            var categories = [];
            var series = [];

            /*0フィル*/
            for(var i=0; i <= maxIdx; i++) {
                series[i] = 0;
                categories.push(idx2time(i,division));
            }
            console.log(series);
            for(var i=0; i < scope.originMessage.length ; i++) {
                series[time2idx(scope.originMessage[i].time,division)]++;
            }

            return {
                'categories' : categories,
                'series'     : series
            };
        }

    }

    return constructor;

}(window, jQuery));

var nic = new NicoComent();
nic.load(function(str){
        console.log(nic.getSeriesData());
        console.log(nic.getSeriesData(60));
});
