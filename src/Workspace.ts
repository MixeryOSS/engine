import { LiveNote } from "./midi/Note.js";

export class Workspace {
    public constructor(
        public readonly audioContext: BaseAudioContext
    ) {}

    private _lastNoteId = 0;
    
    public autoNoteId(note: LiveNote) {
        note.id = this._lastNoteId++;
    }
}