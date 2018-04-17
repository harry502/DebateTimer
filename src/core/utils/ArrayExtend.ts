module core {
	export class ArrayExtend {
		public static convertAll<T, V>(list: Array<T>, convertFun: Callback): Array<V> {
			let newList: Array<V> = new Array<V>();
			for (let i = 0; i < list.length; i++) {
				newList.push(convertFun.apply(list[i]) as V);
			}

			return newList;
		}

		public static contains<T, V>(list: Array<T>, value: T): boolean {
			return list.indexOf(value) >= 0;
		}

		public static remove<T, V>(list: Array<T>, value: T): void {
			let index: number = list.indexOf(value);
			if (index >= 0) {
				list.splice(index, 1);
			}
		}
		public static add<T, V>(list: Array<T>, value: T): void {
			let index: number = list.indexOf(value);
			if (index == -1) {
				list.push(value);
			}
		}

		public static AddRange<T>(list: Array<T>, list2: Array<T>): void {
			for (let i = 0; i < list2.length; i++) {
				list.push(list2[i]);
			}
		}

		public static Copy<T>(sourceArray:Array<T>, sourceIndex:number, destinationArray:Array<T>, destinationIndex:number, length:number) {
			for (let i = 0; i < length; i++) {
				destinationArray[destinationIndex + i] = sourceArray[sourceIndex];
				sourceIndex++;
				if (sourceIndex >= sourceArray.length) sourceIndex = 0;
			}
		}

	}
}
