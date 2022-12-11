import { Effect } from "../../addons/plugins/effects/Effect.js";
import { Label } from "../../utils/Label.js";
import { Mixer } from "./Mixer.js";

export class MixerTrack {
    public get workspace() { return this.mixer.workspace; }
    public get project() { return this.mixer.project; }
    public get audioContext() { return this.mixer.audioContext; }

    public readonly input: GainNode;
    public readonly output: GainNode;
    public get gain() { return this.output.gain; }

    private readonly _effects: Effect[] = [];

    /**
     * Return an array copy of effects in this mixer track. Changes to this array does not
     * apply. See ``#editFxChain()`` to manipulate effects chain.
     */
    public get effects() { return [...this._effects]; }

    public constructor(
        public readonly mixer: Mixer,
        public readonly id: string,
        public readonly label: Label
    ) {
        this.input = this.audioContext.createGain();
        this.input.gain.value = 1.0;
        this.output = this.audioContext.createGain();
        this.output.gain.value = 1.0;
        this.input.connect(this.output);
    }

    private _collectFxChain() {
        let arr: [GainNode, GainNode][] = [];
        
        if (this._effects.length == 0) {
            arr.push([this.input, this.output]);
            return arr;
        }

        let fxid = 0;
        let prev = this.input;
        let next = this._effects[fxid].input;

        do {
            arr.push([prev, next]);
            prev = this._effects[fxid].output;
            fxid++;
            next = this._effects[fxid]?.input ?? this.output;
        } while (next != this.output);

        arr.push([prev, next]);
        return arr;
    }

    private _breakFxChain() {
        this._collectFxChain().forEach(([a, b]) => {
            a.disconnect(b);
        });
    }

    private _joinFxChain() {
        this._collectFxChain().forEach(([a, b]) => {
            a.connect(b);
        });
    }

    public editFxChain(cb: (chain: Effect[]) => any) {
        this._breakFxChain();
        cb(this._effects);
        this._joinFxChain();
    }

    public reconnectFxChain() {
        this.editFxChain(() => {});
    }

    public pushEffect(fx: Effect) {
        this.editFxChain(chain => chain.push(fx));
    }

    public popEffect() {
        let fx: Effect;
        this.editFxChain(chain => { fx = chain.pop() });
        return fx;
    }

    public insertEffect(mode: "before" | "after", target: Effect, insertWith: Effect) {
        let success: boolean;

        this.editFxChain(chain => {
            const idx = chain.indexOf(target);
            if (idx == -1) {
                success = false;
                return;
            }

            if (mode == "before") chain.splice(idx, 0, insertWith);
            if (mode == "after") chain.splice(idx + 1, 0, insertWith);
        });
    }
}