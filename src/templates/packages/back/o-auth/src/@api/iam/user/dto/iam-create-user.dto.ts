/* eslint-disable indent */
import { ApiProperty } from '@nestjs/swagger';

export class IamCreateUserDto
{
    @ApiProperty({
        type       : String,
        description: 'id [input here api field description]',
    })
    id: string;

    @ApiProperty({
        type       : String,
        description: 'accountId [input here api field description]',
        example    : 'fad8221e-8a49-41d8-98d5-eb54f044ca66',
    })
    accountId: string;

    @ApiProperty({
        type       : String,
        description: 'name [input here api field description]',
    })
    name: string;

    @ApiProperty({
        type       : String,
        description: 'surname [input here api field description]',
    })
    surname?: string;

    @ApiProperty({
        type       : String,
        description: 'code [input here api field description]',
    })
    code?: string;

    @ApiProperty({
        type       : String,
        description: 'avatar [input here api field description]',
    })
    avatar?: string;

    @ApiProperty({
        type       : String,
        description: 'mobile [input here api field description]',
    })
    mobile?: string;

    @ApiProperty({
        type       : String,
        description: 'langId [input here api field description]',
    })
    langId?: string;

    @ApiProperty({
        type       : String,
        description: 'username [input here api field description]',
    })
    username: string;

    @ApiProperty({
        type       : String,
        description: 'password [input here api field description]',
    })
    password: string;

    @ApiProperty({
        type       : String,
        description: 'rememberToken [input here api field description]',
    })
    rememberToken?: string;

    @ApiProperty({
        type       : Object,
        description: 'data [input here api field description]',
    })
    data?: any;

}