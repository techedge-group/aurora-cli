import { Injectable } from '@nestjs/common';
import { {{#if schema.properties.hasI18n}}AddI18NConstraintService, {{/if}}ICommandBus } from '{{ config.auroraCorePackage }}';

// {{ config.applicationsContainer }}
import { Create{{ toPascalCase schema.moduleNames }}Command } from '{{ config.applicationsContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/application/create/create-{{ toKebabCase schema.moduleNames }}.command';
import { {{ toPascalCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }}Input } from '../../../../graphql';
import { {{ toPascalCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }}Dto } from '../dto';

@Injectable()
export class {{ toPascalCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleNames }}Handler
{
    constructor(
        private readonly commandBus: ICommandBus,
        {{#if schema.properties.hasI18n}}
        private readonly addI18NConstraintService: AddI18NConstraintService,
        {{/if}}
    ) {}

    async main(
        payload: {{ toPascalCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }}Input[] | {{ toPascalCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }}Dto[],
        {{#if schema.hasTenant}}
        account: AccountResponse,
        {{/if}}
        timezone?: string,
    ): Promise<boolean>
    {
        await this.commandBus.dispatch(new Create{{ toPascalCase schema.moduleNames }}Command(payload, { timezone }));
        return true;
    }
}