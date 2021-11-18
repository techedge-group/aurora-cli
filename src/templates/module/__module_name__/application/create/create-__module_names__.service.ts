import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
    {{#each schema.properties.valueObjects}}
    {{ toPascalCase ../schema.moduleName }}{{ toPascalCase name }},
    {{/each}}
    {{#each schema.propertiesI18n.valueObjects}}
    {{#if @first}}

    // i18n
    {{/if}}
    {{#allowI18nProperty ../schema.moduleName name}}
    {{ toPascalCase ../schema.moduleName }}I18N{{ toPascalCase name }},
    {{/allowI18nProperty}}
    {{/each}}
} from './../../domain/value-objects';
import { I{{ toPascalCase schema.moduleName }}Repository } from './../../domain/{{ toKebabCase schema.moduleName }}.repository';
import { {{ toPascalCase schema.boundedContextName }}{{ toPascalCase schema.moduleName }} } from './../../domain/{{ toKebabCase schema.moduleName }}.aggregate';
import { Add{{ toPascalCase schema.moduleNames }}ContextEvent } from './../events/add-{{ toKebabCase schema.moduleNames }}-context.event';

@Injectable()
export class Create{{ toPascalCase schema.moduleNames }}Service
{
    constructor(
        private readonly publisher: EventPublisher,
        private readonly repository: I{{ toPascalCase schema.moduleName }}Repository,
    ) {}

    public async main(
        {{ toCamelCase schema.moduleNames }}: {
            {{#each schema.properties.createService}}
            {{ toCamelCase name }}: {{ toPascalCase ../schema.moduleName }}{{ toPascalCase name }},
            {{/each}}
            {{#each schema.propertiesI18n.createService}}
            {{#if @first}}

            // i18n
            {{/if}}
            {{#allowI18nProperty ../schema.moduleName name}}
            {{ toCamelCase name }}: {{ toPascalCase ../schema.moduleName }}I18N{{ toPascalCase name }},
            {{/allowI18nProperty}}
            {{/each}}
        } []
    ): Promise<void>
    {
        // create aggregate with factory pattern
        const aggregate{{ toPascalCase schema.moduleNames }} = {{ toCamelCase schema.moduleNames }}.map({{ toCamelCase schema.moduleName }} => {{ schema.aggregateName }}.register(
            {{#each schema.properties.createService}}
            {{ toCamelCase ../schema.moduleName }}.{{ toCamelCase name }},
            {{/each}}
            new {{ toPascalCase schema.moduleName }}CreatedAt({ currentTimestamp: true }),
            new {{ toPascalCase schema.moduleName }}UpdatedAt({ currentTimestamp: true }),
            null,
            {{#each schema.propertiesI18n.createService}}
            {{#if @first}}

            // i18n
            {{/if}}
            {{#allowI18nProperty ../schema.moduleName name}}
            {{ toCamelCase ../schema.moduleName }}.{{ toCamelCase name }},
            {{/allowI18nProperty}}
            {{/each}}
        ));

        // insert
        await this.repository.insert(aggregate{{ toPascalCase schema.moduleNames }});

        // create Add{{ toPascalCase schema.moduleNames }}ContextEvent to have object wrapper to add event publisher functionality
        // insert EventBus in object, to be able to apply and commit events
        const {{ toCamelCase schema.moduleNames }}Registered = this.publisher.mergeObjectContext(new Add{{ toPascalCase schema.moduleNames }}ContextEvent(aggregate{{ toPascalCase schema.moduleNames }}));

        {{ toCamelCase schema.moduleNames }}Registered.created(); // apply event to model events
        {{ toCamelCase schema.moduleNames }}Registered.commit(); // commit all events of model
    }
}