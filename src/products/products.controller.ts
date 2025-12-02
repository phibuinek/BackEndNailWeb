import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import * as fs from 'fs';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        // Resolving path to be more robust - assuming this runs from /dist/products/
        // We want to go to /frontend/public/images/uploads
        // Current working directory (process.cwd()) should be backend root
        let rootPath = process.cwd();
        // If we are inside dist or src, move up
        if (rootPath.endsWith('dist') || rootPath.endsWith('src')) {
            rootPath = resolve(rootPath, '..');
        }
        // Check if we are in backend directory
        if (rootPath.endsWith('backend')) {
            rootPath = resolve(rootPath, '..');
        }

        const uploadPath = resolve(rootPath, 'frontend/public/images/uploads');
        
        console.log('Uploading file to:', uploadPath);
        
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Return path relative to public folder for Next.js Image
    return { url: `/images/uploads/${file.filename}` };
  }
}
