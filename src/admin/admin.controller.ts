import { Body, Controller, Post } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CollectionRequestDTO } from "src/dtos/collectionDTO";

@Controller("admin")
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Post("collections")
    public async collections(
        @Body() body: CollectionRequestDTO
    ): Promise<boolean> {
        return this.adminService.addCollection(body);
    }
}
