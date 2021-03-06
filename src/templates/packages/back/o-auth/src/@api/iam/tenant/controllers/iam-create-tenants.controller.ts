/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Timezone } from 'aurora-ts-core';
import { IamTenantDto, IamCreateTenantDto } from '../dto';

// authorization
import { Permissions } from '@api/iam/shared/decorators/permissions.decorator';
import { AuthenticationJwtGuard } from '@api/o-auth/shared/guards/authentication-jwt.guard';
import { AuthorizationGuard } from '@api/iam/shared/guards/authorization.guard';

// @apps
import { IamCreateTenantsHandler } from '../handlers/iam-create-tenants.handler';

@ApiTags('[iam] tenant')
@Controller('iam/tenants/create')
@Permissions('iam.tenant.create')
@UseGuards(AuthenticationJwtGuard, AuthorizationGuard)
export class IamCreateTenantsController
{
    constructor(
        private readonly handler: IamCreateTenantsHandler,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create tenants in batch' })
    @ApiCreatedResponse({ description: 'The records has been created successfully.' , type: [IamTenantDto]})
    @ApiBody({ type: [IamCreateTenantDto]})
    async main(
        @Body() payload: IamCreateTenantDto[],
        @Timezone() timezone?: string,
    )
    {
        return await this.handler.main(
            payload,
            timezone,
        );
    }
}