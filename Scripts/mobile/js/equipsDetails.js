function equipsDetails() {
    var urlstr = myApp.views.main.history,
        leng = urlstr.length;
    var equip_name = urlstr[leng - 1].split("#")[1];
    $(".sliding,.title-large-text").text(equip_name);
    onTreePar($(".equipsDetails-equip-list"), equip_name, event);
}