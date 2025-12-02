import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, resolve, join, sep } from 'path';
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
        // Robust path resolution
        let rootPath = process.cwd();
        
        // If running from backend directory, move up to workspace root
        if (rootPath.endsWith('backend') || rootPath.endsWith('backend' + sep)) {
            rootPath = resolve(rootPath, '..');
        }
        
        // Construct absolute path to frontend public uploads
        const uploadPath = join(rootPath, 'frontend', 'public', 'images', 'uploads');
        
        console.log('MULTER: Upload path determined as:', uploadPath);
        
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
          console.log('MULTER: Creating directory:', uploadPath);
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        console.log('MULTER: Saving file as:', filename);
        cb(null, filename);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Return path relative to public folder for Next.js Image
    return { url: `/images/uploads/${file.filename}` };
  }
}
