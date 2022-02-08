import { PartialType, OmitType } from "@nestjs/mapped-types";
import { CreatePostDto  } from "./create-post.dto";
// con esto creamos una Dto que solo tiene los campos que necesitamos
//export class EditPostDto extends PartialType(CreatePostDto) {}

//siquiero que no se considere el slug con esto se emite el envio de este dato
export class EditPostDto extends PartialType(OmitType(CreatePostDto, 
    ['slug'] as const,//['slug'] as const//otra omicion de hacerlo as const
)) {}