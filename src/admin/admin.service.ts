import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CollectionRequestDTO } from "src/dtos/collectionDTO";
import { Collection } from "src/entities/collection.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Collection)
        private collectionRepository: Repository<Collection>
    ) {}

    async addCollection(request: CollectionRequestDTO): Promise<boolean> {
        const exists = await this.collectionRepository.findOne({
            where: { address: request.address }
        });
        if (exists) {
            return false;
        }

        const collection = this.collectionRepository.create({
            address: request.address
        });
        await this.collectionRepository.save(collection);
        return true;
    }
}
