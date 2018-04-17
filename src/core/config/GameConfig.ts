module core {
	export class GameConfig {
		/**
		 * 设计尺寸宽 758
		 */
		public static readonly designSizeWidth: number = 758;
		/**
		 * 设计尺寸高 1136
		 */
		public static readonly designSizeHeight: number = 1136;
		/**
		 * 设计尺寸宽高比 0.667
		 */
		public static readonly designSizeAspectRatio: number = GameConfig.designSizeWidth / GameConfig.designSizeHeight;

		//http服务器通讯地址;
		public static serverHttpRUL:string = "ws://120.92.62.28:9021";
		
		//socket服务器通讯地址;
		public static serverIP:string = "120.92.62.28";
		public static serverPort:number = 9021;

		//appkey;
		public static readonly appkey:string = "NrKzRqUqEdHfEiykWCaEk6f1vsEyCrBM";
	}
}
