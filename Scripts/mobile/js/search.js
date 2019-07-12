function search() {
   var html = "";
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
   });

}