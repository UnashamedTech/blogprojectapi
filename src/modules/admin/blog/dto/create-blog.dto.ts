import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsObject,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { BLOG_LAYOUTS } from 'src/common/constants/layout.constants';

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
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(BLOG_LAYOUTS))
  layout?: string;

  @IsOptional()
  @IsObject()
  heroImages?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}
