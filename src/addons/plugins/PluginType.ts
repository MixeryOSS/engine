import { Project } from "../../projects/Project.js";
import { PluginBase } from "./PluginBase.js";

export abstract class PluginTypeBase<T extends PluginBase> {
    public abstract readonly id: string;
    public abstract readonly info: PluginTypeInfo;

    /**
     * Create a new plugin.
     * @param project Project that the new plugin will be stored.
     * @param id Plugin referencing id. Can be anything, but we suggest using GUID.
     */
    public abstract create(project: Project, id: string): T;
}

export interface PluginTypeInfo {
    name?: string;
}