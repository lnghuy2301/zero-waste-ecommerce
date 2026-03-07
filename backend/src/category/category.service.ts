import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { CategoryHelper } from './category.helper';
import { CategoryRequestDto } from './dto/category.request.dto';
import { CategoryResponseDto } from './dto/category.response.dto';
import { Delete_list_categoryDto } from './dto/delete_list_category.dto';
import { AccountHelper } from '../account/account.helper';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepository: CategoryRepository,
    private categoryHelper: CategoryHelper,
    private accountHelper: AccountHelper,
  ) {}

  async create(category: CategoryRequestDto): Promise<CategoryResponseDto> {
    return this.categoryRepository.createCategory(category);
  }

  async update(
    id: number,
    category: CategoryRequestDto,
  ): Promise<CategoryResponseDto> {
    await this.categoryHelper.checkCategory(id);
    return this.categoryRepository.updateCategory(id, category);
  }

  async getAllCategories(): Promise<CategoryResponseDto[]> {
    const category = await this.categoryRepository.getAllCategories();
    if (category.length === 0) {
      throw new BadRequestException('Không có danh mục nào tồn tại');
    }
    return category;
  }

  async delete(id: number): Promise<CategoryResponseDto | null> {
    await this.categoryHelper.checkCategory(id);
    return this.categoryRepository.deleteCategory(id);
  }

  async deleteList(
    listCategory: Delete_list_categoryDto,
  ): Promise<{ count: number }> {
    const category =
      await this.categoryRepository.deleteListCategory(listCategory);

    if (!category) {
      throw new NotFoundException(
        'Không tìm thấy id danh mục nào hợp lệ để xóa hoặc danh sách chứa Admin',
      );
    }
    return category;
  }
}
