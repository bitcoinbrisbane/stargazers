import { ApiProperty } from "@nestjs/swagger";

export class CollectionRequestDTO {
    @ApiProperty({
        description: "Address of the collection",
        example: "0x2953399124f0cbb46d2cbacd8a89cf0599974963",
        required: true
    })
    address: string;
}
