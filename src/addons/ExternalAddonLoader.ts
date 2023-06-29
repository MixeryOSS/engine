import { Addon } from "../addons/Addon.js";
import { Workspace } from "../Workspace.js";

export class ExternalAddonLoader {
    resources: any[] = [];
    addon: Addon;

    constructor(public readonly workspace: Workspace) {}

    require(name: string) {
        let module = this.workspace.addonRequires.get(name);
        if (!module) throw new Error(`Can't find module ${name} (Have you registered your module using Workspace#addonRequires.set() yet?).`);
        return module;
    }

    runScript(script: string) {
        let func = new Function("require", "use", script);
        func(
            (name: string) => this.require(name),
            (addon: Addon) => {
                if (this.addon) throw new Error("You can only register 1 addon for each package");
                this.addon = addon;
            }
        );
    }
}