import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import cloudinary from "cloudinary";

//Service
import { UserService } from "./user.service";

//Entities
import { SuccessInfo } from "./entities/success.entity";
import { RegistrationInfo } from "./entities/registration.entity";
import { User } from "./entities/user.entity";

//Dto
import { UserInput } from "./dto/user.dto";
import { ResendInput } from "./dto/resend.dto";
import { VerifyInput } from "./dto/verify.dto";
import { LoginInput } from "./dto/login.dto";


//Cloudinary config
cloudinary.v2.config({
    cloud_name: 'dub0dpenl',
    api_key: '717735579125587',
    api_secret: 'gq4LLGJtlz5TszWdwGwqsK6urm8',
})

@Resolver()
export class UserResolver {
    //Constructor
    constructor(
        private readonly userService: UserService
    ) { }

    //Get
    @Query(() => [User], { name: "getUser" })
    get() {
        return this.userService.get();
    }

    //Create user
    @Mutation(() => SuccessInfo, { name: "createUser" })
    create(
        @Args("userInput") userInput: UserInput
    ) {
        return this.userService.create(userInput);
    }

    //Resend Otp
    @Mutation(() => SuccessInfo, { name: "resendOtp" })
    resend(
        @Args("resendInput") resendInput: ResendInput
    ) {
        return this.userService.resend(resendInput)
    }

    //Verify otp
    @Mutation(() => RegistrationInfo, { name: "verifyOtp" })
    verify(
        @Args("verifyInput") verifyInput: VerifyInput
    ) {
        return this.userService.verify(verifyInput);
    }

    //Login otp
    @Mutation(() => RegistrationInfo, { name: "login" })
    login(
        @Args("loginInput") loginInput: LoginInput
    ) {
        return this.userService.login(loginInput);
    }

    //Update profile
    @Mutation(() => SuccessInfo, { name: "updateProfile" })
    update() {
        cloudinary.v2.uploader.destroy("zvaqkipte1b1sulhzz13")
    }

}