import { LivePlayableNote } from "../../midi/Note.js";
import { Temperaments } from "../../utils/Temperament.js";
import { MIDIPattern } from "../playlist/patterns/MIDIPattern.js";
import { PatternHolder } from "../playlist/patterns/PatternHolder.js";
import { Project } from "../Project.js";

export class Player {
    public get workspace() { return this.project.workspace; }
    public get audioContext() { return this.project.workspace.audioContext; }
    public get playlist() { return this.project.playlist; }

    private _runningInterval: ReturnType<typeof setTimeout>;
    public isStarting = false;
    public isStarted = false;
    public isStopped = false;
    public startSec = -1;
    public get currentSec() { return this.audioContext.currentTime; }
    public get elapsedSec() { return this.currentSec - this.startSec; }
    public get currentSongSec() { return this.startSongSec + this.elapsedSec; }

    public constructor(
        public readonly project: Project,
        public readonly startSongSec = 0
    ) {}

    public async start() {
        if (this.isStarting) throw new Error("Cannot reuse Player. Please create a new one.");

        if (this.audioContext instanceof AudioContext) {
            this.isStarting = true;

            if (this.audioContext.state != "running") {
                console.log("[Player] AudioContext is suspended, resuming...");
                await this.audioContext.resume();
            }

            this.startSec = this.audioContext.currentTime;
            // requestAnimationFrame does not call render loop when window is unfocused
            // window.requestAnimationFrame(() => this._renderLoop());
            this._runningInterval = setInterval(() => this._intervalLoop(), 10);
        } else if (this.audioContext instanceof OfflineAudioContext) {
            this.isStarting = true;
            this.isStarted = true;

            // TODO: play everything

            this.isStopped = true;
        }
    }

    public stop() {
        if (this.isStopped) return;
        this.isStopped = true;
        clearInterval(this._runningInterval);

        this._playingNotes.forEach(note => {
            const generator = this.project.generators.get(note.channel);
            if (!generator) {
                console.warn(`[Player] Cannot find generator with linkId = ${note.channel}`);
                return;
            }

            generator.onNoteUpUnpredicted.emit({ id: note.id });
        });
    }

    private _intervalLoop() {
        let [windowStart, windowEnd] = this.updateMarker();
        this.triggerEventsInWindow(windowStart, windowEnd);

        //if (!this.isStopped) window.requestAnimationFrame(t => this._renderLoop());
    }

    public markedSec = 0;
    public get elapsedMsSinceLastMark() { return this.elapsedSec - this.markedSec; }

    public updateMarker() {
        const startMs = this.markedSec;
        const delta = this.elapsedMsSinceLastMark;
        const endMs = startMs + delta;
        this.markedSec = this.elapsedSec;
        return [startMs, endMs, delta];
    }

    private _playedPatterns = new Set<PatternHolder>();
    private _pendingNotes: PlayingPatternLiveNote[] = [];
    private _playingNotes: PlayingPatternLiveNote[] = [];

    public triggerEventsInWindow(startSec: number, endSec: number) {
        const delta = endSec - startSec;

        // Find new patterns to play
        const patterns = this.playlist.patternsAt(startSec).filter(v => !this._playedPatterns.has(v));
        patterns.forEach(p => {
            if (p.pattern instanceof MIDIPattern) {
                p.pattern.channels.forEach((notes, channel) => {
                    this._pendingNotes.push(...notes.map(v => {
                        let note: PlayingPatternLiveNote = {
                            id: -1, channel, midi: v.midi,
                            frequency: Temperaments.EQUAL.getFreqMIDI(v.midi),
                            velocity: v.velocity,
                            startSec: startSec + v.startSec, durationSec: v.durationSec
                        };
                        this.workspace.autoNoteId(note);
                        return note;
                    }));
                });
            }

            this._playedPatterns.add(p);
        });

        // Stream all notes
        const notesToPlay = this._pendingNotes.filter(v => startSec >= v.startSec && startSec < v.startSec + v.durationSec);
        notesToPlay.forEach(note => {
            this._pendingNotes.splice(this._pendingNotes.indexOf(note), 1);
            
            const generator = this.project.generators.get(note.channel);
            if (!generator) {
                console.warn(`[Player] Cannot find generator with linkId = ${note.channel}`);
                return;
            }

            generator.onNoteDown.emit(note);
            this._playingNotes.push(note);
        });
        this._playingNotes.filter(v => startSec >= v.startSec + v.durationSec).forEach(note => {
            this._playingNotes.splice(this._playingNotes.indexOf(note), 1);
        });
    }
}

interface PlayingPatternLiveNote extends LivePlayableNote {
    channel: string;
}