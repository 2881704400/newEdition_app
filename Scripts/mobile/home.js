//首页事件
function onHomePage() {
    switchToolbar("homeTool");
    authorizationName();
    getJurisdictionData();
    getAppStatusBarHeight();
    tranformMenu(window.localStorage.languageList);
    
}

//响应App绑定函数-获取状态栏高度 
function getStatusBarHeight(height, ScreenHeight) {
    var heightRate = height / ScreenHeight;
    var parentHeight = document.body.clientHeight;
    heightRate = heightRate * parentHeight;
    if (heightRate > 0) {
        $(".md .statusbar").height(heightRate + "px");
    }
}

function getAppStatusBarHeight() {
    if (typeof(myJavaFun) != "undefined") {
        //App绑定函数-获取键盘高度
        if (typeof myJavaFun.getStatusBarHeight === "function") {
            myJavaFun.getStatusBarHeight();
        }
    }
}
//授权名称
function authorizationName() {
    var ajaxVar = $.ajax({
        type: "POST",
        url: "/GWService.asmx/GetName2SFService",
        timeout: 5000,
        data: {
            userName: window.localStorage.userName,
        },
        success: function(data) {
            var dt = $(data).find('string').text();
            if (dt) {
                if (dt == "false") dt = "AlarmCenter";
                $(".auth_name_get").text(dt);
                window.localStorage.auth_name_title = dt;
            } else {
                tipsInformtion(window.localStorage.languageList == 1 ? "Failed to obtain authorization name" : "获取授权名失败,是否退出登陆界面?", exitLogin);
            }
        },
        error: function(e) {
            tipsInformtion(window.localStorage.languageList == 1 ? "Failed to obtain authorization name" : "获取授权名失败,是否退出登陆界面?", exitLogin);
        }
    });
}
//提示窗口
function tipsInformtion(tipsStr, tipsEvent) {
    myApp.dialog.create({
        title: window.localStorage.languageList == 1 ? "Tips" : "提示",
        text: tipsStr,
        buttons: [{
            text: window.localStorage.languageList == 1 ? "Cancel" : "取消"
        }, {
            text: window.localStorage.languageList == 1 ? "confirm" : "确定",
            onClick: function() {
                tipsEvent();
            }
        }]
    }).open();
}
//常用
function commonlyUsedFun(className, classListName, jsonString) {
    $("." + className).html("");
    var countTrailer = jsonString.length;
    var htmlTrailerChild = "",
        xhTrailer = 0;
    for (var i = 0; i < countTrailer; i++) {
        htmlTrailerChild += "<li class=\"col-" + classListName + "\">" + "<a href=\"" + (window.localStorage.languageList == 1 ? jsonString[i].href_en : jsonString[i].href_zh) + "\"  id=\"homeBtn" + (i + 1) + "\" class=\"homeBtn\" set_equip=\"" + jsonString[i].equipNo + "\" set_no=\"" + jsonString[i].setNo + "\" onclick=\"get_no_set(this,'" + jsonString[i].value + "')\">" + "<i class=\"" + jsonString[i].icon + "\" style=\"background: linear-gradient(30deg," + jsonString[i].color + ")\"></i>" + "<p class=\"p-ellipsis1\">" + (window.localStorage.languageList == 1 ? jsonString[i].name_en : jsonString[i].name) + "</p>" + "</a>" + "<a href=\"#\"  class=\"homeBtn displayNone\">" + "<i class=\"" + jsonString[i].icon + "\"></i>" + "<p class=\"p-ellipsis1\">" + (window.localStorage.languageList == 1 ? jsonString[i].name_en : jsonString[i].name) + "</p>" + "</a>" + "</li>";
    }
    $("." + className).append(htmlTrailerChild);
}
//实时快照 
var event_Level_list_home, btnInfoNames_home = [],
    btnInfoLevels_home = [];

function snashotData() {
    btnInfoNames_home.length = 0, btnInfoLevels_home.length = 0;
    $.ajax({
        type: 'post',
        url: '/api/event/alarm_config',
        headers: {
            Authorization: window.localStorage.ac_appkey + '-' + window.localStorage.ac_infokey //签名由getkey接口获取
        },
        data: {},
        success: function(dt) {
            if (dt.HttpStatus == 200 && dt.HttpData.data) {
                var resultData = dt.HttpData.data;
                var strData = "";
                for (var i = 0; i < resultData.length; i++) {
                    if (resultData[i].IsShow == 1) {
                        var btnStatus = resultData[i].IsShow == 1 ? true : false;
                        var btnValue = [];
                        for (var j = resultData[i].SnapshotLevelMin; j <= resultData[i].SnapshotLevelMax; j++) {
                            btnValue += j + ",";
                        }
                        event_Level_list_home += btnValue;
                        btnValue = btnValue.substring(0, btnValue.length - 1);
                        btnInfoNames_home.push(resultData[i].SnapshotName)
                        btnInfoLevels_home.push(btnValue);
                    }
                }
                snashotCount(btnInfoLevels_home);
            }
        }
    });
}

function snashotCount(btnInfoLevels_home) {
    var strBtnInfoLevels = "";
    for (var i = 0; i < btnInfoLevels_home.length; i++) {
        strBtnInfoLevels += btnInfoLevels_home[i] + "/";
    }
    if (strBtnInfoLevels.length > 0) {
        strBtnInfoLevels = strBtnInfoLevels.substring(0, strBtnInfoLevels.length - 1);
        $.ajax({
            type: 'post',
            url: '/api/event/real_evt_count',
            headers: {
                Authorization: window.localStorage.ac_appkey + '-' + window.localStorage.ac_infokey //签名由getkey接口获取
            },
            data: {
                levels: strBtnInfoLevels
            },
            success: function(dt) {
                if (dt.HttpStatus == 200 && dt.HttpData.data) {
                    var resultData = dt.HttpData.data;
                    var resultDataArr = resultData.toString().split(",");
                    for (var i = 0; i < resultDataArr.length; i++) {
                        $(".statisticsTable a:eq(" + i + ")").attr("href", "/snapShotDetail/?" + btnInfoNames_home[i] + '&' + btnInfoLevels_home[i]).find("p").text(resultDataArr[i]);
                    }
                }
            }
        });
    }
}
//配置界面
function getJurisdictionData() {
    myApp.dialog.progress((window.localStorage.languageList == 1 ? '<a style="font-size: 1rem">Loading...</a>' : '<a style="font-size: 1rem">加载中...</a>'));
    // 权限管理 
    var JurisdictionArray = [];
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/getJurisdictionData", {
        async: false
    })).done(function(n) {
        let result = n.HttpData;
        var JurisdictionFunArray = result.data.filter((item, index) => {
            if (item.ClassName.indexOf("AlarmCenter.APP.Home") > -1) return item;
        });
        if (result.code == 200) {
            $.ajax({
                type: "post",
                url: service + "/UserPermissions",
                data: "userName=" + window.localStorage.userName,
                success: function(usersDt) {
                    myApp.dialog.close();
                    $("#homeContents>ul").html("");
                    getWebUser = $(usersDt).children("UserItem");
                    let resultControl = $(usersDt).find("RoleItem").find("AddinModule_List").find("int"),
                        JurisdictionArrayList = [];
                    if ($(usersDt).find("IsAdministrator").text() == "true") JurisdictionArray = ["HomeSnapShot", "HomeShortcutFunction", "HomeButton"];
                    else {
                        resultControl.each(function(index_p, item_p) {
                            JurisdictionArrayList.push($(item_p).text());
                        });
                        let Juris = JurisdictionFunArray.filter((item, index) => JurisdictionArrayList.some(item_ch => item_ch.toString() == item.ID.toString()));
                        Juris.forEach((item, index) => {
                            JurisdictionArray.push(item.ClassName.replace("AlarmCenter.APP.Home.", ""));
                        });
                    }
                    var html = "";
                    JurisdictionArray.forEach(function(item, index) {
                        html += functionalModule(item, "");
                    });
                    $("#homeContents>ul").append(html);
                    // 实现内容添加 
                    JurisdictionArray.forEach(function(item, index) {
                        switch (item) {
                            case "HomeSnapShot":
                                snashotData();
                                break;
                            case "HomeShortcutFunction":
                                $(".videoPatternHeader").parent().find("p label").html(window.localStorage.languageList == 1 ? jjPattern[7].title_en : jjPattern[7].title);
                                $(".pptPatternHeader").parent().find("p label").html(window.localStorage.languageList == 1 ? pptPattern[5].title_en : pptPattern[5].title);
                                myApp.swiper.create('.HomeShortcutFunction-swiper', {
                                    spaceBetween: 10,
                                    slidesPerView: 1.2
                                });
                                break;
                            case "HomeButton":
                                break;
                            default:
                                break;
                        }
                    });
                }
            });
        }
    }).fail(function(e) {});
}

function functionalModule(className, htmlStr) {
    var html = "";
    switch (className) {
        case "HomeSnapShot":
            html = `<li class="row HomeSnapShot statisticsTable no-gap bottomLine">
                        <h2 class="title_2">实时快照</h2>
                        <a class="col-20"><p>0</p>${window.localStorage.languageList == 1?"Errors":"故障"}</a>
                        <a class="col-20"><p>0</p>${window.localStorage.languageList == 1?"Warnings":"警告"}</a>
                        <a class="col-20"><p>0</p>${window.localStorage.languageList == 1?"Informations":"信息"}</a>
                        <a class="col-20"><p>0</p>${window.localStorage.languageList == 1?"Settings":"设置"}</a>
                        <a class="col-20" style="border-right: 0;"><p>0</p>${window.localStorage.languageList == 1?"Assets":"资产"}</a>
                    </li>`;
            break;
        case "HomeShortcutFunction":
            html = `<li class="row HomeShortcutFunction bottomLine">
            <h2 class="title_2">大屏操控</h2>
            <div class="col-50" onclick="videoExplain()">
               <div class="videoPatternHeader row">
                  <span class="col-100 title_4">
                     <h3 class="title_3">${window.localStorage.languageList == 1?"Video Explanation":"视频讲解"}</h3>
                     ${window.localStorage.languageList == 1?"Video Brief Introduction of Dare to Platform":"敢为平台视频简介"}
                  </span>
                  <a><i class="icon iconfont icon_PPTyanshi"></i></a>
               </div>
            </div>
            <div class="col-50" onclick="pptPlay()">
               <div class="pptPatternHeader row">
                  <span class="col-100 title_4">
                     <h3 class="title_3">${window.localStorage.languageList == 1?"PPT Paly":"PPT播放"}</h3>
                     ${window.localStorage.languageList == 1?"Dare to Demonstrate PPT for Platform":"敢为平台PPT演示"}
                  </span>
                   <a><i class="icon iconfont icon_shipinjiangjie"></i></a>
               </div>
            </div>
            <div class="col-50" onclick="sceneSwitching()">
               <div class="pptPatternHeader row">
                  <span class="col-100 title_4">
                     <h3 class="title_3">${window.localStorage.languageList == 1?"Scene switching":"场景切换"}</h3>
                     ${window.localStorage.languageList == 1?"Common Scenarios":"常用场景"}
                  </span>
                   <a><i class="icon iconfont icon_changjingqiehuan"></i></a>
               </div>
            </div>     
            </li>`;
            break;
        case "HomeButton":
            html = `<li class="row HomeButton bottomLine">
            <h2 class="title_2">功能模块</h2>
            <a class="col-50" href="/Video/">
               <div class="videoPatternHeader row" >
                  <span class="col-100 title_4">
                     <h3 class="title_3">${window.localStorage.languageList == 1?"Video surveillance":"视频监控"}</h3>
                     ${window.localStorage.languageList == 1?"View all monitoring devices":"查看所有监控设备"}
                  </span>
                  <b class="icon iconfont icon_gongnengrukou_ditu"><i class="icon iconfont icon_changjingzhiling_jiankong"></i></b>
               </div>
              
            </a>

            <a class="col-50" href="/videoControl/">
               <div class="pptPatternHeader row">
                  <span class="col-100 title_4">
                     <h3 class="title_3">${window.localStorage.languageList == 1?"Map monitoring":"地图监控"}</h3>
                     ${window.localStorage.languageList == 1?"View the location of the device":"查看设备所在位置"}
                  </span>
                   <b class="icon iconfont icon_gongnengrukou_ditu"><i class="icon iconfont icon_gongnengrukou_ditujiankong"></i></b>
               </div>
               
            </a>

            <a class="col-50" href="/pptSelection/">
               <div class="pptPatternHeader row">
                  <span class="col-100 title_4">
                     <h3 class="title_3">${window.localStorage.languageList == 1?"PPT Settings":"PPT设置"}</h3>
                     ${window.localStorage.languageList == 1?"PPT Operational Control":"PPT操作控制"}
                  </span>
                   <b class="icon iconfont icon_gongnengrukou_ditu"><i class="icon iconfont icon_gongnengrukou_PPTshezhi"></i></b>
               </div>
               
            </a>
            <a class="col-50" href="/welcomeWords/">
               <div class="pptPatternHeader row">
                  <span class="col-100 title_4">
                     <h3 class="title_3">${window.localStorage.languageList == 1?"Welcome speech":"欢迎词"}</h3>
                     ${window.localStorage.languageList == 1?"Setting up Welcome Words to Show Contents":"设置欢迎词展示内容"}
                  </span>
                   <b class="icon iconfont icon_gongnengrukou_ditu"><i class="icon iconfont icon_gongnengrukou_huanyingci"></i></b>
               </div>
               
            </a>
            <a class="col-50" >
               <div class="pptPatternHeader row">
                  <span class="col-100 title_4">
                     <h3 class="title_3">${window.localStorage.languageList == 1?"Module title":"模块标题"}</h3>
                     ${window.localStorage.languageList == 1?"Module Content Interpretation":"模块内容解释"}
                  </span>
                   <b class="icon iconfont icon_gongnengrukou_ditu"><i class="icon iconfont icon_gongnengmokuai_shebeiliandong"></i></b>
               </div>
               
            </a>            
                                 
            </li>`;
            break;
        default:
            html = htmlStr;
            break;
    }
    return html;
}

//视频讲解
function videoExplain() {
    var htmlContent = `<div class="popoverVideoExplain">
     <h4><span>功能指令</span></h4>
     <div class="row">
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${jjPattern[0].equipNo}" set_no="${jjPattern[0].setNo}" onclick="get_no_set(this,null)" >
               <i class="${jjPattern[0].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?jjPattern[0].name_en:jjPattern[0].name}</p>
         </a>
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${jjPattern[2].equipNo}" set_no="${jjPattern[2].setNo}" onclick="get_no_set(this,null)" >
               <i class="${jjPattern[2].icon}"></i>
               <p class="title_4">${window.localStorage.languageList == 1 ?jjPattern[2].name_en:jjPattern[2].name}</p>
         </a>
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${jjPattern[3].equipNo}" set_no="${jjPattern[3].setNo}" onclick="get_no_set(this,null)" >
               <i class="${jjPattern[3].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?jjPattern[3].name_en:jjPattern[3].name}</p>
         </a>                                 
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${jjPattern[4].equipNo}" set_no="${jjPattern[4].setNo}" onclick="get_no_set(this,null)" >
         <i class="${jjPattern[4].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?jjPattern[4].name_en:jjPattern[4].name}</p>
         </a>
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${jjPattern[5].equipNo}" set_no="${jjPattern[5].setNo}" onclick="get_no_set(this,null)" >
         <i class="${jjPattern[5].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?jjPattern[5].name_en:jjPattern[5].name}</p>
         </a>
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${jjPattern[6].equipNo}" set_no="${jjPattern[6].setNo}" onclick="JumpPage(this)" >
         <i class="${jjPattern[6].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?jjPattern[6].name_en:jjPattern[6].name}</p>
         </a>  
         <a href="#" class="col-25"></a>
         <a href="#" class="col-25"></a>
     </div>

       </div>
    `;
    ststemSet(window.localStorage.languageList == 1 ? "Video Explanation" : "视频讲解", "sceneBtnControl", htmlContent);
}
//ppt播放 
function pptPlay() {
    var htmlContent = `<div class="popoverVideoExplain">
    <h4><span>功能指令</span></h4>
     <div class="row">
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${pptPattern[0].equipNo}" set_no="${pptPattern[0].setNo}" onclick="get_no_set(this,null)" >
               <i class="${pptPattern[0].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?pptPattern[0].name_en:pptPattern[0].name}</p>
         </a> 
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${pptPattern[1].equipNo}" set_no="${pptPattern[1].setNo}" onclick="get_no_set(this,null)" >
               <i class="${pptPattern[1].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?pptPattern[1].name_en:pptPattern[1].name}</p>
         </a>                                         
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${pptPattern[2].equipNo}" set_no="${pptPattern[2].setNo}" onclick="get_no_set(this,null)" >
         <i class="${pptPattern[2].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?pptPattern[2].name_en:pptPattern[2].name}</p>
         </a>
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${pptPattern[3].equipNo}" set_no="${pptPattern[3].setNo}" onclick="get_no_set(this,null)" >
         <i class="${pptPattern[3].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?pptPattern[3].name_en:pptPattern[3].name}</p>
         </a>
         <a href="#" class="popoverVideoExplain col-25"  set_equip="${pptPattern[4].equipNo}" set_no="${pptPattern[4].setNo}" onclick="JumpPage(this)" >
         <i class="${pptPattern[4].icon}"></i>
            <p class="title_4">${window.localStorage.languageList == 1 ?pptPattern[4].name_en:pptPattern[4].name}</p>
         </a>  
     </div>
    </div>
    `;
    ststemSet(window.localStorage.languageList == 1 ? "PPT Paly" : "PPT播放", "sceneBtnControl", htmlContent);
}
//设置跳页
function JumpPage(dt) {
    myApp.dialog.prompt(window.localStorage.languageList == 1 ? "Please enter a jump page" : "请输入跳转页", window.localStorage.languageList == 1 ? "Tips" : "提示", function(name) {
        if (parseFloat(name).toString() == "NaN") myApp.dialog.alert(window.localStorage.languageList == 1 ? "Please enter a number" : "请输入数字");
        else get_no_set(dt, name);
    });
}
//场景切换
function sceneSwitching() {
    var htmlContent = `<div class="popoverVideoExplain">
       ${returnSceneHtml()}
    </div>
    `;
    ststemSet(window.localStorage.languageList == 1 ? "Scene switching" : "场景切换", "sceneBtnControl", htmlContent);
}
function returnSceneHtml(){
   var headerHtml = "",contentHtml = "",allHtml = "";
    KOvm.forEach((item,index)=>{
       headerHtml = `<h4><span>${item.title}</span></h4>`;
       contentHtml = `
         <div class="row">
            ${returnSceneChildHtml(item.child)}                            
         </div>
       `;
       allHtml += (headerHtml + contentHtml);
    });
   return allHtml;
}
function returnSceneChildHtml(dom){
  var allHtml = "";
  dom.forEach((item,index)=>{
     allHtml += `
           <a href="#" class="popoverVideoExplain col-25"  set_equip="${item.equipNo}" set_no="${item.setNo}" onclick="get_no_set(this,null)" >
                 <i class="${item.icon}"></i>
              <p class="title_4">${window.localStorage.languageList == 1 ?item.name_en:item.name}</p>
           </a>                              
     `;
  });
  allHtml +=`<a href="#" class="col-25"></a><a href="#" class="col-25"></a><a href="#" class="col-25"></a>`;
  return allHtml;
}

//模块功能
function functionalModule_page() {

    dynamicSheetAll = myApp.sheet.create({
        content: `
       <div class="sheet-modal my-sheet-swipe-to-step fm-modal" style="height:auto; --f7-sheet-bg-color: #fff;">
          <div class="sheet-modal-inner">
            <div class="sheet-modal-swipe-step">
              <div class="display-flex padding justify-content-space-between align-items-center header_center_gray">
                 <div></div>
              </div>
            </div>
            <div class="block-title block-title-medium margin-top title_2" style="${window.localStorage.moduleRecord?"":"display: none;"}">近期使用</div>
            <div class="no-hairlines">

              <div data-pagination='{"el": ".swiper-pagination-header"}' data-space-between="10" data-slides-per-view="3" class="swiper-container-header swiper-init demo-swiper">
                <div class="swiper-wrapper">
                    ${historyHTML()}
                </div>
              </div>
            </div>    
            <hr class="transform-05"/>        
            <div class="block-title block-title-medium margin-top title_2">系统模块</div>
            <div class="no-hairlines">
              <div data-pagination='{"el": ".swiper-pagination-content"}' data-space-between="10" data-slides-per-view="3" class="swiper-container-content swiper-init demo-swiper">
                <div class="swiper-wrapper">
                  <div class="swiper-slide">
                    <a href="/eventSearch/">
                      <p class="icon iconfont icon_gongnengrukou_ditu">
                        <i class="icon iconfont icon_gongnengmokuai_shijianchaxun"></i>
                      </p>
                      <span class="title_4">事件查询</span>
                    </a>
                  </div>
                  <div class="swiper-slide">
                    <a href="/equipConfigList/">
                      <p class="icon iconfont icon_gongnengrukou_ditu">
                      <i class="icon iconfont icon_gongnengmokuai_xitongpeizhi"></i>
                      </p>
                      <span class="title_4">系统配置</span>
                    </a>
                  </div>
                  <div class="swiper-slide">
                    <a href="/schedule/">
                      <p class="icon iconfont icon_gongnengrukou_ditu">
                       <i class="icon iconfont icon_gongnengmokuai_baojingpaiban"></i>
                      </p>
                      <span class="title_4">报警排表</span>
                    </a>
                    
                  </div>
                  <div class="swiper-slide">
                    <a href="/equipLinkage/">
                      <p class="icon iconfont icon_gongnengrukou_ditu">
                      <i class="icon iconfont icon_gongnengmokuai_shebeiliandong"></i>
                      </p>
                      <span class="title_4">设备联动</span>
                    </a>
                  </div>
                  <div class="swiper-slide">
                    <a href="/sceneEdit/">
                       <p class="icon iconfont icon_gongnengrukou_ditu">
                         <i class="icon iconfont icon_gongnengmokuai_changjingpeizhi"></i>
                      </p>
                      <span class="title_4">场景编辑</span>
                    </a>
                  </div>                  
                </div>
              </div>
            </div>
          </div>
        </div>`,
        // Events
        on: {
            open: function(sheet) {
              var swiper = myApp.swiper.create('.swiper-container-header,.swiper-container-content', {
                  speed: 400,
                  spaceBetween: 10,
                  slidesPerView: 4.5
              });
            },
            opened: function(sheet) {},
        },
        swipeToClose: true,
        swipeToStep: false,
        backdrop: true,
    });
    dynamicSheetAll.open();
}

//近期使用
function historyHTML(){
  var historyRecord,html = "";
   if(window.localStorage.moduleRecord)
   {
       historyRecord = JSON.parse(window.localStorage.moduleRecord);
       for(var val of historyRecord)
       {
          html += `
           <div class="swiper-slide">
            <a href="/${val.split("&")[0]}/">
              <p class="icon iconfont icon_gongnengrukou_ditu">
              <i class="${val.split("&")[1]}"></i>
              </p>
              <span class="title_4">${val.split("&")[2]}</span>
           </a></div>`;
       }  
   }
   return html;
}
function addModuleRecord(value){
   var historyRecord;
   if(window.localStorage.moduleRecord)
   {
       historyRecord = JSON.parse(window.localStorage.moduleRecord);
       if(historyRecord.join(",").indexOf(value) == -1)
          historyRecord.push(value);
       if(historyRecord.length>3)
          historyRecord.shift();   
   }
   else
   {
       historyRecord = [];
       historyRecord.push(value);
   }
   window.localStorage.moduleRecord = JSON.stringify(historyRecord);
}

function judgeOpenPage(url){
   switch(url)
   {
    case "/eventSearch/": addModuleRecord("eventSearch&icon iconfont icon_gongnengmokuai_shijianchaxun&事件查询");break;
    case "/equipConfigList/": addModuleRecord("equipConfigList&icon iconfont icon_gongnengmokuai_xitongpeizhi&系统配置");break;
    case "/schedule/": addModuleRecord("schedule&icon iconfont icon_gongnengmokuai_baojingpaiban&报警排表");break;
    case "/equipLinkage/": addModuleRecord("equipLinkage&icon iconfont icon_gongnengmokuai_shebeiliandong&设备联动");break;
    case "/sceneEdit/": addModuleRecord("sceneEdit&icon iconfont icon_gongnengmokuai_changjingpeizhi&场景编辑");break;
    default: break;
   }
}