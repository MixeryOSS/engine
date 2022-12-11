import { Slot } from "@mixery/state-machine"
import { PluginGUI } from "./PluginGUI.js";

export class PluginTab {
    public readonly name = new Slot("Tab");
    public readonly body = document.createElement("div");

    public constructor(public readonly gui: PluginGUI) {}
}