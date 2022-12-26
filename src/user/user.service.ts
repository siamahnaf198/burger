import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
import * as bcrypt from "bcrypt";
import * as speakeasy from "speakeasy";

//Email template
import { emailTemplate } from "../helper/email-temp";

//Orm Entity
import { User } from "./model/user.entity";

//Entities
import { SuccessInfo } from "./entities/success.entity";
import { RegistrationInfo } from "./entities/registration.entity";

//Dto
import { UserInput } from "./dto/user.dto";
import { ResendInput } from "./dto/resend.dto";
import { VerifyInput } from "./dto/verify.dto";
import { LoginInput } from "./dto/login.dto";

@Injectable()
export class UserService {
    //Constructor
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private readonly mailService: MailerService,
        private jwtService: JwtService
    ) { }

    //Get user
    async get() {
        const user = await this.userRepository.find();
        return user;
    }

    //Create User
    async create(userInput: UserInput): Promise<SuccessInfo> {
        const user = await this.userRepository.findOneBy({
            email: userInput.email
        });
        if (user && user.is_verify) throw new NotFoundException("User already registered!");
        const secret = speakeasy.generateSecret({ length: 20 });
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        const passwordHash = await bcrypt.hash(userInput.password, 12);
        await this.mailService.sendMail({
            to: userInput.email,
            from: "noreply@pichat.com",
            subject: "One time verification code for pi chat",
            html: emailTemplate(otp)
        })
            .catch(() => {
                throw new NotFoundException("Something went wrong!")
            })
        if (user && !user.is_verify) {
            await this.userRepository.update(user.id, { otp: secret.base32 })
        } else {
            const result = this.userRepository.create({
                ...userInput,
                otp: secret.base32,
                password: passwordHash
            });
            await this.userRepository.save(result);
        }
        return {
            success: true,
            message: "User created successfully!"
        }
    }

    //Resend Otp
    async resend(resendInput: ResendInput): Promise<SuccessInfo> {
        const user = await this.userRepository.findOneBy({
            email: resendInput.email
        });
        if (!user) throw new NotFoundException("User not found with this email!");
        const secret = speakeasy.generateSecret({ length: 20 });
        const otp = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32'
        });
        await this.mailService.sendMail({
            to: user.email,
            from: "noreply@pichat.com",
            subject: "One time verification code for pi chat",
            html: emailTemplate(otp)
        })
            .catch(() => {
                throw new NotFoundException("Something went wrong!")
            })
        await this.userRepository.update(user.id, { otp: secret.base32 });
        return {
            success: true,
            message: "One time password sent successfully!"
        }
    }

    //Email verification
    async verify(verifyInput: VerifyInput): Promise<RegistrationInfo> {
        const user = await this.userRepository.findOne({
            where: {
                email: verifyInput.email
            },
            select: ["id", "email", "otp"]
        })
        if (!user) throw new NotFoundException("User not found!");
        var validOtp = speakeasy.totp.verify({
            secret: user.otp,
            encoding: 'base32',
            token: verifyInput.otp,
            window: 10
        });
        if (!validOtp) throw new NotFoundException("Wrong or expired otp!");
        await this.userRepository.update(user.id, { is_verify: true })
        const payload = { email: user.email }
        return {
            success: true,
            token: this.jwtService.sign(payload),
            expire: 30,
            message: "User registration successful!"
        }
    }

    //Login
    async login(loginInput: LoginInput): Promise<RegistrationInfo> {
        const user = await this.userRepository.findOne({
            where: {
                email: loginInput.email,
                is_verify: true
            },
            select: ["id", "email", "password"]
        })
        if (!user) throw new NotFoundException("Wrong email or password!");
        const validPassword = await bcrypt.compare(loginInput.password, user.password);
        if (!validPassword) throw new NotFoundException("Wronssg email or password!")
        const payload = { email: user.email }
        return {
            success: true,
            token: this.jwtService.sign(payload),
            expire: 30,
            message: "User login successful!"
        }
    }
}


