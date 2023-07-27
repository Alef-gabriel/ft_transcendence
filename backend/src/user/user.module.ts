import {Module} from '@nestjs/common';
import {UserService} from "./user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import entities from "../typeorm";
import {UserController} from "./user.controller";

@Module({
    controllers: [UserController],
    providers: [UserService],
    imports: [TypeOrmModule.forFeature(entities)],
    exports: [UserService]
})
export class UserModule {
}
