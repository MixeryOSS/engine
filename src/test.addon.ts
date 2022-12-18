import { Addon } from "./addons/Addon.js";
import { EffectType } from "./addons/plugins/effects/EffectType.js";
import { GeneratorType } from "./addons/plugins/generators/GeneratorType.js";

export const TestAddon = new Addon("test_addon", {
    name: "Test Addon"
}, addon => {
    addon.register(new GeneratorType("sine_wave", {
        name: "Sine Wave"
    }, generator => {
        const { gui, onNoteDown, onNoteUpUnpredicted, audioContext, output } = generator;

        gui.add(tab => {
            tab.name.value = "Plugin";
            tab.body.innerHTML = `<span>Hi!</span>`;
        });

        const notes = new Map<number, OscillatorNode>();
        onNoteDown.add(note => {
            const gain = audioContext.createGain();
            gain.gain.value = note.velocity;
            gain.connect(output);

            const osc = audioContext.createOscillator();
            osc.frequency.value = note.frequency;
            osc.connect(gain);
            notes.set(note.id, osc);

            osc.start(note.startSec);
            if (note.durationSec != null) osc.stop(note.startSec + note.durationSec);
            osc.onended = () => notes.delete(note.id);
        });

        onNoteUpUnpredicted.add(note => {
            notes.get(note.id).stop();
        });
    }));

    addon.register(new EffectType("analyzer", {
        name: "Analyzer"
    }, effect => {
        const { gui, input, output, audioContext } = effect;

        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 256;
        input.connect(analyzer);
        analyzer.connect(output);
        // TODO: test the branch approach

        console.log(analyzer);
    }));
});