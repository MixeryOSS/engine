import * as engine from "./index.js";
import * as stateMachine from "@mixery/state-machine";
import { LiveNote } from "./midi/Note.js";
import { Addon } from "./addons/Addon.js";
import { ExternalAddonLoader } from "./addons/ExternalAddonLoader.js";

export class Workspace {
    addonRequires = new Map<string, any>();
    addons: Addon[] = [];

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

    async loadAddonFromUrl(url: string) {
        let addon = await ExternalAddonLoader.loadFromUrl(this, url);
        this.addons.push(addon);
        return addon;
    }
}