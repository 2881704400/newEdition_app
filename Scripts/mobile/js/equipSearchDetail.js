function equipSearchDetail() {
	// switchToolbar("configTool");
	var chatObject = myApp.views.main.history,
		urlLength = chatObject.length - 1;
	var chatValue = chatObject[urlLength].split("?")[1].split("&");
	var type = chatValue[0],time = chatValue[1],name = chatValue[2],user = chatValue[3],event = chatValue[4];
	var strData = "";
	if(type == 0) {
				strData += '<li class="item-content item-input">' +
					'				<div class="item-inner row" style="flex-direction: row;">' +
					'					<div class="item-title item-label col-30" style="line-height: 44px;">时间</div>' +
					'					<div class="item-input-wrap col-70">' +
					'						<input type="text" name="name" readonly value="' + time + '">' +
					'					</div>' +
					'				</div>' +
					'			</li>' +
					'<li class="item-content item-input">' +
					'				<div class="item-inner">' +
					'					<div class="item-title item-label">设备名称</div>' +
					'					<div class="item-input-wrap">' +
					'						<input type="text" name="name" readonly value="' + name + '">' +
					'					</div>' +
					'				</div>' +
					'			</li>' +
					'<li class="item-content item-input">' +
					'				<div class="item-inner" >' +
					'					<div class="item-title item-label">设备事件</div>' +
					'					<div class="item-input-wrap" >' +
					'						<textareareadonly>"' + event + '"</textarea>' +
					'					</div>' +
					'				</div>' +
					'			</li>';
		$(".eventDetailPopupTitle").html("设备事件详情");

	} else if(type == 1) {

				strData += '<li class="item-content item-input">' +
					'				<div class="item-inner row" style="flex-direction: row;">' +
					'					<div class="item-title item-label col-30" style="line-height: 44px;">时间</div>' +
					'					<div class="item-input-wrap col-70">' +
					'						<input type="text" name="name" readonly value="' + time + '">' +
					'					</div>' +
					'				</div>' +
					'			</li>' +
					'<li class="item-content item-input">' +
					'				<div class="item-inner">' +
					'					<div class="item-title item-label">设备名称</div>' +
					'					<div class="item-input-wrap">' +
					'						<input type="text" name="name" readonly value="' + name + '">' +
					'					</div>' +
					'				</div>' +
					'			</li>' +
					'<li class="item-content item-input">' +
					'				<div class="item-inner">' +
					'					<div class="item-title item-label">操作人</div>' +
					'					<div class="item-input-wrap">' +
					'						<input type="text" name="name" readonly value="' + user + '">' +
					'					</div>' +
					'				</div>' +
					'			</li>' +
					'<li class="item-content item-input">' +
					'				<div class="item-inner">' +
					'					<div class="item-title item-label">设备事件</div>' +
					'					<div class="item-input-wrap">' +
					'						<textarea readonly>"' + event + '"</textarea>' +
					'					</div>' +
					'				</div>' +
					'			</li>';

		$(".eventDetailPopupTitle").html("设置事件详情");

	} else {

		strData += '<li class="item-content item-input">' +
			'				<div class="item-inner row" style="flex-direction: row;">' +
			'					<div class="item-title item-label col-30" style="line-height: 44px;">时间</div>' +
			'					<div class="item-input-wrap col-70">' +
			'						<input type="text" name="name" readonly value="' + time + '">' +
			'					</div>' +
			'				</div>' +
			'			</li>' +
			'<li class="item-content item-input">' +
			'				<div class="item-inner">' +
			'					<div class="item-title item-label">设备事件</div>' +
			'					<div class="item-input-wrap">' +
			'						<textarea readonly>"' + event + '"</textarea>' +
			'					</div>' +
			'				</div>' +
			'			</li>';
		$(".eventDetailPopupTitle").html("系统事件详情");
		
	}
    $(".eventDetailList ul").html(strData);
} 