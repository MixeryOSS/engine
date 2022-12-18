import { MIDIPattern } from "./projects/playlist/patterns/MIDIPattern.js";
import { PatternHolder } from "./projects/playlist/patterns/PatternHolder.js";
import { PlaylistTrack } from "./projects/playlist/PlaylistTrack.js";
import { Project } from "./projects/Project.js";
import { TestAddon } from "./test.addon.js";
import { Temperaments } from "./utils/Temperament.js";
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

const midi = new MIDIPattern({ name: "totally my voice" }, "totally_my_voice", 10);
playlistTrack.patterns.push(new PatternHolder(midi, 0));

// Sample chords. I don't know about music theory through...
midi.getChannel(generator).push({ midi: 72, velocity: 0.1, startSec: 0, durationSec: 1 });
midi.getChannel(generator).push({ midi: 76, velocity: 0.1, startSec: 0, durationSec: 1 });
midi.getChannel(generator).push({ midi: 81, velocity: 0.1, startSec: 0, durationSec: 1 });

midi.getChannel(generator).push({ midi: 69, velocity: 0.1, startSec: 1, durationSec: 1 });
midi.getChannel(generator).push({ midi: 72, velocity: 0.1, startSec: 1, durationSec: 1 });
midi.getChannel(generator).push({ midi: 78, velocity: 0.1, startSec: 1, durationSec: 1 });

console.log(workspace, project);

const player = project.createPlayer(0);
const playBtn = document.createElement("button");
playBtn.textContent = "Click To Play";
playBtn.addEventListener("click", () => player.start());
document.body.appendChild(playBtn);

const stopBtn = document.createElement("button");
stopBtn.textContent = "Click To Stop";
stopBtn.addEventListener("click", () => player.stop());
document.body.appendChild(stopBtn);

console.log(project.playlist.tracks[0]);

// Connect to analyzer node
const analyzer = workspace.audioContext.createAnalyser();
analyzer.fftSize = 512;
const buff = new Uint8Array(analyzer.frequencyBinCount);
project.mixer.master.output.connect(analyzer);
analyzer.connect(workspace.audioContext.destination);

const canvas = document.createElement("canvas");
canvas.width = buff.length; canvas.height = 200;
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

function render() {
    window.requestAnimationFrame(render);
    analyzer.getByteFrequencyData(buff);
    ctx.clearRect(0, 0, 500, 200);

    ctx.strokeStyle = "black";
    ctx.beginPath();
    for (let i = 0; i < buff.length; i++) {
        const p = 200 * (1 - buff[i] / 255);
        if (i == 0) ctx.moveTo(i, p);
        else ctx.lineTo(i, p);
    }
    ctx.stroke();
    ctx.closePath();
}
window.requestAnimationFrame(render);