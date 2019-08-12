var isVoices = false;
var orderFlag = true;
var cancelVoiceFlag = false;
var startX, //触摸时的坐标   
    startY,
    x, //滑动的距离   
    y,
    aboveY = 0; //设一个全局变量记录上一次内部块滑动的位置    
function voice() {
    modifyZnUs();
    //移除监听
    document.getElementById("videoContentBtnId").removeEventListener('touchstart', onTouchStart);
    document.getElementById("videoContentBtnId").removeEventListener('touchend', onTouchEnd);
    // 监听
    document.getElementById("videoContentBtnId").addEventListener('touchstart', onTouchStart);
    document.getElementById("videoContentBtnId").addEventListener('touchend', onTouchEnd);
    //记录选择
    try {
        myJavaFun.VoiceOpen();
    } catch (ex) {}
};

function changeContentBoxBg() {
    document.getElementById("videoContentBtnId").addEventListener('touchstart', onTouchStart);
    document.getElementById("videoContentBtnId").addEventListener('touchend', onTouchEnd);
    $(".voiceView").find("label").removeClass("displayNone");
    voiceInt();
}

function onTouchStart(e) {
    $(".voiceView").find("label").addClass("displayNone");
    $(".voiceView").find(".title_1").addClass("displayNone");
    $(".voiceView div.loader").removeClass("displayNone");
    voiceAnimateMove();
    try {
        if (window.localStorage.voiceType == "0") myJavaFun.StartVoice("1");
        else {
            myJavaFun.startMicrosoftSpeech();
        }
    } catch (ex) {}
    orderFlag = true;
}

function onTouchEnd(e) {
    if (orderFlag) {
        orderFlag = false;
        $(".voiceView div.loader").addClass("displayNone");
        $(".voiceView").find(".title_1").removeClass("displayNone").html("识别中...");
        //移除监听 
        document.getElementById("videoContentBtnId").removeEventListener('touchstart', onTouchStart);
        document.getElementById("videoContentBtnId").removeEventListener('touchend', onTouchEnd);
        setTimeout(function() {
            try {
                if (window.localStorage.voiceType == "0") myJavaFun.StopVoice();
                else {
                    myJavaFun.stopMicrosoftSpeech();
                }
            } catch (ex) {
                changeContentBoxBg();
                strAnimate("请用APP打开语音");
            }
        }, 50);
    }
}

function StartVoiceXF() {
    try {
        myJavaFun.StartViceXF(parseInt(window.localStorage.XFOffline));
    } catch (ex) {}
}

function callbackVoiceXFMessage(dt) {
    strAnimate(window.localStorage.languageList == "0" ? "您好像没有说话哦！" : "You don't seem to be talking！");
    voiceInt();
    document.getElementById("videoContentBtnId").addEventListener('touchstart', onTouchStart);
    document.getElementById("videoContentBtnId").addEventListener('touchend', onTouchEnd);
}
//输入口令正确  
function VoicePasswords() {
    $(".voice-container").append('<div class="pannel-chat-info">' + '<div class="chart-content"><span>口令正确</span></div>' + '</div>');
    $('.voice-container').scrollTop($('.voice-container')[0].scrollHeight);
}
//等待口令
function waitForPasswords() {
    $(".voice-container").append('<div class="pannel-chat-info">' + '<div class="chart-content"><span>请您说出口令</span></div>' + '</div>');
    $('.voice-container').scrollTop($('.voice-container')[0].scrollHeight);
}
//返回
function callbackVoiceXFData(dt) {
    var voiceString = dt;
    var _url = "/api/Voice/voice_string",
        _data = {
            data_string: dt,
            userName: window.localStorage.userName
        };
    ajaxServiceSendVoice("post", _url, true, _data, _successf, _error);

    function _successf(dt) {
        if (dt.HttpStatus == 200 && dt.HttpData.data) {
            var result = dt.HttpData.data;
            if (result == "") {
                $(".voiceView").find("h2").html(window.localStorage.languageList == "0" ? "<span>未识别！</span>" : "<span> Unidentified！</span>");
            } else {
                result = handleString(result);
                let contentTxt = result.replace(/打/g, "").replace(/开/g, "");
                if (result.indexOf("打") != -1 || result.indexOf("开") != -1) {
                    $(".voiceView").find("h2").html((window.localStorage.languageList == "0" ? (contentTxt + "已经打开") : "Already implemented"));
                } else {
                    $(".voiceView").find("h2").html((window.localStorage.languageList == "0" ? (contentTxt + "已执行") : "Already implemented"));
                }
                document.getElementById("videoContentBtnId").addEventListener('touchstart', onTouchStart);
                document.getElementById("videoContentBtnId").addEventListener('touchend', onTouchEnd);                
                //每次说话
                setTimeout(function() {
                    $(".voiceView").find("label").removeClass("displayNone").html(result);
                    strAnimate("请按下说话!");
                }, 1000);
            }
        } else {
            result = handleString(result);
            $(".voiceView").find("h2").html(voiceString + (window.localStorage.languageList == "0" ? "指令异常，执行失败" : " Instruction exception, execution failure!"));
            document.getElementById("videoContentBtnId").addEventListener('touchstart', onTouchStart);
            document.getElementById("videoContentBtnId").addEventListener('touchend', onTouchEnd);
        }
    }

    function _error(qXHR, textStatus, errorThrown) {
        $(".voiceView").find("h2").html("<span>服务器出错！</span>");
        document.getElementById("videoContentBtnId").addEventListener('touchstart', onTouchStart);
        document.getElementById("videoContentBtnId").addEventListener('touchend', onTouchEnd);
    }
}
//处理字符串
function handleString(str) {
    var result = str;
    result = result.replace("未识别语音,内容", "");
    result = result.replace("已处理语音,内容", "");
    result = result.replace("---", "");
    result = result.replace("。", "");
    return result;
}

function microsoftSpeech(dt) {
    callbackVoiceXFData(dt);
}

function ajaxServiceSendVoice(_type, _url, _asycn, _data, _success, _error) {
    var ajaxs = $.ajax({
        type: _type,
        url: _url,
        timeout: 5000,
        async: _asycn,
        data: _data,
        success: _success,
        error: _error,
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
        }
    });
}
//key或者授权过期提示
function voiceErrorAlert() {
    $(".voiceView").find("h2").html("<span>" + window.localStorage.languageList == "0" ? "keys值错误或者授权过期" : "Key value error or authorization expiration" + "</span>");
    isVoices = false;
    //移除监听
    document.getElementById("videoContentBtnId").removeEventListener('touchstart', onTouchStart);
    document.getElementById("videoContentBtnId").removeEventListener('touchend', onTouchEnd);
    // 监听
    document.getElementById("videoContentBtnId").addEventListener('touchstart', onTouchStart);
    document.getElementById("videoContentBtnId").addEventListener('touchend', onTouchEnd);
}