import { Generator } from "../../../addons/plugins/generators/Generator.js";
import { MIDIClipNote } from "../../../midi/Note.js";
import { Label } from "../../../utils/Label.js";
import { PatternBase } from "./PatternBase.js";

export class MIDIPattern extends PatternBase {
    public readonly channels = new Map<string, MIDIClipNote[]>();

    public constructor(
        public readonly label: Label,
        public readonly id: string,
        public durationSec: number = 0, // TODO: autosize
    ) {
        super();
    }

    getChannel(generator: Generator) {
        let channel = this.channels.get(generator.id);
        if (!channel) this.channels.set(generator.id, channel = []);
        return channel;
    }
}