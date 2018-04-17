/**
 * 背景音乐类
 */
module core {
	export class SoundBgm extends SoundBase {

		private _currBgm: string;
		private _currSound: egret.Sound;
		private _currSoundChannel: egret.SoundChannel;
		private _volume: number;
		private _loops: number;

		/**
		 * 构造函数
		 */
		public constructor() {
			super();
			this._currBgm = "";
		}

		/**
		 * 停止当前音乐
		 */
		public stop(): void {
			if (this._currSoundChannel) {
				this._currSoundChannel.stop();
			}
			this._currSoundChannel = null;
			this._currSound = null;
			this._currBgm = "";
		}

		/**
		 * 播放某个音乐
		 * @param effectName
		 */
		public play(effectName: string, loops: number): void {
			if (this._currBgm == effectName)
				return;
			this.stop();
			this._currBgm = effectName;
			this._loops = loops;
			var sound: egret.Sound = this.getSound(effectName);
			if (sound) {
				this.playSound(sound, this._loops);
			}
		}

		/**
		 * 播放
		 * @param sound
		 */
		private playSound(sound: egret.Sound, loops: number): void {
			this._currSound = sound;
			this._currSoundChannel = this._currSound.play(0, loops);
			this._currSoundChannel.volume = this._volume;
		}

		/**
		 * 设置音量
		 * @param volume
		 */
		public setVolume(volume: number): void {
			this._volume = volume;
			if (this._currSoundChannel) {
				this._currSoundChannel.volume = this._volume;
			}
		}

		/**
		 * 资源加载完成后处理播放
		 * @param key
		 */
		public loadedPlay(key: string): void {
			if (this._currBgm == key) {
				this.playSound(RES.getRes(key), this._loops);
			}
		}

		/**
		 * 检测一个文件是否要清除
		 * @param key
		 * @returns {boolean}
		 */
		public checkCanClear(key: string): boolean {
			return this._currBgm != key;
		}
	}
}