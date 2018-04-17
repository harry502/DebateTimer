module core {
	export class Controller implements IEventDispatcher {
		private dispatchObj: ControllerDispatcher;
		private eventList: Object;

		public constructor() {
			this.dispatchObj = ControllerDispatcher.getInstance();
			this.eventList = {};
		}

		public destroy(): void {
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
		}

		public addEventListener(eventType: string, callback: Function, thisObject: any = null): boolean {
			let yes: boolean = this.dispatchObj.addEventListener(eventType, callback, thisObject);
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
			return this.dispatchObj.hasEventListener(eventType);
		}

		public removeEventListenerAll(eventType: string, immediately: boolean = false): boolean {
			let list: any[] = this.eventList[eventType];
			if (list != null) {
				for (let i = 0; i < list.length; i++) {
					this.removeEventListener(eventType, list[0], list[1], immediately);
				}
				delete this.eventList[eventType];
				return true;
			}
			return false;
		}

		public removeEventListener(eventType: string, callback: Function, thisObject: any = null, immediately: boolean = false): boolean {
			let yes: boolean = this.dispatchObj.removeEventListener(eventType, callback, thisObject, immediately);
			if (yes) {
				let list: any[] = this.eventList[eventType];
				if (list != null) {
					for (let i = 0; i < list.length; i++) {
						if (list[i][0] == callback && list[i][1] == thisObject) {
							list.splice(i, 1);
							break;
						}
					}
					if (list.length == 0) delete this.eventList[eventType];
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
