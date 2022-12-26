import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class SuccessInfo {
    @Field(() => Boolean, { nullable: false })
    success: boolean;
    @Field(() => String, { nullable: false })
    message: string;
}