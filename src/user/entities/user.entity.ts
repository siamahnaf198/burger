import { ObjectType, Field, Float } from "@nestjs/graphql";

@ObjectType()
export class User {
    @Field(() => Float, { nullable: false })
    id: number;
    @Field(() => String, { nullable: false })
    firstName: string;
    @Field(() => String, { nullable: false })
    lastName: string;
    @Field(() => Boolean, { nullable: false })
    isActive: boolean;
    @Field(() => Date, { nullable: false })
    created_at: Date;
    @Field(() => Date, { nullable: false })
    updated_at: Date;
}