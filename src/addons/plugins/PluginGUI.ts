import { Emitter } from "../../utils/Emitter.js";
import { PluginTab } from "./PluginTab.js";

export class PluginGUI {
    public readonly tabs: PluginTab[] = [];
    public readonly onTabCreate = new Emitter<PluginTab>();

    public add(cb: (tab: PluginTab) => any = () => 0): PluginTab {
        let tab = new PluginTab(this);
        cb(tab);
        this.tabs.push(tab);
        this.onTabCreate.emit(tab);
        return tab;
    }
}