var comPort = $('.slick-viewport');/*コメントエリア*/
if (comPort.length < 0) {
    alert('コメントエリアの取得失敗');
}

/*コメントエリア内の情報を取得*/
/*すべて取得*/
var comArray = [];/*コメント情報を格納する*/
var idArray = [];
var beforeTop = -1;/*直前に読み込ん高さ*/
var m;/*コメントタグ*/
comPort.scrollTop(0);
while (comPort.scrollTop() !== beforeTop) {
    m = $('.ui-widget-content.slick-row');
    m.each(function(){
            console.log($(this).children('div.slick-cell.r0').text());
        if($.inArray($(this).children('div.slick-cell.r3').text(),idArray)){
            //return ;
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

console.log(comArray);
console.log('length:'+comArray.length);
