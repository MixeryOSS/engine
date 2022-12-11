export interface MIDINote {
    midi: number;
    velocity: number;
}

export interface PlayableNote extends MIDINote {
    /** Note frequency */
    frequency: number;

    /**
     * Note start time in seconds. This field already included the current time position of
     * ``AudioContext``.
     */
    startSec: number;

    /** Note duration in seconds */
    durationSec?: number;
}

export interface LiveNote {
    /** Note id */
    id: number;
}

export interface LivePlayableNote extends LiveNote, PlayableNote {}

export interface MIDIClipNote extends MIDINote {
    startSec: number;
    durationSec: number;
}