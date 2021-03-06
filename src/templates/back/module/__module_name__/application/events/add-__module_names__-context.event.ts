import { AggregateRoot } from '@nestjs/cqrs';
import { {{ schema.aggregateName }} } from '../../domain/{{ toKebabCase schema.moduleName }}.aggregate';
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/created-' (toKebabCase schema.moduleName) '.event.ts'}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/created-' (toKebabCase schema.moduleNames) '.event.ts'}}
import { Created{{ toPascalCase schema.moduleName }}Event } from './created-{{ toKebabCase schema.moduleName }}.event';
{{/notInArray}}
{{/notInArray}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/created-' (toKebabCase schema.moduleName) '.event.ts'}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/created-' (toKebabCase schema.moduleNames) '.event.ts'}}
import { Created{{ toPascalCase schema.moduleNames }}Event } from './created-{{ toKebabCase schema.moduleNames }}.event';
{{/notInArray}}
{{/notInArray}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/updated-' (toKebabCase schema.moduleName) '.event.ts'}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/updated-' (toKebabCase schema.moduleNames) '.event.ts'}}
import { Updated{{ toPascalCase schema.moduleName }}Event } from './updated-{{ toKebabCase schema.moduleName }}.event';
{{/notInArray}}
{{/notInArray}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/updated-' (toKebabCase schema.moduleName) '.event.ts'}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/updated-' (toKebabCase schema.moduleNames) '.event.ts'}}
import { Updated{{ toPascalCase schema.moduleNames }}Event } from './updated-{{ toKebabCase schema.moduleNames }}.event';
{{/notInArray}}
{{/notInArray}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/deleted-' (toKebabCase schema.moduleName) '.event.ts'}}
import { Deleted{{ toPascalCase schema.moduleName }}Event } from './deleted-{{ toKebabCase schema.moduleName }}.event';
{{/notInArray}}
{{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/deleted-' (toKebabCase schema.moduleNames) '.event.ts'}}
import { Deleted{{ toPascalCase schema.moduleNames }}Event } from './deleted-{{ toKebabCase schema.moduleNames }}.event';
{{/notInArray}}

export class Add{{ toPascalCase schema.moduleNames }}ContextEvent extends AggregateRoot
{
    constructor(
        public readonly aggregateRoots: {{ schema.aggregateName }}[] = [],
    )
    {
        super();
    }

    *[Symbol.iterator]()
    {
        for (const aggregateRoot of this.aggregateRoots) yield aggregateRoot;
    }

    {{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/created-' (toKebabCase schema.moduleName) '.event.ts'}}
    {{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/created-' (toKebabCase schema.moduleNames) '.event.ts'}}
    created(): void
    {
        this.apply(
            new Created{{ toPascalCase schema.moduleNames }}Event(
                this.aggregateRoots.map({{ toCamelCase schema.moduleName }} =>
                    new Created{{ toPascalCase schema.moduleName }}Event(
                        {{#each schema.properties.aggregate}}
                        {{#if (allowProperty ../schema.moduleName this) }}
                        {{ toCamelCase ../schema.moduleName }}.{{ toCamelCase name }}{{#if nullable}}?{{/if}}.value,
                        {{/if}}
                        {{/each}}
                    ),
                ),
            ),
        );
    }
    {{/notInArray}}
    {{/notInArray}}

    {{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/updated-' (toKebabCase schema.moduleName) '.event.ts'}}
    {{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/updated-' (toKebabCase schema.moduleNames) '.event.ts'}}
    updated(): void
    {
        this.apply(
            new Updated{{ toPascalCase schema.moduleNames }}Event(
                this.aggregateRoots.map({{ toCamelCase schema.moduleName }} =>
                    new Updated{{ toPascalCase schema.moduleName }}Event(
                        {{#each schema.properties.aggregate}}
                        {{#if (allowProperty ../schema.moduleName this) }}
                        {{ toCamelCase ../schema.moduleName }}.{{ toCamelCase name }}{{#if nullable}}?{{/if}}.value,
                        {{/if}}
                        {{/each}}
                    ),
                ),
            ),
        );
    }
    {{/notInArray}}
    {{/notInArray}}

    {{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/deleted-' (toKebabCase schema.moduleName) '.event.ts'}}
    {{#notInArray schema.excluded 'src/' config.applicationsContainer '/' (toKebabCase schema.boundedContextName) '/' (toKebabCase schema.moduleName)  '/application/events/deleted-' (toKebabCase schema.moduleNames) '.event.ts'}}
    deleted(): void
    {
        this.apply(
            new Deleted{{ toPascalCase schema.moduleNames }}Event(
                this.aggregateRoots.map({{ toCamelCase schema.moduleName }} =>
                    new Deleted{{ toPascalCase schema.moduleName }}Event(
                        {{#each schema.properties.aggregate}}
                        {{#if (allowProperty ../schema.moduleName this) }}
                        {{ toCamelCase ../schema.moduleName }}.{{ toCamelCase name }}{{#if nullable}}?{{/if}}.value,
                        {{/if}}
                        {{/each}}
                    ),
                ),
            ),
        );
    }
    {{/notInArray}}
    {{/notInArray}}
}