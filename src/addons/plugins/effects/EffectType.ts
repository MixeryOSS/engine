import { Project } from "../../../projects/Project.js";
import { PluginTypeBase, PluginTypeInfo } from "../PluginType.js";
import { Effect } from "./Effect.js";

export type EffectFactory = (effect: Effect) => any;

export class EffectType extends PluginTypeBase<Effect> {
    public constructor(
        public readonly id: string,
        public readonly info: PluginTypeInfo,
        public readonly factory: EffectFactory
    ) {
        super();
    }

    public create(project: Project, id: string) {
        const effect = new Effect(project, this, id);
        this.factory(effect);
        return effect;
    }
}