import { QueryStatement } from 'aurora-ts-core';
import { CQMetadata } from 'aurora-ts-core';

export class PaginateScopesQuery
{
    constructor(
        public readonly queryStatement?: QueryStatement,
        public readonly constraint?: QueryStatement,
        public readonly cQMetadata?: CQMetadata,
    ) {}
}