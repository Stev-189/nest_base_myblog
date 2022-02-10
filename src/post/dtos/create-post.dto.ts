import { IsArray, IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { EnumToString } from "src/common/helpers/enumToString";
import { PostCategory } from "../enums";

export class CreatePostDto {

    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    excerpt: string;

    @IsString()
    content: string;

    @IsEnum(PostCategory, { message:`Opcion invalida. las opciones correctas son ${ EnumToString(PostCategory) }` })
    category: PostCategory; // enum type son los valores que puede tomar el campo

    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @IsOptional()
    @IsBoolean()
    status: boolean;
}