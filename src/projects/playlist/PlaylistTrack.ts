import { Label } from "../../utils/Label.js";
import { PatternHolder } from "./patterns/PatternHolder.js";

export class PlaylistTrack {
    public isMuted = false;
    public readonly patterns: PatternHolder[] = [];

    public constructor(
        public readonly label: Label
    ) {}

    public patternAt(timeSec: number) {
        return this.patterns.find(v => v.isOccupiedAtTime(timeSec));
    }
}