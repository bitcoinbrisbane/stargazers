import { Controller, Get, Param } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("check-nft/:walletAddress")
    checkNft(@Param("walletId") walletId: string): boolean {
        return this.authService.checkNFT(walletId);
    }
}
