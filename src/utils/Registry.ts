export class Registry<K, V> {
    private _map = new Map<string, V>();

    public constructor(
        public readonly keyTranslator: (v: K) => string = (v) => `${v}`,
        public readonly parent?: Registry<K, V>
    ) {}

    public has(key: K): boolean {
        const translated = this.keyTranslator(key);
        if (this._map.has(translated)) return true;
        return this.parent?.has(key) ?? false;
    }

    public register(key: K, value: V) {
        const translated = this.keyTranslator(key);
        if (this.has(key)) return false;
        this._map.set(translated, value);
        return true;
    }

    public get(key: K): V {
        const translated = this.keyTranslator(key);
        if (this._map.has(translated)) return this._map.get(translated);
        return this.parent?.get(key) ?? null;
    }
}