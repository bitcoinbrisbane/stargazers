import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { Collection } from "../entities/collection.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Collection])],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule {}
