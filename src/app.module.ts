import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailerModule } from "@nestjs-modules/mailer";

//Path
import { join } from "path";

//Using Apollo Studio
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

//Module
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: false,
      playground: false,
      path: "piechat",
      plugins: [ApolloServerPluginLandingPageLocalDefault()]
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST,
      port: parseInt(<string>process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true
    }),
    MailerModule.forRoot({
      transport: {
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "eb4eee75e3af3b",
          pass: "0b4bbec693a12f"
        }
      }
    }),
    UserModule
  ]
})

export class AppModule { }