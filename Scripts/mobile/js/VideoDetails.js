function VideoDetails() {
    var urlstr = myApp.views.main.history,
        leng = urlstr.length;
    var url = urlstr[leng - 1].split("#")[1]
    var dll = url.split("-")[0];
    var equip_no = url.split("-")[1];
     // searchResult.length = 0;
    videoListLi(dll,equip_no,"#VideoDetails_tree");
}
