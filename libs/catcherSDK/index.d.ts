export interface CatcherSDKConfig {
    url: string;
    gameVersion: string;
    gameId: number | string;
    /** 数据以什么形式传给上层, 现在默认 JSON */
    messageType?: "JSON" | "STRING" | "ARRAYBUFFER";
}

export interface SDKEventMap {
    READY: ReadyEvt;
    MESSAGE: MessageEvt;
    GAMEOVER: GameOverEvt;
    KICK: KickEvt;
    ERROR: ErrorEvt;
    CONNECT: GameInfo;
    BREAK: BreakEvt;
    CONTINUE: ContinueEvt;
    PROGRESS: ProgressEvt;
    MIC_CHANGE: MicChangeEvt;
    AUDIO_CHANGE: AudioChangeEvt;
}
export interface ReadyEvt {
}
export interface UserInfo {
    openId: string;
    nickname: string;
    avatarUrl: string;
    battleTimes: number;
    gender:number;
}
export interface GroupUserInfo extends UserInfo {
    groupId: number;
    isRobot: number;
    state: ProgressState;
    rate: number;
}
export interface GameInfo {
    battleId: string;
    gameCode: string;
    userInfo: GroupUserInfo;
    playerList: GroupUserInfo[];
}
export interface MessageEvt {
    data: any;
}
export interface BreakEvt {
}
export interface ContinueEvt {
}
export interface ErrorEvt {
}
export interface GameResult {
    groupId: number;
    result: -1 | 0 | 1;
}
export interface GameOverEvt {
    code: number;
    groupResult: GameResult[];
}
export interface KickEvt {
    code: number;
    reason: string;
}
export interface ProgressEvt {
    openId: UserInfo['openId'];
    rate?: number;
    state: ProgressState;
}
export interface MicChangeEvt {
    statusList: {
        openId: string;
        micStatus: boolean;
    }[];
}
export interface AudioChangeEvt {
    audioStatus: boolean;
}

declare enum ProgressState {
    CONNECTED = 0,
    PROGRESSING = 1,
    INITIALIZING = 2,
    COMPLETED = 3,
    WAITING = 4,
}

export declare class CatcherSDK {
    static ProgressState: typeof ProgressState;
    static instance(): CatcherSDK;
    static init(config: CatcherSDKConfig): CatcherSDK;
    start(): void;
    end(): Promise<void>;
    on<T extends keyof SDKEventMap>(type: T, cb: (event: SDKEventMap[T]) => void): this;
    sendJson(json: any): void;
    sendData(data: any): void;
    serverTimeDiff: number;
    gameInfo: ALISDK.GameInfo;
    /** 
     * 上传游戏加载进度
     * @param state
     * 1: progressing; 
     * 2: initializing; 
     * 3: complete;
     * @param rate progressing rate
     */
    updateProgress(
        state: ProgressState.PROGRESSING | ProgressState.INITIALIZING | ProgressState.COMPLETED,
        rate?: number
    ): void;
}

export as namespace ALISDK;