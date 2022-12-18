import { PatternBase } from "./PatternBase.js";

export class PatternHolder {
    public get actualDurationSec() { return this.durationSec == -1? this.pattern.durationSec : this.durationSec; }

    public constructor(
        public pattern: PatternBase,
        public startSec: number,
        /** ``-1`` to use duration obtained from pattern base. */
        public durationSec: number = -1
    ) {}

    public isOccupiedAtTime(tSec: number) {
        return tSec >= this.startSec && tSec < this.startSec + this.actualDurationSec;
    }
}