/*地图*/
var map, distCluster, zoomChangeLevel, overPolygon, featureCountNum = 0;
var topAdcodes = [120000, 140000, 310000, 320000, 340000, 350000, 370000, 420000, 500000];
var strStrokeStyle = 'rgba(87,88,89,.9)';
var strFillStyle = 'rgba(87,88,89,.4)';
var strLeCountNum = 0,
	strRiCountNum = 0;
var myTimer1, myTimer2, nowAreaName = "全国";
var nowPanelName, nowPanelNum, isFirstFlag = true;
var strSDHtml, strSXHtml, strJSHtml, strTJHtml, strAHHtml, strSHHtml, strHBHtml, strCQHtml, strFJHtml;
$(function() {
	//	if(typeof userinfo != "undefined") {
	if(document.body.offsetWidth > 2000) {
		zoomChangeLevel = 6;
	} else {
		zoomChangeLevel = 5;
	}
	//初始化地图
	initMaps();
	//绘制标注点
	drawMarkers();
	//获取卡片信息
	getCardInfo();
	//旋转动画效果
	getRotateAnimate();

	//	} else {
	//		window.location.href = "/Views/error404.html"
	//	}
});

function getRotateAnimate() {
	var allInfo = getPoints();
	var strLeData = '';
	var strRiData = '';
	for(var i = 0; i < allInfo.length; i++) {
		if(nowAreaName == "山东省" || nowAreaName == "青岛市") {
			if(allInfo[i].properCity != "山东省") {
				continue;
			}
		}
		var numberValue = parseInt(i / 3) % 2;
		if(i % 3 == 0) {
			if(numberValue == 0) {
				strLeData += '<div class="panel-content">';
				strRiData += '</div>';
			} else if(numberValue == 1) {
				strLeData += '</div>';
				strRiData += '<div class="panel-content">';
			}
		}
		if(numberValue == 0) {
			strLeData += `<div class="half-box">
					<div class="box-title">
						<i class="icon iconfont icondichanmingcheng"></i>
						<span>${allInfo[i].properCity} ${allInfo[i].name}</span>
					</div>
					<div class="box-content">
						<div class="box-img">
							<img src="img/community/${allInfo[i].properImg}.png" />
							<div class="half-box-content">
								<div class="three-half-box" style="height:23%"></div>
								<div class="three-half-box">
									<div class="three-half-box-title">物业类型:</div>
									<div class="three-half-box-desc color-orange-light"><i class="icon iconfont iconwuyeleixing"></i>${allInfo[i].properType}</div>
								</div>
								<div class="three-half-box" style="background: url(./img/panel_img_bg.png) no-repeat center center/100% 100%;height:43.67%;">
									<div class="three-half-box-title">物业地址:</div>
									<div class="three-half-box-desc color-white-light"><i class="icon iconfont iconwuyedizhi"></i>${allInfo[i].properAddr}</div>
								</div>
							</div>
						</div>
					</div>
				</div>`;
		} else if(numberValue == 1) {
			strRiData += `<div class="half-box">
					<div class="box-title">
						<i class="icon iconfont icondichanmingcheng"></i>
						<span>${allInfo[i].properCity} ${allInfo[i].name}</span>
					</div>
					<div class="box-content">
						<div class="box-img">
							<img src="img/community/${allInfo[i].properImg}.png" />
							<div class="half-box-content">
								<div class="three-half-box" style="height:23%"></div>
								<div class="three-half-box">
									<div class="three-half-box-title">物业类型:</div>
									<div class="three-half-box-desc color-orange-light"><i class="icon iconfont iconwuyeleixing"></i>${allInfo[i].properType}</div>
								</div>
								<div class="three-half-box" style="background: url(./img/panel_img_bg.png) no-repeat center center/100% 100%;height:43.67%;">
									<div class="three-half-box-title">物业地址:</div>
									<div class="three-half-box-desc color-white-light"><i class="icon iconfont iconwuyedizhi"></i>${allInfo[i].properAddr}</div>
								</div>
							</div>
						</div>
					</div>
				</div>`;
		}
	}
	$('.left-panel').html(strLeData);
	$('.right-panel').html(strRiData);

	//初始化
	console.log("初始化数据")
	initHtmlData();
	strLeCountNum = 0;
	strRiCountNum = 0;
	if(nowAreaName == "云玺社区") {
		console.log('进入云玺社区界面')
		if(myTimer1) {
			clearInterval(myTimer1)
		}
		if(myTimer2) {
			clearInterval(myTimer2)
		}
		strLeCountNum = 0;
		strRiCountNum = 0;
		return false;
	}

	$('.left-panel .panel-content').eq(0).addClass("pt-page-moveFromLeftFade");
	map.on('complete', function(e) {
		getControlInfo("全国");
		if(!$("#code370000").html()) {
			setTimeout(function() {
				if(!strTJHtml) {
					strTJHtml = $("#code120000").html();
				}
				if(!strSXHtml) {
					strSXHtml = $("#code140000").html();
				}
				if(!strSHHtml) {
					strSHHtml = $("#code310000").html();
				}
				if(!strJSHtml) {
					strJSHtml = $("#code320000").html();
				}
				if(!strAHHtml) {
					strAHHtml = $("#code340000").html();
				}
				if(!strFJHtml) {
					strFJHtml = $("#code350000").html();
				}
				if(!strSDHtml) {
					strSDHtml = $("#code370000").html();
				}
				if(!strHBHtml) {
					strHBHtml = $("#code420000").html();
				}
				if(!strCQHtml) {
					strCQHtml = $("#code500000").html();
				}
				
				$("#code370000").html("");
				$("#code370000").animate({
					width: '24px'
				}, 1000, function() {
					$(this).animate({
						width: '0px',
						height: '0px',
					}, 500, function() {
						$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">山东省</div><div class="line-panel-box-desc-info">SHANGDONG PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">37</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
						$(this).find('.line-panel').animate({
							width: '362px'
						}, 1500)
					})
				});
			}, 2000)
		} else {
			if(!strTJHtml) {
				strTJHtml = $("#code120000").html();
			}
			if(!strSXHtml) {
				strSXHtml = $("#code140000").html();
			}
			if(!strSHHtml) {
				strSHHtml = $("#code310000").html();
			}
			if(!strJSHtml) {
				strJSHtml = $("#code320000").html();
			}
			if(!strAHHtml) {
				strAHHtml = $("#code340000").html();
			}
			if(!strFJHtml) {
				strFJHtml = $("#code350000").html();
			}
			if(!strSDHtml) {
				strSDHtml = $("#code370000").html();
			}
			if(!strHBHtml) {
				strHBHtml = $("#code420000").html();
			}
			if(!strCQHtml) {
				strCQHtml = $("#code500000").html();
			}
			setTimeout(function() {
				$("#code370000").html("");
				$("#code370000").animate({
					width: '24px'
				}, 1000, function() {
					$(this).animate({
						width: '0px',
						height: '0px',
					}, 500, function() {
						$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">山东省</div><div class="line-panel-box-desc-info">SHANGDONG PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">37</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
						$(this).find('.line-panel').animate({
							width: '362px'
						}, 1500)
					})
				});
			}, 1000)
		}
	});

	if(myTimer1) {
		clearInterval(myTimer1)
	}
	myTimer1 = setInterval(function() {
		console.log(strLeCountNum)
		if(strLeCountNum == 8 && nowAreaName == "全国") {
			initHtmlData(0);
			isFirstFlag = false;
			$("#code370000").html("");
			$("#code370000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">山东省</div><div class="line-panel-box-desc-info">SHANGDONG PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">37</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});
		} else if(strLeCountNum == 6 && nowAreaName == "全国") {
			initHtmlData(1);
			$("#code140000").html("");
			$("#code140000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">山西省</div><div class="line-panel-box-desc-info">SHANGXI PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">3</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});

			$("#code320000").html("");
			$("#code320000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel" style="transform: rotateX(180deg)"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box" style="transform: rotateX(180deg)"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">江苏省</div><div class="line-panel-box-desc-info">JIANGSU PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">3</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});
		} else if(strLeCountNum == 7 && nowAreaName == "全国") {
			initHtmlData(2);
			$("#code120000").html("");
			$("#code120000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">天津市</div><div class="line-panel-box-desc-info">TIANJIN CITY</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">1</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});

			$("#code310000").html("");
			$("#code310000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">上海市</div><div class="line-panel-box-desc-info">SHANGHAI CITY</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">1</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});

			$("#code340000").html("");
			$("#code340000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel" style="transform: rotateX(180deg)"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box" style="transform: rotateX(180deg)"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">安徽省</div><div class="line-panel-box-desc-info">ANHUI PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">1</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});

			$("#code350000").html("");
			$("#code350000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel" style="transform: rotate(180deg)"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box" style="transform: rotate(180deg)"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">福建省</div><div class="line-panel-box-desc-info">FUJIAN PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">1</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});

			$("#code420000").html("");
			$("#code420000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel" style="transform: rotateY(180deg)"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box" style="transform: rotateY(180deg)"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">湖北省</div><div class="line-panel-box-desc-info">HUBEI PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">1</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});

			$("#code500000").html("");
			$("#code500000").animate({
				width: '24px'
			}, 1000, function() {
				$(this).animate({
					width: '0px',
					height: '0px',
				}, 500, function() {
					$(this).html('<div class="diffusion2"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div><div class="line-panel" style="transform: rotate(180deg)"><div class="line-panel-line"><img src="img/line.png"/></div><div class="line-panel-box" style="transform: rotate(180deg)"><img src="img/panel.png"/><div class="line-panel-box-desc"><div class="line-panel-box-desc-name">重庆市</div><div class="line-panel-box-desc-info">CHONGQING PROVINCE</div></div><div class="line-panel-box-info"><div class="line-panel-box-info-name">1</div><div class="line-panel-box-info-desc">社区数量</div></div></div></div>');
					$(this).find('.line-panel').animate({
						width: '362px'
					}, 1500)
				})
			});
		}
		$('.left-panel .panel-content').eq(strLeCountNum).removeClass("pt-page-moveFromLeftFade");
		if(strLeCountNum < -2) {
			$('.left-panel .panel-content').eq(strLeCountNum).fadeOut(1400);
		} else {
			$('.left-panel .panel-content').eq(strLeCountNum).addClass("pt-page-moveToLeftEasing")
			$('.left-panel .panel-content').eq(strLeCountNum).fadeOut(1400, function() {
				$(this).removeClass("pt-page-moveToLeftEasing");
			});
		}
		strLeCountNum++;
		if(!$('.left-panel .panel-content').eq(strLeCountNum).html()) {
			strLeCountNum = 0;
		}
		$('.left-panel .panel-content').eq(strLeCountNum).show();
		$('.left-panel .panel-content').eq(strLeCountNum).addClass("pt-page-moveFromLeftFade");
	}, 5000);

	$('.right-panel .panel-content').eq(0).addClass("pt-page-moveFromRightFade");
	if(myTimer2) {
		clearInterval(myTimer2)
	}
	myTimer2 = setInterval(function() {
		$('.right-panel .panel-content').eq(strRiCountNum).removeClass("pt-page-moveFromRightFade");
		if(strLeCountNum < -2) {
			$('.right-panel .panel-content').eq(strRiCountNum).fadeOut(1400);
		} else {
			$('.right-panel .panel-content').eq(strRiCountNum).addClass("pt-page-moveToRightEasing")
			$('.right-panel .panel-content').eq(strRiCountNum).fadeOut(1400, function() {
				$(this).removeClass("pt-page-moveToRightEasing");
			});
		}
		strRiCountNum++;
		if(!$('.right-panel .panel-content').eq(strRiCountNum).html()) {
			strRiCountNum = 0;
		}
		$('.right-panel .panel-content').eq(strRiCountNum).show();
		$('.right-panel .panel-content').eq(strRiCountNum).addClass("pt-page-moveFromRightFade");
	}, 5000);
}

function initHtmlData(type) {
	if(type == 0) {
		$("#code120000").css({
			width: '80px',
			height: '24px'
		})
		$("#code120000").html(strTJHtml);
		$("#code140000").css({
			width: '80px',
			height: '24px'
		})
		$("#code140000").html(strSXHtml);
		$("#code310000").css({
			width: '80px',
			height: '24px'
		})
		$("#code310000").html(strSHHtml);
		$("#code320000").css({
			width: '80px',
			height: '24px'
		})
		$("#code320000").html(strJSHtml);
		$("#code340000").css({
			width: '80px',
			height: '24px'
		})
		$("#code340000").html(strAHHtml);
		$("#code350000").css({
			width: '80px',
			height: '24px'
		})
		$("#code350000").html(strFJHtml);
		$("#code420000").css({
			width: '80px',
			height: '24px'
		})
		$("#code420000").html(strHBHtml);
		$("#code500000").css({
			width: '80px',
			height: '24px'
		})
		$("#code500000").html(strCQHtml);
	} else if(type == 1) {
		$("#code120000").css({
			width: '80px',
			height: '24px'
		})
		$("#code120000").html(strTJHtml);
		$("#code310000").css({
			width: '80px',
			height: '24px'
		})
		$("#code310000").html(strSHHtml);
		$("#code340000").css({
			width: '80px',
			height: '24px'
		})
		$("#code340000").html(strAHHtml);
		$("#code350000").css({
			width: '80px',
			height: '24px'
		})
		$("#code350000").html(strFJHtml);
		$("#code370000").css({
			width: '80px',
			height: '24px'
		})
		$("#code370000").html(strSDHtml);
		$("#code420000").css({
			width: '80px',
			height: '24px'
		})
		$("#code420000").html(strHBHtml);
		$("#code500000").css({
			width: '80px',
			height: '24px'
		})
		$("#code500000").html(strCQHtml);
	} else if(type == 2) {
		$("#code140000").css({
			width: '80px',
			height: '24px'
		})
		$("#code140000").html(strSXHtml);
		$("#code320000").css({
			width: '80px',
			height: '24px'
		})
		$("#code320000").html(strJSHtml);
		$("#code370000").css({
			width: '80px',
			height: '24px'
		})
		$("#code370000").html(strSDHtml);
	} else {
		$("#code120000").css({
			width: '80px',
			height: '24px'
		})
		$("#code120000").html(strTJHtml);
		$("#code140000").css({
			width: '80px',
			height: '24px'
		})
		$("#code140000").html(strSXHtml);
		$("#code310000").css({
			width: '80px',
			height: '24px'
		})
		$("#code310000").html(strSHHtml);
		$("#code320000").css({
			width: '80px',
			height: '24px'
		})
		$("#code320000").html(strJSHtml);
		$("#code340000").css({
			width: '80px',
			height: '24px'
		})
		$("#code340000").html(strAHHtml);
		$("#code350000").css({
			width: '80px',
			height: '24px'
		})
		$("#code350000").html(strFJHtml);
		$("#code370000").css({
			width: '80px',
			height: '24px'
		})
		$("#code370000").html(strSDHtml);
		$("#code420000").css({
			width: '80px',
			height: '24px'
		})
		$("#code420000").html(strHBHtml);
		$("#code500000").css({
			width: '80px',
			height: '24px'
		})
		$("#code500000").html(strCQHtml);
	}
}

function getControlInfo(dataInfo) {console.log(dataInfo)
	if(map && distCluster) {
		if(dataInfo == "山东省") {
			nowAreaName = "山东省";
			
			$('.left-panel').show();
			$('.left-panel-detail').hide();
			$('.right-panel').show();
			$('.right-panel-detail').hide();
			$(".footer-panel ul").hide();
			$(".custom-marker-community").hide();
			
			//旋转动画效果
			getRotateAnimate();
			distCluster.zoomToShowSubFeatures(370000, [118.779845, 36.03233]);
		} else if(dataInfo == "青岛市") {
			nowAreaName = "青岛市";
			
			$('.left-panel').show();
			$('.left-panel-detail').hide();
			$('.right-panel').show();
			$('.right-panel-detail').hide();
			$(".footer-panel ul").hide();
			$(".custom-marker-community").show();
			
			//旋转动画效果
			getRotateAnimate();
			distCluster.zoomToShowSubFeatures(370200);
		} else if(dataInfo == "云玺社区") {
			$('.left-panel .panel-content').eq(strLeCountNum).fadeOut(600, function() {
				$('.left-panel').hide();
			});
			$('.left-panel-detail').show();
			$('.left-panel-detail .panel-content').addClass("pt-page-moveFromLeftFade");

			$('.right-panel .panel-content').eq(strRiCountNum).fadeOut(600, function() {
				$('.right-panel').hide();
			});
			$('.right-panel-detail').show();
			$('.right-panel-detail .panel-content').addClass("pt-page-moveFromRightFade");

			$(".footer-panel ul").show();
			$(".footer-panel").addClass("pt-page-moveFromBottomFade");
			
			getRotateAnimate();
			nowAreaName = "云玺社区";
			$(".custom-marker-community").show();
			map.setZoomAndCenter(17, [120.428208, 36.133509]); //同时设置地图层级与中心点
		} else {
			nowAreaName = "全国";
			
			$('.left-panel').show();
			$('.left-panel-detail').hide();
			$('.right-panel').show();
			$('.right-panel-detail').hide();
			$(".footer-panel ul").hide();
			$(".custom-marker-community").hide();
			
			//旋转动画效果
			getRotateAnimate();
			
			map.setZoomAndCenter(zoomChangeLevel, [114.674342, 32.86966]); //同时设置地图层级与中心点
		}
	}
}

function ShowSubFeaturesByCode(adcode) {
	if(distCluster) {
		if(adcode == 370000) {
			nowAreaName = "山东省";
			//旋转动画效果
			getRotateAnimate();
			distCluster.zoomToShowSubFeatures(370000, [118.779845, 36.03233]);
		} else {
			nowAreaName = "其他城市";
			//旋转动画效果
			getRotateAnimate();
			distCluster.zoomToShowSubFeatures(adcode);
		}
	}
}

// 底部卡片
function getCardInfo() {
	var allInfo = getPoints();
	var strData = "";
	for(var i = 0; i < allInfo.length; i++) {
		strData += `<li class="card-box">
						<div class="card-box-content">
							<span class="horn left-top-horn"></span>
							<span class="horn right-top-horn"></span>
							<span class="horn left-bottom-horn"></span>
							<span class="horn right-bottom-horn"></span>
							<img src="img/community/${allInfo[i].properImg}.png" />
							<div class="three-half-box">
								<div class="three-half-box-title">地产名称</div>
								<div class="three-half-box-desc color-orange-light"><i class="icon iconfont icondichanmingcheng"></i>${allInfo[i].name}</div>
							</div>
							<div class="three-half-box">
								<div class="three-half-box-title">物业类型:</div>
								<div class="three-half-box-desc color-white-light"><i class="icon iconfont iconwuyeleixing"></i>${allInfo[i].properType}</div>
							</div>
							<div class="three-half-box">
								<div class="three-half-box-title">物业地址:</div>
								<div class="three-half-box-desc color-white-light"><i class="icon iconfont iconwuyedizhi"></i>${allInfo[i].properAddr}</div>
							</div>
						</div>
					</li>`;
	}
	$('#footerPanelId ul').html(strData);
	$("#footerPanelId").scrollForever();
}

// 初始化地图
function initMaps() {
	if(typeof(AMap) == "undefined") {
		window.location.reload();
	} else {
		map = new AMap.Map('container', {
			resizeEnable: true, //是否监控地图容器尺寸变化
			mapStyle: "amap://styles/a66fd2e326a78e85c27082f33e6541ad",
			center: [114.674342, 32.86966],
			zoom: zoomChangeLevel,
		});
	}

	if(typeof(AMapUI) == "undefined") {
		window.location.reload();
	} else {
		//加载行政区划聚合|海量点相关组件
		AMapUI.load(['ui/geo/DistrictCluster', 'ui/geo/DistrictExplorer'], function(DistrictCluster, DistrictExplorer) {
			window.DistrictCluster = DistrictCluster;
			window.DistrictExplorer = DistrictExplorer;
			//启动页面
			initPage(DistrictCluster, DistrictExplorer);
		});
	}
}

// 初始化聚合点和行政区划
function initPage(DistrictCluster, DistrictExplorer) {
	map.on('zoomchange', function(e) {
		ZoomChangeFun();
	});

	distCluster = new DistrictCluster({
		map: map, //所属的地图实例
		zIndex: 11,
		topAdcodes: topAdcodes,
		autoSetFitView: false,
		getPosition: function(item) {

			if(!item) {
				return null;
			}
			return item.value;
		},
		renderOptions: {
			clusterMarkerClickToShowSub: false,
			getClusterMarkerPosition: function(feature, dataItems) {
				if(feature.properties.name == "山东省") {
					return new AMap.LngLat(120.428208, 36.133509);
				} else if(feature.properties.name == "湖南省") {
					return new AMap.LngLat(110.983074, 28.116077);
				} else if(feature.properties.name == "江苏省") {
					return new AMap.LngLat(118.763563, 33.061361);
				}
				return feature.properties.center; //返回行政中心
			},
			getClusterMarker: function(feature, dataItems, recycledMarker) {
				//存在可回收利用的marker
				if(recycledMarker) {
					return null;
				}
				var adcode = parseInt(feature.properties.adcode / 10000) * 10000;
				var markerLength = feature.properties.name.length * 18 + 26;
				var strConetntAnimate = '<p class="custom-marker custom-marker-dark other-customer" id="code' + feature.properties.adcode + '" style="width: ' + markerLength + 'px" disabled><span class="custom-marker-span custom-marker-span-dark">' + dataItems.length + '</span><span class="custom-marker-font">' + feature.properties.name + '</span></p>'
				if(map.getZoom() > zoomChangeLevel) {
					if(adcode == 370000) {
						if(dataItems.length > 0) {
							strConetntAnimate = '<p class="custom-marker custom-marker-light" id="code' + feature.properties.adcode + '" onclick="ShowSubFeaturesByCode(' + feature.properties.adcode + ')" style="width: ' + markerLength + 'px"><span class="custom-marker-span custom-marker-span-light">' + dataItems.length + '</span><span class="custom-marker-font">' + feature.properties.name + '</span></p>'
						} else {
							strConetntAnimate = '<p class="custom-marker custom-marker-dark" id="code' + feature.properties.adcode + '" style="width: ' + markerLength + 'px"><span class="custom-marker-span custom-marker-span-dark">' + dataItems.length + '</span><span class="custom-marker-font">' + feature.properties.name + '</span></p>'
						}
					} else {
						strConetntAnimate = '<p class="custom-marker custom-marker-dark other-customer" id="code' + feature.properties.adcode + '" style="width: ' + markerLength + 'px;display:none" disabled><span class="custom-marker-span custom-marker-span-dark">' + dataItems.length + '</span><span class="custom-marker-font">' + feature.properties.name + '</span></p>'
					}
				} else {
					if(adcode == 370000) {
						if(dataItems.length > 0) {
							strConetntAnimate = '<p class="custom-marker custom-marker-light" id="code' + feature.properties.adcode + '" onclick="ShowSubFeaturesByCode(' + feature.properties.adcode + ')" style="width: ' + markerLength + 'px"><span class="custom-marker-span custom-marker-span-light">' + dataItems.length + '</span><span class="custom-marker-font">' + feature.properties.name + '</span></p>'
						} else {
							strConetntAnimate = '<p class="custom-marker custom-marker-dark" id="code' + feature.properties.adcode + '" style="width: ' + markerLength + 'px"><span class="custom-marker-span custom-marker-span-dark">' + dataItems.length + '</span><span class="custom-marker-font">' + feature.properties.name + '</span></p>'
						}
					}
				}

				if(feature.properties.adcode == 370000) {
					strConetntAnimate = '<p class="custom-marker custom-marker-light" id="code' + feature.properties.adcode + '" onclick="ShowSubFeaturesByCode(' + feature.properties.adcode + ')"><span class="custom-marker-span custom-marker-span-light">37</span><span class="custom-marker-font">山东省</span></div>';
				}

				if(feature.properties.adcode == 370200) {
					strConetntAnimate = '<p class="custom-marker custom-marker-light" id="code' + feature.properties.adcode + '" onclick="ShowSubFeaturesByCode(' + feature.properties.adcode + ')"><span class="custom-marker-span custom-marker-span-light">33</span><span class="custom-marker-font">青岛市</span></div>';
				}

				if(feature.properties.adcode == 370211) {
					strConetntAnimate = '<p class="custom-marker custom-marker-light" id="code' + feature.properties.adcode + '" onclick="ShowSubFeaturesByCode(' + feature.properties.adcode + ')"><span class="custom-marker-span custom-marker-span-light">7</span><span class="custom-marker-font">黄岛区</span></div>';
				}

				if(feature.properties.adcode == 370214) {
					strConetntAnimate = '<p class="custom-marker custom-marker-light" id="code' + feature.properties.adcode + '" onclick="ShowSubFeaturesByCode(' + feature.properties.adcode + ')"><span class="custom-marker-span custom-marker-span-light">3</span><span class="custom-marker-font">城阳区</span></div>';
				}

				if(feature.properties.adcode == 370215) {
					strConetntAnimate = '<p class="custom-marker custom-marker-light" id="code' + feature.properties.adcode + '" onclick="ShowSubFeaturesByCode(' + feature.properties.adcode + ')"><span class="custom-marker-span custom-marker-span-light">5</span><span class="custom-marker-font">即墨区</span></div>';
				}

				var realMarker = new AMap.Marker({
					content: strConetntAnimate
				});

				return realMarker
			},
			//基础样式
			featureStyle: {
				fillStyle: 'rgba(89,173,255,0.6)', //填充色
				lineWidth: 1, //描边线宽
				strokeStyle: 'rgb(31, 119, 180)', //描边色
				//鼠标Hover后的样式
				hoverOptions: null
			},
			//特定区划级别的默认样式
			featureStyleByLevel: {
				country: {
					fillStyle: 'rgba(89, 173, 255, 0.6)'
				},
				province: {
					fillStyle: 'rgba(89, 173, 255, 0.4)'
				},
				city: {
					fillStyle: 'rgba(89, 173, 255, 0.2)'
				},
				district: {
					fillStyle: 'rgba(89, 173, 255, 0.1)'
				}
			},
			//直接定义某写区划面的样式
			getFeatureStyle: function(feature, dataItems) {
				if(map.getZoom() >= 17) {
					return {
						strokeStyle: strStrokeStyle, //描边色
						fillStyle: 'rgba(89, 173, 255, 0)',
						//鼠标Hover后的样式
						hoverOptions: null
					};
				}

				if(feature.properties.level == "province") {
					var arr = [120000, 140000, 310000, 320000, 340000, 350000, 420000, 500000];
					if(arr.includes(feature.properties.adcode)) {
						featureCountNum++;
						return {
							strokeStyle: strStrokeStyle, //描边色
							fillStyle: strFillStyle,
							//鼠标Hover后的样式
							hoverOptions: null
						};
					}
				} else {
					var adcode = parseInt(feature.properties.adcode / 10000) * 10000;
					if(adcode == 370000) {
						if(dataItems.length > 0) {
							if(feature.properties.level == "city") {
								return {
									fillStyle: 'rgba(89, 173, 255, 0.4)',
									//鼠标Hover后的样式
									hoverOptions: null
								};
							} else {
								return {
									fillStyle: 'rgba(89, 173, 255, 0.1)',
									//鼠标Hover后的样式
									hoverOptions: null
								};
							}

						} else {
							return {
								strokeStyle: 'rgba(87,88,89,.9)', //描边色
								fillStyle: 'rgba(87,88,89,.4)',
								//鼠标Hover后的样式
								hoverOptions: null
							};
						}
					} else {
						return {
							strokeStyle: 'rgba(87,88,89,.9)', //描边色
							fillStyle: 'rgba(87,88,89,.4)',
							//鼠标Hover后的样式
							hoverOptions: null
						};
					}
				}
				return null;
			}
		}
	});

	//随机创建一批点，仅作示意
	var data = getPoints();
	//设置数据
	distCluster.setData(data);

}

// 页面缩放事件 动态显示省份
function ZoomChangeFun() {
	var zoom = map.getZoom();
	if(zoom > zoomChangeLevel) {
		topAdcodes = [370000];
		//设置数据
		distCluster.setData(getPoints());
		strStrokeStyle = 'rgba(87,88,89,0)';
		strFillStyle = 'rgba(87,88,89,0)';
		$(".diffusion").show();
		$(".other-customer").hide();
	} else {
		topAdcodes = [120000, 140000, 310000, 320000, 340000, 350000, 370000, 420000, 500000];
		//设置数据
		distCluster.setData(getPoints());
		strStrokeStyle = 'rgba(87,88,89,.9)';
		strFillStyle = 'rgba(87,88,89,.4)';
		$(".diffusion").hide();
		$(".other-customer").show();
	}
	if(zoom >= 10) {
		$(".custom-marker-community").show();
	} else {

		$(".custom-marker-community").hide();
	}
}

function goOthePage() {
	$('.left-panel .panel-content').eq(strLeCountNum).fadeOut(1400, function() {
		$('.left-panel').hide();
	});
	$('.left-panel-detail').show();
	$('.left-panel-detail .panel-content').addClass("pt-page-moveFromLeftFade");

	$('.right-panel .panel-content').eq(strRiCountNum).fadeOut(1400, function() {
		$('.right-panel').hide();
	});
	$('.right-panel-detail').show();
	$('.right-panel-detail .panel-content').addClass("pt-page-moveFromRightFade");

	$(".footer-panel ul").show();
	$(".footer-panel").addClass("pt-page-moveFromBottomFade");
	getRotateAnimate();
	map.setZoomAndCenter(17, [120.428208, 36.133509]); //同时设置地图层级与中心点
}

function drawMarkers() {
	var strConetntAnimate = '<div class="diffusion"><i class="icon iconfont diffusion-real-inner"></i><i class="icon iconfont diffusion-inner"></i><i class="icon iconfont diffusion-real-inner2"></i><i class="icon iconfont diffusion-inner2"></i></div>'
	var clerkMarker = new AMap.Marker({
		map: map,
		offset: new AMap.Pixel(0, 0),
		content: strConetntAnimate,
		position: [120.428208, 36.133509]
	});
	clerkMarker.setLabel({
		offset: new AMap.Pixel(0, 0),
		content: '<p class="custom-marker-community" onclick="goOthePage()"><img src="./img/community_title.png" class="custom-marker-community-bg" /><span class="custom-marker-span"><i class="icon iconfont iconyuanqu1"></i></span><span class="custom-marker-font">海尔云玺</span></p>'
	});
}

function getPoints() {
	var lnglatLists = [{
			name: "白云山花园",
			value: [120.446751, 36.317666],
			properAddr: "山东省青岛市城阳区春阳路37号",
			properType: "住宅,洋房",
			properCity: "山东省",
			properImg: 1
		},
		{
			name: "香溪地",
			value: [120.408462, 36.411853],
			properAddr: "青岛市即墨区青威路与明水二路交汇处（青威路辅路）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 2
		},
		{
			name: "海尔信息谷•熙园",
			value: [120.169608, 35.973327],
			properAddr: "山东省青岛市西海岸新区香江路1017号",
			properType: "住宅,别墅,洋房",
			properCity: "山东省",
			properImg: 3
		},
		{
			name: "蓝谷海上东方",
			value: [120.72701, 36.57103],
			properAddr: "青岛市即墨区硅谷路6号",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 4
		},
		{
			name: "融海公馆",
			value: [120.007558, 35.815283],
			properAddr: "青岛市军民融合区山川路与翠岛路交汇处",
			properType: "住宅,商业,文化,养生,别墅",
			properCity: "山东省",
			properImg: 5
		},
		{
			name: "东方文华",
			value: [120.449335, 36.397899],
			properAddr: "青岛市即墨区鹤山路与朝阳路交汇处",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 6
		},
		{
			name: "国际广场（高新区）",
			value: [120.274126, 36.264513],
			properAddr: "青岛高新区智力岛路8号",
			properType: "商业",
			properCity: "山东省",
			properImg: 7
		},
		{
			name: "翡翠云城",
			value: [120.496078, 36.165848],
			properAddr: "青岛市崂山区松岭路199号（海大崂山校区对面）",
			properType: "住宅,商业,别墅,洋房",
			properCity: "山东省",
			properImg: 8
		},
		{
			name: "世纪观邸",
			value: [120.393549, 36.124022],
			properAddr: "市北区新都心德兴路56号",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 9
		},
		{
			name: "即墨中央花园",
			value: [120.536684, 36.408746],
			properAddr: "即墨创智新区市民服务大厅北500米（壮武路以西）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 10
		},
		{
			name: "莱茵公馆",
			value: [120.1131, 36.068506],
			properAddr: "青岛市黄岛区团结路北侧、昆仑山路东侧中德生态园",
			properType: "住宅",
			properCity: "山东省",
			properImg: 11
		},
		{
			name: "海尔云谷",
			value: [120.429786, 36.133318],
			properAddr: "青岛市海尔路1号",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 12
		},
		{
			name: "珺玺",
			value: [120.25721, 36.245975],
			properAddr: "青岛高新区火炬路北与新悦路交汇处",
			properType: "住宅,商业,别墅",
			properCity: "山东省",
			properImg: 13
		},
		{
			name: "云玺",
			value: [120.429786, 36.133318],
			properAddr: "青岛市崂山区海尔路一号(海尔工业园一号门旁)",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 14
		},
		{
			name: "波尔多小镇",
			value: [120.540073, 36.113822],
			properAddr: "青岛市崂山区李沙路崂山南麓",
			properType: "住宅,文化,养生,别墅,洋房",
			properCity: "山东省",
			properImg: 15
		},
		{
			name: "海逸公馆",
			value: [120.492942, 36.12849],
			properAddr: "青岛市崂山区辽阳东路77号",
			properType: "住宅",
			properCity: "山东省",
			properImg: 16
		},
		{
			name: "世纪公馆",
			value: [120.390468, 36.119924],
			properAddr: "青岛市市北区新都心合肥路与蚌埠路交汇处（立新小学对面）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 17
		},
		{
			name: "悦湖兰庭",
			value: [120.144176, 35.976861],
			properAddr: "青岛市黄岛区香江路735号",
			properType: "商业",
			properCity: "山东省",
			properImg: 18
		},
		{
			name: "博悦兰庭",
			value: [120.433578, 36.183609],
			properAddr: "李沧区广水路以南东川路以东",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 19
		},
		{
			name: "云街",
			value: [120.38306, 36.114558],
			properAddr: "市北区重庆南路99号",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 20
		},
		{
			name: "信息谷",
			value: [120.173211, 35.971508],
			properAddr: "青岛黄岛区香江路",
			properType: "别墅,商业",
			properCity: "山东省",
			properImg: 21
		},
		{
			name: "山海湾",
			value: [120.238029, 35.964034],
			properAddr: "青岛市开发区漓江东路505号",
			properType: "住宅",
			properCity: "山东省",
			properImg: 22
		},
		{
			name: "学府",
			value: [120.369686, 36.102995],
			properAddr: "青岛市市北区抚顺支路9号",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 23
		},
		{
			name: "玫瑰兰庭",
			value: [120.382222, 36.117272],
			properAddr: "青岛市市北区重庆南路128号（麦德龙北侧）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 24
		},
		{
			name: "海尔创新研究中心",
			value: [120.442632, 36.069236],
			properAddr: "崂山区东海路以南，极地海洋世界以西",
			properType: "文化",
			properCity: "山东省",
			properImg: 25
		},
		{
			name: "时代风景",
			value: [120.37158, 36.079253],
			properAddr: "青岛市市北宁夏路87号（宁夏路与镇江南路交汇处）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 26
		},
		{
			name: "鼎世华府",
			value: [120.418442, 36.146141],
			properAddr: "青岛市李沧区青山路与台柳路交汇处（李沧宝龙城市广场南侧）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 27
		},
		{
			name: "时代广场",
			value: [120.38225, 36.114349],
			properAddr: "青岛市市北重庆南路99号（原海尔冰箱厂）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 28
		},
		{
			name: "御品华府",
			value: [120.054781, 36.286829],
			properAddr: "胶州海尔工业园北侧",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 29
		},
		{
			name: "首府",
			value: [119.987397, 36.776193],
			properAddr: "平度海尔大道与长江路交汇处（市政府南侧）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 30
		},
		{
			name: "原乡小镇",
			value: [120.632937, 36.435175],
			properAddr: "即墨市温泉镇温泉一路399号",
			properType: "别墅",
			properCity: "山东省",
			properImg: 31
		},
		{
			name: "海尔东城国际",
			value: [120.443217, 36.107205],
			properAddr: "青岛市崂山区辽阳东路16号",
			properType: "住宅",
			properCity: "山东省",
			properImg: 32
		},
		{
			name: "海尔望山居",
			value: [120.153113, 36.007047],
			properAddr: "青岛市经济技术开发区奋进路666号",
			properType: "住宅",
			properCity: "山东省",
			properImg: 33
		},
		{
			name: "天玺",
			value: [117.096829, 36.690544],
			properAddr: "济南市历下区花园路与化纤厂路交汇处",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 34
		},
		{
			name: "云世界",
			value: [117.025559, 36.678442],
			properAddr: "济南市天桥区大明湖北500米，小清河以南",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 35
		},
		{
			name: "济南时代大厦",
			value: [117.071301, 36.651657],
			properAddr: "济南市燕山立交西南角（经十路17079号）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 36
		},
		{
			name: "济南全运村",
			value: [117.126687, 36.653347],
			properAddr: "济南市历下区奥体东路（奥体中心东南侧）",
			properType: "住宅,洋房",
			properCity: "山东省",
			properImg: 37
		},
		{
			name: "白云山花园",
			value: [120.446751, 36.317666],
			properAddr: "山东省青岛市城阳区春阳路37号",
			properType: "住宅,洋房",
			properCity: "山东省",
			properImg: 1
		},
		{
			name: "香溪地",
			value: [120.408462, 36.411853],
			properAddr: "青岛市即墨区青威路与明水二路交汇处（青威路辅路）",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 2
		},
		{
			name: "海尔信息谷•熙园",
			value: [120.169608, 35.973327],
			properAddr: "山东省青岛市西海岸新区香江路1017号",
			properType: "住宅,别墅,洋房",
			properCity: "山东省",
			properImg: 3
		},
		{
			name: "蓝谷海上东方",
			value: [120.72701, 36.57103],
			properAddr: "青岛市即墨区硅谷路6号",
			properType: "住宅,商业",
			properCity: "山东省",
			properImg: 4
		},
		{
			name: "融海公馆",
			value: [120.007558, 35.815283],
			properAddr: "青岛市军民融合区山川路与翠岛路交汇处",
			properType: "住宅,商业,文化,养生,别墅",
			properCity: "山东省",
			properImg: 5
		},
		{
			name: "太原学府",
			value: [112.518869, 37.857957],
			properAddr: "太原迎泽西大街与千峰路交汇处往北800米（玉门河旁）",
			properType: "住宅,商业",
			properCity: "山西省",
			properImg: 38
		},
		{
			name: "太原国际广场",
			value: [112.527409, 37.876016],
			properAddr: "太原市万柏林区漪汾街与文兴路交汇处海尔地产国际广场售楼部",
			properType: "住宅",
			properCity: "山西省",
			properImg: 39
		},
		{
			name: "十二院城",
			value: [112.510585, 37.839482],
			properAddr: "山西省太原市万柏林区和平南路139号",
			properType: "住宅,商业,文化,别墅",
			properCity: "山西省",
			properImg: 40
		},
		{
			name: "海尔创智谷",
			value: [120.46119, 31.598114],
			properAddr: "无锡锡东新城火车东站北广场对面（新华路与兴越路交汇处）",
			properType: "住宅,商业",
			properCity: "江苏省",
			properImg: 42
		},
		{
			name: "滟澜公馆",
			value: [117.159183, 34.265823],
			properAddr: "徐州市泉山区矿山路6号",
			properType: "住宅,商业",
			properCity: "江苏省",
			properImg: 46
		},
		{
			name: "南京双湖壹号公馆",
			value: [118.91017, 31.34294],
			properAddr: "双湖路与芜太路交汇处",
			properType: "住宅,别墅",
			properCity: "江苏省",
			properImg: 48
		},
		{
			name: "天津世纪公馆",
			value: [117.44526, 39.2047],
			properAddr: "天津市东丽湖东丽大道与丽桐路交口",
			properType: "别墅,洋房",
			properCity: "天津市",
			properImg: 41
		},
		{
			name: "武汉国际广场",
			value: [114.195986, 30.597532],
			properAddr: "武汉市硚口区解放大道古田二路轻轨站口",
			properType: "住宅,商业",
			properCity: "湖南省",
			properImg: 43
		},
		{
			name: "重庆海语江山",
			value: [106.577982, 29.613802],
			properAddr: "重庆市江北区海尔路199号（江北区府侧对面）",
			properType: "住宅,商业",
			properCity: "重庆市",
			properImg: 44
		},
		{
			name: "上海智谷",
			value: [121.269594, 31.052097],
			properAddr: "海市松江区广富林东路66号",
			properType: "工业",
			properCity: "上海市",
			properImg: 45
		},
		{
			name: "合肥智慧公馆",
			value: [117.359667, 31.866531],
			properAddr: "合肥市瑶海区郎溪路往西200米（临泉路和长江东路之间）",
			properType: "住宅,商业",
			properCity: "安徽省",
			properImg: 47
		},
		{
			name: "厦门华玺",
			value: [118.024458, 24.531543],
			properAddr: "厦门市海沧区霞光路",
			properType: "住宅,别墅",
			properCity: "福建省",
			properImg: 49
		}
	];
	return lnglatLists;
}

//随机生产点
function createPoints(center, num) {
	var data = [];
	for(var i = 0, len = num; i < len; i++) {
		data.push({
			position: [
				center.getLng() + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 30,
				center.getLat() + (Math.random() > 0.5 ? 1 : -1) * Math.random() * 20
			]
		});
	}
	return data;
}