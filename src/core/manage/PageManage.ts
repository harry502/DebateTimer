module core {
	export enum ViewLayerType {
		Undefined,
		SceneLayer,
		WindowLayer,
		LoaderLayer,
		NoticeLayer
	}

	export enum RemoveViewType {
		Undefined,
		Retain,
		HideBefore,
		HideBeforeAll,
		RemoveBefore,
		RemoveBeforeAll,
	}

	export class PageManage implements IBasicObject {
		private static _create: boolean;
		private static _instance: PageManage;
		public static getInstance(): PageManage {
			if (PageManage._instance == null) {
				PageManage._create = true;
				PageManage._instance = new PageManage();
				PageManage._create = false;
			}
			return PageManage._instance;
		}

		private controlList: Object;
		private cacheControlList: Object;
		private controlUpdateList: Object;

		public constructor() {
			if (!PageManage._create) {
				Log.error("PageManage 单例类，不能通过构造函数实例化。请使用 PageManage.getInstance() 方法访问该实例");
				return;
			}

			this.controlList = {};
			this.cacheControlList = {};
			this.controlUpdateList = {};
		}

		public destroy(): void {
			let list: ViewController[];
			for (let key in this.controlList) {
				list = this.controlList[key];
				for (let i = 0; i < list.length; i++) {
					list[i].destroy();
				}
			}
			list = null;
			this.controlList = null;
			for (let key in this.cacheControlList) {
				this.cacheControlList[key].destroy();
			}
			this.cacheControlList = null;
			this.controlUpdateList = null;
			PageManage._instance = null;
		}

		public update(time: number): void {
			let list: any[];
			for (let key in this.controlUpdateList) {
				list = this.controlUpdateList[key];
				for (let key2 in list) {
					list[key2].update(time);
				}
			}
		}

		/**
		 * 触发本模块消息
		 * @param key 唯一标识
		 * @param param 参数
		 *
		 */
		public addViewControl<T extends ViewController>(control: { new (): T }, viewType: ViewLayerType, removeType: RemoveViewType = RemoveViewType.Retain, ...args): T {
			let list: ViewController[] = this.getControlList(viewType);
			let className: string = String.getClassName(control);
			let tempControl: T;
			let index: number;
			for (index = 0; index < list.length; index++) {
				if (list[index] instanceof control) {
					tempControl = list[index] as T;
					break;
				}
			}
			if (tempControl != null) {
				list.splice(index, 1);
				this.removeUpdate(tempControl);
			} else {
				tempControl = this.cacheControlList[className];
				if (tempControl == null) {
					tempControl = new control();
				} else {
					this.cacheControlList[className] = null;
				}
			}

			switch (removeType) {
				case RemoveViewType.HideBefore:
					this.removeControlList(list, false);
					break;
				case RemoveViewType.HideBeforeAll:
					this.removeControlList(list, false, -1);
					break;
				case RemoveViewType.RemoveBefore:
					this.removeControlList(list, true);
					break;
				case RemoveViewType.RemoveBeforeAll:
					this.removeControlList(list, true, -1);
					break;
			}

			tempControl.setParams.apply(tempControl, args);
			list.push(tempControl);
			switch (viewType) {
				case ViewLayerType.SceneLayer:
					this.removeControlAll(ViewLayerType.WindowLayer);
					tempControl.setParent(DisplayManage.getInstance().sceneLayer, viewType);
					break;
				case ViewLayerType.WindowLayer:
					tempControl.setParent(DisplayManage.getInstance().windowLayer, viewType);
					break;
				case ViewLayerType.LoaderLayer:
					tempControl.setParent(DisplayManage.getInstance().loaderLayer, viewType);
					break;
				case ViewLayerType.NoticeLayer:
					tempControl.setParent(DisplayManage.getInstance().noticeLayer, viewType);
					break;
			}
			tempControl.open();
			this.addUpdate(tempControl);

			return tempControl;
		}

		public getControl<T extends ViewController>(classControl: { new (): T }, viewType: ViewLayerType): T {
			let list: ViewController[] = this.getControlList(viewType);
			let control: ViewController;
			for (let i = 0; i < list.length; i++) {
				if (list[i] instanceof classControl) {
					control = list[i];
					break;
				}
			}

			return control as T;
		}

		public removeControlAll(viewType: ViewLayerType, destroy: boolean = false) {
			this.removeControlList(this.getControlList(viewType), destroy, -1);
		}

		public removeControl<T extends ViewController>(classControl: { new (): T }, viewType: ViewLayerType, destroy: boolean = false) {
			let list: ViewController[] = this.getControlList(viewType);
			let control: ViewController;
			for (let i = 0; i < list.length; i++) {
				control = list[i];
				if (list[i] instanceof classControl) {
					list.splice(i, 1);
					this.removeUpdate(control);
					if (destroy) {
						control.destroy();
					} else {
						let tempName: string = String.getClassName_Obj(control);
						if (this.cacheControlList[tempName] != null) {
							this.cacheControlList[tempName].destroy();
						}
						this.cacheControlList[tempName] = control;
						control.close();
					}
					break;
				}
			}
		}

		private removeControlList(list: ViewController[], destroy: boolean, count: number = 1): void {
			if (list != null) {
				if (count > 0) count = list.length - count;
				if (count < 0) count = 0;
				let tempControl: ViewController;
				for (let i = list.length - 1; i >= count; i--) {
					tempControl = list[i];
					list.splice(i, 1);
					this.removeUpdate(tempControl);
					if (destroy) {
						tempControl.destroy();
					} else {
						let tempName: string = String.getClassName_Obj(tempControl);
						if (this.cacheControlList[tempName] != null) {
							this.cacheControlList[tempName].destroy();
						}
						this.cacheControlList[tempName] = tempControl;
						tempControl.close();
					}
				}
			}
		}

		private getControlList(viewType: ViewLayerType): ViewController[] {
			let list: ViewController[];
			if (viewType != ViewLayerType.Undefined) {
				list = this.controlList[viewType];
				if (list == null) {
					list = [];
					this.controlList[viewType] = list;
				}
			} else {
				Log.error("获取视图列表失败，该视图类型不在识别范围 ViewLayerType: " + viewType);
			}

			return list;
		}

		private addUpdate(control: ViewController) {
			if (control["update"] != null && typeof (control["update"]) == "function") {
				if (this.controlUpdateList[control.getViewLayerType()] == null) {
					this.controlUpdateList[control.getViewLayerType()] = {};
				}
				let tempName: string = String.getClassName_Obj(control);
				this.controlUpdateList[control.getViewLayerType()][tempName] = control;
			}
		}

		private removeUpdate(control: ViewController) {
			let list = this.controlUpdateList[control.getViewLayerType()];
			if (list != null) {
				let tempName: string = String.getClassName_Obj(control);
				if (list[tempName] != null) delete list[tempName];
				if (ObjectExtend.isEmptyObject(list)) delete this.controlUpdateList[control.getViewLayerType()];
			}
		}
	}
}
