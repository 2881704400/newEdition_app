function equipLinkageModify() {

	var chatObject = myApp.views.main.history,
		urlLength = chatObject.length - 1,
		receiveUser = chatObject[urlLength].split("?")[1],
		msgArray = [];
	receiveUser ? msgArray = receiveUser.split("&") : "";

	var index = "",receiveUserArr,equipName,cType,cSpot,delayTime,linkageEquip,linkageEquip,linkageOpt,optCode,remarks;
	if(receiveUser) {
		receiveUserArr = receiveUser.split("&");
		equipName = receiveUserArr[0];
		cType = receiveUserArr[1];
		cSpot = receiveUserArr[2];
		delayTime = receiveUserArr[3];
		linkageEquip = receiveUserArr[4];
		linkageOpt = receiveUserArr[5];
		optCode = receiveUserArr[6];
		remarks = receiveUserArr[7];
		ID = receiveUserArr[8];
		$("#equipLinkageModifyId").attr("dataID", ID)
		index = receiveUserArr[9];
		if(equipName != " " && equipName != "undefined") {
			$("#equipTiggerName").val(equipName);
		}
		if(cType != " " && cType != "undefined") {
			$("#equipTiggerType").val(cType);
		}
		if(cSpot != " " && cSpot != "undefined") {
			$("#equipTiggerSpot").val(cSpot);
		}
		if(delayTime != " " && delayTime != "undefined") {
			$("#equipTiggerTime").val(delayTime);
		}else{
			$("#equipTiggerTime").val(0);
		}
		if(linkageEquip != " " && linkageEquip != "undefined") {
			$("#equipTigger_Link").val(linkageEquip);
		}
		if(linkageOpt != " " && linkageOpt != "undefined") {
			$("#equipTiggerCom").val(linkageOpt);
		}
		if(remarks != " " && remarks != "undefined") {
			$("#equipTiggerInfo").val(remarks);
		}
	}

	$("#equipLinkageModifyId").unbind('click').bind('click', function() {
		addLinkage(this, index);
	});
	
    $(".equipTiggerName").unbind().bind("click",function(){
    	quipLinkageAlert(this, listAdd.map(item => {return item.label;}));
    });
    $(".equipTiggerType").unbind().bind("click",function(){
    	if($(".equipTiggerName").val())
    	quipLinkageAlert(this, equipTiggerType.map(item => {return item.label;}));
    });  
    $(".equipTiggerSpot").unbind().bind("click",function(){
    	if($(".equipTiggerType").val())
    	quipLinkageAlert(this, link_listInit_spot[0].children.map(item => {return item.label; }));
    });    

    $(".equipTigger_Link").unbind().bind("click",function(){
    	quipLinkageAlert(this, linkageEquips.map(item => {return item.label; }));
    });
    $(".equipTiggerCom").unbind().bind("click",function(){
    	if($(".equipTigger_Link").val())
    	quipLinkageAlert(this, link_listInit_com.map(item => {return item.set_nm; }));
    });    

    //初始化数据
    if(index == "1")
     equipLinkageModifyInit();
}

function equipLinkageModifyInit(){

        link_listInit_no = listAdd.filter((equip, index) => {
            if (equip.label === $("#equipTiggerName").val()) {
                return equip;
            }
        })[0].value;
        if (link_listInit_no) 
	        $.when(AlarmCenterContext.post("/api/GWServiceWebAPI/getYcp", {
	            equip_nos: link_listInit_no
	        }), AlarmCenterContext.post("/api/GWServiceWebAPI/getYxp", {
	            equip_nos: link_listInit_no
	        })).done(function(n, l) {
	            if (n.HttpData.code == 200 && l.HttpData.code == 200) {
	                ycpData_table_9 = n.HttpData;
	                yxpData_table_10 = l.HttpData;
	                writeContent();
	            }
	        }).fail(function(e) {});


        var no = linkageEquips.filter((item, index) => {
                if (item.label == $("#equipTigger_Link").val()) return item;
            })[0].value;
        $.when(AlarmCenterContext.post("/api/real/get_setparm", {
            equip_nos: no
        })).done(function(n, l) {
            if (n.HttpData.code == 200) {
                link_listInit_com = n.HttpData.data;
            }
        }).fail(function(e) {});

}

