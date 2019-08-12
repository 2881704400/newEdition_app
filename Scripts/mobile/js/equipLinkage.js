var toastCenterLinkage, toastCenterLinkageSuccess;

function equipLinkage() {
    switchToolbar("functionalModule_pageTool");
    loadFun();
    initAddList(); //联动设置
    toastCenterLinkage = myApp.toast.create({
        text: "操作失败",
        position: 'center',
        closeTimeout: 2000,
    });
    toastCenterLinkageSuccess = myApp.toast.create({
        text: "操作成功",
        position: 'center',
        closeTimeout: 2000,
    });
}

//初始化列表
var linkage_init, setparm_init, listAdd = [],
    linkageEquips = [];

function initAddList() {
    $("#equipLinkage_set ul").html("");
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/getEquipList"), AlarmCenterContext.post("/api/GWServiceWebAPI/getSetparmList", {
        findEquip: false
    }), AlarmCenterContext.post("/api/GWServiceWebAPI/getLinkageList")).done(function(n, l, h) {
        let nObject = n.HttpData,
            lObject = l.HttpData,
            hObject = h.HttpData;
        if (nObject.code == 200 && lObject.code == 200 && hObject.code == 200) {
            linkageEquips = nObject.data.filter((equip, index) => {
                if (lObject.data.some(parm => {
                        return equip.equip_no === parm.equip_no
                    })) {
                    return equip
                }
            }).map(equip => {
                return {
                    value: equip.equip_no,
                    label: equip.equip_nm,
                    loading: false,
                    children: []
                }
            });
            listAdd = nObject.data.map(item => {
                return {
                    value: item.equip_no,
                    label: item.equip_nm,
                    loading: false,
                    children: []
                }
            })
            setparm_init = lObject;
            linkage_init = hObject;
            equipLinkList();
        }

    }).fail(function(e) {
        toastCenterLinkage.open();
    });
}

//公共请求
var publicFirstData,tableNameNoYcp, tableNameNoYxp, ycpData_table_5, yxpData_table_6, ycpData_table_7, yxpData_table_8, ycpData_table_9, yxpData_table_10,
    typeList = [{
        value: "X",
        label: "状态量报警",
        children: []
    }, {
        value: "x",
        label: "状态量恢复",
        children: []
    }, {
        value: "C",
        label: "模拟量越线",
        children: []
    }, {
        value: "c",
        label: "模拟量恢复",
        loading: false,
        children: []
    }, {
        value: "E",
        label: "设备通讯故障",
        children: []
    }, {
        value: "e",
        label: "设备通讯恢复",
        children: []
    }, {
        value: "S",
        label: "设备状态故障",
        children: []
    }, {
        value: "s",
        label: "设备状态恢复",
        children: []
    }];

function equipLinkList() {
    let rt = linkage_init,
        parmRt = setparm_init;
    if (rt.code === 200 && parmRt.code === 200) {
        var data = rt.data,
            parmData = parmRt.data
        var ycpData_table = 'ycp',
            yxpData_table = 'yxp';
        var ycpData_table_type = 'ycp',
            yxpData_table_type = 'yxp';
        var equip_ycp_nos = "",yc_ycp_nos = "",equip_yxp_nos = "",yc_yxp_nos = "";

        data.forEach(function(item, index) {
            if (item.iycyx_type === "c" || item.iycyx_type === "C") {
                ycpData_table == 'ycp' ? ycpData_table += (' where (equip_no =' + item.iequip_no + ' and yc_no =' + item.iycyx_no + ')') : ycpData_table += (' or (equip_no =' + item.iequip_no + ' and yc_no =' + item.iycyx_no + ')');
                equip_ycp_nos += (item.iequip_no + ",");
                yc_ycp_nos += (item.iycyx_no + ",");
            } else if (item.iycyx_type === "x" || item.iycyx_type === "X") {
                yxpData_table == 'yxp' ? yxpData_table += (' where (equip_no =' + item.iequip_no + ' and yx_no =' + item.iycyx_no + ')') : yxpData_table += (' or (equip_no =' + item.iequip_no + ' and yx_no =' + item.iycyx_no + ')');
                equip_yxp_nos += (item.iequip_no + ",");
                yc_yxp_nos += (item.yc_yxp_nos + ",");
            }
        });
        if (equip_ycp_nos.length > 0) {
            equip_ycp_nos = equip_ycp_nos.substring(0, equip_ycp_nos.length - 1);
            yc_ycp_nos = yc_ycp_nos.substring(0, yc_ycp_nos.length - 1);
        }
        if (equip_yxp_nos.length > 0) {
            equip_yxp_nos = equip_yxp_nos.substring(0, equip_yxp_nos.length - 1);
            yc_yxp_nos = yc_yxp_nos.substring(0, yc_yxp_nos.length - 1);
        }

        if (ycpData_table != "ycp" && yxpData_table != "yxp") {
            $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_DataForListStr", {
                "tType": ycpData_table_type,
                "equip_nos": equip_ycp_nos,
                "yc_nos": yc_ycp_nos
            }), AlarmCenterContext.post("/api/GWServiceWebAPI/get_DataForListStr", {
                "tType": yxpData_table_type,
                "equip_nos": equip_yxp_nos,
                "yc_nos": yc_yxp_nos
            })).done(function(n, l) {
                if (n.HttpData.code == 200 && n.HttpData.code == 200) {
                    ycpData_table_5 = n.HttpData.data;
                    yxpData_table_6 = l.HttpData.data;
                    notEqualToYCPYXP();
                } else {}
            }).fail(function(e) {});
        } else if (ycpData_table != "ycp") {

            $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_DataForListStr", {
                "tType": ycpData_table_type,
                "equip_nos": equip_ycp_nos,
                "yc_nos": yc_ycp_nos
            })).done(function(n) {
                if (n.HttpData.code == 200) {
                    ycpData_table_7 = n.HttpData.data;
                    notEqualToYCP();
                }
            }).fail(function(e) {});
        } else if (yxpData_table != "yxp") {
            $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_DataForListStr", {
                "tType": yxpData_table_type,
                "equip_nos": equip_yxp_nos,
                "yc_nos": yc_yxp_nos
            })).done(function(n) {
                if (n.HttpData.code == 200) {
                    yxpData_table_8 = n.HttpData.data;
                    notEqualToYXP();
                }
            }).fail(function(e) {});
        } else {
            publicFun(null, null);
        }
    }
}

// 不等于ycp yxp
function notEqualToYCPYXP() {
    let ycpRt = ycpData_table_5,
        yxpRt = yxpData_table_6;


        publicFun(ycpRt, yxpRt);

}

//不等于ycp 
function notEqualToYCP() {
    let ycpRt = ycpData_table_7;
    let ycpData_ycp = ycpRt,
        yxpData_yxp = null;
    publicFun(ycpData_ycp, yxpData_yxp);
}

//不等于yxp
function notEqualToYXP() {
    let yxpRt = yxpData_table_8;
    let ycpData = null,
        yxpData = yxpRt;
    publicFun(ycpData, yxpData);
}

var equipLinkage_public_list = [];
function publicFun(ycpData, yxpData) {
    var html = "";
    equipLinkage_public_list = linkage_init.data.map((row, index) => {
        let result = {}
        result.id = row.ID;
        result.originalData = row;
        result.delayTime = row.delay;
        result.optCode = row.value;
        result.remarks = row.ProcDesc;
        linkageEquips.forEach(item => {
            if (row.oequip_no === item.value) {
                result.linkageEquip = item.label
            }
        })
        setparm_init.data.forEach(item => {
            if (row.oequip_no === item.equip_no && row.oset_no === item.set_no) {
                result.linkageOpt = item.set_nm
            }
        })
        listAdd.forEach(item => {
            result.equipName = (item.value === row.iequip_no) ? item.label : result.equipName
        })
        typeList.forEach(item => {
            if (item.value === row.iycyx_type) {
                result.cType = item.label
            }
        })
        if (row.iycyx_type === "c" || row.iycyx_type === "C") {
            if (ycpData) ycpData.forEach(item => {
                if (row.iequip_no === item.equip_no && row.iycyx_no === item.yc_no) {

                    result.cCurren = item.yc_nm
                }
            })
        } else if (row.iycyx_type === "x" || row.iycyx_type === "X") {
            if (yxpData) yxpData.forEach(item => {
                if (row.iequip_no === item.equip_no && row.iycyx_no === item.yx_no) {
                    result.cCurren = item.yx_nm
                }
            })
        } else {
            result.cCurren = "无"
        }

        html += `<li class="swipeout bottomBorderLine">
          <div class="item-content swipeout-content schedule-content row no-gap" onclick="newlyBuildLinkage(this,1)" TrID="${result.id}" TrRow = '${index}'>
            <div class="col-50">${result.equipName}</div>
            <div class="col-50">${result.linkageEquip}</div> 
            <div class="col-100">${result.remarks}</div> 
          </div>
          <div class="swipeout-actions-right">
            <a href="#" class="delBtn" onclick="deleteLinkage(this)">删除</a>
          </div>
        </li>`;
        return result;
    })
    $("#equipLinkage_set ul").html(html);
}

//联动设置添加
var equipTiggerType = [],
    equipTiggerSpot = [],
    equipTiggerLink = [],
    equipTiggerCom = [],
    dtParent;

function newlyBuildLinkage(dt, index) {
    dtParent = dt;
    var result = $(dtParent).attr("TrRow") ? equipLinkage_public_list[$(dtParent).attr("TrRow")] : {
        id: "",
        equipName: "",
        cType: "",
        cCurren: "",
        delayTime: 0,
        linkageEquip: "",
        linkageOpt: "",
        remarks: ""
    };
    myApp.views.main.router.navigate("/equipLinkageModify/?" + result.equipName + "&" + result.cType + "&" + result.cCurren + "&" + result.delayTime + "&" + result.linkageEquip + "&" + result.linkageOpt + "&" + result.optCode + "&" + result.remarks + "&" + result.id + "&" + index + "");

}

//列表联动
function writeContent() {
    let ycpRt = ycpData_table_9,
        yxpRt = yxpData_table_10,
        item = typeList.filter((dt, index) => {
            if (dt.label == $("#equipTiggerType").val()) return dt;
        }),
        childrenContent;
    if (ycpRt.code === 200 || yxpRt.code === 200) {
        let ycpData = ycpRt.data,
            yxpData = yxpRt.data;
        equipTiggerType = typeList;
        if (!ycpData || !ycpData.length) {
            equipTiggerType = equipTiggerType.filter((child, index) => {
                return index !== 2 && index !== 3;
            });
        } else {
            equipTiggerType.map((child, index) => {
                if (index === 2 || index === 3) {
                    child.children = ycpData.map(yc => {
                        return {
                            value: yc.yc_no,
                            label: yc.yc_nm
                        }
                    })
                }
            })
        }
        if (!yxpData || !yxpData.length) {
            equipTiggerType = equipTiggerType.filter((item, index) => {
                return index !== 0 && index !== 1;
            });
        } else {
            equipTiggerType.map((child, index) => {
                if (index === 0 || index === 1) {
                    child.children = yxpData.map(yx => {
                        return {
                            value: yx.yx_no,
                            label: yx.yx_nm
                        }
                    })
                }
            })
        }
    } else {}

    link_listInit_spot = equipTiggerType.filter((item, index) => {
      if (item.children.length > 0 && item.label == $("#equipTiggerType").val()) return item;
    });

}

//获取存在条件对象
function getObject(arrayObject, className, index) {
    if (index == 1) return arrayObject.filter((item, index) => {
        if (item.children.length > 0 && item.label == $("." + className).val()) return item;
    });
    else if (index == 2) return arrayObject.filter((item, index) => {
        if (item.label == $("." + className).val()) return item;
    });
    else if (index == 3) return arrayObject.filter((item, index) => {
        if (item.set_nm == $("." + className).val()) return item;
    });
}
// 插入或者更新记录 
function addLinkage(dt, index) { //index = 1 更新，index = 2 插入
    
    let equipLink_cType = getObject(equipTiggerType, "equipTiggerType", 2);
    // let equipLink_spot = getObject(link_listInit_spot, "equipTiggerSpot", 1);
    let equipLink_linkEquipNo = getObject(linkageEquips, "equipTigger_Link", 2);
    let equipLink_linkNo = getObject(link_listInit_com, "equipTiggerCom", 3);
    var equipLink_cNo;
    try {
        equipLink_cNo = link_listInit_spot[0].children.filter((item, index) => {
            if (item.label == $(".equipTiggerSpot").val()) return item;
        })[0].value;
    } catch (e) {}

    var reqData = {
        id: $(dt).attr("dataID") || 1,
        equipNo: link_listInit_no,
        cType: equipLink_cType.length > 0 ? equipLink_cType[0].value : "''",
        cNo: equipLink_cNo ? equipLink_cNo : 0,
        delay: $(".equipTiggerTime").val(),
        linkEquipNo: equipLink_linkEquipNo.length > 0 ? equipLink_linkEquipNo[0].value : "''",
        linkNo: (equipLink_linkNo.length > 0 && equipLink_linkNo)? equipLink_linkNo[0].set_no : "null",
        optCode: '""',
        remarks: $(".equipTiggerInfo").val() || ""
    }
    if (index == 1) {
        $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/updateLinkage", reqData)).done(function(n) {
            if (n.HttpData.code == 200) {
                toastCenterLinkageSuccess.open();
            }
        }).fail(function(e) {
            toastCenterLinkage.open();
        });
    } else {
        $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/addLinkage", reqData)).done(function(n) {
            if (n.HttpData.code == 200) {
                toastCenterLinkageSuccess.open();
            }
        }).fail(function(e) {
            toastCenterLinkage.open();
        });
    }
}
//删除
function deleteLinkage(dt) {
    let val = parseInt($(dt).parent().siblings().attr("trid"));
    myApp.dialog.confirm("是否删除该项", "提示", function() {
        myApp.popup.close();
        $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/deleteLinkage", {
            id: val
        })).done(function(n) {
            if (n.HttpData.code == 200) {
                toastCenterLinkageSuccess.open();
                $(dt).parents("li").remove();
            }
        }).fail(function(e) {
            toastCenterLinkage.open();
        });
    });
}

//触发点
var link_listInit_spot = [];
//触发命令
var link_listInit_com = [],link_listInit_no = 0;

//底部弹窗
function quipLinkageAlert(dt, arry) {
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
                <div class="row">${equipLinkageHtml(dt,arry)}</div> 
            </div>
          </div>
        </div>`,
        on: {
            open: function(sheet) {},
            opened: function(sheet) {
                $(".equipSelectSheet div.no-hairlines a").unbind().bind("click", function() {
                    var that = this;
                    //选择 
                    if ($(dt).hasClass("equipTiggerName")) {
                        link_listInit_no = listAdd.filter((equip, index) => {
                            if (equip.label === $(that).text()) {
                                return equip;
                            }
                        })[0].value;
                        if (link_listInit_no) $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/getYcp", {
                            equip_nos: link_listInit_no
                        }), AlarmCenterContext.post("/api/GWServiceWebAPI/getYxp", {
                            equip_nos: link_listInit_no
                        })).done(function(n, l) {
                            if (n.HttpData.code == 200 && l.HttpData.code == 200) {
                                ycpData_table_9 = n.HttpData;
                                yxpData_table_10 = l.HttpData;
                                writeContent();
                            }
                        }).fail(function(e) {});
                        $(".equipTiggerType,.equipTiggerSpot").val("");
                    } else if ($(dt).hasClass("equipTiggerType")) {
                        $(".equipTiggerSpot").val("");
                        link_listInit_spot = equipTiggerType.filter((item, index) => {
                            if (item.children.length > 0 && item.label == $(that).text()) return item;
                        });
                    } else if ($(dt).hasClass("equipTigger_Link")) {
                        $(".equipTiggerCom").val("");
                        $.when(AlarmCenterContext.post("/api/real/get_setparm", {
                            equip_nos: linkageEquips.filter((item, index) => {
                                if (item.label == $(that).text()) return item;
                            })[0].value
                        })).done(function(n, l) {
                            if (n.HttpData.code == 200) {
                                link_listInit_com = n.HttpData.data;
                            }
                        }).fail(function(e) {});
                    }
                    if (!$(this).hasClass("selectedBgColor")) {
                        $(this).addClass("selectedBgColor").siblings().removeClass("selectedBgColor");
                        $(dt).val($(this).text());
                    }
                });
            },
        },
        swipeToClose: false,
        swipeToStep: false,
        backdrop: true,
    }).open();
}

function equipLinkageHtml(dt, array) {
    var l_html = "";
    array.forEach(function(item, index) {
        l_html += `<a href="#" class="col-33">${item}</a>`;
    });
    return l_html + `<a href="#" class="col-33 opacity"></a><a href="#" class="col-33 opacity"></a>`;
}