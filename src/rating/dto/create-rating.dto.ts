import { Min, Max } from 'class-validator';


export class CreateRatingDto {
    @Min(0) // Ensure value is >= 0
  @Max(5) // Ensure value is <= 5
  value: number;
}
