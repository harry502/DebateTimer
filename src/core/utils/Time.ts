module core {
	export class Time {
		public static timeScale: number = 1;
		
		//当前游戏运作帧数;
		private static _frameCount:number = 0;
		public static updateFrameCount():void {
			Time._frameCount ++;
		}
		public static getFrameCount():number {
			return Time._frameCount;
		}

		//执行一帧耗时;
		private static _deltaTime:number = 0;
		private static _deltaTimePoint:number = 0;
		public static updateDeltaTime():void {
			if (Time._deltaTimePoint == 0) {
				Time._deltaTimePoint = Time.getUnixTimestamp_msec();
				Time._deltaTime = 0;
			} else {
				let num:number = Time.getUnixTimestamp_msec();
				Time._deltaTime = (num - Time._deltaTimePoint) / 1000;
				Time._deltaTimePoint = num;
			}
		}
		public static getDeltaTime():number {
			return Time._deltaTime;
		}

		private static processTime: number = Time.getUnixTimestamp_msec();
		public static getProcessTime(): number {
			return Time.getUnixTimestamp_msec() - Time.processTime;
		}

		public static getUnixTimestamp_sec(): number {
			return Date.now() / 1000;
		}

		public static getUnixTimestamp_msec(): number {
			return Date.now();
		}

		public static getFullTime(): string {
			let date: Date = new Date();
			let content: string = date.getFullYear() + "-" + String.padLeft(date.getMonth(), 2) + "-" + String.padLeft(date.getDay(), 2) + " " +
				String.padLeft(date.getHours(), 2) + ":" + String.padLeft(date.getMinutes(), 2) + ":" +
				String.padLeft(date.getSeconds(), 2) + "." + String.padLeft(date.getMilliseconds(), 3);
			return content;
		}

		public static getClockTime(): string {
			let date: Date = new Date();
			let content: string = String.padLeft(date.getHours(), 2) + ":" + String.padLeft(date.getMinutes(), 2) + ":" +
				String.padLeft(date.getSeconds(), 2) + "." + String.padLeft(date.getMilliseconds(), 3);
			return content;
		}

		private static serverTime: number = -1;
		private static getServerTimeLocalPoint: number;
		public static getServerTime(): number {
			if (Time.serverTime == -1) Time.setServerTime(Time.getUnixTimestamp_sec());
			return Time.serverTime + (Time.getUnixTimestamp_sec() - Time.getServerTimeLocalPoint);
		}

		public static setServerTime(timestamp: number): void {
			Time.serverTime = timestamp;
			Time.getServerTimeLocalPoint = Time.getUnixTimestamp_sec();
		}
	}
}
