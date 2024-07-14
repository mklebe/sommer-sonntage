export declare class TipsController {
    getAllTips(slug: string): Promise<any[]>;
    getUserTip(username: string): Promise<any>;
    setUserTip(userId: string): Promise<any>;
    setJokerTip(userId: string, body: any): Promise<any>;
    unsetJokerTip(userId: string, body: any): Promise<any>;
}
