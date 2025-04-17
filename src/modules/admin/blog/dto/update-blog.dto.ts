import { IsString, IsOptional } from 'class-validator';

export class UpdateBlogDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string;

  @IsString()
  location?: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  heroImages?: JSON;
}
