import { QueryStatement } from 'aurora-ts-core';
import { CQMetadata } from 'aurora-ts-core';

export class DeleteApplicationByIdCommand
{
    constructor(
        public readonly id: string,
        public readonly constraint?: QueryStatement,
        public readonly cQMetadata?: CQMetadata,
    ) {}
}