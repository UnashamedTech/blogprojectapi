import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsBoolean,
} from 'class-validator';

type BlogParagraph = {
  id?: string;
  image?: string;
  content: string;
};
export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsObject()
  content: Record<string, BlogParagraph>;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsObject()
  heroImages?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}
