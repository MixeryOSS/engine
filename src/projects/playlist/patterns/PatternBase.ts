import { Label } from "../../../utils/Label.js";

export abstract class PatternBase {
    public abstract readonly label: Label;
    public abstract readonly id: string;
    public abstract durationSec: number;
}