var toastCenter,allEquip = [],
    allEvent = ['设备事件', '设置事件', '系统事件'];

function eventSearch() {
    switchToolbar("functionalModule_pageTool");
    var startTime = myApp.calendar.create({
            inputEl: '#startTime',
            value: [new Date()],
            openIn: 'customModal',
            toolbarCloseText: "确定",
            footer: false,
            dateFormat: 'yyyy年mm月dd日',
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
            rangePicker: false,
            on: {
                init: function(e) {
                    setDateAttr(e, "startTime");
                },
                closed: function(e) {
                    setDateAttr(e, "startTime");
                },
            }
        }),
        endTime = myApp.calendar.create({
            inputEl: '#endTime',
            value: [new Date()],
            openIn: 'customModal',
            toolbarCloseText: "确定",
            footer: false,
            dateFormat: 'yyyy年mm月dd日',
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
            rangePicker: false,
            on: {
                init: function(e) {
                    setDateAttr(e, "endTime");
                },
                closed: function(e) {
                    setDateAttr(e, "endTime");
                },
            }
        });
        toastCenter = myApp.toast.create({
          text: '暂无数据',
          position: 'center',
          closeTimeout: 2000,
        });
    //初始化
    $("#searchAllEquip").val("全部设备");
    $("#searchAllEvent").val("设备事件");
    onEquipLists();
}
//加载所有设备
function onEquipLists() {
    var _url = service + "/EquipItemList";
    function _successf(data) {
        var resultJs = $(data).children("string").text();
        if (resultJs != "false") {
            equip_list = new Array();
            allEquip = JSON.parse(resultJs);
            var str = "";
            for (var arry in allEquip) {
                if (allEquip[arry].value && arry == allEquip.length - 1) str += allEquip[arry].value;
                else if (allEquip[arry].value) str += (allEquip[arry].value + ",");
            }
            allEquip.unshift({
                name: "全部设备",
                value: str
            });
            $("#searchAllEquip").attr("data-no", str);
            allEquip = allEquip.filter((item, index) => {
                if (item.value) return item;
            });
            searchEquipItems();
        }
    }

    function _error(e) {}
    JQajaxoNoCancel("post", _url, false, "", _successf, _error);
}
//请求
function searchEquipItems() {
    $(".eventSearchContent>div").html("");
    loadFun();
    var startimeval = $("#startTime").attr("date-val"),
        endtimeval = $("#endTime").attr("date-val"),
        realSearchTime = startimeval + "," + endtimeval,
        realSearchEquip = $("#searchAllEquip").attr("data-no"),
        searchTabType = $("#searchAllEvent").val(),eventList = [],inNum,postData;
    //把时间线填充进eventList中
    eventList = eventListHandle(startimeval.split(" ")[0],endtimeval.split(" ")[0]);
    if (searchTabType == "设备事件") {
        postData = AlarmCenterContext.QueryEquipEvt(realSearchTime,realSearchEquip);
        inNum = 0;
    } else if (searchTabType == "设置事件") {
        postData = AlarmCenterContext.QuerySetupsEvt(realSearchTime,realSearchEquip);
        inNum = 1;
    } else {
        postData = AlarmCenterContext.QuerySystemEvt(realSearchTime,realSearchEquip);
        inNum = 2;
    }
    $.when(postData).done(function(n){
        var resultJs = $(n).children("string").text();
        if(resultJs == "false")
        {
            toastCenter.open();
            return;
        }
        var result =  JSON.parse(resultJs);
        result.forEach((item,index)=>{
            var timeInit = new Date(item.time.split(" ")[0]).getTime();
            eventList.forEach((itemChild,indexChild)=>{
              var timeInitChild = new Date(itemChild.time).getTime();
              if(timeInit == timeInitChild)
                eventList[indexChild].children.push({"time":item.time,"name":item.equip_nm,"event":item.event});
            });
        });
        $(".eventSearchContent>div").html(renderingUI(eventList,inNum));
        myApp.popup.close();   

    }).fail(function(e){
        
    });



}
//详情
function showEventDetail(type, time, name,user, event) {
    myApp.views.main.router.navigate("/equipSearchDetail/?" + type + "&" + time + "&" + name + "&" + user + "&" + event + "");
}
//返回时间
function getNowTime() {
    var date = new Date();
    var seperator1 = "/";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//封装ajax
function JQajaxoNoCancel(_type, _url, _asycn, _data, _success, _error) {
    var ajaxs = $.ajax({
        type: _type,
        url: _url,
        async: _asycn,
        data: _data,
        success: _success,
        complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
            if (status == 'timeout') { //超时,status还有success,error等值的情况
                ajaxs.abort();
                myApp.dialog.create({
                    title: "系统提示",
                    text: '请求超时，请查看网络是否已连接！',
                    buttons: [{
                        text: '确定'
                    }]
                }).open();
            }
            XMLHttpRequest = null;
        },
        error: _error
    });
}
//设置日期属性 
function setDateAttr(dt, id) {
    var d = new Date(dt.value);
    var datetime = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + (id == "startTime" ? '00:00:00' : '23:59:59');
    $("#" + id).attr("date-val", datetime);
}
//设备选择
function eventSearchallEquip(index, dt) {
    myApp.sheet.create({
        content: `
       <div class="sheet-modal my-sheet-swipe-to-step fm-modal equipSelectSheet eventSearchSheet" style=" --f7-sheet-bg-color: #fff;">
          <div class="sheet-modal-inner">
            <div class="sheet-modal-swipe-step">
              <div class="display-flex padding justify-content-space-between align-items-center header_center_gray">
                 <div></div>
              </div>
            </div> 
            <div class="block-title block-title-medium margin-top title_2" style="">请选择对应项</div>
            <hr class="transform-05"/>        
            <div class="no-hairlines row">
                ${eventReturnModifyHtml(index)} 
            </div>
          </div>
        </div>`,
        // Events
        on: {
            open: function(sheet) {},
            opened: function(sheet) {
                $(".eventSearchSheet div.no-hairlines a").unbind().bind("click", function() {
                    $(this).addClass("selectedBgColor").siblings().removeClass("selectedBgColor");
                    $(dt).val($(this).text()).attr("data-no", $(this).attr("data-no"));
                });
            },
        },
        swipeToClose: false,
        swipeToStep: false,
        backdrop: true,
    }).open();
}

function eventReturnModifyHtml(no) {
    var l_html = "",
        arry = [];
    no == "1" ? arry = allEquip : arry = allEvent;
    arry.forEach(function(item, index) {
        l_html += `<a href="#" class="col-33" data-no="${no == 1?item.value:0}">${no == 1?item.name:item}</a>`;
    });
    return l_html;
}



//渲染界面UI
function renderingUI(arry,inNum){
    var html = "";
    arry.forEach((item,index)=>{
       html += `<h2 class="title_2" ${!childrenList(item.children)?'style="display: none;"':''}>${transformDate(item.time)}</h2><ul class="bottomLine" ${!childrenList(item.children)?'style="display: none;"':''}>${childrenList(item.children,inNum)}</ul>`;
    });
    return html;
}
//日期转换
function transformDate(stime){
    return stime.replace("/","年").replace("/","月").replace("/","日");
}
//子项日期列表
function childrenList(arry,inNum){
   var html = "";
    arry.forEach((item,index)=>{
       html += `<li>
        <a href="#" class="item-link item-content" onClick='showEventDetail(${inNum},"${item.time}","${item.name?item.name: "系统事件"}","${item.operator?item.operator: ""}","${item.event.replace(/\"/g,"")}")'> 
            <div class="item-inner"> 
                <div class="item-title-row"> 
                    <div class="item-subtitle">${item.name?item.name:"系统事件"}</div> 
                    <div class="item-after">  <span class="span-color-notsure sure-flag">${item.time.split(" ")[1]}</span>  </div> 
                </div> 
                <div class="item-text item-title fontweight-normal">${item.event}</div> 
            </div> 
        </a> 
       </li>`;
    });   
  return html;
}