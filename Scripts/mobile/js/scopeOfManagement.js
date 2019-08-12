function scopeOfManagement() {
    scopeOfManagementInit();
}
//人员初始化
function scopeOfManagementInit() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_AlmReportData", {
        data: {
            getDataTable: "0"
        }
    }), AlarmCenterContext.post("/api/GWServiceWebAPI/get_EquipGroupData")).done(function(data, l) {
        let arrayLike = data.HttpData.data,
            code = data.HttpData.code,
            arrayLike_l = l.HttpData.data,
            code_l = l.HttpData.code;
        if (code == 200 && code_l == 200) {
            returnUserHtml(arrayLike, arrayLike_l);
        }
    }).fail(function(e) {});
}

function returnUserHtml(arry, arry_l) {
    var html = "";
    arry.forEach((item, index) => {
        html += `<li>
       <a href="/scheduleModify/?title=管理范围&table=NewlyBuildTableScopeEdit&Administrator=${item.Administrator}&group_no=${item.group_no}&group_no_name=${getIdenticalList(item.group_no,arry_l)}&id=${item.id}" class="item-link item-content">
          <div class="item-inner">
            <div class="item-title">${item.Administrator}</div>
            <div class="item-after">${getIdenticalList(item.group_no,arry_l)}</div>
          </div>
       </a>
    </li> `;
    });
    $(".scopeOfManagementPageContent>div>ul").html(html);
}

function getIdenticalList(num, array) {
    var obj = array.filter((item, index) => {
        if (item.group_no == num) return item;
    });
    if(obj.length>0)
     return obj[0].group_name;
    else
      return "";
}