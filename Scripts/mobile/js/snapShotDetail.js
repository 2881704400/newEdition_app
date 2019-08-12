var userAdmin = [],
    alertMsg = [];
var chatList, chatTitleName;
var snapshotDetailArrs = [];

function snapShotDetail() {
    switchToolbar("snapshotTool");
    //获取父页面参数
    var chatObject = myApp.views.main.history,
        urlLength = chatObject.length - 1;
    var chatValue = chatObject[urlLength].split("?")[1].split("&");
    chatTitleName = chatValue[0];
    chatList = chatValue[1];
    $(".auth_name_get").html(chatTitleName);
    var snapashot_ptr = $$('.snapashotMessage-page-content');
    snapashot_ptr.on("ptr:refresh", refreshpg);
    loadMessage();
    var searchbar = myApp.searchbar.create({
        el: '.searchbarSnapDetail',
        searchContainer: '.snapshotMessage-ul',
        searchIn: '.item-title,.item-subtitle',
    });
    //菜单切换
    $(".snashot-header a").unbind().bind("click", function() {
        $(this).addClass("selectListType").siblings().removeClass("selectListType");
        initRetrieval();
    });
    //查询内容初始化
    searchResult.length = 0;
    alertMsg.length = 0;
    loadFun();
}

function initRetrieval() {
    var num = parseInt($(".selectListType").attr("data-menu"));
    switch (num) {
        case 1:
            $("#snapShotDetailListId").find('li').removeClass("displayNone");
            break;
        case 2:
            $("#snapShotDetailListId").find('li[data-Flag="1"]').removeClass("displayNone");
            $("#snapShotDetailListId").find('li[data-Flag="2"]').addClass("displayNone");
            break;
        case 3:
            $("#snapShotDetailListId").find('li[data-Flag="1"]').addClass("displayNone");
            $("#snapShotDetailListId").find('li[data-Flag="2"]').removeClass("displayNone");
            break;
        default:
            break;
    }
}

function loadMessage() {
    $.ajax({
        type: 'post',
        url: '/api/GWServiceWebAPI/get_AdministratorData',
        headers: {
            Authorization: window.localStorage.ac_appkey + '-' + window.localStorage.ac_infokey
        },
        data: {
            "getDataTable": 0,
        },
        success: function(dt) {
            if (dt.HttpStatus == 200 && dt.HttpData.data) {
                var resultData = dt.HttpData.data;
                userAdmin = [];
                for (var i = 0; i < resultData.length; i++) {
                    userAdmin.push({
                        Administrator: resultData[i].Administrator,
                        MobileTel: resultData[i].MobileTel,
                        allInfo: resultData[i].Administrator + "&&" + resultData[i].MobileTel
                    });
                }
            }
        }
    });
    $.ajax({
        type: 'post',
        url: '/api/event/real_evt',
        headers: {
            Authorization: window.localStorage.ac_appkey + '-' + window.localStorage.ac_infokey
        },
        data: {
            levels: chatList
        },
        success: function(dt) {
            if (dt.HttpStatus == 200 && dt.HttpData.data) {
                var result = dt.HttpData.data;
                statistics(result);
                let tableListData = [],
                    current = "";
                var strSureData = "",
                    strData = "",
                    countNum = 0;
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        snapshotDetailArrs.push(result[i]);
                        var textareaEventMsg = "";
                        if (result[i].EventMsg.length > 200) {
                            textareaEventMsg = "<textarea>" + result[i].EventMsg + "</textarea>";
                        } else {
                            textareaEventMsg = result[i].EventMsg;
                        }
                        var textareaAdviceMsg = "";
                        if (result[i].Proc_advice_Msg && result[i].Proc_advice_Msg.length > 200) {
                            textareaAdviceMsg = "<textarea>" + result[i].Proc_advice_Msg + "</textarea>";
                        } else {
                            textareaAdviceMsg = result[i].Proc_advice_Msg;
                        }
                        var isSureSpan = "";
                        alertMsg.push({
                            obj: result[i],
                            msg: textareaEventMsg,
                            adMsg: textareaAdviceMsg
                        });
                        if (result[i].bConfirmed == false) {
                            isSureSpan = `<span class="span-color-notsure notConfirmed">未确认</span>`;
                            strData += current = `<li data-Flag="1">
                                <a href='/snapShotInfoDetail/#1&${i}&${countNum}'  class="item-link item-content"> 
                                    <div class="item-media"><i class="${iconType()}"></i></div>
                                    <div class="item-inner"> 
                                        <div class="item-title-row"> 
                                            <div class="item-subtitle">  ${formatDate(result[i].Time)}  </div> 
                                            <div class="item-after">  ${isSureSpan}  </div> 
                                        </div> 
                                        <div class="item-text item-title fontweight-normal">  ${result[i].EventMsg}  </div> 
                                    </div> 
                                </a> 
                                </li>`;
                            countNum++;
                        } else {
                            isSureSpan = `<span class="span-color-sure confirmed">已确认</span>`;
                            strSureData += current = `<li data-Flag="2"> 
                                <a href='/snapShotInfoDetail/#2&${i}'  class="item-link item-content"> 
                                    <div class="item-media"><i class="${iconType()}"></i></div>
                                    <div class="item-inner"> 
                                        <div class="item-title-row"> 
                                            <div class="item-subtitle">  ${formatDate(result[i].Time)}  </div> 
                                            <div class="item-after">  ${isSureSpan}  </div> 
                                        </div> 
                                        <div class="item-text item-title fontweight-normal">  ${result[i].EventMsg}  </div> 
                                    </div> 
                                </a> 
                                </li>`;
                        }
                        //查询条件
                        searchResult.push(current);
                    }
                    $("#snapShotDetailListId").html(strData + strSureData);
                    initRetrieval();
                } else {
                    $("#snapShotDetailListId").html(strData + strSureData);
                    initRetrieval();
                }
            }
        }
    });
}
//统计
function statistics(arry) {
    var number = parseInt(arry.filter((item, index) => {
        if (!item.bConfirmed) return item
    }).length);
    $(".snashot-header a:eq(0)").html("全部 " + parseInt(arry.length));
    $(".snashot-header a:eq(1)").html("待确认 " + number);
    $(".snashot-header a:eq(2)").html("已确认 " + (parseInt(arry.length) - number));
}
//选择是否发送短信
function onProcsCheckBox(countNum) {
    var that = $("#snapShotInfoDetail");
    if (that.find('.isProcsInput').is(':checked')) {
        if (!that.find(".procsContent ul").find("li").length) {
            var newRow = "<ul>";
            for (var i = 0; i < userAdmin.length; i++) {
                newRow += '<li><label class="item-checkbox item-content">' + '    <input type="checkbox" name="my-checkbox"  value="' + userAdmin[i].MobileTel + '"/>' + '    <i class="icon icon-checkbox"></i>' + '    <div class="item-inner">' + '      <div class="item-title">' + userAdmin[i].Administrator + (userAdmin[i].MobileTel == null ? "" : "(" + userAdmin[i].MobileTel + ")") + '</div>' + '    </div>' + '  </label></li>';
            }
            newRow += "</ul>";
            that.find(".procsContent").html(newRow);
            that.find(".procsContent").show();
        }
    } else {
        that.find(".procsContent").html("");
    }
}

function onTextareaBlur() {
    window.scroll(0, 0);
    window.innerHeight = window.outerHeight = window.screen.height;
}

function OnSureMessage(countNum, strTime, dt) {
    window.scroll(0, 0);
    window.innerHeight = window.outerHeight = window.screen.height;
    /*阻止事件冒泡*/
    event.stopPropagation();
    var checkValArr = []; //短信联系人选中值
    var strAdviceMsg = $(dt).parent().find(".advice-textarea").val(); //处理意见值
    var isShortMsg = "";
    if ($("#snapShotInfoDetail").find('.isProcsInput').is(':checked')) {
        $("#snapShotInfoDetail").find('input[name="my-checkbox"]:checked').each(function() {
            checkValArr.push($(this).val());
        });
        isShortMsg = true;
    }
    var strEventMsg = snapshotDetailArrs[countNum].EventMsg;
    var Time = strTime.replace("T", " ");
    var TimeArr = [];
    var strTimeArr = "";
    if (Time != "" && Time != null) {
        TimeArr = Time.split(".");
        strTimeArr = TimeArr[1].toString();
        if (strTimeArr.length >= 6) {
            strTimeArr = strTimeArr.substring(0, 6)
        } else {
            strTimeArr = strTimeArr + "000000".substring(0, 6 - strTimeArr.length);
        }
    }
    $.ajax({
        type: 'post',
        url: '/api/event/confirm_evt',
        headers: {
            Authorization: window.localStorage.ac_appkey + '-' + window.localStorage.ac_infokey
        },
        data: {
            shortmsg: isShortMsg, //是否发送短信
            telUser: checkValArr.toString(), //发送人的电话
            evtname: strEventMsg, //事件名
            time: TimeArr[0] + "." + strTimeArr, //事件时间
            userName: window.localStorage.userName, //是否发送短信
            msg: strAdviceMsg //处理意见
        },
        success: function(dt) {
            if (dt.HttpStatus == 200 && dt.HttpData.data) {
                var resultData = dt.HttpData.data;
                myApp.toast.create({
                    text: '操作成功!',
                    position: 'center',
                    closeTimeout: 500,
                }).open();
                $("#snapShotDetailListId li").eq(countNum).find(".content-container").css({
                    height: "0"
                });
                $("#snapShotDetailListId li").eq(countNum).find('.sure-flag').html("已确认");
                $("#snapShotDetailListId li").eq(countNum).find('.sure-flag').removeClass("span-color-notsure").addClass("span-color-sure");
                $("#snapShotDetailListId li").eq(countNum).removeClass("accordion-item-opened");
                setTimeout(loadMessage, 2000)
            }
        }
    });
}

function formatDate(time) {
    var newTime = time.replace("T", " ")
    return newTime.substring(0, 19);
}

function refreshpg(e) {
    setTimeout(function() {
        loadMessage();
        // 加载完毕需要重置
        e.detail();
        myApp.toast.create({
            text: '数据加载成功!',
            position: 'center',
            closeTimeout: 500,
        }).open();
    }, 2000);
}
//图标分类
function iconType() {
    var iconClassName = "";
    switch (chatTitleName) {
        case "故障":
            iconClassName = "icon iconfont icon_kuaizhaoleixing_guzhang";
            break;
        case "警告":
            iconClassName = "icon iconfont icon_kuaizhaoleixing_jinggao";
            break;
        case "信息":
            iconClassName = "icon iconfont icon_kuaizhaoleixing_xinxi";
            break;
        case "设置":
            iconClassName = "icon iconfont icon_kuaizhaoleixing_shezhi";
            break;
        case "资产":
            iconClassName = "icon iconfont icon_kuaizhaoleixing_zichan";
            break;
        default:
            break;
    }
    return iconClassName;
}