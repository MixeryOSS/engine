import { Addon, AddonMetadata } from "../addons/Addon.js";
import { Workspace } from "../Workspace.js";

export class ExternalAddonLoader {
    metadata: AddonMetadata;
    addon: Addon;

    constructor(
        public readonly workspace: Workspace
    ) {}

    static async loadFromUrl(workspace: Workspace, url: string) {
        // Security risk: Loading addons from URLs allows scripts to have access to your
        // data (projects, presets, etc) that is stored inside Mixery.

        if (url.endsWith("/")) url = url.substring(0, url.length - 1);
        const metadata: AddonMetadata = await (await fetch(`${url}/addon.metadata.json`)).json();
        const script = await (await fetch(`${url}/${metadata.main}`)).text();
        const loader = new ExternalAddonLoader(workspace);

        loader.metadata = metadata;
        loader.createAddonInstance();
        loader.runScript(script);
        return loader.addon;
    }

    require(name: string) {
        let module = this.workspace.addonRequires.get(name);
        if (!module) throw new Error(`Can't find module ${name} (Have you registered your module using Workspace#addonRequires.set() yet?).`);
        return module;
    }

    createAddonInstance() {
        this.addon = new Addon(this.metadata.id, this.metadata);
    }

    runScript(script: string) {
        let func = new Function("require", "id", "metadata", "addon", script);
        func(
            (name: string) => this.require(name),
            this.metadata.id,
            this.metadata,
            this.addon
        );
    }
}