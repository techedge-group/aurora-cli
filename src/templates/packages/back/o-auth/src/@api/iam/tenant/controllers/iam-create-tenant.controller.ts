/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';
import { Timezone } from 'aurora-ts-core';
import { IamTenantDto, IamCreateTenantDto } from '../dto';

// authorization
import { Permissions } from '@api/iam/shared/decorators/permissions.decorator';
import { AuthenticationJwtGuard } from '@api/o-auth/shared/guards/authentication-jwt.guard';
import { AuthorizationGuard } from '@api/iam/shared/guards/authorization.guard';

// @apps
import { IamCreateTenantHandler } from '../handlers/iam-create-tenant.handler';

@ApiTags('[iam] tenant')
@Controller('iam/tenant/create')
@Permissions('iam.tenant.create')
@UseGuards(AuthenticationJwtGuard, AuthorizationGuard)
export class IamCreateTenantController
{
    constructor(
        private readonly handler: IamCreateTenantHandler,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Create tenant' })
    @ApiCreatedResponse({ description: 'The record has been successfully created.', type: IamTenantDto })
    async main(
        @Body() payload: IamCreateTenantDto,
        @Timezone() timezone?: string,
    )
    {
        return await this.handler.main(
            payload,
            timezone,
        );
    }
}