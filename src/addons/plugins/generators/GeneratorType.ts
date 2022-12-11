import { Project } from "../../../projects/Project.js";
import { PluginTypeBase, PluginTypeInfo } from "../PluginType.js";
import { Generator } from "./Generator.js";

export type GeneratorFactory = (generator: Generator) => any;

export class GeneratorType extends PluginTypeBase<Generator> {
    public constructor(
        public readonly id: string,
        public readonly info: PluginTypeInfo,
        public readonly factory: GeneratorFactory
    ) {
        super();
    }

    public create(project: Project, id: string) {
        const generator = new Generator(project, this, id);
        this.factory(generator);
        return generator;
    }
}