function equipsDetails() {
    var urlstr = myApp.views.main.history,
        leng = urlstr.length;
    var equip_name = urlstr[leng - 1].split("#")[1];

    $(".sliding,.equipsDetails-title-large").text(equip_name);
    searchResult.length = 0;

    onTreePar($(".equipsDetails-equip-list"), equip_name, event); 

}