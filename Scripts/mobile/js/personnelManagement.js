
function personnelManagement() {
   personnelManagementUser();
}
//人员初始化
function personnelManagementUser() {
    $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/get_AdministratorData", {
        data: {
            getDataTable: "0"
        }
    })).done(function(data) {
        let arrayLike = data.HttpData.data,code = data.HttpData.code;
        if (code == 200) {
          returnUserHtml(arrayLike);
        }
    }).fail(function(e) {});
}

function returnUserHtml(arry){
  var html = "";
  arry.forEach((item,index)=>{
      html += `<li>
       <a href="/scheduleModify/?title=人员管理&table=UserEdit&name=${item.Administrator}&phone=${item.Telphone}&msn=${item.MobileTel}&email=${item.EMail}&level=${item.AckLevel}" class="item-link item-content">
          <div class="item-inner">
            <div class="item-title">${item.Administrator}</div>
          </div>
       </a>
    </li> `;  
  });
 $(".personnelManagementPageContent>div>ul").html(html);
}