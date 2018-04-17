module core {
	export class SocketManage implements IBasicObject {
		private static _create:boolean;
		private static _instance:SocketManage;
		public static getInstance():SocketManage {
			if (SocketManage._instance == null) {
				SocketManage._create = true;
				SocketManage._instance = new SocketManage();
				SocketManage._create = false;
			}
			return SocketManage._instance;
		}

		private _socket:Socket;
		public constructor() {
			if (!SocketManage._create) {
				Log.error("SocketManage 单例类，不能通过构造函数实例化。请使用 SocketManage.GetInstance() 方法访问该实例");
			}
		}

		public destroy():void {
			this.closeSocket();
			SocketManage._instance = null;
		}

		public getState():SocketState {
			if (this._socket == null) {
				return SocketState.Empty;
			} else {
				return this._socket.getState();
			}
		}

		public createSocket(ip:string, post:number, socketType:string = egret.WebSocket.TYPE_STRING):void {
			this.closeSocket();
			Log.print("创建连接 ip:" + ip + " post:" + post);
			this._socket = new Socket();
			this._socket.addEventListeners(this.socketLongCallback, this, SocketEventType.ConnectionSucceed, SocketEventType.ConnectionFailure, 
											SocketEventType.Disconnect, SocketEventType.ReceiveData);
			this._socket.connect(ip, post, socketType);
		}

		public createSocketByUrl(url:string, socketType:string = egret.WebSocket.TYPE_STRING):void {
			this.closeSocket();
			Log.print("创建连接 url:" + url);
			this._socket = new Socket();
			this._socket.addEventListeners(this.socketLongCallback, this, SocketEventType.ConnectionSucceed, SocketEventType.ConnectionFailure, 
											SocketEventType.Disconnect, SocketEventType.ReceiveData);
			this._socket.connectByUrl(url, socketType);
		}

		public closeSocket():void {
			if (this._socket != null) {
				this._socket.removeEventListeners(this.socketLongCallback, this, false, SocketEventType.ConnectionSucceed, SocketEventType.ConnectionFailure, 
											SocketEventType.Disconnect, SocketEventType.ReceiveData);
				this._socket.destroy();
				this._socket = null;
			}
		}

		public send(protocolName:string, ...args):void {
			if (this._socket == null) {
				Log.warning("socket 未创建，发送协议前请先创建 socket");
				return;
			}
			if(this._socket.getState() != SocketState.ConnectionSucceed) {
				Log.warning("socket 还未与服务器建立连接，请稍后");
				return;
			}
			var list = ProtocolList.GetProtocolArgs(protocolName);
			if (list == null) return;
			if (list.length != args.length) {
				Log.error("发送的协议：" + protocolName + " 参数与定义参数不匹配，请检查调用处是否错误。定义参数：" + list.length + " 传入参数：" + args.length);
				return;
			}
			var dataObj:Object = {};
			dataObj["name"] = protocolName;
			dataObj["params"] = {};
			for (var i = 0; i < list.length; i++) {
				dataObj["params"][list[i]] = args[i];
			}
			var dataStr:string = JSON.stringify(dataObj);
			Log.print("发送协议：" + dataStr);
			this._socket.send(dataStr);
		}

		private socketLongCallback(evt:Event):void {
			switch (evt.getEventType()) {
				case SocketEventType.ConnectionSucceed:
					Log.print("连接成功");
					this.DispatchEventToControl(evt);
					break;
				case SocketEventType.ConnectionFailure:
					Log.print("连接失败");
					this.DispatchEventToControl(evt);
					break;
				case SocketEventType.Disconnect:
					Log.print("断开连接");
					this.DispatchEventToControl(evt);
					break;
				case SocketEventType.ReceiveData:
					this.AnalysisProtocol(evt.getParam<string>(0), evt.getParam<any>(1));
					break;
			}
		}

		private AnalysisProtocol(socketType:string, data:any):void {
			let dataStr:string;
			if (socketType == egret.WebSocket.TYPE_STRING) {
				dataStr = data;
				Log.print("接收协议：" + dataStr);
				var dataObj = JSON.parse(dataStr);
				if (String.isNullOrEmpty(dataObj.name)) {
					Log.warning("返回协议失败，协议名未定义");
				} else {
					if (this.HasEventListener(dataObj.name)) {
						this.DispatchEvent(new Event(dataObj.name, dataObj.params));
					} else {
						Log.warning("协议：" + dataObj.name + " 未定义回调函数，请确认该协议是否有效");
					}
				}
			} else {
				Log.error("返回协议解析数据未定义，二进制数据解析未完善");
			}
		}

		private DispatchEvent(evt:Event):boolean {
			return ServiceDispatcher.getInstance().dispatchEvent(evt);
		}

		private DispatchEventToControl(evt:Event):boolean {
			return ControllerDispatcher.getInstance().dispatchEvent(evt);
		}

		private HasEventListener(eventType:string):boolean {
			return ServiceDispatcher.getInstance().hasEventListener(eventType);
		}
	}
}