module core {
	export enum SocketState{
		Empty,
		Connecting,
		ConnectionSucceed,
		ConnectionFailure,
		Disconnect
	}

	export class Socket extends core.EventDispatcher {
		private _socket:egret.WebSocket;
		private _socketState:SocketState;
		private _receiveData:egret.ByteArray;

		public constructor() {
			super();
			this._socketState = SocketState.Empty;
		}

		public destroy():void {
			this.close();
			super.destroy();
		}

		public getState():SocketState {
			return this._socketState;
		}

		public getDataType():string {
			if (this._socket == null) {
				return null;
			} else {
				return this._socket.type;
			}
		}

		public connect(ip:string, post:number, socketType:string = egret.WebSocket.TYPE_STRING):void {
			if (this._socket != null) {
				this.close();
			}
			this._socketState = SocketState.Connecting;
			if (socketType == egret.WebSocket.TYPE_BINARY) {
				if (this._receiveData != null) {
					this._receiveData.clear();
				} else {
					this._receiveData = new egret.ByteArray();
				}
			}
			this._socket = new egret.WebSocket();
			this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.socket_ReceiveMessage, this);
			this._socket.addEventListener(egret.Event.CONNECT, this.socket_Connect, this);
			this._socket.addEventListener(egret.Event.CLOSE, this.socket_Close, this);
			this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.socket_Error, this);
			this._socket.type = socketType;
			this._socket.connect(ip, post);
		}

		public connectByUrl(url:string, socketType:string = egret.WebSocket.TYPE_STRING):void {
			if (this._socket != null) {
				this.close();
			}
			this._socketState = SocketState.Connecting;
			if (socketType == egret.WebSocket.TYPE_BINARY) {
				if (this._receiveData != null) {
					this._receiveData.clear();
				} else {
					this._receiveData = new egret.ByteArray();
				}
			}
			this._socket = new egret.WebSocket();
			this._socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.socket_ReceiveMessage, this);
			this._socket.addEventListener(egret.Event.CONNECT, this.socket_Connect, this);
			this._socket.addEventListener(egret.Event.CLOSE, this.socket_Close, this);
			this._socket.addEventListener(egret.IOErrorEvent.IO_ERROR, this.socket_Error, this);
			this._socket.type = socketType;
			this._socket.connectByUrl(url);
		}

		public close():void {
			if (this._socket != null) {
				this._socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA, this.socket_ReceiveMessage, this);
				this._socket.removeEventListener(egret.Event.CONNECT, this.socket_Connect, this);
				this._socket.removeEventListener(egret.Event.CLOSE, this.socket_Close, this);
				this._socket.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.socket_Error, this);
				this._socket.close();
				this._socket = null;
			}
			this._socketState = SocketState.Disconnect;
			if (this._receiveData != null) {
				this._receiveData.clear();
			}
		}

		private socket_ReceiveMessage(evt:egret.ProgressEvent):void {
			if (this.getDataType() == egret.WebSocket.TYPE_BINARY) {
				this._socket.readBytes(this._receiveData);
				this.dispatchEvent(new Event(SocketEventType.ReceiveData, this.getDataType(), this._receiveData));
			} else {
				this.dispatchEvent(new Event(SocketEventType.ReceiveData, this.getDataType(), this._socket.readUTF()));
			}
		}

		private socket_Connect(evt:egret.Event):void {
			this._socketState = SocketState.ConnectionSucceed;
			this.dispatchEvent(new Event(SocketEventType.ConnectionSucceed));
		}

		private socket_Close(evt:egret.Event):void {
			this.close();
			this.dispatchEvent(new Event(SocketEventType.Disconnect));
		}

		private socket_Error(evt:egret.IOErrorEvent):void {
			this.close();
			this.dispatchEvent(new Event(SocketEventType.ConnectionFailure));
		}

		public send(data:string):void {
			if (this._socketState == SocketState.ConnectionSucceed) {
				this._socket.writeUTF(data);
				this._socket.flush();
			} else {
				Log.warning("尚未与服务器建立连接，不可发送协议");
			}
		}
	}
}