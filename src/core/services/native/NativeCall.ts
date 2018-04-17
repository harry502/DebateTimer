module core {
	export class NativeCall {
		public static sendNative(funName:string, obj:Object = null):void {
			if (obj == null) obj = {};
			switch (egret.Capabilities.os) {
				case "iOS":
				case "Android":
					if (funName == "onPKFinish") {
						if (window["nativeApp"] == null || window["nativeApp"]["onPKFinish"] == null) {
							if (window["TZOpen"] != null) {
								if (window["TZOpen"]["getResult"] != null) {
									let data:string = JSON.stringify(obj);
									Log.print("发送NativeCall name:" + funName + " param:" + data);
									window["TZOpen"]["getResult"](data);
									return;
								}
							}
						}
					}
					if (window["nativeApp"] != null) {
						if (window["nativeApp"][funName] != null) {
							let data:string = JSON.stringify(obj);
							Log.print("发送NativeCall name:" + funName + " param:" + data);
							window["nativeApp"][funName](data);
						}
					}
					break;
				default:
					Log.warning("发送NativeCall失败，平台未定义", egret.Capabilities.os, " name:" + funName, " param:", JSON.stringify(obj));
					break;
			}
		}
	}
}