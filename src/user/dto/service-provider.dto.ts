// user/dto/service-provider.dto.ts
export class ServiceProviderDto {
    id: number;
    name: string;
    profession: string;
    skills: string[];
    service_count: number;
    orders: number; // Initially set to 0
    rating: number;
    image: string; // Assume profileImagePath in UserEntity
  }
  