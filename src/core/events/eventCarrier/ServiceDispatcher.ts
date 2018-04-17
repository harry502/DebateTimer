module core {
	export class ServiceDispatcher extends EventDispatcher {
		private static _create: boolean;
		private static _instance: ServiceDispatcher;
		public static getInstance(): ServiceDispatcher {
			if (ServiceDispatcher._instance == null) {
				ServiceDispatcher._create = true;
				ServiceDispatcher._instance = new ServiceDispatcher();
				ServiceDispatcher._create = false;
			}
			return ServiceDispatcher._instance;
		}

		public constructor() {
			if (!ServiceDispatcher._create) {
				Log.error("ServiceDispatcher 单例类，不能通过构造函数实例化。请使用 ServiceDispatcher.getInstance() 方法访问该实例");
				return;
			}
			super();
		}

		public destroy(): void {
			ServiceDispatcher._instance = null;
			super.destroy();
		}
	}
}