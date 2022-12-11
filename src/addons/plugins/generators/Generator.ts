import { LiveNote, LivePlayableNote } from "../../../midi/Note.js";
import { Project } from "../../../projects/Project.js";
import { Emitter } from "../../../utils/Emitter.js";
import { References } from "../../../utils/References.js";
import { PluginBase } from "../PluginBase.js";
import { GeneratorType } from "./GeneratorType.js";

export class Generator extends PluginBase {
    public get reference(): References.Ref { return { type: "generator", pluginId: this.id }; };

    public readonly output: GainNode;

    public readonly onNoteDown = new Emitter<LivePlayableNote>();
    public readonly onNoteUpUnpredicted = new Emitter<LiveNote>();

    public constructor(
        public readonly project: Project,
        public readonly type: GeneratorType,
        public readonly id: string,
    ) {
        super();
        this.name = type.info.name ?? type.id;
        // TODO: color based on name hash
        
        this.output = this.audioContext.createGain();
        this.output.gain.value = 1.0;
    }
}