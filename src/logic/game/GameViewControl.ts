
class GameViewControl extends core.ViewController {
	private gameView:GameView;
	private goods:Object;

	public constructor() {
		super();
	}

	public destroy() {
		if(this.gameView)
		{
			this.gameView.parent.removeChild(this.gameView);
			this.gameView.destroy();
			this.gameView = null;
		}
		super.destroy();
	}

	public open(): void {

		if(this.gameView == null){
			this.gameView = new GameView();
		}
		this.getParent().addChild(this.gameView);
		this.gameView.open();

    }

	public update(): void {
	}

}
