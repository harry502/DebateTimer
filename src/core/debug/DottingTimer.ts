module core {
	export class DottingTimer {
		private static pointList: Object = {};
		public static start(name: string): void {
			if (DottingTimer.pointList[name] == null) {
				DottingTimer.pointList[name] = Time.getUnixTimestamp_msec();
			} else {
				Log.warning("DottingTimer 开始时间点错误，name: " + name + " 对象已存在，若要添加组打点，请调用 addition() 函数");
			}
		}

		public static addition(name: string): void {
			if (DottingTimer.pointList[name] != null) {
				let lastTime: number = DottingTimer.pointList[name];
				DottingTimer.pointList[name] = Time.getUnixTimestamp_msec();
				Log.print("DottingTimer_Addition " + name + ": " + (DottingTimer.pointList[name] - lastTime));
			} else {
				Log.warning("DottingTimer 增加时间点错误，name: " + name + " 对象未定义，请先调用 start 函数加入");
			}
		}

		public static end(name: string): void {
			if (DottingTimer.pointList[name] != null) {
				let lastTime: number = DottingTimer.pointList[name];
				DottingTimer.pointList[name] = null;
				Log.print("DottingTimer_End " + name + ": " + (Time.getUnixTimestamp_msec() - lastTime));
			} else {
				Log.warning("DottingTimer 结束时间点错误，name: " + name + " 对象不存在");
			}
		}

		public static cleanup(): void {
			DottingTimer.pointList = {};
		}
	}
}
