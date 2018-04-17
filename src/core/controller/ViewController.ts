module core {
	export class ViewController extends Controller {
		private parent: egret.DisplayObjectContainer;
		private viewLayerType: ViewLayerType;
		private argList: Array<any>;

		public constructor() {
			super();
		}

		public destroy() {
			this.parent = null;
			this.argList = null;
			this.viewLayerType = null;
			super.destroy();
		}

		public open(): void {
			Log.error("所有继承 ViewController 的子类都必须重写 open() 方法，该方法在控制器被添加到显示列表时调用");
		}

		public close(): void {
			Log.error("所有继承 ViewController 的子类都必须重写 close() 方法，该方法在控制器被移出显示列表时调用");
		}

		public getParams(): any[] {
			return this.argList;
		}

		public setParams(...list): void {
			this.argList = list;
		}

		public getParam<T>(index: number): T {
			let obj: T = null;
			if (this.argList != null && this.argList.length > index) {
				obj = this.argList[index] as T;
			}

			return obj;
		}

		public getParamCount(): number {
			if (this.argList == null) {
				return 0;
			} else {
				return this.argList.length;
			}
		}

		public setParent(parent: egret.DisplayObjectContainer, viewType: ViewLayerType): void {
			this.parent = parent;
			this.viewLayerType = viewType;
		}

		public getParent(): egret.DisplayObjectContainer {
			return this.parent;
		}

		public getViewLayerType(): ViewLayerType {
			return this.viewLayerType;
		}

		public getModel<T extends Model>(modelClass: { new (): T; }): T {
			return ModelManage.getInstance().getModel(modelClass);
		}
	}
}
