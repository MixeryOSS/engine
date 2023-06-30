import { EffectType } from "./plugins/effects/EffectType.js";
import { GeneratorType } from "./plugins/generators/GeneratorType.js";
import { PluginTypeBase } from "./plugins/PluginType.js";

export interface AddonInfo {
    name?: string;
    authors?: string[];
    description?: string;
}

export interface AddonMetadata extends AddonInfo {
    id: string;
    main: string;
}

export type AddonFactory = (addon: Addon) => any;

export class Addon {
    public readonly generators = new Map<string, GeneratorType>();
    public readonly effects = new Map<string, EffectType>();
    
    public constructor(
        public readonly id: string,
        public readonly info: AddonInfo,
        factory?: AddonFactory
    ) {
        if (factory) factory(this);
    }

    public register(plugin: PluginTypeBase<any>) {
        const registry = plugin instanceof GeneratorType? this.generators : this.effects;

        if (registry.has(plugin.id)) return false;
        registry.set(plugin.id, plugin as any);
        return true;
    }
}