import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {CategoryRequestDto} from "./dto/category.request.dto";
import {CategoryResponseDto} from "./dto/category.response.dto";
import {Delete_list_categoryDto} from "./dto/delete_list_category.dto";

@Injectable()
export class CategoryRepository {
    constructor(private prismaService: PrismaService) {}

    async createCategory(category: CategoryRequestDto): Promise<CategoryResponseDto> {
        return this.prismaService.category.create({
            data: {
                name: category.name,
                description: category.description,
            }
        });
    }

    async updateCategory(id: number, category: CategoryRequestDto): Promise<CategoryResponseDto> {
        return this.prismaService.category.update({
            where: {
                id: id
            },
            data: {
                name: category.name,
                description: category.description,
            }
        });
    }

    async getAllCategories(): Promise<CategoryResponseDto[]> {
        return this.prismaService.category.findMany();
    }

    async deleteCategory(id: number): Promise<CategoryResponseDto | null> {
        return this.prismaService.category.delete({
            where: {
                id: id
            }
        });
    }

    async deleteListCategory(listCategory: Delete_list_categoryDto): Promise<{count: number}> {
        return this.prismaService.category.deleteMany({
            where: {
                id: {
                    in: listCategory.Ids,
                }
            }
        });
    }
}