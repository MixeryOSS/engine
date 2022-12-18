export class Temperament {
    public constructor(public readonly multipliers: number[]) {}

    public getFreqMul(semitone: number) {
        let octaves = Math.floor(semitone / 12);
        let mul = this.multipliers[semitone - (octaves * 12)];
        return mul * (2 ** octaves);
    }

    public getFreq(base: number, semitone: number) {
        return base * this.getFreqMul(semitone);
    }

    public getFreqMIDI(midi: number) {
        return this.getFreq(440.0, midi - 69);
    }
}

export namespace Temperaments {
    export const EQUAL = new Temperament([...(function* () {
        for (let i = 0; i < 12; i++) yield 2 ** (i / 12);
    })()]);
}