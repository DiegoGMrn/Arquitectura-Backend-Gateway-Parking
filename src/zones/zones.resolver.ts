import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Zones } from './zones.entity';
import { Inject } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { CreateZoneRequest, ZonesServiceClient } from './zones.pb';
import { firstValueFrom } from 'rxjs';
import { CreateZoneInput } from './dto/create-zone.input';
import { createZoneResponse } from './createZoneResponse.entity';
import { arrayZones } from './arrayZones.entity';
import { findOneInput } from './dto/findOne.input';


@Resolver()
export class ZonesResolver {
    constructor(
       @Inject('ZonesServiceClient')
       private readonly zonesServiceClient: ClientGrpcProxy,
    ) {}
    private zonesService: ZonesServiceClient;

    onModuleInit(): void {
        this.zonesService =
            this.zonesServiceClient.getService<ZonesServiceClient>('ZonesService');
    }

    @Query(returns => arrayZones)
    async findAllZones(): Promise<arrayZones> {
        const response = await firstValueFrom(this.zonesService.findAll({}));
        return response;
    }
    @Mutation(returns => createZoneResponse)
    async create(@Args('inputCreateZone') inputCreateZone: CreateZoneInput): Promise<createZoneResponse> {
        const request: CreateZoneRequest = {
        name: inputCreateZone.name,
        cantEstacionamientosTotales: parseInt(inputCreateZone.cantEstacionamientosTotales),
        };
        const response: createZoneResponse = await firstValueFrom(this.zonesService.create(request));
        return response;
  }

  @Query(returns => Zones)
    async findOneZone(@Args('id') id: number): Promise<Zones> {
        const input: findOneInput = { id };
        const response = await firstValueFrom(this.zonesService.findOne(input));
        return response;
    }
}
