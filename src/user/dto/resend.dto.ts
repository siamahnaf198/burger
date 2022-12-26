import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";

@InputType()
export class ResendInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}