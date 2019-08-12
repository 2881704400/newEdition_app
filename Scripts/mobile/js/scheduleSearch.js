function scheduleSearch() {
   var html = "",urlstr = myApp.views.main.history,leng = urlstr.length,name = urlstr[leng - 1].split("#")[1];
   $(".scheduleSearch-main div.snashot-header").find("a").unbind().bind("click",function(){
      $(this).addClass("selectListType").siblings().removeClass("selectListType");
       if($(".scheduleSearch-main .searchInput input").val())
         drawHtml(".scheduleSearch-main .searchInput input");
   });
   $(".scheduleSearch-main .searchInput input").unbind().bind("keypress",function(event){
       if(event.keyCode == 13)
       {
         drawHtml(this);
       }
   });
}

function drawHtml(dt){
          var val = $(dt).val();
          html = "",num = $(".selectListType").attr("data-menu");
          if(num == "1" || num == "3")
          weeklySchedule.forEach((item,index)=>{
            if(item.Administrator.search(val) != -1)
             {
               let sTime = item.begin_time.split("T")[1],eTime = item.end_time.split("T")[1];
                html += `<li>
                 <a href="/scheduleModify/?title=周排表&table=schedule_specificDate&name=${item.Administrator}&week=${item.week_day}&stime=${sTime}&etime=${eTime}&id=${item.id}" class="item-link item-content">
                    <div class="item-media equipListStatus_">
                        <span class="gray">周排</span>
                    </div>
                    <div class="item-inner">
                      <div class="item-title">${item.Administrator}</div>
                      <div class="item-after">${sTime+" - "+ eTime}</div>
                    </div>
                 </a>
                </li> `;
             }
          });
         if(num == "1" || num == "2")
          specificScheduling.forEach((item,index)=>{
            if(item.Administrator.search(val) != -1)
             {
              let sTime = item.begin_time.split("T")[0],eTime = item.end_time.split("T")[0];
              var timeLine = eventListHandle(sTime,eTime);
               html += `<li>
               <a href="/scheduleModify/?title=特定排表&table=schedule_weeklytable&name=${item.Administrator}&stime=${item.begin_time.replace("T"," ")}&etime=${item.end_time.replace("T"," ")}&id=${item.id}" class="item-link item-content">
                  <div class="item-media equipListStatus_">
                      <span class="blue">特排</span>
                  </div>
                  <div class="item-inner">
                    <div class="item-title">${item.Administrator}</div>
                    <div class="item-after">${sTime+" - "+ eTime}</div>
                  </div>
               </a>
               </li>`;
             }
          });    
          $(".scheduleSearch-main .snapshotMessage-ul").html("").html(html); 
}