import {
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import { ethers } from "ethers";
import { extractTokenFromHeader } from "src/utils/auth";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    private readonly provider: ethers.JsonRpcProvider;
    private readonly nftContractAddress: string;

    // Standard ERC-721 ABI for basic NFT functions
    private readonly ERC721_ABI = [
        "function balanceOf(address owner) view returns (uint256)",
        "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
        "function tokenURI(uint256 tokenId) view returns (string)",
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function supportsInterface(bytes4 interfaceId) view returns (bool)"
    ];

    // ERC-721 interface ID
    private readonly ERC721_INTERFACE_ID = "0x80ac58cd";

    constructor(private readonly jwtService: JwtService) {
        // // Initialize provider - you can use Infura, Alchemy, or other providers
        // const rpcUrl: string =
        //     this.configService.get<string>("ETHEREUM_RPC_URL") ||
        //     "https://eth-mainnet.alchemyapi.io/v2/your-api-key";

        const rpcUrl: string = process.env.ETHEREUM_RPC_URL ||
            "https://mainnet.infura.io/v3/";

        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.nftContractAddress = "";
    }

    checkNFT(walletId): boolean {
        console.log("Checking NFT for wallet:", walletId);
        return true;
    }

    async validAdmin(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = extractTokenFromHeader(request.headers.authorization);

        if (!token) {
            const errorMessage = "No token found in request header";
            throw new UnauthorizedException(errorMessage);
        }

        try {
            const authUser = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || "your-secret-key",
                ignoreExpiration: false
            });

            if (!authUser || !authUser.role || authUser.role !== "admin") {
                const errorMessage = "Unauthorized access: Admin role required";
                throw new UnauthorizedException(errorMessage);
            }

            return true;
        } catch (error) {
            throw new UnauthorizedException(error);
        }
    }

    // /**
    //  * Check NFT ownership and validate addresses
    //  */
    // async checkNFT(address: string): Promise<NFTCheckResult> {
    //     const result: NFTCheckResult = {
    //         address,
    //         nftContractAddress,
    //         isValidWallet: false,
    //         isValidNFTContract: false,
    //         balance: "0",
    //         tokenIds: []
    //     };

    //     try {
    //         // Validate wallet address
    //         result.isValidWallet = this.isValidAddress(walletAddress);
    //         if (!result.isValidWallet) {
    //             throw new BadRequestException("Invalid wallet address format");
    //         }

    //         // Validate NFT contract address
    //         result.isValidNFTContract =
    //             await this.isValidNFTContract(nftContractAddress);
    //         if (!result.isValidNFTContract) {
    //             throw new BadRequestException(
    //                 "Invalid NFT contract address or not an ERC-721 contract"
    //             );
    //         }

    //         // Create contract instance
    //         const contract = new ethers.Contract(
    //             nftContractAddress,
    //             this.ERC721_ABI,
    //             this.provider
    //         );

    //         // Get NFT balance
    //         const balance = await contract.balanceOf(walletAddress);
    //         result.balance = balance.toString();

    //         // Get token IDs owned by the wallet
    //         const tokenIds: string[] = [];
    //         const balanceNum = parseInt(balance.toString());

    //         for (let i = 0; i < balanceNum; i++) {
    //             try {
    //                 const tokenId = await contract.tokenOfOwnerByIndex(
    //                     walletAddress,
    //                     i
    //                 );
    //                 tokenIds.push(tokenId.toString());
    //             } catch (error) {
    //                 // Some contracts might not implement tokenOfOwnerByIndex
    //                 this.logger.warn(
    //                     `Could not get token at index ${i}: ${error.message}`
    //                 );
    //                 break;
    //             }
    //         }

    //         result.tokenIds = tokenIds;

    //         // Get metadata for each token (optional, can be expensive)
    //         if (tokenIds.length > 0 && tokenIds.length <= 10) {
    //             // Limit to 10 for performance
    //             result.metadata = await this.getNFTMetadata(contract, tokenIds);
    //         }

    //         this.logger.log(
    //             `NFT check completed for wallet ${walletAddress}: ${balance} tokens found`
    //         );
    //         return result;
    //     } catch (error) {
    //         this.logger.error(`Error checking NFT: ${error.message}`);
    //         result.error = error.message;
    //         return result;
    //     }
    // }

    /**
     * Validate if an address is a valid Ethereum address
     */
    private isValidAddress(address: string): boolean {
        try {
            return ethers.isAddress(address);
        } catch {
            return false;
        }
    }

    // /**
    //  * Check if contract address is a valid ERC-721 NFT contract
    //  */
    // private async isValidNFTContract(
    //     contractAddress: string
    // ): Promise<boolean> {
    //     try {
    //         // First check if it's a valid address
    //         if (!this.isValidAddress(contractAddress)) {
    //             return false;
    //         }

    //         // Check if there's code at this address
    //         const code = await this.provider.getCode(contractAddress);
    //         if (code === "0x") {
    //             return false; // No contract at this address
    //         }

    //         // Check if it supports ERC-721 interface
    //         const contract = new ethers.Contract(
    //             contractAddress,
    //             this.ERC721_ABI,
    //             this.provider
    //         );

    //         // If supportsInterface fails, try calling basic ERC-721 functions
    //         try {
    //             await contract.name();
    //             await contract.symbol();
    //             return true;
    //         } catch {
    //             return false;
    //         }

    //     } catch (error) {
    //         console.error(`Error checking NFT contract: ${error}`);
    //         return false;
    //     }
    // }
}
