import { Project } from "../../projects/Project.js";
import { Label } from "../../utils/Label.js";
import { References } from "../../utils/References.js";
import { PluginGUI } from "./PluginGUI.js";

export abstract class PluginBase implements PluginInfo, References.IHasReference {
    name: string;
    color?: string;
    
    public abstract readonly project: Project;
    public abstract readonly id: string;
    public abstract readonly reference: References.Ref;
    public get workspace() { return this.project.workspace; }
    public get audioContext() { return this.project.audioContext; }

    public readonly gui = new PluginGUI();
}

export interface PluginInfo extends Label {
    name: string;
}