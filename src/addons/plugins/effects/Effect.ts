import { Project } from "../../../projects/Project.js";
import { References } from "../../../utils/References.js";
import { PluginBase } from "../PluginBase.js";
import { EffectType } from "./EffectType.js";

export class Effect extends PluginBase {
    public get reference(): References.Ref { return { type: "effect", pluginId: this.id }; };

    public readonly input: GainNode;
    public readonly output: GainNode;

    public constructor(
        public readonly project: Project,
        public readonly type: EffectType,
        public readonly id: string,
    ) {
        super();
        this.name = type.info.name ?? type.id;
        // TODO: color based on name hash

        this.input = this.audioContext.createGain();
        this.input.gain.value = 1.0;

        this.output = this.audioContext.createGain();
        this.output.gain.value = 1.0;
    }
}