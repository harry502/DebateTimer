module core {
	export class EventDispatcher implements IEventDispatcher {
		private eventList: Object;

		public constructor() {
			this.eventList = {};
		}

		public destroy(): void {
			this.eventList = null;
		}

		public addEventListener(eventType: string, callback: Function, thisObject: any = null): boolean {
			if (this.eventList[eventType] == null) {
				this.eventList[eventType] = new Array<Callback>();
			}
			let list: Array<Callback> = this.eventList[eventType];
			let tempItem: Callback;
			for (let i = 0; i < list.length; i++) {
				tempItem = list[i];
				if (tempItem.compare(callback, thisObject)) {
					Log.warning("添加事件监听失败，事件类型：" + eventType + " 中的回调函数添加重复，请检查调用处是否正确调用");
					return false;
				}
			}
			list.push(new Callback(callback, thisObject));
			return true;
		}

		public addEventListeners(callback: Function, thisObject: any = null, ...eventTypes): void {
			for (let i = 0; i < eventTypes.length; i++) {
				this.addEventListener(eventTypes[i], callback, thisObject);
			}
		}

		public dispatchEvent(evt: Event): boolean {
			if (this.eventList[evt.getEventType()] == null) return false;
			evt.setTarget(this);
			let list: Array<Callback> = this.eventList[evt.getEventType()];
			let tempList: Array<Callback> = new Array<Callback>();
			for (let i = 0; i < list.length; i++) {
				tempList.push(list[i]);
			}
			evt.setTarget(this);
			for (let i = 0; i < tempList.length; i++) {
				tempList[i].apply(evt);
			}
			return true;
		}

		public hasEventListener(eventType: string): boolean {
			return this.eventList[eventType] != null;
		}

		public removeEventListenerAll(eventType: string, immediately: boolean = false): boolean {
			if (this.eventList[eventType] == null) return false;
			if (immediately) {
				let list: Array<Callback> = this.eventList[eventType];
				for (let i = list.length - 1; i >= 0; i--) {
					list[i].destroy();
				}
			}
			delete this.eventList[eventType];
			return true;
		}

		public removeEventListener(eventType: string, callback: Function, thisObject: any = null, immediately: boolean = false): boolean {
			if (this.eventList[eventType] == null) return false;
			let list: Array<Callback> = this.eventList[eventType];
			let tempItem: Callback;
			for (let i = 0; i < list.length; i++) {
				tempItem = list[i];
				if (tempItem.compare(callback, thisObject)) {
					if (immediately) tempItem.destroy();
					list.splice(i, 1);
					if (list.length == 0) delete this.eventList[eventType];
					return true;
				}
			}
			return false;
		}

		public removeEventListeners(callback: Function, thisObject: any = null, immediately: boolean = false, ...eventTypes): void {
			for (let i = 0; i < eventTypes.length; i++) {
				this.removeEventListener(eventTypes[i], callback, thisObject, immediately);
			}
		}
	}
}
