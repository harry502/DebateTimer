/**
 * 声音管理类
 */
module core {
	export class SoundManager implements IBasicObject {
		private static _create: boolean;
		private static _instance: SoundManager;
		public static getInstance(): SoundManager {
			if (SoundManager._instance == null) {
				SoundManager._create = true;
				SoundManager._instance = new SoundManager();
				SoundManager._create = false;
			}
			return SoundManager._instance;
		}


		/**
		 * 音乐文件清理时间
		 * @type {number}
		 */
		public static CLEAR_TIME: number = 3 * 60 * 1000;

		private effect: SoundEffects;
		private bgm: SoundBgm;
		private effectOn: boolean;
		private bgmOn: boolean;
		private currBgm: string;
		private bgmVolume: number;
		private effectVolume: number;

		/**
		 * 构造函数
		 */
		public constructor() {
			if (!SoundManager._create) {
				Log.error("SoundManager 单例类，不能通过构造函数实例化。请使用 SoundManager.getInstance() 方法访问该实例");
				return;
			}

			this.bgmOn = true;
			this.effectOn = true;

			this.bgmVolume = 0.5;
			this.effectVolume = 0.5;

			this.bgm = new SoundBgm();
			this.bgm.setVolume(this.bgmVolume);

			this.effect = new SoundEffects();
			this.effect.setVolume(this.effectVolume);
		}

		public destroy():void {

		}

		/**
		 * 播放音效
		 * @param effectName
		 */
		public playEffect(effectName: string): void {
			if (!this.effectOn)
				return;

			this.effect.play(effectName);
		}

		/**
		 * 播放背景音乐
		 * @param key
		 */
		public playBgm(bgmName: string, loops: number = 0): void {
			this.currBgm = bgmName;
			if (!this.bgmOn)
				return;

			this.bgm.play(bgmName, loops);
		}

		/**
		 * 停止背景音乐
		 */
		public stopBgm(): void {
			this.bgm.stop();
		}

		/**
		 * 设置音效是否开启
		 * @param $isOn
		 */
		public setEffectOn($isOn: boolean): void {
			this.effectOn = $isOn;
		}

		/**
		 * 设置背景音乐是否开启
		 * @param $isOn
		 */
		public setBgmOn($isOn: boolean): void {
			this.bgmOn = $isOn;
			if (!this.bgmOn) {
				this.stopBgm();
			} else {
				if (this.currBgm) {
					this.playBgm(this.currBgm);
				}
			}
		}

		/**
		 * 获取背景音乐开启状态
		 * @returns {boolean}
		 */
		public getBgmOn(): boolean {
			return this.bgmOn;
		}

		/**
		 * 获取音效开启状态
		 * @returns {boolean}
		 */
		public getEffectOn(): boolean {
			return this.effectOn;
		}

		/**
		 * 设置背景音乐音量
		 * @param volume
		 */
		public setBgmVolume(volume: number): void {
			volume = Math.min(volume, 1);
			volume = Math.max(volume, 0);
			this.bgmVolume = volume;
			this.bgm.setVolume(this.bgmVolume);
		}

		/**
		 * 获取背景音乐音量
		 * @returns {number}
		 */
		public getBgmVolume(): number {
			return this.bgmVolume;
		}

		/**
		 * 设置音效音量
		 * @param volume
		 */
		public setEffectVolume(volume: number): void {
			volume = Math.min(volume, 1);
			volume = Math.max(volume, 0);
			this.effectVolume = volume;
			this.effect.setVolume(this.effectVolume);
		}

		/**
		 * 获取音效音量
		 * @returns {number}
		 */
		public getEffectVolume(): number {
			return this.effectVolume;
		}

	}
}