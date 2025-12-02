import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() product: Product): Promise<Product> {
    return this.productsService.create(product);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() product: Partial<Product>): Promise<Product | null> {
    return this.productsService.update(+id, product);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<any> {
    return this.productsService.remove(+id);
  }

  @Post('update-sold')
  async updateSold(@Body() body: { items: { id: number, quantity: number }[] }) {
      for (const item of body.items) {
          await this.productsService.updateSold(item.id, item.quantity);
      }
      return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    try {
      if (!files || files.length === 0) {
         throw new Error('No files uploaded');
      }
      
      const uploadPromises = files.map(file => this.cloudinaryService.uploadImage(file));
      const results = await Promise.all(uploadPromises);
      
      // Return array of URLs
      return { urls: results.map(res => res.secure_url) };
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
}
