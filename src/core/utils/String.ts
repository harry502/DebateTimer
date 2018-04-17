module core {
	export class String {
		public static padLeft(obj: any, length: number, pad: string = "0"): string {
			return (Array(length).join(pad) + obj).slice(-length);
		}

		public static padRight(obj: any, length: number, pad: string = "0"): string {
			return (obj + Array(length).join(pad)).substring(0, length);
		}

		public static getClassName(classType): string {
			return classType.name;
		}

		public static getClassName_Obj(classObj): string {
			if (classObj.__proto__ != null && classObj.__proto__.__class__ != null) {
				return classObj.__proto__.__class__;
			}
			return typeof (classObj);
		}

		public static getFunctionArgs(func): Array<string> {
			let args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];
			return args.split(",").map(function (arg) {
				return arg.replace(/\/\*.*\*\//, "").trim();
			}).filter(function (arg) {
				return arg;
			});
		}

		public static isNullOrEmpty(str: string): boolean {
			return str == null || str == "";
		}

		public static format(formatStr: string, ...values): string {
			if (values.length == 0) return null;

			let str = formatStr;
			for (let i = 0; i < values.length; i++) {
				let re = new RegExp('\\{' + i + '\\}', 'gm');
				str = str.replace(re, values[i]);
			}
			return str;
		}

		public static getQueryString(name:string):string {
			let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			let r = window.location.search.substr(1).match(reg);
			return r != null ? r[2] : null;
		}

		public static uuid(len:number = 0, radix:number = 0):string {
			let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			let uuid = [];
			if (radix <= 0) radix = chars.length;
		
			if (len > 0) {
				for (let i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
			} else {
				let r;
				uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
				uuid[14] = '4';
				
				for (let i = 0; i < 36; i++) {
					if (!uuid[i]) {
						r = 0 | Math.random() * 16;
						uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
					}
				}
			}
		
			return uuid.join('');
		}

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////;
		//////////////////////////////////////////////// SHA1 算法 ////////////////////////////////////////////////////////////////////;
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////;
		public static SHA1(sIn:string):string {
			var x = String.AlignSHA1(sIn);
			var w = new Array(80);
			var a = 1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d = 271733878;
			var e = -1009589776;
			var t;
			for(var i = 0; i < x.length; i += 16) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;
				var olde = e;
				for(var j = 0; j < 80; j++) {
					if(j < 16) w[j] = x[i + j];
					else w[j] = String.rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
					t = String.add(String.add(String.rol(a, 5), String.ft(j, b, c, d)), String.add(String.add(e, w[j]), String.kt(j)));
					e = d;
					d = c;
					c = String.rol(b, 30);
					b = a;
					a = t;
				}
				a = String.add(a, olda);
				b = String.add(b, oldb);
				c = String.add(c, oldc);
				d = String.add(d, oldd);
				e = String.add(e, olde);
			}
			var SHA1Value = String.SHA1hex(a) + String.SHA1hex(b) + String.SHA1hex(c) + String.SHA1hex(d) + String.SHA1hex(e);
			return SHA1Value.toUpperCase();
		}
  
		public static SHA2(sIn:string):string {
			return String.SHA1(sIn).toLowerCase();
		}

		private static add(x:number, y:number):number {
			return((x & 0x7FFFFFFF) + (y & 0x7FFFFFFF)) ^ (x & 0x80000000) ^ (y & 0x80000000);
		}
  
		private static SHA1hex(num:number):string {
			var sHEXChars = "0123456789abcdef";
			var str = "";
			for(var j = 7; j >= 0; j--)
				str += sHEXChars.charAt((num >> (j * 4)) & 0x0F);
			return str;
		}  
		
		private static AlignSHA1(sIn:string):Array<number> {
			var nblk = ((sIn.length + 8) >> 6) + 1,
				blks = new Array(nblk * 16);
			for(var i = 0; i < nblk * 16; i++) blks[i] = 0;
			for(i = 0; i < sIn.length; i++)
				blks[i >> 2] |= sIn.charCodeAt(i) << (24 - (i & 3) * 8);
			blks[i >> 2] |= 0x80 << (24 - (i & 3) * 8);
			blks[nblk * 16 - 1] = sIn.length * 8;
			return blks;
		}
		
		private static rol(num:number, cnt:number):number {
			return(num << cnt) | (num >>> (32 - cnt));
		}
		
		private static ft(t:number, b:number, c:number, d:number):number {
			if(t < 20) return(b & c) | ((~b) & d);
			if(t < 40) return b ^ c ^ d;
			if(t < 60) return(b & c) | (b & d) | (c & d);
			return b ^ c ^ d;
		}  
		
		private static kt(t:number):number {
			return(t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
		}
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////;
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////;
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////;
	}
}
