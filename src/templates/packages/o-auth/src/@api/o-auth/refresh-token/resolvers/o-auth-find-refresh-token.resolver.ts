import { Resolver, Args, Query } from '@nestjs/graphql';
import { Constraint, QueryStatement, Timezone } from 'aurora-ts-core';

// @apps
import { OAuthFindRefreshTokenHandler } from '../handlers/o-auth-find-refresh-token.handler';
import { OAuthRefreshToken } from '../../../../../graphql';

@Resolver()
export class OAuthFindRefreshTokenResolver
{
    constructor(
        private readonly handler: OAuthFindRefreshTokenHandler,
    ) {}

    @Query('oAuthFindRefreshToken')
    async main(
        @Args('query') queryStatement?: QueryStatement,
        @Constraint() constraint?: QueryStatement,
        @Timezone() timezone?: string,
    ): Promise<OAuthRefreshToken>
    {
        return await this.handler.main(
            queryStatement,
            constraint,
            timezone,
        );
    }
}