import { Controller, Get } from "@nestjs/common";
import { AppService } from "./auth.service";

@Controller()
export class AdminController {
    constructor(private readonly appService: AppService) {}

    @Get()
    checkNft(): string {
        return this.appService.getHello();
    }
}
