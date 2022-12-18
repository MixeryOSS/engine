import { PlaylistTrack } from "./PlaylistTrack.js";

export class Playlist {
    public readonly tracks: PlaylistTrack[] = [];

    public patternsAt(tSec: number) {
        return this.tracks.map(v => v.patternAt(tSec)).filter(v => v);
    }
}