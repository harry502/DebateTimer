module core {
	export enum RichType {
		Undefined,
		View,
		Color
	}

	export class RichInfo implements core.IBasicObject {
		public static create(xml:string):RichInfo {
			let info:RichInfo;

			let list:RegExpMatchArray = xml.match("[a-zA-Z0-9]+");
			if (list && list.length >= 1) {
				switch(list[0]) {
					case "quad":
							info = new RichInfo_View();
						break;
					case "color":
							info = new RichInfo_Color();
						break;
				}
			}
			
			return info;
		}

		protected richType:RichType;
		private index:number;

		public destroy():void {
			this.clear();
		}

		public clear():void {
			this.richType = RichType.Undefined;
			this.index = -1;
		}

		public setInfo(xml:string):void {
			xml = xml.slice(1, xml.length-1);
			let list:Array<string> = xml.split(" ");
			if (list != null) {
				let tempName:string;
				let tempValue:string;
				let dataList:RegExpMatchArray;
				let property:any;
				for (let i = 0, m = list.length; i < m; i++) {
					dataList = list[i].match("(\\w+\\s*)=(\\s*[^\\b]+)");
					if (dataList) {
						tempName = dataList[1];
						tempValue = dataList[2];
						property = this[tempName];
						if (property != null) {
							if (typeof(property) == "string") {
								this[tempName] = tempValue;
							} else if (typeof(property) == "number") {
								this[tempName] = Number(tempValue);
							}
						}
					}
				}
			}
		}

		public getRichType():RichType {
			return this.richType;
		}

		public setIndex(index:number):void {
			if (index < 0) {
				Log.error("富文本对象设置索引错误，索引不能小于0");
			} else {
				this.index = index;
			}
		}

		public getIndex():number {
			return this.index;
		}
	}

	export class RichInfo_View extends RichInfo {
		public name:string = "";
		public size:number = 0;
		public width:number = 0;
		public yoffset:number = 0;

		public constructor() {
			super();
			this.richType = RichType.View;
		}

		public clear():void {
			this.name = "";
			this.size = 0;
			this.width = 0;
			this.yoffset = 0;
			super.clear();
		}
	}

	export class RichInfo_Color extends RichInfo {
		public color:string = "";
		public endIndex:number = 0;

		public constructor() {
			super();
			this.richType = RichType.Color;
		}

		public clear():void {
			this.color = "";
			this.endIndex = 0;
			super.clear();
		}
	}
}