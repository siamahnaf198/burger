import { ObjectType, Field, Float } from "@nestjs/graphql";

@ObjectType()
export class RegistrationInfo {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => String, { nullable: false })
    token: string;
    @Field(() => Float, { nullable: false })
    expire: number;
    @Field(() => String, { nullable: false })
    message: string;
}