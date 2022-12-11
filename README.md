# Mixery Engine
_The Mixery engine_

Mixery Engine handles pretty much everything related to app backend (handles stuff like audio rendering for example, not to be confused with "backend" as in "server-side", although you can use it in server-side without issues).

## Example
### 440Hz sine wave
```ts
import * as engine from "@mixery/engine";

const workspace = new engine.Workspace(new AudioContext());

// Create a simple project and play it
const project = new engine.Project(workspace, {
    name: "sine_440",
    artists: ["your_name"]
});
project.timeline.getOrCreate(0).bpm = 60.00; // 60 BPM at 00:00.00

const generator = project.generators.add(engine.Generators.Oscillator, "generator0", {
    name: "Sine Wave 440Hz"
});

const track = project.playlist.addTrack({ name: "Track 1" });
const midi = project.patterns.add(new engine.Patterns.MIDI({ name: "Pattern 1" }, [
    { channel: generator.channel(), note: engine.note("A4"), velocity: 1.00, offset: 0, duration: 1000 }
]));
track.place({ offset: 0 }, midi);

// Our seek pointer is placed at 00:00.00 by default
playBtn.addEventListener("click", async () => await project.player.play());
```

### Create your own generator
```ts
import * as engine from "@mixery/engine";

export const addon = new engine.Addon("addon_id", { name: "My Addon", authors: ["your_name"] }, addon => {
    addon.register(new engine.GeneratorType("generator_id", {
        name: "My Generator"
    }, generator => {
        const { gui, audioContext, output, onNoteDown, onNoteUp } = generator;
        const notes = new Map<number, OscillatorNode>();
        
        onNoteDown.add(note => {
            const node = audioContext.createOscillator();
            node.frequency.value = note.frequency;
            node.connect(output);
            notes.set(note.id, node);

            node.start(note.startSec);
            if (node.endSec != -1) node.stop(note.startSec + note.durationSec);
            node.onended = () => nodes.delete(note.id);

            // If the note is played with endTime, onNoteUp will not be triggered.
        });

        // This event only applies to controller actions
        onNoteUp.add(note => {
            notes.get(note.id).stop();
        });

        // Let's add GUI to your generator
        // Mixery supports multi-tabs generators and effects
        gui.addTab({ id: "main", isMain: true, name: "Main Tab" }, body => {
            body.innerHTML = `<span>Very cool</span>`;
        });
    }));
});

const workspace = new engine.Workspace(new AudioEngine());
workspace.loadAddon(addon);
```