
function snapShotInfoDetail() {
	//获取父页面参数
	var chatObject = myApp.views.main.history,
		urlLength = chatObject.length - 1;
	var chatValue = chatObject[urlLength].split("#")[1].split("&");
    chatValue[0] == "1"?ConfirmedFun(chatValue):NotConfirmedFun(chatValue);
}

//已确认
function ConfirmedFun(arry){
	var result = JSON.parse(arry[1]);
	var html =	`
		<div class="content-container-block"> 
		<div class="title_2 row"><label class="col-40">时间</label><label class="col-60">${formatDate(result.Time)}</label></div> 
		<div class="title_2 row"><label class="col-100">事件</label><div class="col-100 snapshotEvent"><div>${arry[2]}</div></div></div> 
		<div class="title_2 row"><label class="col-100">处理意见</label><div class="snapshotEvent"><div><textarea class="advice-textarea" placeholder="请输入处理意见" onblur="onTextareaBlur()"></textarea></div></div></div> 
		<div class="title_2 row msgInfo"><label class="col-40">是否发送短信</label><label class="col-60"><label class="toggle toggle-init color-blue" > 
		<input type="checkbox" class="isProcsInput"><span class="toggle-icon"></span></label></label>
		<div class="list procsContent list-block"></div></div> 
		<a href="#" class="button button-big button-fill color-blue" onclick="OnSureMessage(${arry[3]},'${result.Time}',this)" values="${result}" title="${result.User_Confirmed}  ${formatDate(result.Dt_Confirmed)}">确定</a>
		</div>`; 
		$(".snapshot-main-details").html(html);
		var toggle = myApp.toggle.create({
		  el: '.toggle',
		  on: {
		    change: function () {
		      onProcsCheckBox(arry[3]);
		    }
		  }
		})
}

//未确认
function NotConfirmedFun(arry){
	var result = JSON.parse(arry[1]);
	var html =	`
				<div class="content-container-block"> 
				<div class="title_2 row"><label class="col-40">时间</label><label class="col-60">${formatDate(result.Time)}</label></div> 
				<div class="title_2 row"><label class="col-100">事件</label><div class="col-100 snapshotEvent"><div>${arry[2]}</div></div></div> 
				<div class="title_2 row"><label class="col-100">处理意见</label><div class="snapshotEvent"><div>${arry[3]}</div></div></div> 
				<div class="title_2 row"><label class="col-40">确认人</label><label class="col-60">${result.User_Confirmed}</label></div>
				<div class="title_2 row"><label class="col-40">确认时间</label><label class="col-60">${formatDate(result.Dt_Confirmed)}</label></div> 
				</div>`; 
    $(".snapshot-main-details").html(html);				
}