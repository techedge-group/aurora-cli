import { NestFactory } from '@nestjs/core';
import { ICommandBus } from '{{ config.auroraCorePackage }}';
import { Create{{ toPascalCase schema.moduleNames }}Command } from '{{ config.applicationsContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/application/create/create-{{ toKebabCase schema.moduleNames }}.command';
import { SeederModule } from './seeder.module';
import { {{ toCamelCase schema.moduleNames }} } from '{{ config.applicationsContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/infrastructure/seeds/{{ toKebabCase schema.moduleName }}.seed';

export class Seeder
{
    main(): void
    {
        NestFactory.createApplicationContext(SeederModule).then(appContext =>
        {
            const commandBus = appContext.get(ICommandBus);
            commandBus.dispatch(new Create{{ toPascalCase schema.moduleNames }}Command({{ toCamelCase schema.moduleNames }}, { timezone: process.env.TZ }));
        });
    }
}
new Seeder().main();