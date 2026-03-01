import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {CategoryRepository} from "./category.repository";
import {CategoryResponseDto} from "./dto/category.response.dto";
import {CategoryRequestDto} from "./dto/category.request.dto";
import {AccountHelper} from "../account/account.helper";
import {AccountRepository} from "../account/account.repository";
import {CategoryHelper} from "./category.helper";
import {Delete_list_categoryDto} from "./dto/delete_list_category.dto";

@Injectable()
export class CategoryService {
    constructor(
        private categoryRepository: CategoryRepository,
        private categoryHelper: CategoryHelper,
        private accountHelper: AccountHelper,
        ) {}

    async createCategory(category: CategoryRequestDto): Promise<CategoryResponseDto> {
        try {
            return this.categoryRepository.createCategory(category);
        }catch(error) {
            this.accountHelper.handleError(error);
        }
    }

    async updateCategory(id: number, category: CategoryRequestDto): Promise<CategoryResponseDto> {
        try {
            await this.categoryHelper.checkCategory(id);
            return this.categoryRepository.updateCategory(id,category);
        }catch(error) {
            this.accountHelper.handleError(error);
        }
    }

    async getAllCategories(): Promise<CategoryResponseDto[]> {
        try {
            const category = await this.categoryRepository.getAllCategories();
            if(category.length === 0) {
                throw new BadRequestException("Không có danh mục nào tồn tại");
            }
            return category;
        }catch (error) {
            this.accountHelper.handleError(error);
        }
    }

    async deleteCategory(id: number): Promise<CategoryResponseDto | null> {
        try {
            await this.categoryHelper.checkCategory(id);
            return this.categoryRepository.deleteCategory(id);
        }catch(error) {
            this.accountHelper.handleError(error);
        }
    }

    async deleteListCategories(listCategory: Delete_list_categoryDto): Promise<{count: number}> {
        try {
            const category = await this.categoryRepository.deleteListCategory(listCategory);
            if(!category){
                throw new NotFoundException('Không tìm thấy id danh mục nào hợp lệ để xóa hoặc danh sách chứa Admin');
            }
            return category;
        }catch(error) {
            this.accountHelper.handleError(error);
        }
    }
}