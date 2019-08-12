function search() {
   var html = "";
   var urlstr = myApp.views.main.history,leng = urlstr.length,name = urlstr[leng - 1].split("#")[1];
   $(".sliding").text("搜索");
   $(".searchInput input").unbind().bind("keypress",function(event){
       if(event.keyCode == 13)
       {
          var val = $(this).val();
          html = "";
          searchResult.forEach((item,index)=>{
            if(item.search(val) != -1)
             {
                html += item;
             }
          });
       }
        $(".snapshotMessage-ul").html("");
        $(".snapshotMessage-ul").html(html);
        $(".snapshotMessage-ul").parent().removeClass();
        switch(name)
        {
          case "snapShotDetail": $(".snapshotMessage-ul").parent().addClass("list media-list");break;
          case "equips": $(".snapshotMessage-ul").addClass("equip-list").parent().addClass("list-block list-page list");break;
          case "equipsDetails": $(".snapshotMessage-ul").attr("equiplist","true").parent().addClass("list-block list-page list equipsDetails-equip-listbreak"); break; 
          case "Video": $(".snapshotMessage-ul").attr("id","Video_tree").parent().addClass("list accordion-list list-page");break;
          case "equipConfigList": $(".snapshotMessage-ul").parent().addClass("list links-list");break;
          default: break;
        }
   });

}