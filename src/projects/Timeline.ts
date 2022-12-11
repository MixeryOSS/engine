export function lerp(a: number, b: number, p: number) {
    return a * (1 - p) + b * p;
}

/**
 * This timeline handles timing info, such as BPM and time signature at given time.
 */
export class Timeline {
    points: TimingPoint[] = [];

    public constructor() {
        this.points.push({ startMs: 0, bpm: 120.0, timeSignature: "4/4" });
    }

    reorg() {
        this.points.sort((a, b) => a.startMs - b.startMs);
    }

    getInBetween(ms: number): [TimingPoint, TimingPoint] {
        for (let i = 0; i < this.points.length; i++) {
            const curr = this.points[i];
            const next = this.points[i + 1];
            if (!next) return [curr, null];
            if (curr.startMs <= ms && ms < next.startMs) return [curr, next];
        }

        console.warn(`[Timeline] Out of order timeline?`);
        return [this.points[this.points.length - 1], null];
    }

    get(ms: number): TimingPoint {
        const [curr, next] = this.getInBetween(ms);
        if (next == null) return { startMs: ms, bpm: curr.bpm, timeSignature: curr.timeSignature };

        const p = (ms - curr.startMs) / (next.startMs - curr.startMs);
        return {
            startMs: ms,
            bpm: lerp(curr.bpm, next.bpm, p),
            timeSignature: curr.timeSignature
        }
    }

    getOrCreate(ms: number) {
        let point = this.points.find(v => v.startMs == ms);

        if (!point) {
            point = this.get(ms);
            this.points.push(point);
            this.reorg();
        }

        return point;
    }

    delete(ms: number) {
        const idx = this.points.findIndex(v => v.startMs == ms);
        if (idx != -1) this.points.splice(idx, 1);
    }
}

export interface TimingPoint {
    readonly startMs: number;
    name?: string;
    color?: string;
    bpm: number;
    timeSignature: "4/4" | "3/4";
}