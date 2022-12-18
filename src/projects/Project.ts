import { Workspace } from "../Workspace.js";
import { Mixer } from "./mixer/Mixer.js";
import { Player } from "./player/Player.js";
import { Playlist } from "./playlist/Playlist.js";
import { ProjectGenerators } from "./ProjectGenerators.js";
import { Timeline } from "./Timeline.js";

export interface ProjectMetadata {
    name?: string;
    artists?: string[];
    description?: string;
}

export class Project {
    public get audioContext() { return this.workspace.audioContext; }
    public readonly timeline: Timeline;
    public readonly mixer: Mixer;
    public readonly generators: ProjectGenerators;
    public readonly playlist: Playlist;

    public constructor(
        public readonly workspace: Workspace,
        public readonly metadata: ProjectMetadata = {}
    ) {
        this.timeline = new Timeline();
        this.mixer = new Mixer(this);
        this.generators = new ProjectGenerators(this);
        this.playlist = new Playlist();
    }

    public createPlayer(startSec: number) {
        const player = new Player(this, startSec);
        return player;
    }
}