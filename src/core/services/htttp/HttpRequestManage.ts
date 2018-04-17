module core {
	export class HttpRequestManage implements IBasicObject {
		private static _create:boolean;
		private static _instance:HttpRequestManage;
		public static getInstance():HttpRequestManage {
			if (HttpRequestManage._instance == null) {
				HttpRequestManage._create = true;
				HttpRequestManage._instance = new HttpRequestManage();
				HttpRequestManage._create = false;
			}
			return HttpRequestManage._instance;
		}

		private requestList:Object;
		public constructor() {
			if (!HttpRequestManage._create) {
				Log.error("HttpRequestManage 单例类，不能通过构造函数实例化。请使用 HttpRequestManage.getInstance() 方法访问该实例");
			}
			this.requestList = {};
		}

		public destroy():void {
			if (this.requestList != null) {
				var request;
				for (var item in this.requestList) {
					request = <egret.HttpRequest>this.requestList[item];
					request.removeEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
					request.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
					request.removeEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
				}
				this.requestList = null;
			}
			HttpRequestManage._instance = null;
		}

		public send(protocolName:string, ...args):void {
			var list = ProtocolList.GetProtocolArgs(protocolName);
			if (list == null) return;
			if (list.length != args.length) {
				Log.error("发送的协议：" + protocolName + " 参数与定义参数不匹配，请检查调用处是否错误。定义参数：" + list.length + " 传入参数：" + args.length);
			}
			var dataObj:Object = {};
			dataObj["name"] = protocolName;
			dataObj["params"] = {};
			for (var i = 0; i < list.length; i++) {
				dataObj["params"][list[i]] = args[i];
			}

			var dataStr:string = JSON.stringify(dataObj);
			Log.print("发送协议：" + dataStr);
			var request = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			request.open(GameConfig.serverHttpRUL, egret.HttpMethod.POST);
			request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			request.send(dataStr);
			request.addEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
			request.addEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
			request.addEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
			if (this.requestList[request.hashCode] == null) {
				this.requestList[request.hashCode] = request;
			} else {
				Log.error("HttpRequest 对象已存在，不能重复添加");
			}
		}

		private onGetComplete(event:egret.Event):void {
			var request = <egret.HttpRequest>event.currentTarget;
			request.removeEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
			request.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
			request.removeEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
			this.requestList[request.hashCode] = null;
			Log.print("接收协议：" + request.response);
			var dataObj = JSON.parse(request.response);
			if (String.isNullOrEmpty(dataObj.name)) {
				Log.warning("返回协议失败，协议名未定义");
			} else {
				if (ServiceDispatcher.getInstance().hasEventListener(dataObj.name)) {
					ServiceDispatcher.getInstance().dispatchEvent(new Event(dataObj.name, dataObj.params));
				} else {
					Log.warning("协议：" + dataObj.name + " 未定义回调函数，请确认该协议是否有效");
				}
			}
		}

		private onGetIOError(event:egret.IOErrorEvent):void {
			var request = <egret.HttpRequest>event.currentTarget;
			request.removeEventListener(egret.Event.COMPLETE,this.onGetComplete,this);
			request.removeEventListener(egret.IOErrorEvent.IO_ERROR,this.onGetIOError,this);
			request.removeEventListener(egret.ProgressEvent.PROGRESS,this.onGetProgress,this);
			this.requestList[request.hashCode] = null;
			Log.error("接收协议错误", event);
		}

		private onGetProgress(event:egret.ProgressEvent):void {
			Log.print("接收协议进度：" + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
		}
	}
}