import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdminController } from "./admin/admin.controller";
import { AdminService } from "./admin/admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Collection } from "./entities/collection.entity";
import { AdminModule } from "./admin/admin.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            url: "postgres://nestjs_user:nestjs_password@localhost:5432/nestjs_app",
            entities: [Collection],
            synchronize: true,
            logging: true
        }),
        TypeOrmModule.forFeature([Collection])
    ],
    controllers: [AdminController],
    providers: [AdminService]
})

// @Module({
//     imports: [
//         ConfigModule.forRoot({
//             isGlobal: true
//         }),
//         TypeOrmModule.forRootAsync({
//             imports: [ConfigModule],
//             useFactory: (configService: ConfigService) => ({
//                 type: "postgres",
//                 url: configService.get("DATABASE_URL"),
//                 entities: [Collection], // ✅ MUST be here
//                 synchronize: configService.get("NODE_ENV") === "development",
//                 logging: true
//             }),
//             inject: [ConfigService]
//         }),
//         AdminModule
//     ],
//     controllers: [AppController, AdminController],
//     providers: [AppService, AdminService]
// })
export class AppModule {}
