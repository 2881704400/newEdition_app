var scheduleModifyChildpositionList, comfirmEquip;

function scheduleModifyChild() {
    //控制子项目点击事件
    $(".equipLinkage_edit_modify_childFirst>div").unbind();
    $(".equipLinkage_edit_modify_childFirst>div").bind("click", function() {
        $(this).addClass("selectedIcorlor").siblings().removeClass("selectedIcorlor");
        $("." + $(this).attr("div_attribute")).removeClass("displayNone").siblings().addClass("displayNone");
        $(".equipLinkage_edit_modify_childFirst").removeClass("displayNone");
    });
    scheduleModifyChildSuccessTooip = myApp.toast.create({
        text: window.localStorage.languageList == 1 ? "Insert success" : "插入成功",
        position: 'center',
        closeTimeout: 2000,
    });
    // 获取位置参数
    var chatObjectChild = myApp.views.main.history,
        urlLengthChild = chatObjectChild.length - 1;
    scheduleModifyChildpositionList = chatObjectChild[urlLengthChild].split("?")[1];
    //输入框单击
    $(".addEquipInfo").unbind().bind("click", function() {
        scenalControlPro_init1();
    });
}
//确认控制项目
function comfirmScaneControl() {
    if (!$(".equipLinkage_edit_modify_childSecond").hasClass("displayNone")) {
        var selVal = $(".addEquipInfo").attr("combination");
        scheduleModifyChildpositionList == "last" ? equiplinkageStr.push(selVal) : equiplinkageStr.splice(parseInt(scheduleModifyChildpositionList), 0, selVal);
    } else {
        let str = $(".equipLinkage_edit_modify_child_time").val();
        if (!str) {
            myApp.dialog.alert(window.localStorage.languageList == 1 ? "Please enter the correct time" : "请输入正确的时间");
            return false;
        } else scheduleModifyChildpositionList == "last" ? equiplinkageStr.push(str) : equiplinkageStr.splice(parseInt(scheduleModifyChildpositionList), 0, str);
    }
    scheduleModifyChildSuccessTooip.open();
}
//新增控制初始化 1.7
function scenalControlPro_init1() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/getSetparmList", {
        findEquip: false
    })).done(function(l) {
        let equipRt = l.HttpData;
        if (l.HttpData.code == 200) {
            var l_html = "";
            comfirmEquip(equipRt.data);
        }
    }).fail(function(e) {
        myApp.dialog.close();
    });
}

function comfirmEquip(arry) {
    myApp.sheet.create({
        content: `
       <div class="sheet-modal my-sheet-swipe-to-step fm-modal equipSelectSheet" style="height:90%; --f7-sheet-bg-color: #fff;">
          <div class="sheet-modal-inner">
            <div class="sheet-modal-swipe-step">
              <div class="display-flex padding justify-content-space-between align-items-center header_center_gray">
                 <div></div>
              </div>
            </div> 
            <div class="block-title block-title-medium margin-top title_2" style="">选择添加的设备</div>
            <hr class="transform-05"/>        
            <div class="no-hairlines">
                <div class="row">${returnModifyHtml(arry)} </div>
            </div>
          </div>
        </div>`,
        // Events
        on: {
            open: function(sheet) {
            },
            opened: function(sheet) {
               $(".equipSelectSheet div.no-hairlines a").unbind().bind("click",function(){
                   if($(this).hasClass("selectedBgColor"))
                   {
                       $(this).removeClass("selectedBgColor");
                       $(".addEquipInfo").val("").attr("combination","");
                   }
                   else
                   {
                       $(this).addClass("selectedBgColor").siblings().removeClass("selectedBgColor");
                       $(".addEquipInfo").val($(this).text()).attr("combination",$(this).attr("combination"));
                   }
               });
            },
        },
        swipeToClose: false,
        swipeToStep: false,
        backdrop: true,
    }).open();
}

function returnModifyHtml(arry) {
    var l_html = "";
    arry.forEach(function(item, index) {
        if (indexAll == 1) {
            if (isArray("username", msgArray) == item.set_nm && isArray("equip_no", msgArray) == item.equip_no) l_html += `<a href="#" class="col-33" combination="${item.equip_no},${item.set_no}" >${item.set_nm}</a>`;
            else l_html += `<a href="#" class="col-33" combination="${item.equip_no},${item.set_no}">${item.set_nm}</a>`;
        } else {
            if (index == 0) l_html += `<a href="#" class="col-33" combination="${item.equip_no},${item.set_no}" >${item.set_nm}</a>`;
            else l_html += `<a href="#" class="col-33" combination="${item.equip_no},${item.set_no}">${item.set_nm}</a>`;
        }
    });
    return l_html+`<a href="#" class="col-33 opacity"></a><a href="#" class="col-33 opacity"></a>`;
}