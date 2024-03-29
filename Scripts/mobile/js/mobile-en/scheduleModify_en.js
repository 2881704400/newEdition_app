var indexAll = 0,
    msgArray = [],
    scheduleModifyTooip, scheduleModifySuccessTooip; //1更新\2插入
function scheduleModify_en() {
    var chatObject = myApp.views.main.history,
        urlLength = chatObject.length - 1,
        receiveUser = chatObject[urlLength].split("?")[1];
    msgArray.length = 0;
    msgArray = receiveUser.split("&");
    if (isArray_en("index", msgArray) == 1) indexAll = 1;
    else indexAll = 2;
    $(".scheduleModify").html(isArray_en("title", msgArray));
    switch (isArray_en("table", msgArray)) {
        case "schedule_user":
            $(".scheduleModifyContainer_user").removeClass("displayNone").siblings().addClass("displayNone");
            if (indexAll == 1) {
                $(".schedule1_username").attr("disabled", true).val(isArray_en("schedule1_username", msgArray));
                $(".schedule1_hpone").val(isArray_en("schedule1_hpone", msgArray));
                $(".schedule1_msm").val(isArray_en("schedule1_msm", msgArray));
                $(".schedule1_email").val(isArray_en("schedule1_email", msgArray));
                $(".schedule1_level").val(isArray_en("schedule1_level", msgArray));
            }
            break;
        case "schedule_equip":
            $(".scheduleModifyContainer_equipgroup").removeClass("displayNone").siblings().addClass("displayNone");
            newlyBuildEquip_en(isArray_en("equipcomb", msgArray));
            break;
        case "schedule_administartor":
            $(".scheduleModifyContainer_administartor").removeClass("displayNone").siblings().addClass("displayNone");
            aminitsrator_view_en();
            break;
        case "schedule_specificDate":
            $(".scheduleModifyContainer_specificDate").removeClass("displayNone").siblings().addClass("displayNone");
            newlyBuildWeekAlmReport_view_en();
            break;
        case "schedule_weeklytable":
            $(".scheduleModifyContainer_weeklytable").removeClass("displayNone").siblings().addClass("displayNone");
            newlyBuildSpeAlmReport_view_en();
            break;
        case "equipLinkage_edit_modify":
            $(".equipLinkage_edit_modify").removeClass("displayNone").siblings().addClass("displayNone");
            if (window.localStorage.sceneName) msgArray[msgArray.length - 1] = "currentTxt=" + window.localStorage.sceneName;
            initSceneList_view_en();
            break;
        default:
            break;
    }
    // 提示
    scheduleModifyTooip = myApp.toast.create({
        text: "Please enter the scenario name",
        position: 'center',
        closeTimeout: 2000,
    });
    scheduleModifySuccessTooip = myApp.toast.create({
        text: "Save successfully",
        position: 'center',
        closeTimeout: 2000,
    });
    scheduleModifyInputTooip = myApp.toast.create({
        text: "Scenario names cannot be repeated",
        position: 'center',
        closeTimeout: 2000,
    });
}

function isArray_en(str, arrayStr) {
    for (var i = 0; i < arrayStr.length; i++) {
        if (str == arrayStr[i].split("=")[0]) {
            return arrayStr[i].split("=")[1];
        }
    }
}
//人员数据库表更新
function updateUserModify_en(that) {
    var dt = $(that).siblings("ul");
    let AdministratorUpdate = {
        getDataTable: "Administrator",
        Administrator: dt.find("input.schedule1_username").val(),
        Telphone: dt.find("input.schedule1_hpone").val(),
        MobileTel: dt.find("input.schedule1_msm").val(),
        EMail: dt.find("input.schedule1_email").val(),
        AckLevel: parseInt(dt.find("input.schedule1_level").val()),
        ifName: "Administrator",
        ifValue: dt.find("input.schedule1_username").val()
    };
    if (indexAll == 1) publicAjaxModify_en(AdministratorUpdate, "/api/GWServiceWebAPI/updateEquipGroup", 1);
    else publicAjaxModify_en(AdministratorUpdate, "/api/GWServiceWebAPI/insertEquipGroup", 1);
}
//人员表公共请求
function publicAjaxModify_en(jsonString, url, index) {
    var jsonData = {
        "url": url,
        "data": jsonString
    };
$.when(AlarmCenterContext.post(jsonData.url,jsonData.data)).done(function(data){
    let arrayLike = data.HttpStatus;
    if (arrayLike == 200 && data.HttpData.data != 0) {
        scheduleAlertSusscess.open();
        switch (index) {
            case 1:
                requestUser_en();
                break;
            case 2:
                requestEquipGroup_en();
                break;
            case 3:
                requestAlmReport_en(requestEGAReport);
                break;
            case 4:
                requestWeekAlmReport_en();
                break;
            case 5:
                requestSpeAlmReport_en();
                break;
            default:
                break;
        }
    } else {
        scheduleAlert.open();
    }
}).fail(function(e){
 scheduleAlert.open();
});


}
//设备分组
var currentArray = [];

function newlyBuildEquip_en(str) {
    currentArray.length = 0;
    var jsonData = {
        "url": "/api/GWServiceWebAPI/get_EquipData",
        "data": {
            getDataTable: ""
        }
    };
    $.when(AlarmCenterContext.post(jsonData.url,jsonData.data)).done(function(data){
            let arrayLike = data.HttpData.data,
                code = data.HttpData.code;
            var item = "",
                html = '<div class="allSelect"><label class="item-checkbox item-content" onclick="allSelectEquip_en()">' + '<input type="checkbox" name="checkbox" >' + '<i class="icon icon-checkbox"></i>' + '<div class="item-inner">' + '<div class="item-title">全选</div>' + '</div>' + '</label></div>' + '<ul class="equipTypeSelect">';
            if (code == 200) {
                var AlarmTabulateLenth = arrayLike.length;
                for (var i = 0; i < AlarmTabulateLenth; i++) {
                    let checkboxSet = "";
                    for (var j = 0; j < coutResult.length; j++) {
                        if (coutResult[j] == arrayLike[i].equip_no) {
                            currentArray.push(arrayLike[i].equip_no);
                            checkboxSet = "checked";
                        }
                    }
                    html += '<li class="">' + '<label class="item-checkbox item-content bottomBorderLine" onclick="actionString_en(this)" equip_no="' + arrayLike[i].equip_no + '">' + '<input type="checkbox" name="checkbox-' + i + '"  value="' + arrayLike[i].equip_nm + '" ' + checkboxSet + '>' + '<i class="icon icon-checkbox"></i>' + '<div class="item-inner">' + '<div class="item-title">' + arrayLike[i].equip_nm + '</div>' + '</div>' + '</label>' + '</li>';
                }
                $(".scheduleModifyContainer_equipgroup>div").append(html + '</ul>');
                // 判断是否全选
                if (currentArray.length == $(".equipTypeSelect li").length) $(".allSelect input").prop("checked", true);
                else $(".allSelect input").prop("checked", false);
            } else {
                newlyBuildEquip_en(that);
                return false;
            }
    }).fail(function(e){
     scheduleAlert.open();
    });

    var coutResult;
    str ? coutResult = str.split("#") || "#" : coutResult = "#";


}

function actionString_en(dt) {
    !$(dt).find("input").is(':checked') ? currentArray.push($(dt).attr("equip_no")) : currentArray.splice(currentArray.indexOf($(dt).attr("equip_no")), 1);
    if (currentArray.length == $(".equipTypeSelect li").length) $(".allSelect input").prop("checked", true);
    else $(".allSelect input").prop("checked", false);
}
//设备更新添加
function updateEquip_en(that) {
    var dt = $(that).siblings("div");
    if (indexAll == 1) {
        let updateJson = {
            getDataTable: "EquipGroup",
            equipcomb: currentArray.length > 0 ? "#" + currentArray.join("#") : "#",
            group_name: isArray_en("currentTxt", msgArray),
            ifValue: isArray_en("group_no", msgArray)
        };
        publicAjaxModify_en(updateJson, "/api/GWServiceWebAPI/updateEquipGroup", 2);
    } else {
        var NewLineVal, NewLineArray = [];
        $("#schedule_equip").find("li").each(function(index) {
            NewLineArray.push($(this).find("div.equipGroupInput span").attr("group_no"));
        });
        NewLineVal = NewLineArray.length == 0 ? 1 : Math.max.apply(null, NewLineArray) + 1;
        let insertJson = {
            getDataTable: "EquipGroup",
            groupName: "New projects",
            groupNo: NewLineVal
        };
        publicAjaxModify_en(insertJson, "/api/GWServiceWebAPI/insertEquipGroup", 2);
    }
}
//全选
function allSelectEquip_en() {
    currentArray.length = 0;
    if (!$(".allSelect").find("input").is(':checked')) {
        $(".equipTypeSelect li").each(function(i) {
            $(this).find("input").prop("checked", true);
            currentArray.push($(this).find("label").attr("equip_no"));
        });
    } else {
        $(".equipTypeSelect li").each(function(i) {
            $(this).find("input").prop("checked", false);
            currentArray.length = 0;
        });
    }
}
//处理equipcomb
var groupNOArray = [];

function allEquipCom_en(dt, value) {
    $(dt).parent().next().find("li").each(function(index) {
        groupNOArray.push($(this).find("label").attr("equip_no"));
    });
    if (value == 1) {
        $(that_parent).attr("equipcomb", "#");
    } else {
        $(that_parent).attr("equipcomb", "#" + groupNOArray.join("#") + "#");
    }
}
//管理范围
function aminitsrator_view_en() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_AdministratorData", {
        getDataTable: "0"
    }), AlarmCenterContext.post("/api/GWServiceWebAPI/get_EquipGroupData", {
        getDataTable: "0"
    })).done(function(n, l) {
        var n_result = n.HttpData,
            l_result = l.HttpData;
        if (n_result.code == 200 && l_result.code == 200) {
            $(".scheduleModifyContainer_administartor_user,.scheduleModifyContainer_administartor_group").html("");
            var n_html = "",
                l_html = "";
            n_result.data.forEach(function(item, index) {
                if (indexAll == 1) {
                    if (isArray_en("username", msgArray) == item.Administrator) n_html += `<option value="male" selected>${item.Administrator}</option>`;
                    else n_html += `<option value="male">${item.Administrator}</option>`;
                } else {
                    if (index == 0) n_html += `<option value="male" selected>${item.Administrator}</option>`;
                    else n_html += `<option value="male">${item.Administrator}</option>`;
                }
            });
            l_result.data.forEach(function(item, index) {
                if (indexAll == 1) {
                    if (isArray_en("groupname", msgArray) == item.group_name) l_html += `<option value="${item.group_name}" selected group_no="${item.group_no}">${item.group_name}</option>`;
                    else l_html += `<option value="${item.group_name}" group_no="${item.group_no}">${item.group_name}</option>`;
                } else {
                    if (index == 0) l_html += `<option value="${item.group_name}" selected group_no="${item.group_no}">${item.group_name}</option>`;
                    else l_html += `<option value="${item.group_name}" group_no="${item.group_no}">${item.group_name}</option>`;
                }
            });
            $(".scheduleModifyContainer_administartor_user").html(n_html);
            $(".scheduleModifyContainer_administartor_group").html(l_html);
        } else {
            scheduleAlert.open();
        }
    }).fail(function(e) {});
}
//设备更新添加
function updateAlmReport_en(that) {
    var weekID = getMaxId_en("schedule_administartor"); //获取新建id主键
    var dt = $(that).parent().prev();
    if (indexAll == 1) {
        let updateJson = {
            getDataTable: "AlmReport",
            group_no: $(".scheduleModifyContainer_administartor_group ").find("option:selected").attr("group_no"),
            Administrator: $(".scheduleModifyContainer_administartor_user").find("option:selected").text(),
            ifValue: isArray_en("dataid", msgArray),
        };
        publicAjaxModify_en(updateJson, "/api/GWServiceWebAPI/updateEquipGroup", 3);
    } else {
        let insertJson = {
            getDataTable: "AlmReport",
            group_no: $(".scheduleModifyContainer_administartor_group").find("option:selected").attr("group_no"),
            Administrator: $(".scheduleModifyContainer_administartor_user").find("option:selected").text(),
            ifValue: weekID
        };
        publicAjaxModify_en(insertJson, "/api/GWServiceWebAPI/insertEquipGroup", 3);
    }
}
//最大ID添加1
function getMaxId_en(id) {
    var parentDt = $("#" + id).find("ul"),
        arrayIndex = [];
    parentDt.find("li").each(function(index) {
        arrayIndex.push($(this).attr("dataid"));
    });
    return arrayIndex.length == 0 ? 1 : Math.max.apply(null, arrayIndex) + 1;
}
//周排表html
function newlyBuildWeekAlmReport_view_en() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_AdministratorData", {
        getDataTable: "0"
    })).done(function(n) {
        var n_result = n.HttpData;
        if (n_result.code == 200) {
            $(".scheduleModifyContainer_specificDate_username").html("");
            var n_html = "";
            n_result.data.forEach(function(item, index) {
                if (indexAll == 1) {
                    if (isArray_en("username", msgArray) == item.Administrator) n_html += `<option value="${item.Administrator}" selected>${item.Administrator}</option>`;
                    else n_html += `<option value="${item.Administrator}">${item.Administrator}</option>`;
                } else {
                    if (index == 0) n_html += `<option value="${item.Administrator}" selected>${item.Administrator}</option>`;
                    else n_html += `<option value="${item.Administrator}">${item.Administrator}</option>`;
                }
            });
            $(".scheduleModifyContainer_specificDate_wk").find("option:contains('" + isArray_en("week", msgArray) + "')").attr("selected", true);
            $(".scheduleModifyContainer_specificDate_username").html(n_html);
            $(".scheduleModifyContainer_specificDate_stime").val(isArray_en("stime", msgArray) ? isArray_en("stime", msgArray) : "00:00");
            $(".scheduleModifyContainer_specificDate_etime").val(isArray_en("etime", msgArray) ? isArray_en("etime", msgArray) : "00:00");
        } else {
            scheduleAlert.open();
        }
    }).fail(function(e) {});
}
//周排表更新
function updateWeekAlmReport_en(that) {
    var reg = /^(20|21|22|23|[0-1]\d):[0-5]\d$/,
        weekID, dt, week_day;
    if (!reg.test($(".scheduleModifyContainer_specificDate_stime").val()) || !reg.test($(".scheduleModifyContainer_specificDate_stime").val())) {
        scheduleTimeAlert("Error in time format").open();
        return;
    }
    if (parseInt($(".scheduleModifyContainer_specificDate_stime").val().replace(":", "")) > parseInt($(".scheduleModifyContainer_specificDate_stime").val().replace(":", ""))) {
        scheduleTimeAlert("The start time should not be greater than the end time.").open();
        return;
    }
    if (indexAll == 1) {
        weekID = isArray_en("dataid", msgArray);
        week_day = $(".scheduleModifyContainer_specificDate_wk").find("option:selected").val();
    } else {
        weekID = getMaxId_en("schedule_specificDate");
        week_day = $(".scheduleModifyContainer_specificDate_wk").find("option:selected").val();
    } //获取新建id主键
    let WeekAlmReportInsert = {
        getDataTable: "WeekAlmReport",
        Administrator: $(".scheduleModifyContainer_specificDate_username").find("option:selected").text(),
        week_day: week_day,
        begin_time: $(".scheduleModifyContainer_specificDate_stime").val(),
        end_time: $(".scheduleModifyContainer_specificDate_etime").val(),
        ifValue: weekID
    };
    if (indexAll == 1) publicAjaxModify_en(WeekAlmReportInsert, "/api/GWServiceWebAPI/updateEquipGroup", 4);
    else publicAjaxModify_en(WeekAlmReportInsert, "/api/GWServiceWebAPI/insertEquipGroup", 4);
}
//特定排表更新
function updateSpeAlmReport_en(that) {
    var weekID, dt, week_day;
    if (indexAll == 1) {
        weekID = isArray_en("dataid", msgArray);
    } else {
        weekID = getMaxId_en("schedule_weeklytable");
    } //获取新建id主键
    let WeekAlmReportInsert = {
        getDataTable: "SpeAlmReport",
        Administrator: $(".scheduleModifyContainer_weeklytable_username").val(),
        begin_time: $(".scheduleModifyContainer_weeklytable_stime").val(),
        end_time: $(".scheduleModifyContainer_weeklytable_etime").val(),
        ifValue: weekID
    };
    if (indexAll == 1) publicAjaxModify_en(WeekAlmReportInsert, "/api/GWServiceWebAPI/updateEquipGroup", 5);
    else publicAjaxModify_en(WeekAlmReportInsert, "/api/GWServiceWebAPI/insertEquipGroup", 5);
}

function newlyBuildSpeAlmReport_view_en() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_AdministratorData", {
        getDataTable: "0"
    })).done(function(n) {
        var n_result = n.HttpData;
        if (n_result.code == 200) {
            $(".scheduleModifyContainer_weeklytable_username").html("");
            var n_html = "";
            n_result.data.forEach(function(item, index) {
                if (indexAll == 1) {
                    if (isArray_en("username", msgArray) == item.Administrator) n_html += `<option value="${item.Administrator}" selected>${item.Administrator}</option>`;
                    else n_html += `<option value="${item.Administrator}">${item.Administrator}</option>`;
                } else {
                    if (index == 0) n_html += `<option value="${item.Administrator}" selected>${item.Administrator}</option>`;
                    else n_html += `<option value="${item.Administrator}">${item.Administrator}</option>`;
                }
            });
            $(".scheduleModifyContainer_weeklytable_username").html(n_html);
            $(".scheduleModifyContainer_weeklytable_stime").val(isArray_en("stime", msgArray));
            $(".scheduleModifyContainer_weeklytable_etime").val(isArray_en("etime", msgArray));
        } else {
            scheduleAlert.open();
        }
    }).fail(function(e) {});
    if (indexAll == 2) {
        myApp.calendar.create({
            inputEl: '#Spe_stime',
            openIn: 'customModal',
            header: false,
            footer: true,
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dateFormat: 'yyyy/mm/dd 00:00:00',
            cssClass: "startTime",
            headerPlaceholder: "End date",
            toolbarCloseText: "Confirm",
            value: [new Date()],
        })
        myApp.calendar.create({
            inputEl: '#Spe_etime',
            openIn: 'customModal',
            header: false,
            footer: true,
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dateFormat: 'yyyy/mm/dd 00:00:00',
            cssClass: "startTime",
            headerPlaceholder: "End date",
            toolbarCloseText: "Confirm",
            value: [new Date()],
        })
    } else {
        myApp.calendar.create({
            inputEl: '#Spe_stime',
            openIn: 'customModal',
            header: false,
            footer: true,
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dateFormat: 'yyyy/mm/dd 00:00:00',
            cssClass: "startTime",
            headerPlaceholder: "End date",
            toolbarCloseText: "Confirm",
        })
        myApp.calendar.create({
            inputEl: '#Spe_etime',
            openIn: 'customModal',
            header: false,
            footer: true,
            monthNames: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dateFormat: 'yyyy/mm/dd 00:00:00',
            cssClass: "startTime",
            headerPlaceholder: "End date",
            toolbarCloseText: "Confirm",
        })
    }
}
// 场景编辑
var sceneData = [],
    scaneEquipData = [];
function initSceneList_view_en() {
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
           
            sceneData = rt.data, scaneEquipData = equipRt.data;
            setList = rt.data, equipList = equipRt.data;
            // 场景名称
            $("#equipLinkage_input").val(isArray_en("currentTxt", msgArray));
            //选择设备
            controlEquipList = setList.filter(item => {
                return (item.equip_no == isArray_en("equip_no", msgArray) && item.set_nm.trim() == isArray_en("currentTxt", msgArray).trim());
            }).map(item => {
                return item
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
                    htmlContent += `<li class="swipeout " equipcomb="${equiplinkageStr[i]}">
                        <div class="item-content swipeout-content schedule-content row no-gap" >
                            <div class="item-inner">
                              <div class="item-title">${i+1}、${(equip_no_flg?filterFun_en(equipList,equiplinkageStr[i].split(",")[0],null):(equiplinkageStr[i]?(window.localStorage.languageList == 1?"Interval operation":"间隔操作"):""))}: <strong>${(equip_no_flg?filterFun_en(setList,equiplinkageStr[i].split(",")[0],equiplinkageStr[i].split(",")[1]):(equiplinkageStr[i]?(window.localStorage.languageList == 1?" ":"延迟间隔")+equiplinkageStr[i]+(window.localStorage.languageList == 1?" ms":" ms"):""))}</strong></div>
                              <div class="item-after" onclick="scenalControlPro_en(this)" index="${i}"><i class="iconfont icon-f7_top_jt"></i></div>
                            </div>
                        </div>
                        <div class="swipeout-actions-right">
                          <a href="#" class="delBtn" onclick="currentControl_en(this)" style="">${window.localStorage.languageList == 1?"Delete":"删除"}</a>
                        </div>
                      </li> `;
                }
                $(".equipLinkage_edit_modify>ul").append(htmlContent);
            }
        }
    }).fail(function(e) {
       
    });
}
//过滤函数
function filterFun_en(obj, selecet_equip_no, selecet_set_no) {
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
function submitScene_en(dt) {
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
            equipNo: isArray_en("equip_no", msgArray),
            setNo: isArray_en("set_no", msgArray),
            sceneName: sceneName,
            dataStr: dataStr
        }
        $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updateScene", {
            data: reqData,
            async: false
        })).done(function(n) {
            initSceneList_en();
            scheduleModifySuccessTooip.open();
        }).fail(function(e) {});
    } else {
        addScene_en();
    }
}
//添加场景
function addScene_en() {
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
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/addScene", {
        data: reqData,
        async: false
    })).done(function(n) {
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
                initSceneList_en();
                scheduleModifySuccessTooip.open();
            }).fail(function(e) {});
        }
    }).fail(function(e) {});
}
//新增控制
function scenalControlPro_en(dt) {
    //场景名是否为空
    if ($("#equipLinkage_input").val().trim() == "") {
    let myApp_en = new Framework7({dialog: {buttonOk: 'confirm', buttonCancel: 'cancel', }, statusbar: {enabled: true, overlay: true, iosOverlaysWebView: true, }, });
        myApp_en.dialog.alert(window.localStorage.languageList == 1 ? 'Please add the scene name first!' : '请先添加场景名称!', window.localStorage.languageList == 1 ? 'Tips' : '提示');
        return false;
    }
    window.localStorage.sceneName = $("#equipLinkage_input").val();
    if (indexAll == 1) {
        let val = $(dt).attr("index");
        myApp.router.navigate("/mobile-en/scheduleModifyChild_en/?" + val);
    } else {
        myApp.router.navigate("/mobile-en/scheduleModifyChild_en/?last");
    }
}
//新增控制初始化
function scenalControlPro_init_en() {
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
                    if (isArray_en("username", msgArray) == item.set_nm && isArray_en("equip_no", msgArray) == item.equip_no) l_html += `<option value="${item.set_nm}" combination="${item.equip_no},${item.set_no}" selected>${item.set_nm}</option>`;
                    else l_html += `<option value="${item.set_nm}" combination="${item.equip_no},${item.set_no}">${item.set_nm}</option>`;
                } else {
                    if (index == 0) l_html += `<option value="${item.set_nm}" combination="${item.equip_no},${item.set_no}" selected>${item.set_nm}</option>`;
                    else l_html += `<option value="${item.set_nm}" combination="${item.equip_no},${item.set_no}">${item.set_nm}</option>`;
                }
            });
            $(".equipLinkage_edit_modify_child_equip").html(l_html);
        }
    }).fail(function(e) {
       
    });
}
//删除当前控制项
function currentControl_en(dt) {
    let myApp_en = new Framework7({dialog: {buttonOk: 'confirm', buttonCancel: 'cancel', }, statusbar: {enabled: true, overlay: true, iosOverlaysWebView: true, }, });
    myApp_en.dialog.confirm("Whether to delete the current control", "Tips", function() {
        $(dt).parent().parent().remove();
        // 序列化每项序号
        $(".equipLinkage_edit_modify>ul li").each(function(index) {
            $(this).find(".item-after").attr("index", index);
        });
    });
}