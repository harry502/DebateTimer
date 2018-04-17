module core {
	class BasicAction implements IBasicObject {
		private list: Array<Callback>;

		public constructor(fun: Function = null, obj: any = null) {
			this.list = new Array<Callback>();
			if (fun != null) this.add(fun, obj);
		}

		public destroy(): void {
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].destroy();
			}
			this.list = null;
		}

		public clean(): void {
			for (let i = 0; i < this.list.length; i++) {
				this.list[i].destroy();
			}
			this.list = [];
		}

		public add(fun: Function, obj: any): boolean {
			let item: Callback;
			for (let i = 0; i < this.list.length; i++) {
				item = this.list[i];
				if (item.compare(fun, obj)) {
					Log.warning("Action 添加回调函数失败，该回调还是已添加，无需重复添加");
					return false;
				}
			}
			this.list.push(new Callback(fun, obj));
			return true;
		}

		public remove(fun: Function, obj: any): boolean {
			let item: Callback;
			for (let i = 0; i < this.list.length; i++) {
				item = this.list[i];
				if (item.compare(fun, obj)) {
					this.list.splice(i, 1);
					return true;
				}
			}
			return false;
		}

		protected call(...args): any {
			let tempOjb: any;
			let item: Callback;
			for (let i = 0; i < this.list.length; i++) {
				item = this.list[i];
				tempOjb = item.apply.apply(item, args);
			}

			return tempOjb;
		}
	}

	export class Action extends BasicAction {
		public apply(): any {
			return this.call();
		}
	}

	export class Action1<T> extends BasicAction {
		public apply(value: T): any {
			return this.call(value);
		}
	}

	export class Action2<K, V> extends BasicAction {
		public apply(value1: K, value2: V): any {
			return this.call(value1, value2);
		}
	}

	export class Action3<K, V, T> extends BasicAction {
		public apply(value1: K, value2: V, value3: T): any {
			return this.call(value1, value2, value3);
		}
	}

	export class Action4<K, V, T, Z> extends BasicAction {
		public apply(value1: K, value2: V, value3: T, value4: Z): any {
			return this.call(value1, value2, value3, value4);
		}
	}

	export class Func<T> extends BasicAction {
		public apply(): T {
			return <T>this.call();
		}
	}
}
