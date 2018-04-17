module core {
	export class ControllerDispatcher extends EventDispatcher {
		private static _create: boolean;
		private static _instance: ControllerDispatcher;
		public static getInstance(): ControllerDispatcher {
			if (ControllerDispatcher._instance == null) {
				ControllerDispatcher._create = true;
				ControllerDispatcher._instance = new ControllerDispatcher();
				ControllerDispatcher._create = false;
			}
			return ControllerDispatcher._instance;
		}

		public constructor() {
			if (!ControllerDispatcher._create) {
				Log.error("ControllerDispatcher 单例类，不能通过构造函数实例化。请使用 ControllerDispatcher.getInstance() 方法访问该实例");
				return;
			}
			super();
		}

		public destroy(): void {
			ControllerDispatcher._instance = null;
			super.destroy();
		}
	}
}
