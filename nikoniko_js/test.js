/*疑似スリープ*/
function sleep(time) {
    var d1 = new Date().getTime();
    var d2 = new Date().getTime();
    while(d2 < d1 + time) {
        d2 = new Date().getTime();
    }
    return ;
}

/*コメント関連のオブジェクト*/
var NicoComent = (function(w,$){
    var _originMessage;
    var _message;

    var _getMessage = function() {
        console.log('コメント欄取得開始');

        _originMessage = [];/*コメント配列*/
        var comPort = $('.slick-viewport');/*コメントエリア*/
        var beforeTop = null;
        var idArray = [];/*取得済みのidリスト*/
        var myTimer = null;

        var sleepTime   = 100;/*コメント取得時のスリープ秒*/
        var scrollWidth = 300;/*コメント取得時のスクロール量*/

        comPort.scrollTop(0);

        myTimer = setInterval(function(){
            if(comPort.scrollTop() === beforeTop) { /*コメント取得完了*/
                clearInterval(myTimer);
                myTimer = null;
                console.log('コメント取得完了')
                $(document).trigger('NICO_COM_COMPLETE');
            }
            else { /*コメント取得*/
                var m = $('.ui-widget-content.slick-row');
                m.each(function(){
                    var message = $(this).children('div.slick-cell.r0').text();
                    var time    = $(this).children('div.slick-cell.r1').text();
                    var id      = $(this).children('div.slick-cell.r3').text();
                    if(message === '' || time === '' || id === ''){
                        return ;
                    }
                    if($.inArray(id,idArray) !== -1){
                        return ;
                    }
                    /*コメント配列へ追加*/
                    _originMessage.push({
                        'message' : message,
                        'time'    : time,
                        'id'      : id
                    });
                });
                beforeTop = comPort.scrollTop();
                comPort.scrollTop(beforeTop+scrollWidth);
            }

        },sleepTime);
    }
    return {
        instance: function () {
            _getMessage();
        },
        messages: function() {
            return _originMessage;
        }
    };
}(window, jQuery));

var com = eval(NicoComent);
com.instance();

$(document).on('NICO_COM_COMPLETE',function(){console.log(com.messages()); console.log(com)});
