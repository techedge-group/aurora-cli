/* eslint-disable quotes */
/* eslint-disable key-spacing */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { I{{ toPascalCase schema.moduleName }}Repository } from '../../../src/{{ config.applicationsContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/domain/{{ toKebabCase schema.moduleName }}.repository';
{{#if schema.properties.hasI18n}}
import { I{{ toPascalCase schema.moduleName }}I18NRepository } from '../../../src/{{ config.applicationsContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/domain/{{ toKebabCase schema.moduleName }}-i18n.repository';
import { AddI18NConstraintService } from '{{ config.auroraCorePackage }}';
{{/if}}
import { Mock{{ toPascalCase schema.moduleName }}Seeder } from '../../../src/{{ config.applicationsContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/infrastructure/mock/mock-{{ toKebabCase schema.moduleName }}.seeder';
import { {{ toCamelCase schema.moduleNames }} } from '../../../src/{{ config.applicationsContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/infrastructure/seeds/{{ toKebabCase schema.moduleName }}.seed';
import { GraphQLConfigModule } from '../../../src/{{ config.auroraLocalPackage }}/graphql/graphql-config.module';
import { {{ toPascalCase schema.boundedContextName }}Module } from '../../../src/{{ config.apiContainer }}/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.boundedContextName }}.module';
import * as request from 'supertest';
import * as _ from 'lodash';

{{#if schema.hasOAuth }}
// has OAuth
import { JwtModule } from '@nestjs/jwt';
{{#unlessEq (toPascalCase schema.moduleName) 'Account' }}
import { IAccountRepository } from '../../../src/{{ config.applicationsContainer }}/iam/account/domain/account.repository';
import { MockAccountRepository } from '../../../src/{{ config.applicationsContainer }}/iam/account/infrastructure/mock/mock-account.repository';
{{/unlessEq }}
{{#unlessEq (toPascalCase schema.boundedContextName) 'Iam' }}
import { IamModule } from './../../../src/{{ config.apiContainer }}/iam/iam.module';
{{/unlessEq }}
import { AuthorizationGuard } from '../../../src/{{ config.apiContainer }}/shared/modules/auth/guards/authorization.guard';
import { TestingJwtService } from './../../../src/{{ config.apiContainer }}/o-auth/credential/services/testing-jwt.service';
import * as fs from 'fs';
{{/if }}


// disable import foreign modules, can be micro-services
const importForeignModules = [];
{{setVar 'language' '4470b5ab-9d57-4c9d-a68f-5bf8e32f543a'}}
describe('{{ toKebabCase schema.moduleName }}', () =>
{
    let app: INestApplication;
    let repository: I{{ toPascalCase schema.moduleName }}Repository;
    {{#if schema.properties.hasI18n}}
    let repositoryI18N: I{{ toPascalCase schema.moduleName }}I18NRepository;
    {{/if }}
    let seeder: Mock{{ toPascalCase schema.moduleName }}Seeder;
    {{#if schema.hasOAuth }}
    let testJwt: string;
    {{/if }}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockData: any = {{ toCamelCase schema.moduleNames }};

    beforeAll(async () =>
    {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ...importForeignModules,
                {{ toPascalCase schema.boundedContextName }}Module,
                {{#if schema.hasOAuth }}
                {{#unlessEq (toPascalCase schema.boundedContextName) 'Iam' }}
                IamModule,
                {{/unlessEq }}
                {{/if }}
                GraphQLConfigModule,
                SequelizeModule.forRootAsync({
                    imports   : [ConfigModule],
                    inject    : [ConfigService],
                    useFactory: (configService: ConfigService) =>
                    {
                        return {
                            dialect       : configService.get('TEST_DATABASE_DIALECT'),
                            storage       : configService.get('TEST_DATABASE_STORAGE'),
                            host          : configService.get('TEST_DATABASE_HOST'),
                            port          : +configService.get('TEST_DATABASE_PORT'),
                            username      : configService.get('TEST_DATABASE_USER'),
                            password      : configService.get('TEST_DATABASE_PASSWORD'),
                            database      : configService.get('TEST_DATABASE_SCHEMA'),
                            synchronize   : configService.get('TEST_DATABASE_SYNCHRONIZE'),
                            logging       : configService.get('TEST_DATABASE_LOGGIN') === 'true' ? console.log : false,
                            autoLoadModels: true,
                            models        : [],
                        };
                    },
                }),
                {{#if schema.hasOAuth }}
                JwtModule.register({
                    privateKey: fs.readFileSync('src/oauth-private.key', 'utf8'),
                    publicKey: fs.readFileSync('src/oauth-public.key', 'utf8'),
                    signOptions: {
                        algorithm: 'RS256',
                    }
                }),
                {{/if }}
            ],
            providers: [
                Mock{{ toPascalCase schema.moduleName }}Seeder,
                {{#if schema.hasOAuth }}
                TestingJwtService,
                {{/if }}
            ],
        })
            {{#if schema.hasOAuth }}
            {{#unlessEq (toPascalCase schema.moduleName) 'Account' }}
            .overrideProvider(IAccountRepository)
            .useClass(MockAccountRepository)
            {{/unlessEq }}
            .overrideGuard(AuthorizationGuard)
            .useValue({ canActivate: () => true })
            {{/if }}
            {{#if schema.properties.hasI18n}}
            .overrideProvider(AddI18NConstraintService)
            .useValue({
                main: () =>
                    ({
                        include: [{
                            association: '{{ toCamelCase schema.moduleName }}I18N',
                            required   : true,
                            where      : { langId: '{{ language }}' }
                        }]
                    })
            })
            {{/if }}
            .compile();

        app             = module.createNestApplication();
        repository      = module.get<I{{ toPascalCase schema.moduleName }}Repository>(I{{ toPascalCase schema.moduleName }}Repository);
        {{#if schema.properties.hasI18n}}
        repositoryI18N  = module.get<I{{ toPascalCase schema.moduleName }}I18NRepository>(I{{ toPascalCase schema.moduleName }}I18NRepository);
        {{/if}}
        seeder          = module.get<Mock{{ toPascalCase schema.moduleName }}Seeder>(Mock{{ toPascalCase schema.moduleName }}Seeder);
        {{#if schema.hasOAuth }}
        testJwt         = module.get(TestingJwtService).getJwt();
        {{/if }}

        // seed mock data in memory database
        {{#if schema.properties.hasI18n}}
        await repository.insert(seeder.collectionSource.filter((item, index, self) => index === self.findIndex(t => t.id.value === item.id.value)));
        await repositoryI18N.insert(seeder.collectionSource, { dataFactory: aggregate => aggregate.toI18nDTO() });
        {{else}}
        await repository.insert(seeder.collectionSource);
        {{/if}}

        await app.init();
    });

    {{#each schema.properties.isNotNullable  as |notNullPropety notNullPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} property can not to be null', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq notNullPropety.name testPropety.name}}...{ {{ toCamelCase name }}: null },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} must be defined, can not be null');
            });
    });

    {{/each}}
    {{#each schema.properties.isNotNullable  as |notNullPropety notNullPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} property can not to be undefined', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq notNullPropety.name testPropety.name}}...{ {{ toCamelCase name }}: undefined },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} must be defined, can not be undefined');
            });
    });

    {{/each}}
    {{#each schema.properties.hasLength  as |hasLengthPropety hasLengthPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is not allowed, must be a length of {{ hasLengthPropety.length }}', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq hasLengthPropety.name testPropety.name}}...{ {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=testPropety type='seed' scapeQuotes=false checkFieldNameMeaning=false length=(add testPropety.length 1)) }}}{{#if hasQuotation }}'{{/if }} },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is not allowed, must be a length of {{ hasLengthPropety.length }}');
            });
    });

    {{/each}}
    {{#each schema.properties.hasMaxLength  as |hasMaxLengthPropety hasMaxLengthPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is too large, has a maximum length of {{ hasMaxLengthPropety.maxLength }}', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq hasMaxLengthPropety.name testPropety.name}}...{ {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=testPropety type='seed' scapeQuotes=false checkFieldNameMeaning=false maxLength=(add testPropety.maxLength 1)) }}}{{#if hasQuotation }}'{{/if }} },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is too large, has a maximum length of {{ hasMaxLengthPropety.maxLength }}');
            });
    });

    {{/each}}
    {{#each schema.properties.hasMinLength  as |hasMinLengthPropety hasMinLengthPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is too short, has a minimum length of {{ propertyHasMinLength.minLength }}', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq hasMinLengthPropety.name testPropety.name}}...{ {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=testPropety type='seed' scapeQuotes=false checkFieldNameMeaning=false minLength=(subtract testPropety.minLength 1)) }}}{{#if hasQuotation }}'{{/if }} },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is too short, has a minimum length of {{ propertyHasMinLength.minLength }}');
            });
    });
    {{/each}}
    {{#each schema.properties.isInteger  as |isIntegerPropety isIntegerPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} has to be a integer value', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq isIntegerPropety.name testPropety.name}}...{ {{ toCamelCase name }}: 100.10 },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} has to be a integer value');
            });
    });
    {{/each}}
    {{#each schema.properties.isIntegerUnsigned  as |isIntegerUnsignedPropety isIntegerUnsignedPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} must have a positive sign', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq isIntegerUnsignedPropety.name testPropety.name}}...{ {{ toCamelCase name }}: -1 },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('The numerical value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} must have a positive sign, this field does not accept negative values');
            });
    });
    {{/each}}
    {{#each schema.properties.isBoolean  as |isBooleanPropety isBooleanPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} has to be a boolean value', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq isBooleanPropety.name testPropety.name}}...{ {{ toCamelCase name }}: 'true' },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} has to be a boolean value');
            });
    });
    {{/each}}
    {{#each schema.properties.isEnum  as |isEnumPropety isEnumPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} has to be a enum option of {{ join enumOptions }}', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq isEnumPropety.name testPropety.name}}...{ {{ toCamelCase name }}: 'XXXX' },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} has to be any of this options: {{ join enumOptions }}');
            });
    });
    {{/each}}
    {{#each schema.properties.isTimestamp  as |isTimestampPropety isTimestampPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} has to be a timestamp value', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq isTimestampPropety.name testPropety.name}}...{ {{ toCamelCase name }}: 'XXXX' },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} has to be a timestamp value');
            });
    });
    {{/each}}
    {{#each schema.properties.isDecimal  as |isDecimalPropety isDecimalPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is too large, has a maximum decimal integers length of {{ subtract (first isDecimalPropety.decimals) (last isDecimalPropety.decimals) }}', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq isDecimalPropety.name testPropety.name}}...{ {{ toCamelCase name }}: {{ randomDecimalDigits (add (first isDecimalPropety.decimals) 1) (last testPropety.decimals) }} },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is too large, has a maximum length of {{ subtract (first isDecimalPropety.decimals) (last isDecimalPropety.decimals) }} integers in');
            });
    });
    {{/each}}
    {{#each schema.properties.isDecimal  as |isDecimalPropety isDecimalPropetyId|}}
    test('/REST:POST {{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create - Got 400 Conflict, {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is too large, has a maximum decimals length of {{ last isDecimalPropety.decimals }}', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase ../schema.boundedContextName }}/{{ toKebabCase ../schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if ../schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                ...mockData[0],
                {{#each ../schema.properties.test as |testPropety testPropetyId|}}{{#eq isDecimalPropety.name testPropety.name}}...{ {{ toCamelCase name }}: {{ randomDecimalDigits (first isDecimalPropety.decimals) (add (last testPropety.decimals) 1) }} },{{/eq}}{{/each}}
            })
            .expect(400)
            .then(res =>
            {
                expect(res.body.message).toContain('Value for {{ toPascalCase ../schema.moduleName }}{{> i18n }}{{ toPascalCase name }} is too large, has a maximum length of {{ last isDecimalPropety.decimals }} decimals in');
            });
    });
    {{/each}}

    test('/REST:POST {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/create - Got 409 Conflict, item already exist in database', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send(seeder.collectionResponse[0])
            .expect(409);
    });

    test('/REST:POST {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleNames }}/paginate', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleNames }}/paginate')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query:
                {
                    offset: 0,
                    limit: 5,
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body).toEqual({
                    total: seeder.collectionResponse{{#if schema.properties.hasI18n}}.filter(item => item.langId === '{{ language }}'){{/if}}.length,
                    count: seeder.collectionResponse{{#if schema.properties.hasI18n}}.filter(item => item.langId === '{{ language }}'){{/if}}.length,
                    rows : seeder.collectionResponse{{#if schema.properties.hasI18n}}.filter(item => item.langId === '{{ language }}'){{/if}}.map(item => expect.objectContaining(_.omit(item, ['createdAt', 'updatedAt', 'deletedAt'{{> manyToManyArrayItems }}]))).slice(0, 5),
                });
            });
    });

    test('/REST:POST {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleNames }}/get', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleNames }}/get')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .expect(200)
            .then(res =>
            {
                expect(res.body).toEqual(
                    seeder.collectionResponse{{#if schema.properties.hasI18n}}.filter(item => item.langId === '{{ language }}'){{/if}}.map(item => expect.objectContaining(_.omit(item, ['createdAt', 'updatedAt', 'deletedAt'{{> manyToManyArrayItems }}]))),
                );
            });
    });

    test('/REST:POST {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/find - Got 404 Not Found', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/find')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query:
                {
                    where:
                    {
                        id: '{{ uuid }}',
                    },
                },
            })
            .expect(404);
    });

    test('/REST:POST {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/create', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/create')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                {{#each schema.properties.test}}
                {{#eq name 'id'}}
                {{ toCamelCase name }}: '{{{ mocker (object property=. scapeQuotes=false) }}}',
                {{else}}
                {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=. scapeQuotes=false hasUuidSeed=false) }}}{{#if hasQuotation }}'{{/if }},
                {{/eq}}
                {{/each}}
            })
            .expect(201);
    });

    test('/REST:POST {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/find', () =>
    {
        return request(app.getHttpServer())
            .post('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/find')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query:
                {
                    where:
                    {
                        id: '{{{ mocker (object type='fixedUuid') }}}',
                    },
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body).toHaveProperty('id', '{{{ mocker (object type='fixedUuid') }}}');
            });
    });

    test('/REST:GET {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/find/{id} - Got 404 Not Found', () =>
    {
        return request(app.getHttpServer())
            .get('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/find/{{ uuid }}')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .expect(404);
    });

    test('/REST:GET {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/find/{id}', () =>
    {
        return request(app.getHttpServer())
            .get('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/find/{{{ mocker (object type='fixedUuid') }}}')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .expect(200)
            .then(res =>
            {
                expect(res.body).toHaveProperty('id', '{{{ mocker (object type='fixedUuid') }}}');
            });
    });

    test('/REST:PUT {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/update - Got 404 Not Found', () =>
    {
        return request(app.getHttpServer())
            .put('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/update')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                {{#each schema.properties.postmanGraphQLUpdateVariables}}
                {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=. type='seed' scapeQuotes=false hasUuidSeed=false) }}}{{#if hasQuotation }}'{{/if }},
                {{/each}}
            })
            .expect(404);
    });

    test('/REST:PUT {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/update', () =>
    {
        return request(app.getHttpServer())
            .put('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/update')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                {{#each schema.properties.postmanGraphQLUpdateVariables}}
                {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=. type='seed' scapeQuotes=false) }}}{{#if hasQuotation }}'{{/if }},
                {{/each}}
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body).toHaveProperty('id', '{{{ mocker (object type='fixedUuid') }}}');
            });
    });

    test('/REST:DELETE {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/delete/{id} - Got 404 Not Found', () =>
    {
        return request(app.getHttpServer())
            .delete('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/delete/{{ uuid }}')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .expect(404);
    });

    test('/REST:DELETE {{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/delete/{id}', () =>
    {
        return request(app.getHttpServer())
            .delete('/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}/delete/{{{ mocker (object type='fixedUuid') }}}')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .expect(200);
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }} - Got 409 Conflict, item already exist in database', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    mutation ($payload:{{ toPascalCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }}Input!)
                    {
                        {{ toCamelCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }} (payload:$payload)
                        {
                            {{#each schema.properties.postmanGraphQLCreateQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables:
                {
                    payload: _.omit(seeder.collectionResponse[0], ['createdAt','updatedAt','deletedAt']),
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body).toHaveProperty('errors');
                expect(res.body.errors[0].extensions.response.statusCode).toBe(409);
                expect(res.body.errors[0].extensions.response.message).toContain('already exist in database');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Paginate{{ toPascalCase schema.moduleNames }}', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    query ($query:QueryStatement $constraint:QueryStatement)
                    {
                        {{ toCamelCase schema.boundedContextName }}Paginate{{ toPascalCase schema.moduleNames }} (query:$query constraint:$constraint)
                        {
                            total
                            count
                            rows
                        }
                    }
                `,
                variables:
                {
                    query:
                    {
                        offset: 0,
                        limit: 5,
                    },
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body.data.{{ toCamelCase schema.boundedContextName }}Paginate{{ toPascalCase schema.moduleNames }}).toEqual({
                    total: seeder.collectionResponse{{#if schema.properties.hasI18n}}.filter(item => item.langId === '{{ language }}'){{/if}}.length,
                    count: seeder.collectionResponse{{#if schema.properties.hasI18n}}.filter(item => item.langId === '{{ language }}'){{/if}}.length,
                    rows : seeder.collectionResponse{{#if schema.properties.hasI18n}}.filter(item => item.langId === '{{ language }}'){{/if}}.map(item => expect.objectContaining(_.omit(item, ['createdAt', 'updatedAt', 'deletedAt'{{> manyToManyArrayItems }}]))).slice(0, 5),
                });
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Get{{ toPascalCase schema.moduleNames }}', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    query ($query:QueryStatement)
                    {
                        {{ toCamelCase schema.boundedContextName }}Get{{ toPascalCase schema.moduleNames }} (query:$query)
                        {
                            {{#each schema.properties.postmanGraphQLFindQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables: {},
            })
            .expect(200)
            .then(res =>
            {
                for (const [index, value] of res.body.data.{{ toCamelCase schema.boundedContextName }}Get{{ toPascalCase schema.moduleNames }}.entries())
                {
                    expect(seeder.collectionResponse[index]).toEqual(expect.objectContaining(_.omit(value, ['createdAt', 'updatedAt', 'deletedAt'])));
                }
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }}', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    mutation ($payload:{{ toPascalCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }}Input!)
                    {
                        {{ toCamelCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }} (payload:$payload)
                        {
                            {{#each schema.properties.postmanGraphQLCreateQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables: {
                    payload: {
                        {{#each schema.properties.postmanGraphQLCreateVariables}}
                        {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=. type='seed' scapeQuotes=false) }}}{{#if hasQuotation }}'{{/if }},
                        {{/each}}
                    },
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body.data.{{ toCamelCase schema.boundedContextName }}Create{{ toPascalCase schema.moduleName }}).toHaveProperty('id', '{{{ mocker (object type='fixedUuid') }}}');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }} - Got 404 Not Found', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    query ($query:QueryStatement)
                    {
                        {{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }} (query:$query)
                        {
                            {{#each schema.properties.postmanGraphQLFindQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables:
                {
                    query:
                    {
                        where:
                        {
                            id: '{{ uuid }}',
                        },
                    },
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body).toHaveProperty('errors');
                expect(res.body.errors[0].extensions.response.statusCode).toBe(404);
                expect(res.body.errors[0].extensions.response.message).toContain('not found');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }}', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    query ($query:QueryStatement)
                    {
                        {{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }} (query:$query)
                        {
                            {{#each schema.properties.postmanGraphQLFindQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables:
                {
                    query:
                    {
                        where:
                        {
                            id: '{{{ mocker (object type='fixedUuid') }}}',
                        },
                    },
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body.data.{{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }}.id).toStrictEqual('{{{ mocker (object type='fixedUuid') }}}');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }}ById - Got 404 Not Found', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    query ($id:ID!)
                    {
                        {{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }}ById (id:$id)
                        {
                            {{#each schema.properties.postmanGraphQLFindQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables: {
                    id: '{{ uuid }}',
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body).toHaveProperty('errors');
                expect(res.body.errors[0].extensions.response.statusCode).toBe(404);
                expect(res.body.errors[0].extensions.response.message).toContain('not found');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }}ById', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    query ($id:ID!)
                    {
                        {{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }}ById (id:$id)
                        {
                            {{#each schema.properties.postmanGraphQLFindByIdQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables: {
                    id: '{{{ mocker (object type='fixedUuid') }}}',
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body.data.{{ toCamelCase schema.boundedContextName }}Find{{ toPascalCase schema.moduleName }}ById.id).toStrictEqual('{{{ mocker (object type='fixedUuid') }}}');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Update{{ toPascalCase schema.moduleName }} - Got 404 Not Found', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    mutation ($payload:{{ toPascalCase schema.boundedContextName }}Update{{ toPascalCase schema.moduleName }}Input!)
                    {
                        {{ toCamelCase schema.boundedContextName }}Update{{ toPascalCase schema.moduleName }} (payload:$payload)
                        {
                            {{#each schema.properties.postmanGraphQLUpdateQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables: {
                    payload: {
                        {{#each schema.properties.postmanGraphQLUpdateVariables}}
                        {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=. type='seed' scapeQuotes=false hasUuidSeed=false) }}}{{#if hasQuotation }}'{{/if }},
                        {{/each}}
                    },
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body).toHaveProperty('errors');
                expect(res.body.errors[0].extensions.response.statusCode).toBe(404);
                expect(res.body.errors[0].extensions.response.message).toContain('not found');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Update{{ toPascalCase schema.moduleName }}', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    mutation ($payload:{{ toPascalCase schema.boundedContextName }}Update{{ toPascalCase schema.moduleName }}Input!)
                    {
                        {{ toCamelCase schema.boundedContextName }}Update{{ toPascalCase schema.moduleName }} (payload:$payload)
                        {
                            {{#each schema.properties.postmanGraphQLUpdateQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables: {
                    payload: {
                        {{#each schema.properties.postmanGraphQLUpdateVariables}}
                        {{ toCamelCase name }}: {{#if hasQuotation }}'{{/if }}{{{ mocker (object property=. type='seed' scapeQuotes=false) }}}{{#if hasQuotation }}'{{/if }},
                        {{/each}}
                    },
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body.data.{{ toCamelCase schema.boundedContextName }}Update{{ toPascalCase schema.moduleName }}.id).toStrictEqual('{{{ mocker (object type='fixedUuid') }}}');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Delete{{ toPascalCase schema.moduleName }}ById - Got 404 Not Found', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    mutation ($id:ID!)
                    {
                        {{ toCamelCase schema.boundedContextName }}Delete{{ toPascalCase schema.moduleName }}ById (id:$id)
                        {
                            {{#each schema.properties.postmanGraphQLDeleteQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables: {
                    id: '{{ uuid }}',
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body).toHaveProperty('errors');
                expect(res.body.errors[0].extensions.response.statusCode).toBe(404);
                expect(res.body.errors[0].extensions.response.message).toContain('not found');
            });
    });

    test('/GraphQL {{ toCamelCase schema.boundedContextName }}Delete{{ toPascalCase schema.moduleName }}ById', () =>
    {
        return request(app.getHttpServer())
            .post('/graphql')
            .set('Accept', 'application/json')
            {{#if schema.hasOAuth }}
            .set('Authorization', `Bearer ${testJwt}`)
            {{/if }}
            .send({
                query: `
                    mutation ($id:ID!)
                    {
                        {{ toCamelCase schema.boundedContextName }}Delete{{ toPascalCase schema.moduleName }}ById (id:$id)
                        {
                            {{#each schema.properties.postmanGraphQLDeleteQuery}}
                            {{ toCamelCase name }}
                            {{/each}}
                        }
                    }
                `,
                variables: {
                    id: '{{{ mocker (object type='fixedUuid') }}}',
                },
            })
            .expect(200)
            .then(res =>
            {
                expect(res.body.data.{{ toCamelCase schema.boundedContextName }}Delete{{ toPascalCase schema.moduleName }}ById.id).toStrictEqual('{{{ mocker (object type='fixedUuid') }}}');
            });
    });

    afterAll(async () =>
    {
        await app.close();
    });
});