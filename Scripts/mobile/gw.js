var hubConn, hubProxy, AlarmCenterContext = {
    projectName: "AlarmCenter",
    //设置命令-需要传值
    setCommandValue: function(equipno, set_no, value) {
        return this.post("/api/DataCenter/SetParmControl", {
            data: {
                equipno: equipno,
                set_no: set_no,
                value: value
            }
        });
    },

    // 系统配置
    getEquipList: function() {//获取设备列表
        return this.post("/GWService.asmx/EquipItemList", {}, null);
    },
    
    getAccess: function() {//获取资产列表
        return this.post("/api/GWServiceWebAPI/get_GWZiChanTableData", {
            getDataTable: ""
        }, null);
    },
    getPlan: function() {//获取预案号列表
        return this.post("/api/GWServiceWebAPI/get_PlanData", {
            getDataTable: ""
        });
    },
    getAlarmWay: function() {//获取报警方式列表
        return this.post("/api/GWServiceWebAPI/get_AlarmProcData", {
            getDataTable: ""
        });
    },
    getLinkVideo: function() {//获取关联视频列表
        return this.post("/api/GWServiceWebAPI/get_VideoInfoData", {
            getDataTable: ""
        });
    },
    setEquipConfig: function(data) {//设备配置多个
        return this.post("/api/real/get_equip", {
            equip_nos: data
        }, null);
    },
    setYcConfig: function(data) {//遥测配置多个
        return this.post("/api/real/get_ycp", {
            equip_nos: data
        });
    },
    setYxConfig: function(data) {//遥信配置多个
        return this.post("/api/real/get_yxp", {
            equip_nos: data
        });
    },
    setSetConfig: function(data) {//设置配置多个
        return this.post("/api/real/get_setparm", {
            equip_nos: data
        });
    },
    setYcConfigSingle: function(equipNo, ycpNo) {//配置表 
        return this.post("/api/real/get_ycp_single", {
            equip_no: equipNo,
            ycp_no: ycpNo
        });
    },
    setYxConfigSingle: function(equipNo, yxpNo) {
        return this.post("/api/real/get_yxp_single", {
            equip_no: equipNo,
            yxp_no: yxpNo
        });
    },
    setSetConfigSingle: function(equipNo, setNo) {
        return this.post("/api/real/get_setparm_single", {
            equip_no: equipNo,
            set_no: setNo
        });
    },
    updEquipConfig: function(data) {
        return this.post("/api/real/update_equip", {
            update: data
        });
    },
    updYcConfig: function(data) {
        return this.post("/api/real/update_ycp", {
            update: data
        });
    },
    updYxConfig: function(data) {
        return this.post("/api/real/update_yxp", {
            update: data
        });
    },
    updSetConfig: function(data) {
        return this.post("/api/real/update_setparm", {
            update: data
        });
    },
    //系统查询
    QueryEquipEvt: function(times,equip_no_list){  //设备事件
         return this.post("/GWService.asmx/QueryEquipEvt", {
            "times": times,
            "equip_no_list": equip_no_list
        });       
    },
    QuerySetupsEvt: function(times,equip_no_list){  //设置事件
        return this.post("/GWService.asmx/QuerySetupsEvt", {
            "times": times,
            "equip_no_list": equip_no_list
        });
    },
    QuerySystemEvt: function(times,equip_no_list){  //系统时间
        return this.post("/GWService.asmx/QuerySystemEvt", {
            "times": times,
            "equip_no_list": equip_no_list
        });
    },
    //欢迎词
    GetFileStructure: function(url,fileName){
        return this.post("/api/Other/GetFileStructure", {
            filePath: url,
            fileName: fileName,
        });  
    },
    connectServer: function(equipNo) {
        hubConn = null
        hubConn = $.hubConnection();
        hubProxy = hubConn.createHubProxy('ServerHub');
        hubProxy.on('sendConnect', data => {
            //连接
        });
        // 来自广播新消息类型和数据
        hubProxy.on('sendAll', (data, type) => {
            // console.log('ycyxall--------------' + type, data)
        });
        // ycp有广播消息
        hubProxy.on('sendYcpSingle', data => {
            // console.log('yccccp----------------', data)
            try {
                var index = data.split(",")[0],
                    name = data.split(",")[1],
                    value = data.split(",")[2],
                    statusY = new Boolean(data.split(",")[4]),
                    companyString = data.split(",")[5];
                $(".edName[data-no = '" + index + "']").text(name);
                $(".edValue[data-no = '" + index + "']").text(value);
                $(".edCompany[data-no = '" + index + "']").text(companyString);
                if (!statusY) {
                    $(".edIcon[data-no = '" + index + "']").removeClass("circle_green").addClass("circle_red");
                } else {
                    $(".edIcon[data-no = '" + index + "']").addClass("circle_green").removeClass("circle_red");
                }
            } catch (e) {}
        });
        // yxp有广播消息
        hubProxy.on('sendYxpSingle', data => {
            //  console.log('yxxxxp-------------------', data) 清理出来
            try {
                let index = data.split(",")[0],
                    status = data.split(",")[4];
                if (status == "True") $("#m_alarmyxps_" + index).find(".iconWrap i").addClass("alarm").removeClass("comOk");
                else {
                    $("#m_alarmyxps_" + index).find(".iconWrap i").removeClass("alarm").addClass("comOk");
                }
            } catch (e) {}
        });
        // 监听设备状态
        hubProxy.on('sendEquipSingle', data => {
            // console.log('equip-------------------', data)
            try {
                let index = data.split(",")[0],
                    status = data.split(",")[2];
                if (status == "CommunicationOK") $(".equipListStatus_" + index).find("i").removeClass("noCom alarm").addClass("comOk");
                else if (status == "HaveAlarm") $(".equipListStatus_" + index).find("i").removeClass("noCom comOk").addClass("alarm");
                else $(".equipListStatus_" + index).find("i").removeClass("comOk alarm").addClass("noCom");
            } catch (e) {}
        });
        hubConn.stop()
        // 开始连接signalr
        hubConn.start().done(() => {
            hubProxy.invoke('Connect');
            hubProxy.invoke('ListenEquipAll', window.localStorage.ac_appkey, window.localStorage.ac_infokey)
            hubProxy.invoke('StartListen', equipNo, window.localStorage.ac_appkey, window.localStorage.ac_infokey)
        }).fail(err => {
            console.log('错误-------:', err)
        })
        // signalr重连
        hubConn.reconnecting(() => {
            hubConn.stop();
            hubConn.start().done(() => {
                console.log('start!')
                hubProxy.invoke('Connect')
                hubProxy.invoke('ListenEquipAll', window.localStorage.ac_appkey, window.localStorage.ac_infokey)
                hubProxy.invoke('StartListen', equipNo, window.localStorage.ac_appkey, window.localStorage.ac_infokey)
            }).fail(err => {
                console.log('错误-------:', err)
            })
        })
        // signalr断开连接
        hubConn.disconnected(() => {
            hubConn.stop();
        })
        // 高频连接触发
        hubConn.connectionSlow((err) => {})
        // 收到signalr消息触发
        hubConn.received((err) => {})
    },
    get: function(url, data) {
        var i = $.Deferred();
        $.ajax({
            url: url,
            data: data,
            type: "GET",
            // headers: headers, 
            // contentType: "application/json; charset=UTF-8",
            dataType: "JSON",
            headers: {
                Authorization: window.localStorage.ac_appkey + '-' + window.localStorage.ac_infokey,
            },
            timeout: 3e4,
            success: function(e) {
                i.resolveWith(this, [e])
            },
            error: function(e, n) {
                i.rejectWith(this, ["网络异常，请稍候重试"]);
                // console.log(JSON.stringify(e), n)
            }
        });
        return i.promise()
    },
    post: function(url, data) {
        var i = $.Deferred();
        return $.ajax({
            url: url,
            data: data,
            type: "POST",
            headers: {
                Authorization: window.localStorage.ac_appkey + '-' + window.localStorage.ac_infokey,
            },
            timeout: 3e4,
            success: function(e) {
                i.resolveWith(this, [e])
            },
            error: function(e, n) {
                i.rejectWith(this, ["网络异常，请稍候重试"]);
                // console.log(JSON.stringify(e), n)
            }
        }), i.promise();
    }
}
// 示例
// $.when(AlarmCenterContext.getYCStatus(1,1)).done(function(n,l){
//   console.log(n);
// }).fail(function(e){
// });