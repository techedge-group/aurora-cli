import { QueryStatement } from '{{ config.auroraCorePackage }}';
import { CQMetadata } from '{{ config.auroraCorePackage }}';

export class Update{{ toPascalCase schema.moduleNames }}Command
{
    constructor(
        public readonly payload: {
            {{#each schema.properties.updateCommand}}
            {{#if (allowProperty ../schema.moduleName this) }}
            {{ toCamelCase name }}?: {{ getJavascriptType }};
            {{/if}}
            {{/each}}
        },
        public readonly queryStatement?: QueryStatement,
        public readonly constraint?: QueryStatement,
        public readonly cQMetadata?: CQMetadata,
    ) {}
}