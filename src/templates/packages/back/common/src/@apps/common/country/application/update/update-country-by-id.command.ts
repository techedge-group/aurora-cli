import { QueryStatement } from 'aurora-ts-core';
import { CQMetadata } from 'aurora-ts-core';

export class UpdateCountryByIdCommand
{
    constructor(
        public readonly payload: {
            id: string;
            iso3166Alpha2?: string;
            iso3166Alpha3?: string;
            iso3166Numeric?: string;
            customCode?: string;
            prefix?: string;
            image?: string;
            sort?: number;
            administrativeAreas?: any;
            latitude?: number;
            longitude?: number;
            zoom?: number;
            dataLang?: any;
            langId?: string;
            name?: string;
            slug?: string;
            administrativeAreaLevel1?: string;
            administrativeAreaLevel2?: string;
            administrativeAreaLevel3?: string;
        },
        public readonly constraint?: QueryStatement,
        public readonly cQMetadata?: CQMetadata,
    ) {}
}