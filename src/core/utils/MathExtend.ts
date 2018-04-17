module core {
	export class MathExtend {
		// 利用向量法检测两条线段是否相交
		public static crossMul(v1: egret.Point, v2: egret.Point): number {
			return v1.x * v2.y - v1.y * v2.x;
		}

		public static checkCross(p1: egret.Point, p2: egret.Point, p3: egret.Point, p4: egret.Point): boolean {
			let checkV1: egret.Point = egret.Point.create(p1.x - p3.x, p1.y - p3.y);
			let checkV2: egret.Point = egret.Point.create(p2.x - p3.x, p2.y - p3.y);
			let checkV3: egret.Point = egret.Point.create(p4.x - p3.x, p4.y - p3.y);
			let v: number = MathExtend.crossMul(checkV1, checkV3) * MathExtend.crossMul(checkV2, checkV3);
			checkV1.x = p3.x - p1.x;
			checkV1.y = p3.y - p1.y;
			checkV2.x = p4.x - p1.x;
			checkV2.y = p4.y - p1.y;
			checkV3.x = p2.x - p1.x;
			checkV3.y = p2.y - p1.y;
			return (v <= 0 && MathExtend.crossMul(checkV1, checkV3) * MathExtend.crossMul(checkV2, checkV3) <= 0) ? true : false;
		}
	}
}