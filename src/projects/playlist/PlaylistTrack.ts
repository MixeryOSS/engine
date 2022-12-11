import { Label } from "../../utils/Label.js";
import { PatternHolder } from "./patterns/PatternHolder.js";

export class PlaylistTrack {
    public isMuted = false;
    public readonly patterns: PatternHolder[] = [];

    constructor(
        public readonly label: Label
    ) {}
}