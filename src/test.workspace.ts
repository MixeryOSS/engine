import { MIDIPattern } from "./projects/playlist/patterns/MIDIPattern.js";
import { PatternHolder } from "./projects/playlist/patterns/PatternHolder.js";
import { PlaylistTrack } from "./projects/playlist/PlaylistTrack.js";
import { Project } from "./projects/Project.js";
import { TestAddon } from "./test.addon.js";
import { Workspace } from "./Workspace.js";

const workspace = new Workspace(new AudioContext({
    latencyHint: "interactive",
    sampleRate: 48000
}));

const project = new Project(workspace, {
    name: "Sample Project",
    artists: ["nahkd123"],
    description: "A sample project, just to test Mixery Engine functionalities"
});
project.timeline.getOrCreate(0).bpm = 60.00;

const generator = project.generators.add(TestAddon.generators.get("sine_wave"), "generator0");
generator.output.connect(project.mixer.master.input);

const playlistTrack = new PlaylistTrack({ name: "Vocal" });
project.playlist.tracks.push(playlistTrack);

const midi = new MIDIPattern({ name: "totally my voice" }, "totally_my_voice");
playlistTrack.patterns.push(new PatternHolder(midi, 0));
midi.getChannel(generator).push({ midi: 42, velocity: 0.78, startSec: 0, durationSec: 1 });

console.log(workspace, project);