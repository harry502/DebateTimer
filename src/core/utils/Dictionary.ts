module core {
	export class Dictionary<K, V> implements IBasicObject {
		private _keyList:Array<K>;
		public _valueList:Array<V>;

		public constructor() {
			this._keyList = new Array<K>();
			this._valueList = new Array<V>();
		}

		public destroy():void {
			this.Clear();
			this._keyList = null;
			this._valueList = null;
		}

		public GetKeys():Array<K> {
			return this._keyList;
		}

		public GetValues():Array<V> {
			return this._valueList;
		}

		public Clear(): void {
			this._keyList.splice(0, this._keyList.length);
			this._valueList.splice(0, this._valueList.length);
		}

		public get Count(): number {
			return this._keyList.length;
		}

		public Add(key: K, value: V): void {
			let index:number = this._keyList.indexOf(key);
			if (index == -1) {
				this._keyList.push(key);
				this._valueList.push(value);
			} else {
				this._valueList.splice(index, 1, value);
			}
		}

		public Remove(key: K): boolean {
			let index:number = this._keyList.indexOf(key);
			if (index > -1) {
				this._keyList.splice(index, 1);
				this._valueList.splice(index, 1);
				return true;
			}
			return false;
		}

		public ContainsKey(key: K): boolean {
			let index:number = this._keyList.indexOf(key);
			return index != -1;
		}

		public ContainsValue(value: V): boolean {
			let index:number = this._valueList.indexOf(value);
			return index != -1;
		}

		public GetValue(key: K): V {
			let index:number = this._keyList.indexOf(key);
			if (index != -1) {
				return this._valueList[index];
			}
			return null;
		}

		public GetKey(value: V):K {
			let index:number = this._valueList.indexOf(value);
			if (index != -1) {
				return this._keyList[index];
			}
			return null;
		}
	}
}
