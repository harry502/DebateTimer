enum eDragonBonesType {
    Qingwa,
	End
}

//龙骨扩展类
class CDragonBoneExtend {

	public dragonBonesNameList: string[];//[eDragonBonesType] = dragonArmatureName

	public constructor() {
		this.InitData();
	}

	/**
	 * 初始化龙骨静态信息
	 */
	public InitData() {
		this.dragonBonesNameList = new Array<string>(eDragonBonesType.End);
		this.dragonBonesNameList[eDragonBonesType.Qingwa] = "qingwa";
	}

	/**
	*根据类型设置龙骨资源
	*/
	public SetDragonBoneDataByType(dragonBonesType: eDragonBonesType): dragonBones.Armature {

		//检查骨骼是否合法，并是否存在
		let dragonbonesFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
		if (this.dragonBonesNameList[dragonBonesType] == null) {
			core.Log.error("骨骼信息未定义,dragonBonesType:" + dragonBonesType);
			return;
		} else {
			let DragonBonesData: dragonBones.DragonBonesData = dragonbonesFactory.getDragonBonesData(this.dragonBonesNameList[dragonBonesType]);
			if (DragonBonesData) {
				return dragonbonesFactory.buildArmature(this.dragonBonesNameList[dragonBonesType]);
			}
		}

		let dragonbones_json: string;
		let texture_json: string;
		let texture_png: string;
		let dragonArmatureName: string;

		switch (dragonBonesType) {
			case eDragonBonesType.Qingwa:
				dragonbones_json = "qingwa_ske_json";
				texture_json = "qingwa_tex_json";
				texture_png = "qingwa_tex_png";
				dragonArmatureName = "qingwa";
				break;
		}
		return this.SetDragonBoneData(dragonbones_json, texture_json, texture_png, dragonArmatureName)
	}

	/**
	 * 设置龙骨的骨骼和纹理资源
	 */
	public SetDragonBoneData(dragonbones_json: string, texture_json: string, texture_png: string, dragonArmatureName: string): dragonBones.Armature {
		let dragonbonesFactory: dragonBones.EgretFactory = dragonBones.EgretFactory.factory;
		dragonbonesFactory.parseDragonBonesData(RES.getRes(dragonbones_json), dragonArmatureName);
		dragonbonesFactory.parseTextureAtlasData(RES.getRes(texture_json), RES.getRes(texture_png), dragonArmatureName);

		return dragonbonesFactory.buildArmature(dragonArmatureName);
	}

	/**
	 * 所有龙骨统一刷帧
	 */
	public allDragonBonePlay(): boolean {
		dragonBones.WorldClock.clock.advanceTime(-1);
		return true;
	}

}
