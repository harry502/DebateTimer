module core {
	export class Model implements IEventDispatcher {
		private dispatchObj: ControllerDispatcher;
		private dispatchServerObj: ServiceDispatcher;
		private eventList: Object;
		private activateProtocolCallback: boolean;

		public constructor() {
			this.dispatchObj = ControllerDispatcher.getInstance();
			this.dispatchServerObj = ServiceDispatcher.getInstance();
			this.eventList = {};
			this.activateProtocolCallback = true;
		}

		public destroy(): void {
			this.activateProtocolCallback = false;
			if (this.eventList != null) {
				let list: any[];
				for (let key in this.eventList) {
					list = this.eventList[key];
					for (let i = 0; i < list.length; i++) {
						this.removeEventListener(key, list[0], list[1], true);
					}
				}
				this.eventList = null;
			}
			this.dispatchObj = null;
			this.dispatchServerObj = null;
		}

		public initModel(): void { }

		public clearData(): void { }

		public getModel(modelClass: any): Model {
			return ModelManage.getInstance().getModel(modelClass);
		}

		public isActivateProtocolCallback(): boolean {
			return this.activateProtocolCallback;
		}

		public setActivateProtocolCallback(yes: boolean): void {
			this.activateProtocolCallback = yes;
		}

		public addProtocolCallback(...protocolNameList): void {
			for (let i = 0; i < protocolNameList.length; i++) {
				this.addEventListener(protocolNameList[i], this.protocolCallback, this);
			}
		}

		protected protocolCallback(evt: Event): void {
			if (!this.activateProtocolCallback) return;
			let callback: Function = this[evt.getEventType()];
			if (callback != null) {
				var args = String.getFunctionArgs(callback);
				if (args.length == evt.getParamCount()) {
					callback.apply(this, evt.getParams());
				} else {
					Log.error("协议回调失败，函数定义参数与接收协议参数个数不匹配。数据类: " + String.getClassName_Obj(this) + " 中定义的回调函数: " + evt.getEventType() + " 参数个数: " + args.length + " 接收协议参数个数: " + evt.getParamCount());
				}
			} else {
				Log.error("协议回调失败，数据类: " + String.getClassName_Obj(this) + " 中未定义回调函数: " + evt.getEventType());
			}
		}

		public addEventListener(eventType: string, callback: Function, thisObject: any = null): boolean {
			let yes: boolean = this.dispatchServerObj.addEventListener(eventType, callback, thisObject);
			if (yes) {
				if (this.eventList[eventType] == null) this.eventList[eventType] = [];
				this.eventList[eventType].push([callback, thisObject]);
			}
			return yes;
		}

		public addEventListeners(callback: Function, thisObject: any = null, ...eventTypes): void {
			for (let i = 0; i < eventTypes.length; i++) {
				this.addEventListener(eventTypes[i], callback, thisObject);
			}
		}

		public dispatchEvent(evt: Event): boolean {
			return this.dispatchObj.dispatchEvent(evt);
		}

		public hasEventListener(eventType: string): boolean {
			return this.dispatchServerObj.hasEventListener(eventType);
		}

		public removeEventListenerAll(eventType: string, immediately: boolean = false): boolean {
			let list: any[] = this.eventList[eventType];
			if (list != null) {
				for (let i = 0; i < list.length; i++) {
					this.removeEventListener(eventType, list[0], list[1], immediately);
				}
				this.eventList[eventType] = null;
				return true;
			}
			return false;
		}

		public removeEventListener(eventType: string, callback: Function, thisObject: any = null, immediately: boolean = false): boolean {
			let yes: boolean = this.dispatchServerObj.removeEventListener(eventType, callback, thisObject, immediately);
			if (yes) {
				let list: any[] = this.eventList[eventType];
				if (list != null) {
					for (let i = 0; i < list.length; i++) {
						if (list[i][0] == callback && list[i][1] == thisObject) {
							list.splice(i, 1);
							break;
						}
					}
					if (list.length == 0) this.eventList[eventType] = null;
				}
			}
			return yes;
		}

		public removeEventListeners(callback: Function, thisObject: any = null, immediately: boolean = false, ...eventTypes): void {
			for (let i = 0; i < eventTypes.length; i++) {
				this.removeEventListener(eventTypes[i], callback, thisObject, immediately);
			}
		}
	}
}
