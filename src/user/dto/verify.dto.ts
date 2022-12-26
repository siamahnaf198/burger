import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsString, IsNotEmpty } from "class-validator";

@InputType()
export class VerifyInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    otp: string;
}