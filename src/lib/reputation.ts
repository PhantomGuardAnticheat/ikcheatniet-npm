type IkcheatnietUser = {
    entries: `${string}:${string}`[];
};

class IkcheatnietReputation {
    private _reputation: number;

    constructor(user: IkcheatnietUser) {
        if (!user || !user.entries) {
            throw new Error("Invalid user data");
        }

        this._reputation = this.calculateReputation(user.entries);
    }

    private calculateReputation(entries: `${string}:${string}`[]): number {
        const penalty = entries.length * 10;
        
        return Math.max(0, 100 - penalty);
    }

    public get reputation(): number {
        return this._reputation;
    }

    public get reputationLevel(): string {
        if (this._reputation === 100) return "Clean";
        if (this._reputation >= 80) return "Suspicious";
        if (this._reputation >= 50) return "Untrusted";
        return "Cheater";
    }
}

export default IkcheatnietReputation;