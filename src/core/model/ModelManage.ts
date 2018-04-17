module core {
	export class ModelManage implements IBasicObject {
		private static _create: boolean;
		private static _instance: ModelManage;
		public static getInstance(): ModelManage {
			if (ModelManage._instance == null) {
				ModelManage._create = true;
				ModelManage._instance = new ModelManage();
				ModelManage._create = false;
			}
			return ModelManage._instance;
		}

		private modelList: Object;

		public constructor() {
			if (!ModelManage._create) {
				Log.error("ModelManage 单例类，不能通过构造函数实例化。请使用 ModelManage.getInstance() 方法访问该实例");
				return;
			}
			this.modelList = {};
			this.createModels();
		}

		public destroy(): void {
			for (let key in this.modelList) {
				this.modelList[key].destroy();
			}
			this.modelList = null;
			ModelManage._instance = null;
		}

		private createModels(): void {
			let length: number = ModelList.modelClassList.length;
			let modelClass: any;
			let modelInstance: Model;
			for (let i = 0; i < length; i++) {
				modelClass = ModelList.modelClassList[i];
				modelInstance = new modelClass();
				this.modelList[String.getClassName(modelClass)] = modelInstance;
			}
		}

		public initModels(): void {
			for (let key in this.modelList) {
				this.modelList[key].initModel();
			}
		}

		public clearDataModels(): void {
			for (let key in this.modelList) {
				this.modelList[key].clearData();
			}
		}

		public getModel<T extends Model>(modelClass: { new (): T; }): T {
			let calssName: string = String.getClassName(modelClass);
			let modelInfo: T = this.modelList[calssName];
			if (modelInfo == null) {
				Log.error("获取数据类 className: " + calssName + " 失败，该数据类不存在，请确认该类已添加到 ModelList 列表");
			}
			return modelInfo;
		}
	}
}
