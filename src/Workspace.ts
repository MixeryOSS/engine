import { LiveNote } from "./midi/Note.js";

import * as engine from "./index.js";
import * as stateMachine from "@mixery/state-machine";

export class Workspace {
    addonRequires = new Map<string, any>();

    public constructor(
        public readonly audioContext: BaseAudioContext
    ) {
        this.addonRequires.set("@mixery/engine", engine);
        this.addonRequires.set("@mixery/state-machine", stateMachine);
    }

    private _lastNoteId = 0;
    
    public autoNoteId(note: LiveNote) {
        note.id = this._lastNoteId++;
    }
}