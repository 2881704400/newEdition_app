var saveSuccess = tipsFunction("保存成功");
var saveFailed = tipsFunction("保存失败");
var operationSuccess = tipsFunction("操作成功");
var operationFailed = tipsFunction("操作失败");
// 报警排表
var groupNameToast = tipsFunction("分组名不能为空");
var groupEquipNameToast = tipsFunction("分组设备不能为空");
var groupNameRepeatToast = tipsFunction("分组名不能重复");
// ppt
var noData = tipsFunction("没有检测到PPT文件");

// 2s提示
function tipsFunction(msg) {
    return myApp.toast.create({
        text: msg,
        position: 'center',
        closeTimeout: 2000
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
//模拟加载
var loadStr;
function loadFun() {
    try {
        clearInterval(loadStr);
    } catch (e) {}
    myApp.dialog.progress((window.localStorage.languageList == 1 ? '<a style="font-size: 1rem">Loading...</a>' : '<a style="font-size: 1rem">加载中...</a>'));
    loadStr = setTimeout(function() {
        myApp.dialog.close();
    }, 500);
}
function loadStart() {
    myApp.dialog.progress((window.localStorage.languageList == 1 ? '<a style="font-size: 1rem">Loading...</a>' : '<a style="font-size: 1rem">加载中...</a>'));
}
function loadEnd() {
    myApp.dialog.close();
}