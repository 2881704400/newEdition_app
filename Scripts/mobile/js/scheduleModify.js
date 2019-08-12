var indexAll = 0,
    allEquip = [],
    allGroupEqup = [],
    colnum = "#",
    msgArray = [],
    scheduleWeek = ["每天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
    scheduleType = ["周排表", "特定排表"],
    scheduleModifyTooip, successfulPreservation, delSuccess, saveFailed; //1更新\2插入
function scheduleModify() {
    var chatObject = myApp.views.main.history,
        urlLength = chatObject.length - 1,
        receiveUser = chatObject[urlLength].split("?")[1];
    msgArray.length = 0;
    msgArray = receiveUser.split("&");
    colnum = "#";
    indexAll = isArray("index", msgArray);
    $(".scheduleModify-title").text(isArray("title", msgArray));
    switch (isArray("table", msgArray)) {
        case "schedule_user":
            $(".scheduleModifyContainer_user").removeClass("displayNone").siblings().addClass("displayNone");
            break;
        case "schedule_equip":
            $(".scheduleModifyContainer_equipgroup").removeClass("displayNone").siblings().addClass("displayNone");
            newlyBuildEquip(isArray("equipcomb", msgArray));
            break;
        case "schedule_administartor":
            $(".scheduleModifyContainer_administartor").removeClass("displayNone").siblings().addClass("displayNone");
            aminitsrator_view();
            break;
        case "schedule_specificDate":
            $(".scheduleModifyContainer_specificDate").removeClass("displayNone").siblings().addClass("displayNone");
            getUser();
            scheduleSpecificInit();
            break;
        case "schedule_weeklytable":
            $(".scheduleModifyContainer_weeklytable").removeClass("displayNone").siblings().addClass("displayNone");
            scheduleWeeklyInit();
            break;
        case "equipLinkage_edit_modify":
            $(".equipLinkage_edit_modify").removeClass("displayNone").siblings().addClass("displayNone");
            if (window.localStorage.sceneName) msgArray[msgArray.length - 1] = "currentTxt=" + window.localStorage.sceneName;
            initSceneList_view();
            break;
        case "NewlyBuildTable": //新建排表
            $(".NewlyBuildTable").removeClass("displayNone").siblings().addClass("displayNone");
            getUser();
            break;
        case "NewlyBuildTableUser":
            $(".NewlyBuildTableUser").removeClass("displayNone").siblings().addClass("displayNone");
            break;
        case "UserEdit":
            $(".NewlyBuildTableUser-udate").removeClass("displayNone").siblings().addClass("displayNone");
            editUserInit();
            break;
        case "NewlyBuildTableGroup":
            $(".NewlyBuildTableGroup").removeClass("displayNone").siblings().addClass("displayNone");
            selectAllEquip();
            $(".NewlyBuildTableGroup-equip").unbind().bind("click", function() {
                dataSelect(this, allEquip);
            });
            break;
        case "GroupEditInit":
            $(".GroupEdit").removeClass("displayNone").siblings().addClass("displayNone");
            selectAllEquip();
            GroupEditInit();
            break;
        case "NewlyBuildTableScopeInit":
            $(".NewlyBuildTableScope").removeClass("displayNone").siblings().addClass("displayNone");
            NewlyBuildTableScopeInit();
            break;
        case "NewlyBuildTableScopeEdit":
            $(".NewlyBuildTableScopeEdit").removeClass("displayNone").siblings().addClass("displayNone");
            $(".NewlyBuildTableScopeEdit-name-ud").val(isArray("Administrator", msgArray));
            $(".NewlyBuildTableScopeEdit-equip-ud").val(isArray("group_no_name", msgArray)).attr("group_no", isArray("group_no", msgArray));
            NewlyBuildTableScopeInit();
            break;
        default:
            break;
    }
    // 提示
    scheduleModifyTooip = window.localStorage.languageList == 1 ? myApp.toast.create({
        text: "Please enter the scenario name",
        position: 'center',
        closeTimeout: 2000,
    }) : myApp.toast.create({
        text: "请输入你的场景名称",
        position: 'center',
        closeTimeout: 2000,
    });
    successfulPreservation = window.localStorage.languageList == 1 ? myApp.toast.create({
        text: "Save successfully",
        position: 'center',
        closeTimeout: 2000,
    }) : myApp.toast.create({
        text: "保存成功",
        position: 'center',
        closeTimeout: 2000,
    });
    delSuccess = window.localStorage.languageList == 1 ? myApp.toast.create({
        text: "Successful deletion",
        position: 'center',
        closeTimeout: 2000,
    }) : myApp.toast.create({
        text: "删除成功",
        position: 'center',
        closeTimeout: 2000,
    });
    scheduleModifyInputTooip = window.localStorage.languageList == 1 ? myApp.toast.create({
        text: "Scenario names cannot be repeated",
        position: 'center',
        closeTimeout: 2000,
    }) : myApp.toast.create({
        text: "名称不能重复",
        position: 'center',
        closeTimeout: 2000,
    });
    saveFailed = window.localStorage.languageList == 1 ? myApp.toast.create({
        text: "Save failed",
        position: 'center',
        closeTimeout: 2000,
    }) : myApp.toast.create({
        text: "保存失败",
        position: 'center',
        closeTimeout: 2000,
    });
}

function isArray(str, arrayStr) {
    for (var i = 0; i < arrayStr.length; i++) {
        if (str == arrayStr[i].split("=")[0]) {
            return arrayStr[i].split("=")[1];
        }
    }
}
//人员初始化
var schedule_public_username = [];

function getUser() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_AdministratorData", {
        data: {
            getDataTable: "0"
        }
    })).done(function(data) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code,
            html = "";
        if (code == 200) {
            schedule_public_username = arrayLike;
            $(".NewlyBuildTable-name,.NewlyBuildTable-type,.NewlyBuildTable-week").unbind().bind("click", function() {
                if ($(this).hasClass("NewlyBuildTable-name")) {
                    dataSelect(this, arrayLike);
                } else if ($(this).hasClass("NewlyBuildTable-type")) {
                    dataSelect(this, scheduleType);
                } else if ($(this).hasClass("NewlyBuildTable-week")) {
                    dataSelect(this, scheduleWeek);
                }
            });
            $(".NewlyBuildTable-name").val(arrayLike[0].Administrator);
            $(".NewlyBuildTable-type").val(scheduleType[0]);
            $(".NewlyBuildTable-week").val(scheduleWeek[0]);
        }
    }).fail(function(e) {});
}
//添加人员信息
function addUserInfo() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/insertEquipGroup", {
        getDataTable: "Administrator",
        Administrator: $(".NewlyBuildTableUser-name").val(),
        Telphone: $(".NewlyBuildTableUser-phone").val(),
        MobileTel: $(".NewlyBuildTableUser-msn").val(),
        EMail: $(".NewlyBuildTableUser-email").val(),
        AckLevel: parseInt($(".NewlyBuildTableUser-level").val()),
    })).done(function(data) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code,
            html = "";
        if (code == 200) {
            $(".NewlyBuildTableUser-name").val("");
            $(".NewlyBuildTableUser-phone").val("");
            $(".NewlyBuildTableUser-msn").val("");
            $(".NewlyBuildTableUser-email").val("");
            $(".NewlyBuildTableUser-level").val("");
            successfulPreservation.open();
        } else saveFailed.open();
    }).fail(function(e) {
        saveFailed.open();
    });
}
//编辑人员信息
function editUserInit() {
    $(".NewlyBuildTableUser-name-ud").val(isArray("name", msgArray));
    $(".NewlyBuildTableUser-phone-ud").val(isArray("phone", msgArray));
    $(".NewlyBuildTableUser-msn-ud").val(isArray("msn", msgArray));
    $(".NewlyBuildTableUser-email-ud").val(isArray("email", msgArray));
    $(".NewlyBuildTableUser-level-ud").val(isArray("level", msgArray));
}
//更新人员信息
function updateUserInfo() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updateEquipGroup", {
        getDataTable: "Administrator",
        Administrator: $(".NewlyBuildTableUser-name-ud").val(),
        Telphone: $(".NewlyBuildTableUser-phone-ud").val(),
        MobileTel: $(".NewlyBuildTableUser-msn-ud").val(),
        EMail: $(".NewlyBuildTableUser-email-ud").val(),
        AckLevel: parseInt($(".NewlyBuildTableUser-level-ud").val()),
        ifName: "Administrator",
        ifValue: $(".NewlyBuildTableUser-name-ud").val()
    })).done(function(data) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code,
            html = "";
        if (code == 200) {
            successfulPreservation.open();
        } else saveFailed.open();
    }).fail(function(e) {
        saveFailed.open();
    });
}
//人员删除
function delUser() {
    myApp.dialog.confirm("是否删除该人员", "提示", function() {
        $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/deleteEquipGroup", {
            getDataTable: "Administrator",
            ifName: "Administrator",
            ifValue: $(".NewlyBuildTableUser-name-ud").val(),
            type: "string"
        })).done(function(data) {
            let arrayLike = data.HttpData.data,
                code = data.HttpData.code,
                html = "";
            if (code == 200) {
                delSuccess.open();
                myApp.views.main.router.back();
            } else saveFailed.open();
        }).fail(function(e) {
            saveFailed.open();
        });
    });
}
//新增分组
function NewlyBuildTableGroup() {
    
    var maxVal = 0,group_name = $(".NewlyBuildTableGroup-name").val(),
        colnumStr = $(".NewlyBuildTableGroup-equip").attr("colnum"),
        group_equip = $(".NewlyBuildTableGroup-equip").val(),
        group_repeat = groupManagementArray.some((item,index)=>{
            return group_name == item.group_name;
        });
    if(!group_name)
    {
        groupNameToast.open();
        return;
    }
    else if(!group_equip)
    {
        groupEquipNameToast.open();
        return;
    }
    else if(group_repeat){
        groupNameRepeatToast.open();
        return;
    }    
    if (colnumStr) colnumStr = colnumStr.substr(0, colnumStr.length - 1);
    allGroupEqup.forEach((item, index) => {
        let num = parseInt(item.group_no);
        num > maxVal ? maxVal = num : "";
    });
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/insertsEquipGroup", {
        group_no: maxVal + 1,
        group_name: group_name,
        equipcomb: colnumStr
    })).done(function(data) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code,
            html = "";
        if (code == 200) {
            successfulPreservation.open();
        } else saveFailed.open();
    }).fail(function(e) {
        saveFailed.open();
    });
}
//编辑分组初始化
function GroupEditInit() {
    colnum = (isArray("equipcomb", msgArray) ? isArray("equipcomb", msgArray) : "");
    $(".NewlyBuildTableGroup-name-ud").val(isArray("group_name", msgArray));
    $(".NewlyBuildTableGroup-equip-ud").attr("colnum", colnum + "#");
    if (colnum) {
        console.log(colnum);
        $(".NewlyBuildTableGroup-equip-ud").val(colnum.split("#").length - 1 + " 台");
        colnum = colnum + "#";
    } else $(".NewlyBuildTableGroup-equip-ud").val("0 台");
    $(".NewlyBuildTableGroup-equip-ud").unbind().bind("click", function() {
        dataSelect(this, allEquip);
    });
}
//分组更新
function groupEdit() {
    var colnumStr = $(".NewlyBuildTableGroup-equip-ud").attr("colnum");
    if (colnumStr) colnumStr = colnumStr.substr(0, colnumStr.length - 1)
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updatesEquipGroup", {
        group_name: $(".NewlyBuildTableGroup-name-ud").val(),
        equipcomb: colnumStr,
        group_no: isArray("group_no", msgArray)
    })).done(function(data) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code;
        if (code == 200) {
            successfulPreservation.open();
        } else saveFailed.open();
    }).fail(function(e) {
        saveFailed.open();
    });
}
//分组删除
function delGroupEdit() {


    myApp.dialog.create({
        title: window.localStorage.languageList == 1 ? "Tips" : "提示",
        text: "确认删除该分组?",
        buttons: [{
            text: window.localStorage.languageList == 1 ? "Cancel" : "取消"
        }, {
            text: window.localStorage.languageList == 1 ? "confirm" : "确定",
            onClick: function() {
                $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/delEquipGroup", {
                    group_no: isArray("group_no", msgArray)
                })).done(function(data) {
                    let arrayLike = data.HttpData.data,
                        code = data.HttpData.code;
                    if (code == 200) {
                        successfulPreservation.open();
                    } else saveFailed.open();
                }).fail(function(e) {
                    saveFailed.open();
                });
            }
        }]
    }).open();




}
//新增分组中--查询所有设备
function selectAllEquip() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_EquipData"), AlarmCenterContext.post("/api/GWServiceWebAPI/get_EquipGroupData")).done(function(data, l) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code,
            arrayLike_l = l.HttpData.data,
            code_l = l.HttpData.code;
        if (code == 200 && code_l == 200) {
            allEquip = arrayLike;
            allGroupEqup = arrayLike_l;
        }
    }).fail(function(e) {});
}
//新建管理范围初始化
function NewlyBuildTableScopeInit() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_AdministratorData", {
        data: {
            getDataTable: "0"
        }
    }), AlarmCenterContext.post("/api/GWServiceWebAPI/get_EquipGroupData")).done(function(data, l) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code,
            arrayLike_l = l.HttpData.data,
            code_l = l.HttpData.code;
        if (code == 200) {
            $(".NewlyBuildTableScope-name,.NewlyBuildTableScope-equip,.NewlyBuildTableScopeEdit-equip-ud").unbind().bind("click", function() {
                if ($(this).hasClass("NewlyBuildTableScope-name")) dataSelect(this, arrayLike);
                else dataSelect(this, arrayLike_l);
            });
        }
    }).fail(function(e) {});
}
//管理范围新建
function NewlyBuildTableScope() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/insertsAlmReport", {
        group_no: $(".NewlyBuildTableScope-equip").attr("group_no"),
        Administrator: $(".NewlyBuildTableScope-name").val()
    })).done(function(data) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code;
        if (code == 200) {
            successfulPreservation.open();
        } else saveFailed.open();
    }).fail(function(e) {
        saveFailed.open();
    });
}
//管理范围编辑
function editScope() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updatesAlmReport", {
        group_no: $(".NewlyBuildTableScopeEdit-equip-ud").attr("group_no"),
        Administrator: $(".NewlyBuildTableScopeEdit-name-ud").val(),
        id: isArray("id", msgArray)
    })).done(function(data) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code;
        if (code == 200) {
            successfulPreservation.open();
        } else saveFailed.open();
    }).fail(function(e) {
        saveFailed.open();
    });
}
//管理范围删除
function delScope() {
    myApp.dialog.create({
        title: window.localStorage.languageList == 1 ? "Tips" : "提示",
        text: "确认删除该范围?",
        buttons: [{
            text: window.localStorage.languageList == 1 ? "Cancel" : "取消"
        }, {
            text: window.localStorage.languageList == 1 ? "confirm" : "确定",
            onClick: function() {
                $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/delAlmReport", {
                    group_no: $(".NewlyBuildTableScopeEdit-equip-ud").attr("group_no"),
                    Administrator: $(".NewlyBuildTableScopeEdit-name-ud").val(),
                    id: isArray("id", msgArray)
                })).done(function(data) {
                    let arrayLike = data.HttpData.data,
                        code = data.HttpData.code;
                    if (code == 200) {
                        successfulPreservation.open();
                    } else saveFailed.open();
                }).fail(function(e) {
                    saveFailed.open();
                });
            }
        }]
    }).open();
}
//底部弹窗
function dataSelect(dt, arry) {
    myApp.sheet.create({
        content: `
       <div class="sheet-modal my-sheet-swipe-to-step fm-modal equipSelectSheet" style="height:50%; --f7-sheet-bg-color: #fff;">
          <div class="sheet-modal-inner">
            <div class="sheet-modal-swipe-step">
              <div class="display-flex padding justify-content-space-between align-items-center header_center_gray">
                 <div></div>
              </div>
            </div> 
            <div class="block-title block-title-medium margin-top title_2" style="">请选择输入</div>
            <hr class="transform-05"/>        
            <div class="no-hairlines">
                <div class="row">${getEquipData(dt,arry)}</div> 
            </div>
          </div>
        </div>`,
        // Events
        on: {
            open: function(sheet) {},
            opened: function(sheet) {
                $(".equipSelectSheet div.no-hairlines a").unbind().bind("click", function() {
                    //选择
                    if ($(dt).hasClass("NewlyBuildTableGroup-equip") || $(dt).hasClass("NewlyBuildTableGroup-equip-ud")) //新建分组管理
                    {
                        if ($(this).hasClass("selectedBgColor")) {
                            if (colnum.indexOf("#" + $(this).attr("equip_no") + "#") != -1) {
                                colnum = colnum.replace("#" + $(this).attr("equip_no") + "#", "#");
                            }
                            $(this).removeClass("selectedBgColor");
                        } else {
                            colnum += ($(this).attr("equip_no") + "#");
                            $(this).addClass("selectedBgColor");
                        }
                        $(dt).val($(".selectedBgColor").length + " 台").attr("colnum", colnum);
                    } else if ($(dt).hasClass("NewlyBuildTableScope-equip") || $(dt).hasClass("NewlyBuildTableScopeEdit-equip-ud")) { //新建管理范围
                        $(this).addClass("selectedBgColor").siblings().removeClass("selectedBgColor");
                        $(dt).val($(this).text()).attr("group_no", $(this).attr("group_no"));
                    }
                    // else if($(dt).hasClass("scheduleModifyContainer_specificDate_wk")){ //周排表
                    //     $(this).addClass("selectedBgColor").siblings().removeClass("selectedBgColor");
                    //     $(dt).attr("week",weekReturn($(this).text())).val($(this).text());
                    // }
                    else if (!$(this).hasClass("selectedBgColor")) {
                        $(this).addClass("selectedBgColor").siblings().removeClass("selectedBgColor");
                        $(dt).val($(this).text());
                    }
                    //新建周排表和特定排表切换
                    if ($(this).text() == "周排表" && $(dt).hasClass("NewlyBuildTable-type")) {
                        $(".NewlyBuildTable-time-week").removeClass("displayNone");
                        $(".NewlyBuildTable-time-spe").addClass("displayNone");
                    } else if ($(dt).hasClass("NewlyBuildTable-type")) {
                        $(".NewlyBuildTable-time-week").addClass("displayNone");
                        $(".NewlyBuildTable-time-spe").removeClass("displayNone");
                        $(".NewlyBuildTable-stime-spe").val(GetDateHandle(new Date(), 0) + " 00:00:00");
                        $(".NewlyBuildTable-etime-spe").val(GetDateHandle(new Date(), 0) + " 23:59:59");
                    }
                });
                //初始化 
                if ($(dt).hasClass("NewlyBuildTableGroup-equip") || $(dt).hasClass("NewlyBuildTableGroup-equip-ud")) {
                    var str = $(dt).attr("colnum");
                    if (str) {
                        str = str.split("#");
                        str.forEach((item, index) => {
                            if (item) $('.equipSelectSheet div.no-hairlines a[equip_no="' + item + '"]').addClass("selectedBgColor");
                        });
                    }
                }
            },
        },
        swipeToClose: false,
        swipeToStep: false,
        backdrop: true,
    }).open();
}

function getEquipData(dt, arry) {
    var l_html = "";
    if ($(dt).hasClass("NewlyBuildTableGroup-equip") || $(dt).hasClass("NewlyBuildTableGroup-equip-ud")) arry.forEach(function(item, index) {
        l_html += `<a href="#" class="col-33" equip_no="${item.equip_no}" colnum="">${item.equip_nm}</a>`;
    });
    else if ($(dt).hasClass("NewlyBuildTableScope-equip") || $(dt).hasClass("NewlyBuildTableScopeEdit-equip-ud")) {
        arry.forEach(function(item, index) {
            l_html += `<a href="#" class="col-33" group_no="${item.group_no}" colnum="${item.equipcomb}">${item.group_name}</a>`;
        });
    } else {
        arry.forEach(function(item, index) {
            l_html += `<a href="#" class="col-33" >${item.Administrator?item.Administrator: item}</a>`;
        });
    }
    return l_html + `<a href="#" class="col-33 opacity"></a><a href="#" class="col-33 opacity"></a>`;
}

//周排表html
function scheduleSpecificInit() {
    $(".scheduleModifyContainer_specificDate_wk").val(weekReturn(parseInt(isArray("week", msgArray)))).attr("week", isArray("week", msgArray));
    $(".scheduleModifyContainer_specificDate_username").val(isArray("name", msgArray));
    $(".scheduleModifyContainer_specificDate_stime").val(isArray("stime", msgArray) ? isArray("stime", msgArray) : "00:00");
    $(".scheduleModifyContainer_specificDate_etime").val(isArray("etime", msgArray) ? isArray("etime", msgArray) : "00:00");
    $(".linkageBtn a").attr("data-id", isArray("id", msgArray));
    $(".scheduleModifyContainer_specificDate_wk,.scheduleModifyContainer_specificDate_username").unbind().bind("click", function() {
        if ($(this).hasClass("scheduleModifyContainer_specificDate_username")) {
            dataSelect(this, schedule_public_username);
        } else if ($(this).hasClass("scheduleModifyContainer_specificDate_wk")) {
            dataSelect(this, scheduleWeek);
        }
    });
}

function updateWeekAlmReport(that) {
    let WeekAlmReportInsert = {
        Administrator: $(".scheduleModifyContainer_specificDate_username").val(),
        week_day: weekReturn($(".scheduleModifyContainer_specificDate_wk").val()),
        begin_time: $(".scheduleModifyContainer_specificDate_stime").val(),
        end_time: $(".scheduleModifyContainer_specificDate_etime").val(),
        id: $(that).attr("data-id")
    };
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updateWeekAlmReport", WeekAlmReportInsert)).done(function(data) {
        let arrayLike = data.HttpStatus;
        if (arrayLike == 200 && data.HttpData.data != 0) {
            successfulPreservation.open();
        } else {}
    }).fail(function(e) {});
}

function delWeekAlmReport(that) {
    myApp.dialog.create({
        title: window.localStorage.languageList == 1 ? "Tips" : "提示",
        text: "确认删除该项?",
        buttons: [{
            text: window.localStorage.languageList == 1 ? "Cancel" : "取消"
        }, {
            text: window.localStorage.languageList == 1 ? "confirm" : "确定",
            onClick: function() {
                let WeekAlmReportInsert = {
                    id: $(that).attr("data-id")
                };
                $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/delWeekAlmReport", WeekAlmReportInsert)).done(function(data) {
                    let arrayLike = data.HttpStatus;
                    if (arrayLike == 200 && data.HttpData.data != 0) {
                        delSuccess.open();
                    } else {}
                }).fail(function(e) {});
            }
        }]
    }).open();
}
//特定排表
function scheduleWeeklyInit() {
    $(".scheduleModifyContainer_weeklytable_username").val(isArray("name", msgArray));
    $(".scheduleModifyContainer_weeklytable_stime").val(isArray("stime", msgArray) ? isArray("stime", msgArray) : "00:00");
    $(".scheduleModifyContainer_weeklytable_etime").val(isArray("etime", msgArray) ? isArray("etime", msgArray) : "00:00");
    $(".linkageBtn a").attr("data-id", isArray("id", msgArray));
}

function updateSpeAlmReport(that) {
    let WeekAlmReportInsert = {
        Administrator: $(".scheduleModifyContainer_weeklytable_username").val(),
        begin_time: $(".scheduleModifyContainer_weeklytable_stime").val(),
        end_time: $(".scheduleModifyContainer_weeklytable_etime").val()
    };
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updateSpeAlmReport", WeekAlmReportInsert)).done(function(data) {
        let arrayLike = data.HttpStatus;
        if (arrayLike == 200 && data.HttpData.data != 0) {
            successfulPreservation.open();
        } else {}
    }).fail(function(e) {});
}

function delSpeAlmReport(that) {
    myApp.dialog.create({
        title: window.localStorage.languageList == 1 ? "Tips" : "提示",
        text: "确认删除该项?",
        buttons: [{
            text: window.localStorage.languageList == 1 ? "Cancel" : "取消"
        }, {
            text: window.localStorage.languageList == 1 ? "confirm" : "确定",
            onClick: function() {
                let WeekAlmReportInsert = {
                    id: $(that).attr("data-id")
                };
                $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/delSpeAlmReport", WeekAlmReportInsert)).done(function(data) {
                    let arrayLike = data.HttpStatus;
                    if (arrayLike == 200 && data.HttpData.data != 0) {
                        delSuccess.open();
                    } else {}
                }).fail(function(e) {});
            }
        }]
    }).open();
}
//报警排表和周排表插入
function scheduleInsertData(dt) {
    var url = "",
        isFlag = ($(".NewlyBuildTable-type").val() == "周排表");
    isFlag ? url = "/api/GWServiceWebAPI/insertWeekAlmReport" : url = "/api/GWServiceWebAPI/insertSpeAlmReport";
    let WeekAlmReportInsert = {
        Administrator: $(".NewlyBuildTable-name").val(),
        week_day: weekReturn($(".NewlyBuildTable-week").val()),
        begin_time: isFlag ? $(".NewlyBuildTable-stime").val() : $(".NewlyBuildTable-stime-spe").val(),
        end_time: isFlag ? $(".NewlyBuildTable-etime").val() : $(".NewlyBuildTable-etime-spe").val(),
    };
    $.when(AlarmCenterContext.post(url, WeekAlmReportInsert)).done(function(data) {
        let arrayLike = data.HttpStatus;
        if (arrayLike == 200 && data.HttpData.data != 0) {
            successfulPreservation.open();
        } else {}
    }).fail(function(e) {});
}
// 场景编辑
var sceneData = [],
    scaneEquipData = [];

function initSceneList_view() {
    var controlEquipList, setList, equipList;
    $(".equipLinkage_edit_modify>ul").html("");
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/getSetparmList", {
        data: {
            findEquip: false
        },
        async: false
    }), AlarmCenterContext.post("/api/GWServiceWebAPI/getEquipList", {
        data: {},
        async: false
    })).done(function(n, l) {
        let rt = n.HttpData,
            equipRt = l.HttpData;
        if (n.HttpData.code == 200 && l.HttpData.code == 200) {
            myApp.dialog.close();
            sceneData = rt.data, scaneEquipData = equipRt.data;
            setList = rt.data, equipList = equipRt.data;
            // 场景名称
            $("#equipLinkage_input").val(isArray("currentTxt", msgArray));
            //选择设备
            controlEquipList = setList.filter(item => {
                return (item.equip_no == isArray("equip_no", msgArray) && item.set_nm.trim() == isArray("currentTxt", msgArray).trim());
            }).map(item => {
                return item;
            });
            // 场景控制项
            if (sceneFlag) {
                var valueString = (controlEquipList.length > 0 ? controlEquipList[0].value.toString().trim() : ""),
                    valueArray = [];
                if (valueString) valueString.indexOf("+") != -1 ? valueArray = valueString.split("+") : valueArray.push(valueString);
                equiplinkageStr = valueArray.concat(equiplinkageStr);
                sceneFlag = false;
            }
            //移除删除场景控制项
            if (removeSceneControl.length > 0) removeSceneControl.forEach(function(item, index) {
                if (equiplinkageStr.indexOf(item) != -1) equiplinkageStr.splice(equiplinkageStr.indexOf(item), 1);
            });
            if (equiplinkageStr.length > 0) {
                var htmlContent = "";
                for (var i = 0; i < equiplinkageStr.length; i++) {
                    var equip_no_flg = true,
                        ValueFlag;
                    try {
                        ValueFlag = equiplinkageStr[i].indexOf(",");
                        ValueFlag != -1 ? equip_no_flg = true : equip_no_flg = false;
                    } catch (e) {}
                    htmlContent += `<li class="swipeout bottomBorderLine" equipcomb="${equiplinkageStr[i]}">
                        <div class="item-content swipeout-content schedule-content row no-gap" >
                            <div class="item-inner">
                              <div class="item-title">${i+1}、${(equip_no_flg?filterFun(equipList,equiplinkageStr[i].split(",")[0],null):(equiplinkageStr[i]?(window.localStorage.languageList == 1?"Interval operation":"间隔操作"):""))}: <strong>${(equip_no_flg?filterFun(setList,equiplinkageStr[i].split(",")[0],equiplinkageStr[i].split(",")[1]):(equiplinkageStr[i]?(window.localStorage.languageList == 1?"Delay interval":"延迟间隔")+equiplinkageStr[i]+(window.localStorage.languageList == 1?"Millisecond":"毫秒"):""))}</strong></div>
                              <div class="item-after" onclick="scenalControlPro(this)" index="${i}"><i class="icon iconfont iconjiantouarrow502"></i></div>
                            </div>
                        </div>
                        <div class="swipeout-actions-right">
                          <a href="#" class="delBtn" onclick="currentControl(this)" style="">${window.localStorage.languageList == 1?"Delete":"删除"}</a>
                        </div>
                      </li> `;
                }
                $(".equipLinkage_edit_modify>ul").append(htmlContent);
            }
        }
    }).fail(function(e) {
        myApp.dialog.close();
    });
}
//过滤函数
function filterFun(obj, selecet_equip_no, selecet_set_no) {
    if (selecet_set_no == null) return obj.filter(item => {
        return item.equip_no == selecet_equip_no;
    }).map(item => {
        return "" || item.equip_nm;
    });
    else return obj.filter(item => {
        return item.equip_no == selecet_equip_no && item.set_no == selecet_set_no;
    }).map(item => {
        return "" || item.set_nm;
    });
}
//保存场景
function submitScene(dt) {
    if (indexAll == 1) {
        let sceneName = $("#equipLinkage_input").val(),
            dataStr = "";
        if (!sceneName) scheduleModifyTooip.open();
        $(".equipLinkage_edit_modify ul li").each(function(item) {
            dataStr += ($(this).attr("equipcomb") + "+");
        });
        try {
            dataStr = dataStr.substr(0, dataStr.length - 1);
        } catch (e) {}
        let reqData = {
            equipNo: isArray("equip_no", msgArray),
            setNo: isArray("set_no", msgArray),
            sceneName: sceneName,
            dataStr: dataStr
        }
        $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updateScene", reqData)).done(function(n) {
            initSceneList();
            successfulPreservation.open();
        }).fail(function(e) {});
    } else {
        addScene();
    }
}
//添加场景
function addScene() {
    //场景名是否重复
    if (sceneData.some(item => {
            return item.set_nm === $("#equipLinkage_input").val();
        })) {
        scheduleModifyInputTooip.open();
        return false;
    }
    //场景设备号和设置号
    var equipNo = "",
        set_no = [],
        str = "";
    if (scaneEquipData.filter(equip => equip.communication_drv === 'GWChangJing.NET.dll').length > 0) {
        equipNo = scaneEquipData.filter(equip => equip.communication_drv === 'GWChangJing.NET.dll')[0].equip_no;
    }
    if (sceneData.length > 0) {
        var setParmList = sceneData.filter(equip => equip.equip_no === equipNo);
        if (setParmList.length > 0) {
            setParmList.forEach(function(item, index) {
                set_no.push(item.set_no);
            });
        }
    }
    //控制项
    $(".equipLinkage_edit_modify ul li").each(function(item) {
        str += ($(this).attr("equipcomb") + "+");
    });
    try {
        str = str.substr(0, str.length - 1);
    } catch (e) {}
    var sceneSetNo = set_no.length > 0 ? (Math.max.apply(null, set_no) + 1) : 1;
    let reqData = {
        title: $("#equipLinkage_input").val(),
        equipNo: equipNo,
        setNo: sceneSetNo,
        value: str,
    }
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/addScene", reqData)).done(function(n) {
        //更新
        if ($(".equipLinkage_edit_modify ul li").length > 0) {
            var dataStr = "";
            $(".equipLinkage_edit_modify ul li").each(function(item) {
                dataStr += ($(this).attr("equipcomb") + "+");
            });
            try {
                dataStr = dataStr.substr(0, dataStr.length - 1);
            } catch (e) {}
            let reqData = {
                equipNo: equipNo,
                setNo: sceneSetNo,
                sceneName: $("#equipLinkage_input").val(),
                dataStr: dataStr
            };
            $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updateScene", {
                data: reqData,
                async: false
            })).done(function(n) {
                initSceneList();
                successfulPreservation.open();
            }).fail(function(e) {});
        }
    }).fail(function(e) {});
}
//新增控制
function scenalControlPro(dt) {
    //场景名是否为空
    if ($("#equipLinkage_input").val().trim() == "") {
        myApp.dialog.alert(window.localStorage.languageList == 1 ? 'Please add the scene name first!' : '请先添加场景名称!', window.localStorage.languageList == 1 ? 'Tips' : '提示');
        return false;
    }
    window.localStorage.sceneName = $("#equipLinkage_input").val();
    if (indexAll == 1) {
        let val = $(dt).attr("index");
        myApp.views.main.router.navigate("/scheduleModifyChild/?" + val);
    } else {
        myApp.views.main.router.navigate("/scheduleModifyChild/?last");
    }
}
//新增控制初始化 
function scenalControlPro_init() {
    var controlEquipList, setList, equipList;
    $(".equipLinkage_edit_modify_child_equip").html("");
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/getSetparmList", {
        findEquip: false
    })).done(function(l) {
        let equipRt = l.HttpData;
        if (l.HttpData.code == 200) {
            var l_html = "";
            equipRt.data.forEach(function(item, index) {
                if (indexAll == 1) {
                    if (isArray("username", msgArray) == item.set_nm && isArray("equip_no", msgArray) == item.equip_no) l_html += `<option value="${item.set_nm}" combination="${item.equip_no},${item.set_no}" selected>${item.set_nm}</option>`;
                    else l_html += `<option value="${item.set_nm}" combination="${item.equip_no},${item.set_no}">${item.set_nm}</option>`;
                } else {
                    if (index == 0) l_html += `<option value="${item.set_nm}" combination="${item.equip_no},${item.set_no}" selected>${item.set_nm}</option>`;
                    else l_html += `<option value="${item.set_nm}" combination="${item.equip_no},${item.set_no}">${item.set_nm}</option>`;
                }
            });
            $(".equipLinkage_edit_modify_child_equip").html(l_html);
        }
    }).fail(function(e) {
        myApp.dialog.close();
    });
}
//删除当前控制项 
function currentControl(dt) {
    myApp.dialog.confirm(window.localStorage.languageList == 1 ? "Whether to delete the current control" : "是否删除当前项", window.localStorage.languageList == 1 ? "Tips" : "提示", function() {
        var that = $(dt).parent().parent();
        that.remove();
        removeSceneControl.push(that.attr("equipcomb"));
        // 序列化每项序号
        $(".equipLinkage_edit_modify>ul li").each(function(index) {
            $(this).find(".item-after").attr("index", index);
        });
    });
}