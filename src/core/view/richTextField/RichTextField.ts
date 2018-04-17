module core {
	export class RichTextField extends egret.Sprite implements core.IBasicObject {
		private c_sprite:egret.Sprite;
		private t_context:egret.TextField;
		private _htmlText:egret.HtmlTextParser;
		private _originalContext:string = "";
		private _context:string = "";
		private _maxWidth:number = 0;
		private _richInfoList:Array<RichInfo>;
		private _bitWide:number = 0;
		private _bitHeight:number = 0;
		
		public constructor() {
			super();
			
			this.t_context = new egret.TextField();
			this.addChild(this.t_context);
			this._htmlText = new egret.HtmlTextParser();
			this.c_sprite = new egret.Sprite();
			this.addChild(this.c_sprite);
			this._bitWide = this.t_context.size / 4;
			this._bitHeight = this.t_context.size + this.t_context.lineSpacing;
		}

		public destroy():void {
			if (this.t_context) {
				if (this.t_context.parent) this.t_context.parent.removeChild(this.t_context);
				this.t_context = null;
			}
			if (this.c_sprite) {
				this.c_sprite.removeChildren();
				if (this.c_sprite.parent) this.c_sprite.parent.removeChild(this.c_sprite);
				this.c_sprite = null
			}
			this._richInfoList = null;
			this._htmlText = null;
		}

		public clear():void {
			this.t_context.textFlow = this._htmlText.parser("");
			this.c_sprite.removeChildren();
			this._richInfoList.splice(0);
			this._maxWidth = 0;
			this._bitWide = 0;
			this._bitHeight = 0;
		}

		public setText(str:string):void {
			if (this._originalContext != str) {
				this._originalContext = str || "";
				let list:Array<Object> = this.analysisRichText(this._originalContext);
				this._context = list[0] as string;
				this._richInfoList = list[1] as Array<RichInfo>;
				this.updateContent();
			}
		}

		public getText():string {
			return this._context;
		}

		public getOriginalText():string {
			return this._originalContext;
		}

		public setColor(color:number):void {
			if (color < 0 || color > 0xffffff) {
				Log.warning("字体颜色值不在 0 ~ 0xffffff 取值范围");
			} else {
				this.t_context.textColor = color;
			}
		}

		public getColor():number {
			return this.t_context.textColor;
		}

		public setFontSize(size:number):void {
			if (size < 1) {
				Log.warning("字体大小不能小于1");
			} else {
				if (this.t_context.size != size) {
					this.t_context.size = size;
					this._bitWide = size / 4;
					this._bitHeight = size + this.t_context.lineSpacing;
					this.updateContent();
				}
			}
		}

		public getFontSize():number {
			return this.t_context.size;
		}

		public setFont(font:string):void {
			if (String.isNullOrEmpty(font)) {
				Log.warning("设置字体失败，字体名不能为空");
			} else {
				this.t_context.fontFamily = font;
			}
		}
		
		public getFont():string {
			return this.t_context.fontFamily;
		}

		public setMaxWidth(width:number):void {
			if (width < 0) {
				Log.warning("设置最大宽度失败，最大宽度不能小于0");
			} else {
				if (this._maxWidth != width) {
					this._maxWidth = this.width = width;
					this.updateContent();
				}
			}
		}

		public getMaxWidth():number {
			return this._maxWidth;
		}

		public setLineSpacing(size:number):void {
			this.t_context.lineSpacing = size;
			this._bitHeight = this.getFontSize() + size;
			this.updateContent();
		}
		
		public getLineSpacing():number {
			return this.t_context.lineSpacing;
		}

		private tempDataList:Dictionary<string, number> = new Dictionary<string, number>();
		private analysisRichText(str:string):Array<Object> {
			let textStr:string = "";
			let spriteList:Array<RichInfo> = new Array<RichInfo>();

			let context:string = str;
			let startIndex:number = context.length;
			let strExtractIndex:number = context.length;
			let leftIndex:number = 0;
			let rightIndex:number = 0;
			let itemStr:string;
			let itemInfo:RichInfo;
			while (true) {
				leftIndex = context.lastIndexOf("<", startIndex);
				if (leftIndex != -1) {
					rightIndex = context.indexOf(">", leftIndex);
					if (rightIndex != -1) {
						rightIndex ++;
						if (rightIndex < strExtractIndex) {
							itemStr = context.slice(rightIndex, strExtractIndex);
							textStr = itemStr + textStr;
							strExtractIndex = leftIndex;
						} else {
							strExtractIndex -= (rightIndex - leftIndex);
						}
						
						itemStr = context.slice(leftIndex, rightIndex);
						if (itemStr.indexOf("</") != -1) {
							let list:RegExpMatchArray = itemStr.match("[a-zA-Z0-9]+");
							if (list != null && list.length >= 1) {
								this.tempDataList.Add(list[0], context.length - rightIndex);
								context = context.slice(0, leftIndex) + context.slice(rightIndex, context.length);
							}
						} else {
							itemInfo = RichInfo.create(itemStr);
							if (itemInfo) {
								itemInfo.setInfo(itemStr);
								itemInfo.setIndex(context.length - rightIndex);
								
								switch(itemInfo.getRichType()) {
									case RichType.Color:
										if (this.tempDataList.ContainsKey("color")) {
											let endIndex:number = this.tempDataList.GetValue("color");
											this.tempDataList.Remove("color");
											(itemInfo as RichInfo_Color).endIndex = endIndex;
										}
										break;
								}
								spriteList.splice(0, 0, itemInfo);
								context = context.slice(0, leftIndex) + context.slice(rightIndex, context.length);
							}
						}
					}
					startIndex = leftIndex-1;
				} else {
					if (strExtractIndex >= 0) {
						itemStr = context.slice(0, strExtractIndex);
						textStr = itemStr + textStr;
					}
					break;
				}
			}
			let length:number = context.length;
			for (let i = 0, m = spriteList.length; i < m; i++) {
				itemInfo = spriteList[i];
				itemInfo.setIndex(length - itemInfo.getIndex());
				switch(itemInfo.getRichType()) {
					case RichType.Color:
						(itemInfo as RichInfo_Color).endIndex = length - (itemInfo as RichInfo_Color).endIndex;
						break;
				}
			}

			return [textStr, spriteList];
		}
		
		private updateContent():void {
			if (this._richInfoList != null && this._context != null) {
				this.c_sprite.removeChildren();
				let tempContext:OutValue<string> = new OutValue<string>("");
				let tempViewX:OutValue<number> = new OutValue<number>(0);
				let tempViewY:OutValue<number> = new OutValue<number>(0);
				let tempNumLines:OutValue<number> = new OutValue<number>(0);
				
				let itemInfo:RichInfo;
				let itemView:egret.DisplayObject;
				let strIndex:number = 0;
				for (let i = 0, m = this._richInfoList.length; i < m; i++) {
					itemInfo = this._richInfoList[i];
					this.calculateNewline(tempContext, this._context.slice(strIndex, itemInfo.getIndex()));
					strIndex = itemInfo.getIndex();
					switch(itemInfo.getRichType()) {
						case RichType.View:
							let viewInfo:RichInfo_View = itemInfo as RichInfo_View;
							this.calculateInsertImageAndPos(tempContext, String.padLeft("", Math.ceil(viewInfo.size / this._bitWide), "\t"), viewInfo.size, tempViewX, tempViewY, tempNumLines);
							itemView = new eui.Image(viewInfo.name + "_png");
							itemView.width = itemView.height = viewInfo.size;
							itemView.x = tempViewX.value;
							itemView.y = tempViewY.value;
							this.c_sprite.addChild(itemView);
							break;
						case RichType.Color:
							let colorInfo:RichInfo_Color = itemInfo as RichInfo_Color;
							if (colorInfo.getIndex() >= colorInfo.endIndex) {
								Log.warning("设置文本文字颜色值失败，请检查开始索引和结束索引是否正确");
							} else {
								strIndex = (itemInfo as RichInfo_Color).endIndex;
								let tempStr:string = this._context.slice(colorInfo.getIndex(), strIndex);
								let tempIndex:number = tempContext.value.length;
								this.calculateNewline(tempContext, tempStr);
								tempContext.value = tempContext.value.slice(0, tempIndex) + "<font color=" + colorInfo.color + ">" + tempContext.value.slice(tempIndex, tempContext.value.length) + "</font>";
							}
							break;
					}
				}
				if (strIndex < this._context.length) {
					this.calculateNewline(tempContext, this._context.slice(strIndex, this._context.length));
				}
				this.t_context.textFlow = this._htmlText.parser(tempContext.value);
			}
		}

		private calculateNewline(context:OutValue<string>, addStr:string):void {
			if (this._maxWidth <= 0) {
				context.value += addStr;
			} else {
				let tempStr:Array<egret.ITextElement> = this.t_context.textFlow;
				this.t_context.textFlow = this._htmlText.parser(context.value + addStr);
				if (this.t_context.width > this._maxWidth) {
					for (let i = 0, m = addStr.length; i < m; i++) {
						this.t_context.textFlow = this._htmlText.parser(context.value + addStr[0]);
						if (this.t_context.width > this._maxWidth) {
							context.value += "\n";
						}
						context.value += addStr[0];
						addStr = addStr.slice(1, addStr.length);
					}
				} else {
					context.value = context.value + addStr;
				}
				this.t_context.textFlow = tempStr;
			}
		}

		private calculateInsertImageAndPos(context:OutValue<string>, addStr:string, viewHeight, viewX:OutValue<number>, viewY:OutValue<number>, numLines:OutValue<number>):void {
			let tempStr:Array<egret.ITextElement> = this.t_context.textFlow;
			if (this._maxWidth <= 0) {
				this.t_context.textFlow = this._htmlText.parser(context.value);
				viewX.value = this.t_context.width;
				context.value += addStr;
			} else {
				this.t_context.textFlow = this._htmlText.parser(context.value + addStr);
				if (this.t_context.width > this._maxWidth) {
					context.value += String.padLeft("", Math.ceil(viewHeight / this._bitHeight) + 1, "\n");
					this.t_context.textFlow = this._htmlText.parser(context.value);
					numLines.value = this.t_context.numLines;
					viewX.value = 0;
					viewY.value = numLines.value * this._bitHeight - viewHeight;
				} else {
					if (numLines.value < this.t_context.numLines) {
						let index:number = context.value.lastIndexOf("\n");
						let tempLeft:string = context.value.slice(0, index+1) + String.padLeft("", Math.ceil(viewHeight / this._bitHeight), "\n");
						let tempRight:string = context.value.slice(index+1, context.value.length);
						this.t_context.textFlow = this._htmlText.parser(tempRight);
						viewX.value = this.t_context.width;
						context.value = tempLeft + tempRight;
						this.t_context.textFlow = this._htmlText.parser(context.value);
						numLines.value = this.t_context.numLines;
						viewY.value = numLines.value * this._bitHeight - viewHeight;
					} else {
						let index:number = context.value.lastIndexOf("\n");
						let tempRight:string = context.value.slice(index, context.value.length);
						this.t_context.textFlow = this._htmlText.parser(tempRight);
						viewX.value = this.t_context.width;
						this.t_context.textFlow = this._htmlText.parser(context.value);
						viewY.value = numLines.value * this._bitHeight - viewHeight;
					}
				}
				context.value += addStr;
			}
			this.t_context.textFlow = tempStr;
		}
	}
}