module core {
	export class Event implements IBasicObject {
		private eventType: string;
		private argList: any[];
		private target: any;
		public constructor(eventType: string, ...args) {
			this.eventType = eventType;
			this.argList = args;
		}

		public destroy(): void {
			this.eventType = null;
			this.argList = null;
			this.target = null;
		}

		public getEventType(): string {
			return this.eventType;
		}

		public getTarget(): any {
			return this.target;
		}

		public setTarget(tar: any): void {
			this.target = tar;
		}

		public getParams(): any[] {
			return this.argList;
		}

		public setParams(list: any[]): void {
			this.argList = list;
		}

		public getParam<T>(index: number): T {
			let obj: T = null;
			if (this.argList.length > index) {
				obj = this.argList[index] as T;
			}
			return obj;
		}

		public getParamCount(): number {
			return this.argList.length;
		}
	}
}
