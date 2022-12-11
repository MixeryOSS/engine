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
            const node = audioContext.createOscillator();
            node.frequency.value = note.frequency;
            node.connect(output);
            notes.set(note.id, node);

            node.start(note.startSec);
            if (note.durationSec != null) node.stop(note.startSec + note.durationSec);
            node.onended = () => notes.delete(note.id);
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