module core {
	export class ObjectExtend {
		public static isEmptyObject(obj) {
			if (obj) {
				for (var n in obj) {
					return false
				}
			}
			return true;
		}

		public static getHashCode(obj: any): number {
			let str: string = obj.toString();
			let h = 0;
			let len = str.length;
			let t = 2147483648;
			for (let i = 0; i < len; i++) {
				h = 31 * h + str.charCodeAt(i);
				if (h > 2147483647) h %= t;
			}
			return h;
		}
	}
}
