class GameInfo
{
    private static inst: GameInfo;
    public static getInst() {
        if (GameInfo.inst == null) {
            GameInfo.inst = new GameInfo();
        }
        return GameInfo.inst;
    }
    private constructor() {}

    selfGroupId: number = -1; //0为p1, 1为p2
    selfUserId: string = "";
    selfUserName: string = "";
    selfUserIcon: string = "";
    selfUserSex:number = 1;//1为男，2为女
    rivalGroupId: number = -1;
    rivalUserId: string = "";
    rivalUserName: string = "";
    rivalUserIcon: string = "";
    rivalUserSex:number = 1;//1为男，2为女
}

interface ServerMsg {
    function: string;
    param: any;
}

//server message
interface SMP_StartGame {
}

class LoadingViewControl extends core.ViewController {

	private view: LoadingView;

	private isGameReady: boolean = false;
    private isResLoaded: boolean = false;
    private loadingProgress: number;
    private gameViewController: GameViewControl;

	public constructor() {
		super();

		var URL = RES.getRes("netconfig_json");

		ALISDK.CatcherSDK.init({
            url: URL.url,
            gameId: '1231231',
            gameVersion: "0.0.1",
        });
        let self = this;
        ALISDK.CatcherSDK.instance()
            .on('CONNECT', (e) => {
                console.log("onConnect", e);
                for (let userInfo of e.playerList) {
                    if (userInfo.groupId === e.userInfo.groupId) {
                        GameInfo.getInst().selfGroupId = userInfo.groupId;
                        GameInfo.getInst().selfUserId = userInfo.openId;
                        GameInfo.getInst().selfUserName = userInfo.nickname;
                        GameInfo.getInst().selfUserIcon = userInfo.avatarUrl;
                        GameInfo.getInst().selfUserSex = userInfo.gender;
                    } else {
                        GameInfo.getInst().rivalGroupId = userInfo.groupId;
                        GameInfo.getInst().rivalUserId = userInfo.openId;
                        GameInfo.getInst().rivalUserName = userInfo.nickname;
                        GameInfo.getInst().rivalUserIcon = userInfo.avatarUrl;
                        GameInfo.getInst().rivalUserSex = userInfo.gender;
                    }
                }
            })
            .on('READY', (_e) => {
            })
            .on('KICK', () => {
            })
            .on('GAMEOVER', (e) => {
                console.log("onResult", e);
            })
            .on('BREAK', () => {
            })
            .on('CONTINUE', () => {
            })
            .on('ERROR', () => {
            })
            .on('MIC_CHANGE',()=>{
			})
            .on('AUDIO_CHANGE',()=>{
            })
            .on('MESSAGE', (msg) => {
                let sm = msg.data as ServerMsg ;

                switch (sm.function) {
                    case "StartGame":
                        let gameInfo = sm.param as SMP_StartGame;
                        self.isGameReady = true;
                        if (self.isResLoaded) {
                            self.onResourceLoadComplete();
                        }
                        break;
                    default:
                        break;
                }
            }).start();

	}

	public destroy() {
		this.close();
		this.view = null;
		super.destroy();
	}

	public open(): void {
		if (this.view == null) {
			this.view = new LoadingView();
		}
		this.getParent().addChild(this.view);

		var groupName: string = "game";
		//var subGroups: Array<string> = ["game", "sound", "animation"];
		var subGroups: Array<string> = [];
		core.LoadingManage.getInstance().loadGroups(groupName, subGroups, this.onResourceLoadComplete, this.onResourceLoadProgress, this);
	}

	public close(): void {
		if (this.view != null && this.view.parent) {
			this.view.parent.removeChild(this.view);
		}
	}

    /**
     * 资源组加载完成
     */
	private onResourceLoadComplete(): void {
		this.isResLoaded = true;

        if (this.isGameReady) {
		    this.gameViewController = core.PageManage.getInstance().addViewControl(GameViewControl, core.ViewLayerType.SceneLayer, core.RemoveViewType.RemoveBefore);
        }
        ALISDK.CatcherSDK.instance().updateProgress(ALISDK.CatcherSDK.ProgressState.COMPLETED);
	}

	/**
 	 * 资源组加载进度
 	 */
	private onResourceLoadProgress(itemsLoaded: number, itemsTotal: number) {
		this.view.setProgress(itemsLoaded, itemsTotal);
		let oldProgress = Math.floor(this.loadingProgress / 10);
        this.loadingProgress = itemsLoaded / itemsTotal * 100;
        let newProgress = Math.floor(this.loadingProgress / 10);
        if (newProgress > oldProgress && newProgress<=10) { //每前进10%上报一次进度
            //console.log("load progress " + itemsLoaded / itemsTotal * 100);
            ALISDK.CatcherSDK.instance().updateProgress(ALISDK.CatcherSDK.ProgressState.PROGRESSING, Math.floor(this.loadingProgress));
        }
		
	}
}
