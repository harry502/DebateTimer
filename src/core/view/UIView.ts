module core {
	export class UIView extends eui.Component implements core.IBasicObject {
		public constructor(path: string = null) {
			super();

			this.percentHeight = 100;
			this.percentWidth = 100;
			this.addEventListener(egret.Event.ADDED_TO_STAGE, this.stageEvents, this);
			this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.stageEvents, this);
			if (path != null) this.reloaderSkin(path);
		}

		public destroy(): void {
			this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.stageEvents, this);
			this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.stageEvents, this);
			this.removeEventListener(eui.UIEvent.COMPLETE, this.loaderSkinCallback, this);
			this.stage.removeEventListener(egret.Event.RESIZE, this.changeViewFrameSize, this);
		}

		private stageEvents(evt: egret.Event): void {
			switch (evt.type) {
				case egret.Event.ADDED_TO_STAGE:
					this.stage.addEventListener(egret.Event.RESIZE, this.changeViewFrameSize, this);
					this.OnEnable();
					break;
				case egret.Event.REMOVED_FROM_STAGE:
					this.stage.removeEventListener(egret.Event.RESIZE, this.changeViewFrameSize, this);
					this.OnDisable();
					break;
			}
		}

		public update(time: number): void { }

		protected OnEnable(): void { }

		protected OnDisable(): void { }

		protected changeWindowSize(width: number, height: number): void { }

		protected reloaderSkin(path: string): void {
			this.addEventListener(eui.UIEvent.COMPLETE, this.loaderSkinCallback, this);
			this.skinName = path;
		}

		private loaderSkinCallback(): void {
			this.removeEventListener(eui.UIEvent.COMPLETE, this.loaderSkinCallback, this);

			this.changeViewFrameSize();
			this.loaderSkinComplete();
		}

		private changeViewFrameSize(evt: egret.Event = null): void {
			let wid: number = document.documentElement.clientWidth;
			let hei: number = document.documentElement.clientHeight;
			let realAspectRatio: number = wid / hei;
			if (realAspectRatio < GameConfig.designSizeAspectRatio) {
				wid = GameConfig.designSizeHeight * realAspectRatio;
			} else {
				wid = GameConfig.designSizeWidth;
			}
			hei = GameConfig.designSizeHeight;
			this.changeWindowSize(wid, hei);
		}

		protected loaderSkinComplete(): void { }

		public getModel<T extends Model>(modelClass: { new (): T; }): T {
			return ModelManage.getInstance().getModel(modelClass);
		}
	}
}
