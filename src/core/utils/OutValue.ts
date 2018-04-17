module core {
	export class OutValue<T> {
		public value:T;

		public constructor(value:T = null) {
			this.value = value;
		}
	}
}