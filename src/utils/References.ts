export namespace References {
    export interface IBaseRef<T extends string> {
        type: T;
    }

    export interface IHasPlugin {
        pluginId: string;
    }

    export interface GeneratorRef extends IBaseRef<"generator">, IHasPlugin {}
    export interface EffectRef extends IBaseRef<"effect">, IHasPlugin {}

    export type Ref = GeneratorRef | EffectRef;

    export interface IHasReference {
        readonly reference: Ref;
    }
}