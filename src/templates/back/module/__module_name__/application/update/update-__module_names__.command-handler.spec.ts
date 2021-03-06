import { Test, TestingModule } from '@nestjs/testing';

// custom items
import { {{ toCamelCase schema.moduleNames }} } from '{{ config.applicationsContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/infrastructure/seeds/{{ toKebabCase schema.moduleName }}.seed';
import { Update{{ toPascalCase schema.moduleNames }}CommandHandler } from './update-{{ toKebabCase schema.moduleNames }}.command-handler';
import { Update{{ toPascalCase schema.moduleNames }}Command } from './update-{{ toKebabCase schema.moduleNames }}.command';
import { Update{{ toPascalCase schema.moduleNames }}Service } from './update-{{ toKebabCase schema.moduleNames }}.service';

describe('Update{{ toPascalCase schema.moduleNames }}CommandHandler', () =>
{
    let commandHandler: Update{{ toPascalCase schema.moduleNames }}CommandHandler;
    let service: Update{{ toPascalCase schema.moduleNames }}Service;

    beforeAll(async () =>
    {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                Update{{ toPascalCase schema.moduleNames }}CommandHandler,
                {
                    provide : Update{{ toPascalCase schema.moduleNames }}Service,
                    useValue: {
                        main: () => { /**/ },
                    },
                },
            ],
        })
            .compile();

        commandHandler  = module.get<Update{{ toPascalCase schema.moduleNames }}CommandHandler>(Update{{ toPascalCase schema.moduleNames }}CommandHandler);
        service         = module.get<Update{{ toPascalCase schema.moduleNames }}Service>(Update{{ toPascalCase schema.moduleNames }}Service);
    });

    describe('main', () =>
    {
        test('Update{{ toPascalCase schema.moduleNames }}CommandHandler should be defined', () =>
        {
            expect(commandHandler).toBeDefined();
        });

        test('should return an {{ toCamelCase schema.moduleNames }} updated', async () =>
        {
            expect(await commandHandler.execute(
                new Update{{ toPascalCase schema.moduleNames }}Command(
                    {
                        {{#each schema.properties.updateController}}
                        {{ toCamelCase name }}: {{ toCamelCase ../schema.moduleNames }}[0].{{ toCamelCase name }},
                        {{/each}}
                    },
                    {},
                    {},
                    { timezone: process.env.TZ },
                ),
            )).toBe(undefined);
        });
    });
});