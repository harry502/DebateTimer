module core {
	export class TweenExtend {
		public static playLoop(target: egret.tween.TweenGroup, isLoop: boolean = true, playerPosition: number = -1, ...itemIndexList: number[]): void {
			if (itemIndexList.length == 0) {
				let item: egret.tween.TweenItem;
				for (let i = 0; i < target.items.length; i++) {
					item = target.items[i];
					if (item["tween"] == null) {
						if (item.props == null) {
							item.props = { loop: isLoop };
						} else {
							item.props["loop"] = isLoop;
						}
					} else {
						item["tween"].loop = isLoop;
					}
				}
				if (playerPosition == -1) {
					target.play();
				} else {
					target.play(playerPosition);
				}
			} else {
				let item: egret.tween.TweenItem;
				for (let i = 0; i < itemIndexList.length; i++) {
					item = target.items[itemIndexList[i]];
					if (item != null) {
						if (item["tween"] == null) {
							if (item.props == null) {
								item.props = { loop: isLoop };
							} else {
								item.props["loop"] = isLoop;
							}
						} else {
							item["tween"].loop = isLoop;
						}
						if (playerPosition == -1) {
							target.play();
						} else {
							target.play(playerPosition);
						}
					} else {
						core.Log.error("播放动画对象失败，该对象索引:" + itemIndexList[i] + " 超出动画组索引列表");
					}
				}
			}
		}
	}
}
