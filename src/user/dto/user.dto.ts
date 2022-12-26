import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength, IsNotEmpty, MaxLength, Matches } from "class-validator";

@InputType()
export class AvatarInput {
    @Field(() => String, { nullable: true })
    public_key: string;
    @Field(() => String, { nullable: true })
    url: string;
}

@InputType()
export class UserInput {
    @Field(() => String, { nullable: false })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @Field(() => String, { nullable: false })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    @Matches(/^.*(?=.{4,10})(?=.*\d)(?=.*[a-zA-Z]).*$/, { message: "password too weak" })
    password: string
}