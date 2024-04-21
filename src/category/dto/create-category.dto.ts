export class CreateCategoryDto {
  readonly parentId?: number;
  readonly title: string;
  readonly description: string;
  readonly iconPath: string;
}