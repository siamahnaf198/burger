import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

//Orm Entity
import { User } from "./model/user.entity";

//Service and Resolver
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";


@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: "30day" }
        }),
    ],
    providers: [UserService, UserResolver]
})

export class UserModule { }