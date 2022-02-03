import { Property } from './property';
import { SqlRelationship, SqlType } from './../types';

export class Properties
{
    moduleName                  = '';
    properties: Property[]      = [];
    timestampFields: string[]   = ['createdAt', 'updatedAt', 'deletedAt'];
    deletedAtField: string[]    = ['deletedAt'];

    *[Symbol.iterator]()
    {
        for (const property of this.properties) yield property;
    }

    get length(): number
    {
        return this.properties.length;
    }

    get hasI18n(): boolean
    {
        return this.properties.filter(property => property.isI18n).length > 0;
    }

    get withoutTimestamps(): Property[]
    {
        return this.properties.filter(property => !this.timestampFields.includes(property.name));
    }

    get withoutDeletedAt(): Property[]
    {
        return this.properties.filter(property => !this.deletedAtField.includes(property.name));
    }

    get withRelationship(): Property[]
    {
        return this.properties.filter(property => property.relationship);
    }

    get withRelationshipOneToOne(): Property[]
    {
        return this.properties.filter(property => property.relationship === SqlRelationship.ONE_TO_ONE);
    }

    get withRelationshipOneToOneWithRelationshipField(): Property[]
    {
        return this.withRelationshipOneToOne.filter(property => !!property.relationshipField);
    }

    get withRelationshipOneToOneWithoutRelationshipField(): Property[]
    {
        return this.withRelationshipOneToOne.filter(property => !property.relationshipField);
    }

    get withRelationshipManyToOne(): Property[]
    {
        return this.properties.filter(property => property.relationship === SqlRelationship.MANY_TO_ONE);
    }

    get withRelationshipOneToMany(): Property[]
    {
        return this.properties.filter(property => property.relationship === SqlRelationship.ONE_TO_MANY);
    }

    get withRelationshipManyToMany(): Property[]
    {
        return this.properties.filter(property => property.relationship === SqlRelationship.MANY_TO_MANY);
    }

    get withRelationshipIntermediateTable(): Property[]
    {
        return this.properties.filter(property => !!property.intermediateTable);
    }

    get withRelationshipType(): Property[]
    {
        return this.properties.filter(property => property.type === SqlType.RELATIONSHIP);
    }

    get withTimezone(): Property[]
    {
        return this.properties.filter(property => property.hasTimezone);
    }

    get id(): Property | undefined
    {
        return this.properties.find(property => property.type === SqlType.ID);
    }

    // data for dashboard
    get gridFields(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))
            .filter(property => property.name !== 'id');
    }

    get detailFields(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))
            .filter(property => property.name !== 'id');
    }

    // data for component
    // aggregate
    get aggregate(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                     // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));   // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    // commands
    get createCommand(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get updateCommand(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    // commands handler
    get createCommandHandler(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get updateCommandHandler(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    // queries handler
    get findQueryHandler(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY);    // exclude one to many relations
    }

    get findByIdQueryHandler(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY);    // exclude one to many relations
    }

    get getQueryHandler(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY);    // exclude one to many relations
    }

    // services
    get createService(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to one relations without relationshipField, is relation one to one without xxxxId
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    get createItemsService(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to one relations without relationshipField, is relation one to one without xxxxId
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'));   // exclude relationship id of i18n table
    }

    get updateService(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to one relations without relationshipField, is relation one to one without xxxxId
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    // events
    get createdEvent(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get updatedEvent(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get deletedEvent(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    // controllers
    get createController(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to one relations without relationshipField, is relation one to one without xxxxId
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    get updateController(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to one relations without relationshipField, is relation one to one without xxxxId
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    // resolvers
    get createResolver(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get updateResolver(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    // graphql
    get graphqlType(): Property[]
    {
        return this.properties;    // exclude one to many relations
    }

    get graphqlInput(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY);                                     // exclude one to many relations
    }

    // DTOs
    get dto(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                     // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));   // exclude one to one relations without relationshipField to avoid circular dependency
    }

    get createDto(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to many relations
    }

    get updateDto(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to many relations
    }

    // models
    get modelColumns(): Property[]
    {
        return this.properties; // exclude one to many relations
    }

    get schemaRelations(): Property[]
    {
        return this.properties.filter(property => property.relationship);               // only relationship
    }

    // postman
    get postmanGraphQLCreateQuery(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_MANY)                                             // exclude many to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to one relations without relationshipField, is relation one to one without xxxxId
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    get postmanGraphQLCreateVariables(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_MANY)                                             // exclude many to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to one relations without relationshipField, is relation one to one without xxxxId
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    get postmanGraphQLGetQuery(): Property[]
    {
        return this.properties
            .filter(property => !this.deletedAtField.includes(property.name))                                               // exclude deleteAt
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_ONE)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_MANY)                                     // exclude many to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get postmanGraphQLFindQuery(): Property[]
    {
        return this.properties
            .filter(property => !this.deletedAtField.includes(property.name))                                               // exclude deleteAt
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_ONE)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_MANY)                                     // exclude many to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get postmanGraphQLFindByIdQuery(): Property[]
    {
        return this.properties
            .filter(property => !this.deletedAtField.includes(property.name))                                               // exclude deleteAt
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_ONE)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_MANY)                                     // exclude many to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get postmanGraphQLUpdateQuery(): Property[]
    {
        return this.properties
            .filter(property => !this.deletedAtField.includes(property.name))                                               // exclude deleteAt
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_ONE)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_MANY)                                     // exclude many to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get postmanGraphQLUpdateVariables(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to one relations without relationshipField, is relation one to one without xxxxId
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));
    }

    get postmanGraphQLDeleteQuery(): Property[]
    {
        return this.properties
            .filter(property => !this.deletedAtField.includes(property.name))                                               // exclude deleteAt
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_ONE)                                      // exclude one to many relations
            .filter(property => property.relationship !== SqlRelationship.MANY_TO_MANY)                                     // exclude many to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get postmanRestCreate(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to many relations
    }

    get postmanRestUpdate(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to many relations
    }

    // data for testing
    get test(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                                      // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                              // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField))             // exclude one to many relations
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    get isNotNullable(): Property[]
    {
        return this.properties.filter(property => property.nullable === false)
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    get hasLength(): Property[]
    {
        return this.properties.filter(property => !!property.length)
            .filter(property => !property.isI18n || (property.isI18n && property.name !== 'id'))                                    // exclude id of i18n table
            .filter(property => !property.isI18n || (property.isI18n && property.name !== this.moduleName.toCamelCase() + 'Id'))    // exclude relationship id of i18n table
            .filter(property => !this.hasI18n || (this.hasI18n && property.name !== 'dataLang'));                                   // exclude dataLang if has i18n table
    }

    get hasMaxLength(): Property[]
    {
        return this.properties.filter(property => !!property.maxLength);
    }

    get hasMinLength(): Property[]
    {
        return this.properties.filter(property => !!property.minLength);
    }

    get isInteger(): Property[]
    {
        return this.properties.filter(property => property.type === SqlType.INT);
    }

    get isIntegerUnsigned(): Property[]
    {
        return this.properties.filter(property => property.type === SqlType['INT.UNSIGNED']);
    }

    get isBoolean(): Property[]
    {
        return this.properties.filter(property => property.type === SqlType.BOOLEAN);
    }

    get isEnum(): Property[]
    {
        return this.properties.filter(property => property.type === SqlType.ENUM);
    }

    get isTimestamp(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))          // exclude timestamps
            .filter(property => property.type === SqlType.TIMESTAMP);
    }

    // others
    get valueObjects(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to many relations
    }

    get response(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to many relations
    }

    get seed(): Property[]
    {
        return this.properties
            .filter(property => !this.timestampFields.includes(property.name))                                              // exclude timestamps
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get mapper(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    get mock(): Property[]
    {
        return this.properties
            .filter(property => property.relationship !== SqlRelationship.ONE_TO_MANY)                                      // exclude one to many relations
            .filter(property => !(property.relationship === SqlRelationship.ONE_TO_ONE && !property.relationshipField));    // exclude one to one relations without relationshipField, is relation one to one without xxxxId
    }

    getForeignRelationship(boundedContextName: string): Property[]
    {
        return this.withRelationship.filter(item =>
        {
            if (!item.relationshipModulePath) return false;
            return item.relationshipModulePath.split('/')[0] !== boundedContextName;
        });
    }

    add(property: Property): void
    {
        this.properties.push(property);
    }

    filter(fn: () => {}): Property[]
    {
        return this.properties.filter(fn);
    }

    toDto(): Property[]
    {
        return this.properties.map(property => property.toDto());
    }
}