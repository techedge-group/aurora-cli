
import { LiteralObject } from '@nestjs/common';
import { IRepository, QueryStatement } from '{{ config.auroraCorePackage }}';
import { CQMetadata, Pagination } from '{{ config.auroraCorePackage }}';
import { {{ schema.aggregateName }} } from './{{ toKebabCase schema.moduleName }}.aggregate';
import { {{ toPascalCase schema.moduleName }}Id } from './value-objects';

export abstract class I{{ toPascalCase schema.moduleName }}I18NRepository implements IRepository<{{ schema.aggregateName }}>
{
    abstract readonly repository: any;

    // paginate records
    abstract paginate(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<Pagination<{{ schema.aggregateName }}>>;

    // find a single record
    abstract find(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<{{ schema.aggregateName }} | null>;

    // find a single record by id
    abstract findById(
        id: {{ toPascalCase schema.moduleName }}Id,
        options?: {
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<{{ schema.aggregateName }} | null>;

    // get multiple records
    abstract get(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<{{ schema.aggregateName }}[]>;

    // count records
    abstract count(
        options?: {
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<number>;

    // ******************
    // ** side effects **
    // ******************

    // create a single record
    abstract create(
        {{ toCamelCase schema.moduleName }}: {{ schema.aggregateName }},
        options?: {
            createOptions?: LiteralObject;
            dataFactory?: (aggregate: {{ schema.aggregateName }}) => LiteralObject;
            // arguments to find object and check if object is duplicated
            finderQueryStatement?: (aggregate: {{ schema.aggregateName }}) => QueryStatement;
        }
    ): Promise<void>;

    // create a single or multiple records
    abstract insert(
        {{ toCamelCase schema.moduleNames }}: {{ schema.aggregateName }}[],
        options?: {
            insertOptions?: LiteralObject;
            dataFactory?: (aggregate: {{ schema.aggregateName }}) => LiteralObject;
        }
    ): Promise<void>;

    // update record by id
    abstract updateById(
        {{ toCamelCase schema.moduleName }}: {{ schema.aggregateName }},
        options?: {
            updateByIdOptions?: LiteralObject;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            dataFactory?: (aggregate: {{ schema.aggregateName }}) => LiteralObject;
            // arguments to find object to update, with i18n we use langId and id relationship with parent entity
            findArguments?: LiteralObject;
        }
    ): Promise<void>;

    // update records
    abstract update(
        {{ toCamelCase schema.moduleName }}: {{ schema.aggregateName }},
        options?: {
            updateOptions?: LiteralObject;
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
            dataFactory?: (aggregate: {{ schema.aggregateName }}) => LiteralObject;
        }
    ): Promise<void>;

    // delete record
    abstract deleteById(
        id: {{ toPascalCase schema.moduleName }}Id,
        options?: {
            deleteOptions?: LiteralObject;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<void>;

    // delete records
    abstract delete(
        options?: {
            deleteOptions?: LiteralObject;
            queryStatement?: QueryStatement;
            constraint?: QueryStatement;
            cQMetadata?: CQMetadata;
        }
    ): Promise<void>;
}