import {Injectable, Logger} from "@nestjs/common";
import {UserEntity} from "../typeorm";
import {ConfigService} from "@nestjs/config";
import {authenticator} from "otplib";
import {Response} from 'express';
import {UserService} from "../user/user.service";
import {toFileStream} from "qrcode";
import {SessionUser} from "./index";

//TODO: Criar Módulo User, refatorar o código, criar UserService e UserRepository
//TODO: Ao invés de salvar o OTP secret no cookie, procurar no banco de dados
@Injectable()
export class AuthService {

    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly userService: UserService,
                private readonly configService: ConfigService) {
    }

    async validateUser(sessionUser: SessionUser) {
        this.logger.debug(`### OAuth2 user: ${JSON.stringify(sessionUser)}`);

        const userEntity: UserEntity = this.convertSessionToEntity(sessionUser);
        const databaseUser: UserEntity | null = await this.userService.findByEmail(sessionUser.email);

        this.logger.debug(`### Current Database User: ${JSON.stringify(databaseUser)}`);
        if (databaseUser) {
            await this.userService.update(userEntity);
            return this.convertEntityToSession(databaseUser);
        }

        this.logger.debug(`### User ${sessionUser.id} not found. Creating new user`)
        const newUser: UserEntity = await this.userService.create(userEntity);
        return this.convertEntityToSession(await this.userService.save(newUser));
    }

    async enable2FA(id: number): Promise<void> {
        await this.userService.enable2FA(id);
    }

    async disable2FA(id: number): Promise<void> {
        await this.userService.disable2FA(id);
    }

    async validateOTP(id: number): Promise<void> {
        await this.userService.validateOTP(id);
    }

    async invalidateOTP(id: number): Promise<void> {
        await this.userService.invalidateOTP(id);
    }

    public async add2FASecret(id: number, secret: string): Promise<void> {
        await this.userService.add2FASecret(id, secret);
    }

    public is2FACodeValid(code: string, secret: string): boolean {
        return authenticator.verify({
            token: code,
            secret: secret
        })
    }

    public async generate2FASecret(id: number, email: string): Promise<string> {
        const secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(email, String(this.configService.get<string>('APP_TWO_FACTOR_AUTHENTICATION_NAME')), secret);

        await this.add2FASecret(id, secret);

        return otpAuthUrl;
    }

    public async pipeQrCodeStream(stream: Response, otpauthUrl: string): Promise<void> {
        //toDataURL()
        return toFileStream(stream, otpauthUrl);
    }

    private convertSessionToEntity(sessionUser: SessionUser): UserEntity {
        const {id, username, displayName, email, profileUrl, otpEnabled, otpSecret, otpValidated} = sessionUser;
        const userEntity: UserEntity = new UserEntity();

        userEntity.id = id;
        userEntity.username = username;
        userEntity.displayName = displayName;
        userEntity.email = email;
        userEntity.profileUrl = profileUrl;
        userEntity.otpEnabled = otpEnabled;
        userEntity.otpSecret = otpSecret;
        userEntity.otpValidated = otpValidated;

        return userEntity;
    }

    private convertEntityToSession(userEntity: UserEntity): SessionUser {
        const {id, username, displayName, email, profileUrl, otpEnabled, otpSecret, otpValidated} = userEntity;
        return {
            id,
            username,
            displayName,
            email,
            profileUrl,
            otpEnabled,
            otpSecret,
            otpValidated
        };
    }
}