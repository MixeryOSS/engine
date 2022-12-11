import { Generator } from "../addons/plugins/generators/Generator.js";
import { GeneratorType } from "../addons/plugins/generators/GeneratorType.js";
import { Project } from "./Project.js";

export class ProjectGenerators {
    private _generatorsList: Generator[] = [];
    private _generatorsMap = new Map<string, Generator>();
    
    public constructor(public readonly project: Project) {}

    get(linkId: string) {
        return this._generatorsMap.get(linkId);
    }

    add(type: GeneratorType, linkId: string) {
        if (this.get(linkId)) throw new Error(`Generator with linking id = ${linkId} already existed`);
        const generator = type.create(this.project, linkId);
        this._generatorsList.push(generator);
        this._generatorsMap.set(linkId, generator);
        return generator;
    }

    forEach(cb: (v: Generator) => any) {
        this._generatorsList.forEach(cb);
    }
}