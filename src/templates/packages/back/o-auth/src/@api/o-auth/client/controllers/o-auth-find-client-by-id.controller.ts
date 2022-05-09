/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Constraint, QueryStatement, Timezone } from 'aurora-ts-core';
import { OAuthClientDto } from '../dto';

// authorization
import { Permissions } from '@api/iam/shared/decorators/permissions.decorator';
import { AuthenticationJwtGuard } from '@api/o-auth/shared/guards/authentication-jwt.guard';
import { AuthorizationGuard } from '@api/iam/shared/guards/authorization.guard';

// @apps
import { OAuthFindClientByIdHandler } from '../handlers/o-auth-find-client-by-id.handler';

@ApiTags('[o-auth] client')
@Controller('o-auth/client/find')
@Permissions('oAuth.client.get')
@UseGuards(AuthenticationJwtGuard, AuthorizationGuard)
export class OAuthFindClientByIdController
{
    constructor(
        private readonly handler: OAuthFindClientByIdHandler,
    ) {}

    @Get(':id')
    @ApiOperation({ summary: 'Find client by id' })
    @ApiOkResponse({ description: 'The record has been successfully created.', type: OAuthClientDto })
    async main(
        @Param('id') id: string,
        @Constraint() constraint?: QueryStatement,
        @Timezone() timezone?: string,
    )
    {
        return await this.handler.main(
            id,
            constraint,
            timezone,
        );
    }
}