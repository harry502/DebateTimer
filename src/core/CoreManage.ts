module core {
	export class CoreManage implements IBasicObject {
		private static _create: boolean;
		private static _instance: CoreManage;
		public static getInstance(): CoreManage {
			if (CoreManage._instance == null) {
				CoreManage._create = true;
				CoreManage._instance = new CoreManage();
				CoreManage._create = false;
			}
			return CoreManage._instance;
		}

		private pageManage: PageManage;

		public constructor() {
			if (!CoreManage._create) {
				Log.error("CoreManage 单例类，不能通过构造函数实例化。请使用 CoreManage.getInstance() 方法访问该实例");
				return;
			}
			ModelManage.getInstance().initModels();
			this.pageManage = PageManage.getInstance();
		}

		public setDisplayObjectContainer(parent: egret.DisplayObjectContainer) {
			let view: DisplayManage = DisplayManage.getInstance();
			if (view.updateFun != null) view.updateFun.destroy();
			view.updateFun = new Action1<number>(this.update, this);
			if (view.parent != null) view.parent.removeChild(view);
			parent.addChild(view);
		}

		public update(time: number): void {
			if (this.pageManage != null) {
				this.pageManage.update(time);
			}
		}

		public destroy(): void {
			this.pageManage.destroy();
			this.pageManage = null;
			DisplayManage.getInstance().destroy();
			ControllerDispatcher.getInstance().destroy();
			ServiceDispatcher.getInstance().destroy();
			DottingTimer.cleanup();
		}
	}
}
