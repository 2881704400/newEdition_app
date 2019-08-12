var groupManagementArray = [];
function groupManagement() {
   groupManagementUser();
}
//人员初始化
function groupManagementUser() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_EquipGroupData", {
        data: {
            getDataTable: "0"
        }
    })).done(function(data) {
        let arrayLike = data.HttpData.data,code = data.HttpData.code;
        if (code == 200) {
          groupManagementArray = arrayLike;
          returnUserHtml(arrayLike);
        }
    }).fail(function(e) {});
}

function returnUserHtml(arry){
  var html = "";
  arry.forEach((item,index)=>{
      html += `<li>
       <a href="/scheduleModify/?title=分组管理&table=GroupEditInit&group_name=${item.group_name}&group_no=${item.group_no}&equipcomb=${item.equipcomb}&sta_n=${item.sta_n}" class="item-link item-content">
          <div class="item-inner">
            <div class="item-title">${item.group_name}</div>
          </div>
       </a>
    </li> `;  
  });
 $(".groupManagementPageContent>div>ul").html(html);
}