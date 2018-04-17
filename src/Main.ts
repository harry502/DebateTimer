/**
 * 程序入口
 */
class Main extends egret.DisplayObjectContainer {

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(event: egret.Event) {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
		egret.ImageLoader.crossOrigin = 'anonymous';

		//注入自定义的素材解析器
		egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
		egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

		//初始化框架;
		core.CoreManage.getInstance().setDisplayObjectContainer(this);

		core.LoadingManage.getInstance().addConfig("resource/default.res.json", "resource/");
		core.LoadingManage.getInstance().loadConfig(this.onConfigComplete, this);
	}

	/**
	 * 配置文件加载完成，开始加载主题文件。
	 */
	private onConfigComplete(): void {
		//加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
		var theme = new eui.Theme("resource/default.thm.json", this.stage);
		theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
	}

	/**
	 * 主题文件加载完成，开始加载loading资源组。
	 */
	private onThemeLoadComplete(): void {
		core.LoadingManage.getInstance().loadGroup("loading", this.onLoadingResLoadComplete, null, this);
	}

	/**
	 * loading资源组加载完成
	 */
	private onLoadingResLoadComplete(): void {
		core.PageManage.getInstance().addViewControl(LoadingViewControl, core.ViewLayerType.SceneLayer);
	}
}
