import { ConflictException, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { CQMetadata } from 'aurora-ts-core';
import {
    ClientId,
    ClientGrantType,
    ClientName,
    ClientSecret,
    ClientAuthUrl,
    ClientRedirect,
    ClientScopes,
    ClientExpiredAccessToken,
    ClientExpiredRefreshToken,
    ClientIsActive,
    ClientIsMaster,
    ClientApplicationIds,
    ClientCreatedAt,
    ClientUpdatedAt,
    ClientDeletedAt,
} from '../../domain/value-objects';
import { IClientRepository } from '../../domain/client.repository';
import { OAuthClient } from '../../domain/client.aggregate';

@Injectable()
export class CreateClientService
{
    constructor(
        private readonly publisher: EventPublisher,
        private readonly repository: IClientRepository,
    ) {}

    async main(
        payload: {
            id: ClientId;
            grantType: ClientGrantType;
            name: ClientName;
            secret: ClientSecret;
            authUrl: ClientAuthUrl;
            redirect: ClientRedirect;
            scopes: ClientScopes;
            expiredAccessToken: ClientExpiredAccessToken;
            expiredRefreshToken: ClientExpiredRefreshToken;
            isActive: ClientIsActive;
            isMaster: ClientIsMaster;
            applicationIds: ClientApplicationIds;
        },
        cQMetadata?: CQMetadata,
    ): Promise<void>
    {
        // create aggregate with factory pattern
        const client = OAuthClient.register(
            payload.id,
            payload.grantType,
            payload.name,
            payload.secret,
            payload.authUrl,
            payload.redirect,
            payload.scopes,
            payload.expiredAccessToken,
            payload.expiredRefreshToken,
            payload.isActive,
            payload.isMaster,
            payload.applicationIds,
            new ClientCreatedAt({ currentTimestamp: true }),
            new ClientUpdatedAt({ currentTimestamp: true }),
            null, // deletedAt
        );

        await this.repository.create(client, { createOptions: cQMetadata?.repositoryOptions });

        // merge EventBus methods with object returned by the repository, to be able to apply and commit events
        const clientRegister = this.publisher.mergeObjectContext(
            client,
        );

        clientRegister.created(client); // apply event to model events
        clientRegister.commit(); // commit all events of model
    }
}