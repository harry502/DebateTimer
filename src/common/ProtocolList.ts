class ProtocolList {
	private static protocolList:Object = {
		//示例: Server_CheckUser:["uid"],
		CheckUser_Jump: ["uid", "uname", "roomid", "iconURL"],
		ReCheckUser_Jump: ["uid", "uname", "roomid", "iconURL"],
		Ready_Jump: [],
		Move_Jump: ["type", "drop"],
		SendPing:[]
	}

	public static GetProtocolArgs(ProtocolName:string):Array<string> {
		var list:Array<string> = ProtocolList.protocolList[ProtocolName];
		if (list == null) {
			core.Log.error("获取协议参数失败，协议名：" + ProtocolName + "　未在协议列表[ProtocolList.protocolList]中定义");
		}
		return list;
	}
}