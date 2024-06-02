import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { ServiceService } from './service.service';
import { ServiceEntity } from './entities/service.entity';

@Resolver(() => ServiceEntity)
export class ServiceResolver {
  constructor(private readonly serviceService: ServiceService) {}

  @Query(() => ServiceEntity, { name: 'getService' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<ServiceEntity> {
    const service = await this.serviceService.getServiceById(id);
    console.log('Service in Resolver:', JSON.stringify(service, null, 2));
    if (!service.ratings) {
      service.ratings = [];
    }
    if (!service.comments) {
      service.comments = [];
    }
    if (!service.orders) {
      service.orders = [];
    }
    return service;
  }
  
}
