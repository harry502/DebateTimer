module core {
	export class Callback implements IBasicObject {
		private fun: Function;
		private obj: any;

		public constructor(fun: Function, obj: any) {
			this.fun = fun;
			this.obj = obj;
		}

		public destroy(): void {
			this.fun = null;
			this.obj = null;
		}

		public apply(...args): any {
			if (this.fun == null) return null;
			return this.fun.apply(this.obj, args);
		}

		public compare(fun: Function, obj: any): boolean {
			return this.fun == fun && this.obj == obj;
		}

		public getOjb(): any {
			return this.obj;
		}

		public getFun(): Function {
			return this.fun;
		}
	}
}