using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using AlarmCenter.DataCenter;
using System.Data;
using GWServiceAPI.Net.LibClass;
using GWServiceAPI.Net.Models;
using System.Web.Script.Serialization;

namespace AlarmCenterAPI.Data
{
    public class ServerHub : Hub
    {
        /// <summary>
        /// 测试连接
        /// </summary>
        public void Connect()
        {
            Clients.Caller.sendConnect("Socket连接成功！");
        }

        /// <summary>
        /// 获取设备ycp,yxp测点的实时状态并添加监听事件
        /// </summary>
        /// <param name="select">设备号</param>
        /// <param name="appkey"></param>
        /// <param name="infokey"></param>
        public void StartListen(int select, string appkey, string infokey)
        {
            DataResult dr = new DataResult();
            dr = null;

            if (string.IsNullOrEmpty(appkey) || string.IsNullOrEmpty(infokey))
            {
                dr = ApiCode.Code1003(dr);
            }
            else
            {
                Clients.Caller.sendAll("开始验证身份", "message");
                try
                {
                    dr = ServerLib.VerifyService(appkey, infokey, 1);

                }
                catch (Exception ex)
                {
                    Clients.Caller.sendAll("身份验证失败：" + ex, "message");

                }
            }
            if (dr.code != 200)
            {
                string drs = new JavaScriptSerializer().Serialize(dr);
                ServerLib.ErrorLog(drs, "");
                return;
            }

            myEquipItem equipItem = Proxy_DataCenter.EqpItemDict[select];

            var ycp = "[";
            Dictionary<int, myProxy_YCItem> dictEquipItem_ycp = equipItem.YCItemDict;
            foreach (myProxy_YCItem my in dictEquipItem_ycp.Values)
            {
                ycp += "{\"m_iYCNo\":\"" + my.m_iYCNo + "\",\"m_YCNm\":\"" + my.m_YCNm + "\",\"m_YCValue\":\"" + my.m_YCValue.ToString() + "\",\"m_AdviceMsg\":\"" + my.m_AdviceMsg + "\",\"m_IsAlarm\":\"" + my.m_IsAlarm + "\",\"m_Unit\":\"" + my.m_Unit + "\"},";
                my.PropertyChanged += DictEquipItem_PropertyChanged_ycp;
            }
            ycp = ycp.Substring(0, ycp.Length - 1);
            if (ycp != "")
            {
                ycp += "]";
            }
            else
            {
                ycp = "[]";
            }
            Clients.Caller.sendAll(ycp, "ycp");

            var yxp = "[";
            Dictionary<int, myProxy_YXItem> dictEquipItem_yxp = equipItem.YXItemDict;
            foreach (myProxy_YXItem my in dictEquipItem_yxp.Values)
            {
                yxp += "{\"m_iYXNo\":\"" + my.m_iYXNo + "\",\"m_YXNm\":\"" + my.m_YXNm + "\",\"m_YXState\":\"" + my.m_YXState + "\",\"m_AdviceMsg\":\"" + my.m_AdviceMsg + "\",\"m_IsAlarm\":\"" + my.m_IsAlarm + "\"},";
                my.PropertyChanged += DictEquipItem_PropertyChanged_yxp;
            }
            yxp = yxp.Substring(0, yxp.Length - 1);
            if (yxp != "")
            {
                yxp += "]";
            }
            else
            {
                yxp = "[]";
            }

            Clients.Caller.sendAll(yxp, "yxp");

        }

        /// <summary>
        /// ycp测点的监听事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DictEquipItem_PropertyChanged_ycp(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {

            if (e.PropertyName == "m_YCValue" || e.PropertyName == "m_IsAlarm" || e.PropertyName == "m_AdviceMsg")
            {
                try
                {
                    myProxy_YCItem dictEquipItem = (myProxy_YCItem)sender;
                    var str = dictEquipItem.m_iYCNo + "," + dictEquipItem.m_YCNm + "," + dictEquipItem.m_YCValue.ToString() + "," + dictEquipItem.m_AdviceMsg + "," + dictEquipItem.m_IsAlarm + ',' + dictEquipItem.m_Unit;
                    Clients.Caller.sendYcpSingle(str);
                }
                catch (Exception ex)
                {
                    ServerLib.ErrorLog(ex.ToString(), "");
                    Clients.Caller.sendConnect(ex.ToString());
                }
            }

        }

        /// <summary>
        /// yxp测点的监听事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void DictEquipItem_PropertyChanged_yxp(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {

            if (e.PropertyName == "m_YXState" || e.PropertyName == "m_IsAlarm" || e.PropertyName == "m_AdviceMsg")
            {
                try
                {
                    myProxy_YXItem dictEquipItem = (myProxy_YXItem)sender;
                    var str = dictEquipItem.m_iYXNo + "," + dictEquipItem.m_YXNm + "," + dictEquipItem.m_YXState + "," + dictEquipItem.m_AdviceMsg + "," + dictEquipItem.m_IsAlarm;
                    Clients.Caller.sendYxpSingle(str);
                }
                catch (Exception ex)
                {
                    ServerLib.ErrorLog(ex.ToString(), "");
                    Clients.Caller.sendConnect(ex.ToString());
                }
            }
        }

        /// <summary>
        /// 添加设备的监听事件
        /// </summary>
        /// <param name="appkey"></param>
        /// <param name="infokey"></param>
        public void ListenEquipAll(string appkey, string infokey)
        {
            DataResult dr = new DataResult();
            if (string.IsNullOrEmpty(appkey) || string.IsNullOrEmpty(infokey))
            {
                dr = ApiCode.Code1003(dr);
            }
            else
            {
                dr = ServerLib.VerifyService(appkey, infokey, 1);
            }
            if (dr.code != 200)
            {
                string drs = new JavaScriptSerializer().Serialize(dr);
                ServerLib.ErrorLog(drs, "");
                return;
            }

            Dictionary<int, myEquipItem> equipItem = Proxy_DataCenter.EqpItemDict;
            foreach (myEquipItem my in equipItem.Values)
            {
                my.EquipItem.PropertyChanged += EquipItem_PropertyChanged;
            }
        }
        /// <summary>
        /// 设备的监听事件
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void EquipItem_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "m_State")
            {
                try
                {
                    myProxy_EquipItem dictEquipItem = (myProxy_EquipItem)sender;
                    var str = dictEquipItem.m_iEquipNo + "," + dictEquipItem.m_EquipNm + "," + dictEquipItem.m_State + ";";
                    str = str.Substring(0, str.Length - 1);
                    Clients.Caller.sendEquipSingle(str);
                }
                catch (Exception ex)
                {
                    ServerLib.ErrorLog(ex.ToString(), "");
                    Clients.Caller.sendConnect(ex.ToString());
                }
            }
        }
    }
}