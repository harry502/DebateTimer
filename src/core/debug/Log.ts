module core {
	export class Log {
		private static readonly PrintType: string = "Print";
		private static readonly WarningType: string = "Warning";
		private static readonly ErrorType: string = "Error";

		public static print(...args: any[]): void {
			if (DebugConfig.PrintLog) {
				args.splice(0, 0, Time.getClockTime() + "【" + Log.PrintType + "】");
				console.log.apply(console, args);
			}
		}

		public static warning(...args): void {
			if (DebugConfig.PrintLog) {
				args.splice(0, 0, Time.getClockTime() + "【" + Log.WarningType + "】");
				console.log.apply(console, args);
			}
		}

		public static error(...args): void {
			if (DebugConfig.PrintLog) {
				throw (new Error(Log.analysisLog(Log.ErrorType, args)));
			}
		}

		private static analysisLog(logType: string, args: any[]): string {
			let content: string = Time.getClockTime() + "【" + logType + "】";
			for (let i = 0; i < args.length; i++) {
				content += (i == 0 ? " " : ", ") + args[i];
			}
			return content;
		}
	}
}
