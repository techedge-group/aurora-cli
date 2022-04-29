import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from '../../@aurora/shared.module';
import { OAuthModels, OAuthHandlers, OAuthServices, OAuthRepositories, OAuthSagas } from '../../@apps/o-auth';
import { OAuthApplicationControllers, OAuthApplicationResolvers, OAuthApplicationApiHandlers } from './application';
import { OAuthClientControllers, OAuthClientResolvers, OAuthClientApiHandlers } from './client';
import { OAuthAccessTokenControllers, OAuthAccessTokenResolvers, OAuthAccessTokenApiHandlers } from './access-token';
import { OAuthRefreshTokenControllers, OAuthRefreshTokenResolvers, OAuthRefreshTokenApiHandlers } from './refresh-token';

@Module({
    imports: [
        SharedModule,
        SequelizeModule.forFeature([
                ...OAuthModels
            ])
    ],
    controllers: [
        ...OAuthApplicationControllers,
        ...OAuthClientControllers,
        ...OAuthAccessTokenControllers,
        ...OAuthRefreshTokenControllers
    ],
    providers: [
        ...OAuthHandlers,
        ...OAuthServices,
        ...OAuthRepositories,
        ...OAuthSagas,
        ...OAuthApplicationResolvers,
        ...OAuthApplicationApiHandlers,
        ...OAuthClientResolvers,
        ...OAuthClientApiHandlers,
        ...OAuthAccessTokenResolvers,
        ...OAuthAccessTokenApiHandlers,
        ...OAuthRefreshTokenResolvers,
        ...OAuthRefreshTokenApiHandlers
    ],
})
export class OAuthModule {}
