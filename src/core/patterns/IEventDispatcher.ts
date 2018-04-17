module core {
	export interface IEventDispatcher extends IBasicObject {
		addEventListener(eventType: string, callback: Function, thisObject: any): boolean;
		addEventListeners(callback: Function, thisObject: any, ...eventTypes): void;
		dispatchEvent(evt: Event): boolean;
		hasEventListener(eventType: string): boolean;
		removeEventListenerAll(eventType: string, immediately: boolean): boolean;
		removeEventListener(eventType: string, callback: Function, thisObject: any, immediately: boolean): boolean;
		removeEventListeners(callback: Function, thisObject: any, immediately: boolean, ...eventTypes): void;
	}
}
