var scheduleTimeAler, scheduleAlert, scheduleAlertSusscess;
var calendarTime,weeklySchedule = [],specificScheduling =[];
function schedule() {
    switchToolbar("functionalModule_pageTool");
    $("#scheduleContainer-picker-container").css("top","170px");
      $("#scheduleContainer-picker-header").html("");
      var monthNames = ['1', '2', '3', '4', '5', '6', '7', '8' , '9' , '10', '11', '12'];
      calendarTime = myApp.calendar.create({
      containerEl: '#scheduleContainer-picker-header',
      value: [new Date()],
      toolbarCloseText: "展开",
      dateFormat: 'yyyy年mm月dd日',
      monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      weekHeader: true,
      footer: true,
      dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
      renderToolbar: function () {
        return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
          '<div class="toolbar-inner">' +
            '<div class="left">' +
              '<a href="#" class="link icon-only"><i class="icon icon-back ' + (app.theme === 'md' ? '' : '') + '"></i></a>' +
            '</div>' +
            '<div class="center"></div>' +
            '<div class="right">' +
              '<a href="#" class="link icon-only"><i class="icon icon-forward ' + (app.theme === 'md' ? '' : '') + '"></i></a>' +
            '</div>' +
          '</div>' +
        '</div>';
      },
      on: {
        init: function (c) {
          $$('.calendar-custom-toolbar .center').text(c.currentYear +'年' + monthNames[c.currentMonth]+'月');
          $$('.calendar-custom-toolbar .left .link').on('click', function () {
            calendarTime.prevMonth();
          });
          $$('.calendar-custom-toolbar .right .link').on('click', function () {
            calendarTime.nextMonth();
          });
          $("#scheduleContainer-picker-header").find(".calendar").addClass("heightSet");
          $("#scheduleContainer-picker-header .calendar-footer a").unbind().bind("click",function(){
                if($(this).parents("div.calendar").hasClass("heightSet")){
                   $(this).html("收缩").parents("div.calendar").removeClass("heightSet");
                   $("#scheduleContainer-picker-container").css("top","384px");
                }
                else
                {
                   $(this).html("展开").parents("div.calendar").addClass("heightSet");
                   $("#scheduleContainer-picker-container").css("top","170px");
                }
          }); 
          $(".scheduleContainer h2 span:eq(0)").text(c.currentYear);
          $(".scheduleContainer h2 span:eq(1)").text(monthNames[c.currentMonth]);
          $(".scheduleContainer h2 span:eq(2)").text(new Date().getDate());
        },
        monthYearChangeStart: function (c) {
          $$('.calendar-custom-toolbar .center').text(c.currentYear +'年' + monthNames[c.currentMonth]+'月');
        },
        dayClick: function(calendar, dayEl, year, month, day){
           $("#scheduleContainer-picker-container ul").html("");
           var monthAdd= parseInt(month)+1,monthStr = monthAdd<10?"0"+monthAdd:monthAdd;
           drawWeeklySchedule(year+"/"+monthStr+"/"+day);
           drawSpecificScheduling(year+"/"+monthStr+"/"+day);
            $(".scheduleContainer h2 span:eq(0)").text(year);
            $(".scheduleContainer h2 span:eq(1)").text(monthStr);
            $(".scheduleContainer h2 span:eq(2)").text(day);
        },
      }
     });
     //周排表和特定排表初始化
     $("#scheduleContainer-picker-container ul").html("");
     scheduleInit("/api/GWServiceWebAPI/get_SpeAlmReportData",2);
     scheduleInit("/api/GWServiceWebAPI/get_WeekAlmReportData",1);
     
}


//初始化
function scheduleInit(url,no){
    var jsonData = {"url": url,"data": { getDataTable: "0"}};
    $.when(AlarmCenterContext.post(jsonData.url,jsonData.data)).done(function(data){
        let arrayLike = data.HttpData.data,code = data.HttpData.code;
        if (code == 200) {
            let AlarmTabulateLenth = arrayLike.length;
            if(no == 1)
             {
                weeklySchedule = arrayLike;
                drawWeeklySchedule(GetDateHandle(new Date(),0));  
             }
            else
             {
                specificScheduling = arrayLike;
                drawSpecificScheduling(GetDateHandle(new Date(),0));
             }
        } else {
          scheduleAlert.open();
        }
    }).fail(function(e){
       scheduleAlert.open();
    });    
}

//判断今天是周几
function judgeWeek(dateStr){
    var day = (new Date(dateStr)).getDay()
    return day;
}

//周排表渲染  
function drawWeeklySchedule(dateStr){
    var html = "",week_day = (judgeWeek(dateStr)==0?7:judgeWeek(dateStr));
    weeklySchedule.forEach((item,index)=>{ 
         if(item.week_day == week_day || item.week_day == 0){
            let sTime = item.begin_time.split("T")[1],eTime = item.end_time.split("T")[1];
            html += `<li>
                 <a href="/scheduleModify/?title=周排表&table=schedule_specificDate&name=${item.Administrator}&week=${item.week_day}&stime=${sTime}&etime=${eTime}&id=${item.id}" class="item-link item-content">
                    <div class="item-media equipListStatus_">
                        <span class="gray">周排</span>
                    </div>
                    <div class="item-inner">
                      <div class="item-title">${item.Administrator}</div>
                      <div class="item-after">${sTime+" - "+ eTime}</div>
                    </div>
                 </a>
            </li> `;
         }
    });
    $("#scheduleContainer-picker-container ul").append(html);
}

//特定排表渲染
function drawSpecificScheduling(dateStr){
    var html = "",timeLine = [];
    specificScheduling.forEach((item,index)=>{ 
        let sTime = item.begin_time.split("T")[0],eTime = item.end_time.split("T")[0];
        timeLine = eventListHandle(sTime,eTime);
        if(timeLine.some((n,l)=>{return n.time == dateStr;}))
            html += `<li>
                       <a href="/scheduleModify/?title=特定排表&table=schedule_weeklytable&name=${item.Administrator}&stime=${item.begin_time.replace("T"," ")}&etime=${item.end_time.replace("T"," ")}&id=${item.id}" class="item-link item-content">
                          <div class="item-media equipListStatus_">
                              <span class="blue">特排</span>
                          </div>
                          <div class="item-inner">
                            <div class="item-title">${item.Administrator}</div>
                            <div class="item-after">${sTime+" - "+ eTime}</div>
                          </div>
                       </a>
                  </li>`;
    });
    $("#scheduleContainer-picker-container ul").append(html);    
}
//新建排表
function newlyBuildTable() {
   myApp.views.main.router.navigate("/scheduleModify/?title=新增排表&table=NewlyBuildTable");
}
//字符串处理
function weekReturn(week) {
    var weekString;
    switch (week) {
        case 0:
            weekString = "每天";
            break;
        case 1:
            weekString = "星期一";
            break;
        case 2:
            weekString = "星期二";
            break;
        case 3:
            weekString = "星期三";
            break;
        case 4:
            weekString = "星期四";
            break;
        case 5:
            weekString = "星期五";
            break;
        case 6:
            weekString = "星期六";
            break;
        case 7:
            weekString = "星期日";
            break;
        case "每天":
            weekString = 0;
            break;
        case "星期一":
            weekString = 1;
            break;
        case "星期二":
            weekString = 2;
            break;
        case "星期三":
            weekString = 3;
            break;
        case "星期四":
            weekString = 4;
            break;
        case "星期五":
            weekString = 5;
            break;
        case "星期六":
            weekString = 6;
            break;
        case "星期日":
            weekString = 7;
            break;
        default:
            break;
    }
    return weekString;
}
//其它功能
function otherFun() {
    dynamicSheetAll = myApp.sheet.create({
        content: `
       <div class="sheet-modal my-sheet-swipe-to-step fm-modal" style="height:auto; --f7-sheet-bg-color: #fff;">
          <div class="sheet-modal-inner">
            <div class="sheet-modal-swipe-step">
              <div class="display-flex padding justify-content-space-between align-items-center header_center_gray">
                 <div></div>
              </div>
            </div> 
            <hr class="transform-05"/>        
            <div class="block-title block-title-medium margin-top title_2">其它功能</div>
            <div class="no-hairlines">
              <div data-pagination='{"el": ".swiper-pagination-content"}' data-space-between="10" data-slides-per-view="3" class="swiper-container-content swiper-init demo-swiper">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <a href="/scheduleSearch/">
                      <p class="icon iconfont icon_gongnengrukou_ditu">
                        <i class="icon iconfont icon_Nav_sousuoshebei"></i>
                      </p>
                      <span class="title_4">排班搜索</span>
                    </a>
                  </div>
                  <div class="swiper-slide">
                    <a href="/personnelManagement/">
                      <p class="icon iconfont icon_gongnengrukou_ditu">
                      <i class="icon iconfont icon_Nav_renyuanguanli"></i>
                      </p>
                      <span class="title_4">人员管理</span>
                    </a>
                  </div>
                  <div class="swiper-slide">
                    <a href="/groupManagement/">
                      <p class="icon iconfont icon_gongnengrukou_ditu">
                       <i class="icon iconfont icon_Nav_fenzuguanli"></i>
                      </p>
                      <span class="title_4">分组管理</span>
                    </a>
                  </div> 
                  <div class="swiper-slide">
                    <a href="/scopeOfManagement/">
                      <p class="icon iconfont icon_gongnengrukou_ditu">
                       <i class="icon iconfont icon_gongnengmokuai_baojingpaiban"></i>
                      </p>
                      <span class="title_4">管理范围</span>
                    </a>
                  </div>                                 
                </div>
              </div>
            </div>
          </div>
        </div>`,
        on: {
            open: function(sheet) {
                var swiper = myApp.swiper.create('.swiper-container-header,.swiper-container-content', {
                    speed: 400,
                    spaceBetween: 10,
                    slidesPerView: 4
                });
            },
            opened: function(sheet) {},
        },
        swipeToClose: false,
        swipeToStep: false,
        backdrop: true,
    });
    dynamicSheetAll.open();
}









































// //人员表公共请求
// function publicAjax(jsonString, url, index) {
//     var jsonData = {
//         "url": url,
//         "data": jsonString
//     };
//     $.when(AlarmCenterContext.post(jsonData.url,jsonData.data)).done(function(data){
//         let arrayLike = data.HttpStatus;
//         if (arrayLike == 200 && data.HttpData.data != 0) {
//             scheduleAlertSusscess.open();
//             switch (index) {
//                 case 1:
//                     requestUser();
//                     break;
//                 case 2:
//                     requestEquipGroup();
//                     break;
//                 case 3:
//                     requestAlmReport(requestEGAReport);
//                     break;
//                 case 4:
//                     requestWeekAlmReport();
//                     break;
//                 case 5:
//                     requestSpeAlmReport();
//                     break;
//                 default:
//                     break;
//             }
//         } else {
//             scheduleAlert.open();
//         }
//     }).fail(function(e){
//        scheduleAlert.open();
//     });
// }
// //设备分组
// var that_parent, equipArray = new Array();
// function requestEquipGroup() {
//     var jsonData = {
//         "url": "/api/GWServiceWebAPI/get_EquipGroupData",
//         "data": {
//             getDataTable: "0"
//         }
//     };
//     $.when(AlarmCenterContext.post(jsonData.url,jsonData.data)).done(function(data){
//         let arrayLike = data.HttpData.data;
//         let code = data.HttpData.code,
//             html = "";
//         $("#schedule_equip ul").html("");
//         if (code == 200) {
//             let AlarmTabulateLenth = arrayLike.length;
//             equipArray.length = 0;
//             for (var i = 0; i < AlarmTabulateLenth; i++) {
//                 html += `<li class="swipeout bottomBorderLine">
//                   <div class="item-content swipeout-content schedule-content row no-gap" style="padding-left: 0;">
//                     <div class="col-50 equipGroupInput" >
//                         <span onclick="activeLinkEquipGroup(this,1)" equipcomb="${arrayLike[i].equipcomb}" group_no="${arrayLike[i].group_no}">${arrayLike[i].group_name}</span>
//                         <div class="displayNone"><input type="text" value=""/></div>
//                     </div>
//                     <div class="col-50">
//                       <a href="#" class="equipGroupModifyBtn linkColor" onclick="equipAlert(this,1)">修改</a>
//                       <span class="displayNone">
//                         <a href="#" class="equipGroupSaveBtn linkColor" onclick="equipAlert(this,2)">保存</a>
//                         <a href="#" class="equipGroupCancelBtn linkColor" onclick="equipAlert(this,3)">取消</a>
//                       </span>
//                     </div>              
//                   </div>
//                   <div class="swipeout-actions-right">
//                     <a href="#" class="delBtn" onclick="delEquip(this)">删除</a>
//                   </div>
//                 </li>`;
//                 equipArray.push(arrayLike[i].group_no);
//             }
//         } else {
//             requestEquipGroup();
//             return false;
//         }
//         $("#schedule_equip ul").append(html);
//     }).fail(function(e){
//        scheduleAlert.open();
//     });
// }
// // 设备html
// function activeLinkEquipGroup(that, status) {
//     if (status == 1) myApp.views.main.router.navigate("/scheduleModify/?title=设备分组修改&index=1&table=schedule_equip&equipcomb=" + $(that).attr("equipcomb") + "&group_no=" + $(that).attr("group_no") + "&currentTxt=" + $(that).text());
//     else myApp.views.main.router.navigate("/scheduleModify/?title=设备分组修改&index=2&table=schedule_equip");
// }
// //设备删除
// function delEquip(that) {
//     myApp.dialog.confirm("是否删除该分组", "提示", function() {
//         let dt = $(that).parent().siblings();
//         var deleteJson = {
//             getDataTable: "EquipGroup",
//             ifName: "group_no",
//             ifValue: dt.find("div.col-50 span").attr("group_no"),
//             type: "number"
//         };
//         publicAjax(deleteJson, "/api/GWServiceWebAPI/deleteEquipGroup", 2);
//     });
// }
// //弹窗输入
// function equipAlert(dt, index) {
//     switch (index) {
//         case 1:
//             $(dt).addClass("displayNone").siblings().removeClass("displayNone");
//             $(dt).parent().prev().find("div").removeClass("displayNone").siblings().addClass("displayNone");
//             $(dt).parent().prev().find("div input").focus();
//             break;
//         case 2:
//             let val = $(dt).parents("div.col-50").prev().find("div input").val(),
//                 tbject = $(dt).parents("div.col-50").prev().find("span");
//             if (!val) {
//                 scheduleAlert.open();
//                 return false;
//             }
//             let updateJson = {
//                 getDataTable: "EquipGroup",
//                 equipcomb: tbject.attr("equipcomb"),
//                 group_name: val,
//                 ifValue: tbject.attr("group_no")
//             };
//             publicAjax(updateJson, "/api/GWServiceWebAPI/updateEquipGroup", 2);
//             break;
//         case 3:
//             $(dt).parent().addClass("displayNone").siblings().removeClass("displayNone");
//             $(dt).parents("div.col-50").prev().find("span").removeClass("displayNone").siblings().addClass("displayNone");
//             break;
//         case 4:
//             var NewLineVal, NewLineArray = [];
//             $("#schedule_equip").find("li").each(function(index) {
//                 NewLineArray.push($(this).find("div.equipGroupInput span").attr("group_no"));
//             });
//             NewLineVal = NewLineArray.length == 0 ? 1 : Math.max.apply(null, NewLineArray) + 1;
//             let insertJson = {
//                 getDataTable: "EquipGroup",
//                 groupName: "新增项目",
//                 groupNo: NewLineVal
//             };
//             publicAjax(insertJson, "/api/GWServiceWebAPI/insertEquipGroup", 2);
//             break;
//         default:
//             break;
//     }
// }
// //获取最大序号
// function getMaxNo() {
//     if (equipArray.length == 0) return 1;
//     else return Math.max.apply(null, equipArray) + 1;
// }
// //管理范围
// function requestAlmReport(almGroupObject) {
//     var jsonData = {
//         "url": "/api/GWServiceWebAPI/get_AlmReportData",
//         "data": {
//             getDataTable: "0"
//         }
//     };
//     $.when(AlarmCenterContext.post(jsonData.url,jsonData.data)).done(function(data){
//         let arrayLike = data.HttpData.data;
//         let code = data.HttpData.code,
//             html = "";
//         $("#schedule_administartor ul").html("");
//         if (code == 200) {
//             let AlarmTabulateLenth = arrayLike.length;
//             for (var i = 0; i < AlarmTabulateLenth; i++) {
//                 html += `<li class="swipeout bottomBorderLine">
//                   <div class="item-content swipeout-content schedule-content row no-gap" onclick="newlyBuildAlmReport(this,1);" dataid = "${arrayLike[i].id}" datano="${arrayLike[i].group_no}">
//                     <div class="col-50">${arrayLike[i].Administrator}</div>
//                     <div class="col-50">${getEquipName(almGroupObject,arrayLike[i].group_no)}</div>              
//                   </div>
//                   <div class="swipeout-actions-right">
//                     <a href="#" class="delBtn" onclick="delAlmReport(this)">删除</a>
//                   </div>
//                 </li>`;
//             }
//         } else {
//             requestAlmReport(almGroupName);
//             return false;
//         }
//         $("#schedule_administartor ul").append(html);
//     }).fail(function(e){
//        scheduleAlert.open();
//     });
// }
// // 设备html
// function newlyBuildAlmReport(that, status) {
//     if (status == 1) myApp.views.main.router.navigate("/scheduleModify/?title=管理范围修改&index=1&table=schedule_administartor&dataid=" + $(that).attr("dataid") + "&datano=" + $(that).attr("datano") + "&username=" + $(that).find("div:eq(0)").text() + "&groupname=" + $(that).find("div:eq(1)").text());
//     else myApp.views.main.router.navigate("/scheduleModify/?title=管理范围修改&index=2&table=schedule_administartor");
// }
// //返回对应设备号的设备名称
// function getEquipName(equipObject, equipno) {
//     var equipName = "";
//     equipObject.forEach(function(ele, index) {
//         if (ele.group_no == equipno) {
//             equipName = ele.group_name;
//         }
//     });
//     return equipName;
// }
// //返回对应设备名称的设备号
// function getEquipNO(equipObject, equipName) {
//     var equipName;
//     equipObject.forEach(function(ele, index) {
//         if (ele.group_name == equipName) equipName = ele.group_no;
//         return equipName;
//     });
//     return equipName;
// }
// //请求设备分组
// var requestEGAReport;
// function requestEGAlmReport() {
//     var equipData = {
//         "url": "/api/GWServiceWebAPI/get_EquipGroupData",
//         "data": {
//             getDataTable: "0"
//         }
//     };
//     $.when(AlarmCenterContext.post(equipData.url,equipData.data)).done(function(data){
//         let arrayLike = data.HttpData.data;
//         let code = data.HttpData.code;
//         if (code == 200) {
//             requestAlmReport(arrayLike);
//             requestEGAReport = arrayLike;
//         }
//     }).fail(function(e){
//        scheduleAlert.open();
//     });
// }
// //设备删除
// function delAlmReport(that) {
//     myApp.dialog.confirm("是否删除该管理范围", "提示", function() {
//         let dt = $(that).parent().siblings();
//         var deleteJson = {
//             getDataTable: "AlmReport",
//             ifName: "id",
//             ifValue: dt.attr("dataid"),
//             type: "number"
//         };
//         publicAjax(deleteJson, "/api/GWServiceWebAPI/deleteEquipGroup", 3);
//     });
// }
// //弹窗输入
// function almReportAlert(dt, index) {
//     myApp.dialog.prompt('', '新的设备分组名', function(equipName) {
//         if (!equipName) myApp.toast.create({
//             text: '设备分组名不能为空',
//             position: 'center',
//             closeTimeout: 2000,
//         }).open();
//         else updateEquip(dt, equipName, index);
//     });
// }
// // 设备分组选项选择
// function almReportList(parentTaht, that) {
//     var isFlag = false;
//     var equipcombParentString = $(parentTaht).attr("equipcomb"),
//         equipnoString = $(that).attr("equip_no");
//     if (!equipcombParentString) {
//         equipcombParentString = "#" + equipnoString + "#";
//     } else {
//         if (!$(that).find("input").is(':checked')) {
//             if (equipcombParentString.indexOf("#" + equipnoString + "#") == -1) {
//                 equipcombParentString += equipnoString + "#";
//             }
//         } else {
//             equipcombParentString = equipcombParentString.replace("#" + equipnoString + "#", "#");
//         }
//     }
//     $(parentTaht).attr("equipcomb", equipcombParentString);
//     updateEquip($(parentTaht).next().find("i.icon-f7_modify"), $(parentTaht).text(), 1);
// }
// //周排表
// var jsondate = [];
// function requestWeekAlmReport() {
//     var jsonData = {
//         "url": "/api/GWServiceWebAPI/get_WeekAlmReportData",
//         "data": {
//             getDataTable: "0"
//         }
//     };
//     $.when(AlarmCenterContext.post(jsonData.url,jsonData.data)).done(function(data){
//         let arrayLike = data.HttpData.data,
//             code = data.HttpData.code,
//             html = "";
//         jsondate.length = 0;
//         $("#schedule_specificDate ul").html("");
//         if (code == 200) {
//             let AlarmTabulateLenth = arrayLike.length;
//         } else {
//             requestUser();
//             return false;
//         }
//         $("#schedule_specificDate ul").append(html);

//     }).fail(function(e){
//        scheduleAlert.open();
//     });
// }
// //周排表html

// //周排表删除
// function delWeekAlmReport(that) {
//     myApp.dialog.confirm("是否删除该周排表", "提示", function() {
//         var dt = $(that).parent().siblings();
//         var deleteJson = {
//             getDataTable: "WeekAlmReport",
//             ifName: "id",
//             ifValue: $(dt).attr("dataid"),
//             type: "number"
//         };
//         publicAjax(deleteJson, "/api/GWServiceWebAPI/deleteEquipGroup", 4);
//     });
// }
// //特定排表
// var spe_array = [];

// function requestSpeAlmReport() {
//     var jsonData = {
//         "url": "/api/GWServiceWebAPI/get_SpeAlmReportData",
//         "data": {
//             getDataTable: "0"
//         }
//     };
//     $.when(AlarmCenterContext.post(jsonData.url,jsonData.data)).done(function(data){
//         let arrayLike = data.HttpData.data;
//         let code = data.HttpData.code,
//             html = "";
//         if (code == 200) {
//             let AlarmTabulateLenth = arrayLike.length;
//             console.log(arrayLike);
//         } else {
//             requestUser();
//             return false;
//         }
//     }).fail(function(e){
//        scheduleAlert.open();
//     });
// }
// //特定排表删除
// function delSpeAlmReport(that) {
//     myApp.dialog.confirm("是否删除该特定排表", "提示", function() {
//         var dt = $(that).parent().siblings();
//         let deleteJson = {
//             getDataTable: "SpeAlmReport",
//             ifName: "id",
//             ifValue: $(dt).attr("dataid"),
//             type: "number"
//         };
//         publicAjax(deleteJson, "/api/GWServiceWebAPI/deleteEquipGroup", 5);
//     });
// }
// function newlyBuildSpeAlmReport(tThatParent, status) {
//     if (status == 1) myApp.views.main.router.navigate("/scheduleModify/?title=特定排表修改&index=1&table=schedule_weeklytable&username=" + $(tThatParent).find("div:eq(0)").text() + "&stime=" + $(tThatParent).find("div:eq(1)").text() + "&etime=" + $(tThatParent).find("div:eq(2)").text() + "&dataid=" + $(tThatParent).attr("dataid"));
//     else myApp.views.main.router.navigate("/scheduleModify/?title=特定排表修改&index=2&table=schedule_weeklytable");
// }
// //switchMenu
// function switchMenu(dt) {
//     let idObj = $(dt).attr("href")
//     $(idObj).removeClass("displayNone").siblings("section").addClass("displayNone");
//     switch (idObj) {
//         case "#schedule_user":
//             requestUser();
//             break;
//         case "#schedule_equip":
//             requestEquipGroup();
//             break;
//         case "#schedule_administartor":
//             requestEGAlmReport();
//             break;
//         case "#schedule_specificDate":
//             requestWeekAlmReport();
//             break;
//         case "#schedule_weeklytable":
//             requestSpeAlmReport();
//             break;
//     }
// }

// //日期转化
// function formatDate(date, fmt) {
//     if (/(y+)/.test(fmt)) {
//         fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
//     }
//     let o = {
//         'M+': date.getMonth() + 1,
//         'd+': date.getDate(),
//         'h+': date.getHours(),
//         'm+': date.getMinutes(),
//         's+': date.getSeconds()
//     };
//     for (let k in o) {
//         if (new RegExp(`(${k})`).test(fmt)) {
//             let str = o[k] + '';
//             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
//         }
//     }
//     return fmt;
// };
// function padLeftZero(str) {
//     return ('00' + str).substr(str.length);
// };
// //删除当前控制项
// function scheduleDelControl() {
//     myApp.dialog.confirm("是否删除该项", "提示", function(){});
// }
