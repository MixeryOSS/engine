import { Label } from "../../utils/Label.js";
import { Project } from "../Project.js";
import { MixerTrack } from "./MixerTrack.js";

export class Mixer {
    public get workspace() { return this.project.workspace; }
    public get audioContext() { return this.project.audioContext; }

    private _tracks: MixerTrack[] = [];
    private _idCounter = 0;
    public get tracks() { return [...this._tracks]; }
    public readonly master: MixerTrack;

    public constructor(
        public readonly project: Project
    ) {
        this.master = new MixerTrack(this, "mixery:mixer/tracks/master", { name: "Master" });
        this._tracks.push(this.master);
        this.master.output.connect(this.audioContext.destination);
    }

    /**
     * Create new mixer track and add it to mixer. By default, this method does not automatically
     * connect the track to mixer master output. You must do this by using
     * ``track.output.connect(mixer.master.input)``
     * @param label Display label for mixer track.
     * @returns The mixer track.
     */
    createNewTrack(label: Label) {
        let track = new MixerTrack(this, `mixery:mixer/tracks/${this._idCounter}`, label);
        this._idCounter++;
        this._tracks.push(track);
        return track;
    }
}