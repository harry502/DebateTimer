/**
 * 声音基类
 */
module core {
	export class SoundBase implements IBasicObject {

		public _cache: any;
		public _loadingCache: Array<string>;
		private _intervalIndex:number = 0;

		/**
		 * 构造函数
		 */
		public constructor() {
			this._cache = {};
			this._loadingCache = new Array<string>();

			this._intervalIndex = egret.setInterval(this.dealSoundTimer, this, 1 * 60 * 1000);
		}

		public destroy():void {
			if (this._intervalIndex != 0) {
				egret.clearInterval(this._intervalIndex);
				this._intervalIndex = 0;
			}
		}

		/**
		 * 处理音乐文件的清理
		 */
		private dealSoundTimer(): void {
			var currTime: number = egret.getTimer();
			var keys = Object.keys(this._cache);
			for (var i: number = 0, len = keys.length; i < len; i++) {
				var key = keys[i];
				if (!this.checkCanClear(key))
					continue;
				if (currTime - this._cache[key] >= SoundManager.CLEAR_TIME) {
					//core.Log.print(key + "已clear")
					delete this._cache[key];
					RES.destroyRes(key);
				}
			}
		}

		/**
		 * 获取Sound
		 * @param key
		 * @returns {egret.Sound}
		 */
		public getSound(key: string): egret.Sound {
			var sound: egret.Sound = RES.getRes(key);
			if (sound) {
				if (this._cache[key]) {
					this._cache[key] = egret.getTimer();
				}
			} else {
				if (this._loadingCache.indexOf(key) != -1) {
					return null;
				}

				this._loadingCache.push(key);
				RES.getResAsync(key, this.onResourceLoadComplete, this);
			}
			return sound;
		}

		/**
		 * 资源加载完成
		 * @param event
		 */
		private onResourceLoadComplete(data: any, key: string): void {
			var index: number = this._loadingCache.indexOf(key);
			if (index != -1) {
				this._loadingCache.splice(index, 1);
				this._cache[key] = egret.getTimer();
				this.loadedPlay(key);
			}
		}

		/**
		 * 资源加载完成后处理播放，纯虚函数，子类重写
		 * @param key
		 */
		public loadedPlay(key: string): void {

		}

		/**
		 * 检测一个文件是否要清除，纯虚函数，子类重写
		 * @param key
		 * @returns {boolean}
		 */
		public checkCanClear(key: string): boolean {
			return true;
		}
	}
}