module core {
	export class DisplayManage extends eui.UILayer {
		private static _create: boolean;
		private static _instance: DisplayManage;
		public static getInstance(): DisplayManage {
			if (DisplayManage._instance == null) {
				DisplayManage._create = true;
				DisplayManage._instance = new DisplayManage();
				DisplayManage._create = false;
			}
			return DisplayManage._instance;
		}

		public sceneLayer: eui.UILayer;
		public windowLayer: eui.UILayer;
		public loaderLayer: eui.UILayer;
		public noticeLayer: eui.UILayer;
		private lastRunTime: number;
		public updateFun: Action1<number>;

		public constructor() {
			if (!DisplayManage._create) {
				Log.error("DisplayManage 单例类，不能通过构造函数实例化。请使用 DisplayManage.getInstance() 方法访问该实例");
				return;
			}
			super();

			this.sceneLayer = new eui.UILayer();
			this.sceneLayer.touchEnabled = false;
			this.addChild(this.sceneLayer);
			this.windowLayer = new eui.UILayer();
			this.windowLayer.touchEnabled = false;
			this.addChild(this.windowLayer);
			this.loaderLayer = new eui.UILayer();
			this.loaderLayer.touchEnabled = false;
			this.addChild(this.loaderLayer);
			this.noticeLayer = new eui.UILayer();
			this.noticeLayer.touchEnabled = false;
			this.addChild(this.noticeLayer);

			this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
			this.lastRunTime = Time.getUnixTimestamp_msec();
		}

		public destroy(): void {
			this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrame, this);
			if (this.updateFun != null) {
				this.updateFun.destroy();
				this.updateFun = null;
			}
			if (this.sceneLayer) {
				if (this.sceneLayer.parent) {
					this.sceneLayer.parent.removeChild(this.sceneLayer);
				}
				this.sceneLayer = null;
			}
			if (this.windowLayer) {
				if (this.windowLayer.parent) {
					this.windowLayer.parent.removeChild(this.windowLayer);
				}
				this.windowLayer = null;
			}
			if (this.loaderLayer) {
				if (this.loaderLayer.parent) {
					this.loaderLayer.parent.removeChild(this.loaderLayer);
				}
				this.loaderLayer = null;
			}
			if (this.noticeLayer) {
				if (this.noticeLayer.parent) {
					this.noticeLayer.parent.removeChild(this.noticeLayer);
				}
				this.noticeLayer = null;
			}
			if (this.parent) {
				this.parent.removeChild(this);
			}
			DisplayManage._instance = null;
		}

		private enterFrame(evt: egret.Event): void {
			let currentTime = Time.getUnixTimestamp_msec();
			let diff = currentTime - this.lastRunTime;
			this.lastRunTime = currentTime;
			if (this.updateFun != null) this.updateFun.apply(diff);
		}
	}
}
