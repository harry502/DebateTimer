module core {
	export class SocketEventType {
		public static readonly ConnectionSucceed:string = "SocketEventType_ConnectionSucceed";
		public static readonly ConnectionFailure:string = "SocketEventType_ConnectionFailure";
		public static readonly ReceiveData:string = "SocketEventType_ReceiveData";
		public static readonly Disconnect:string = "SocketEventType_Disconnect";
	}
}