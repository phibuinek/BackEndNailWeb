import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    await this.seedProducts();
  }

  private async seedProducts() {
    // Check if data already exists to prevent reset on restart
    if ((await this.productModel.countDocuments()) > 0) {
      console.log('Database already has data, skipping seed.');
      return;
    }

    console.log('Seeding database with bilingual products using local images...');
    
    const products: any[] = [];
    let idCounter = 1;
    
    // Helper
    const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);
    const randomFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

    // Image Mapping (Local Files)
    const categoryImages = {
      'Manicure': '/images/categories/manicure.png',
      'Pedicure': '/images/categories/pedicure.png',
      'Acrylic': '/images/categories/acrylic.png',
      'Gel Polish': '/images/categories/gel-polish.png',
      'Dipping Powder': '/images/categories/dipping-powder.png',
      'Nail Tips & Glue': '/images/categories/tips-glue.png',
      'Tools & Accessories': '/images/categories/tools.png',
      'Waxing': '/images/categories/waxing.png',
      'Eyelashes': '/images/categories/eyelashes.png',
      'Gloves': '/images/categories/gloves.png',
      'Treatments': '/images/categories/treatments.png',
      'Gel & Top Coat': '/images/categories/gel-top-coat.png'
    };

    const categories = [
        { en: 'Acrylic', vi: 'Acrylic' },
        { en: 'Dipping Powder', vi: 'Bột Nhúng' },
        { en: 'Manicure', vi: 'Làm Móng Tay' },
        { en: 'Gel Polish', vi: 'Sơn Gel' },
        { en: 'Gel & Top Coat', vi: 'Gel & Lớp Phủ' },
        { en: 'Nail Tips & Glue', vi: 'Móng Giả & Keo' },
        { en: 'Treatments', vi: 'Điều Trị' },
        { en: 'Tools & Accessories', vi: 'Dụng Cụ & Phụ Kiện' },
        { en: 'Waxing', vi: 'Tẩy Lông' },
        { en: 'Pedicure', vi: 'Chăm Sóc Móng Chân' },
        { en: 'Eyelashes', vi: 'Lông Mi' },
        { en: 'Gloves', vi: 'Găng Tay' }
    ];

    const sampleProducts = [
        { catEn: 'Acrylic', nameEn: 'Acrylic Powder Clear', nameVi: 'Bột Acrylic Trong Suốt', descEn: 'Crystal clear powder for sculpting.', descVi: 'Bột trong suốt để đắp móng.' },
        { catEn: 'Acrylic', nameEn: 'Acrylic Monomer', nameVi: 'Lưu Huỳnh Monomer', descEn: 'Low odor monomer liquid.', descVi: 'Lưu huỳnh ít mùi.' },
        { catEn: 'Dipping Powder', nameEn: 'Nude Dip Powder', nameVi: 'Bột Nhúng Màu Nude', descEn: 'Natural look dipping powder.', descVi: 'Bột nhúng màu tự nhiên.' },
        { catEn: 'Manicure', nameEn: 'Cuticle Nippers', nameVi: 'Kềm Cắt Da', descEn: 'Stainless steel nippers.', descVi: 'Kềm thép không gỉ.' },
        { catEn: 'Gel Polish', nameEn: 'Classic Red Gel', nameVi: 'Sơn Gel Đỏ Cổ Điển', descEn: 'Long lasting red gel polish.', descVi: 'Sơn gel đỏ bền màu.' },
        { catEn: 'Gel & Top Coat', nameEn: 'No Wipe Top Coat', nameVi: 'Top Coat Không Cần Lau', descEn: 'High shine finish.', descVi: 'Độ bóng cao.' },
        { catEn: 'Nail Tips & Glue', nameEn: 'Coffin Tips 500pcs', nameVi: 'Móng Coffin 500 cái', descEn: 'Full cover coffin tips.', descVi: 'Móng úp coffin.' },
        { catEn: 'Treatments', nameEn: 'Cuticle Oil', nameVi: 'Dầu Dưỡng Móng', descEn: 'Hydrating cuticle oil.', descVi: 'Dầu dưỡng ẩm da tay.' },
        { catEn: 'Tools & Accessories', nameEn: 'Nail File 100/180', nameVi: 'Dũa Móng 100/180', descEn: 'Professional nail file.', descVi: 'Dũa móng chuyên nghiệp.' },
        { catEn: 'Waxing', nameEn: 'Hard Wax Beans', nameVi: 'Sáp Wax Hạt', descEn: 'Painless hair removal.', descVi: 'Tẩy lông không đau.' },
        { catEn: 'Pedicure', nameEn: 'Pumice Stone', nameVi: 'Đá Bọt Chà Gót', descEn: 'Exfoliating foot stone.', descVi: 'Đá tẩy tế bào chết chân.' },
        { catEn: 'Eyelashes', nameEn: 'Mink Lashes', nameVi: 'Lông Mi Chồn', descEn: 'Natural looking lashes.', descVi: 'Lông mi nhìn tự nhiên.' },
        { catEn: 'Gloves', nameEn: 'Latex Gloves Box', nameVi: 'Găng Tay Cao Su', descEn: 'Disposable protective gloves.', descVi: 'Găng tay bảo vệ dùng một lần.' },
    ];

    // Generate products for each category based on samples + random variations
    categories.forEach(cat => {
        const relevantSamples = sampleProducts.filter(p => p.catEn === cat.en);
        // If no specific sample, create generic one
        if (relevantSamples.length === 0) {
             relevantSamples.push({ 
                 catEn: cat.en, 
                 nameEn: `${cat.en} Item`, 
                 nameVi: `Sản phẩm ${cat.vi}`, 
                 descEn: `High quality ${cat.en} product.`, 
                 descVi: `Sản phẩm ${cat.vi} chất lượng cao.`
             });
        }

        // Create ~8-10 items per category
        const count = random(8, 12);
        for(let i=0; i<count; i++) {
            const base = relevantSamples[i % relevantSamples.length];
            products.push({
                id: idCounter++,
                name: {
                    en: `${base.nameEn} #${i+1}`,
                    vi: `${base.nameVi} #${i+1}`
                },
                description: {
                    en: base.descEn,
                    vi: base.descVi
                },
                price: randomFloat(5, 50),
                quantity: random(10, 100),
                rating: randomFloat(3.5, 5.0),
                image: categoryImages[cat.en] || '/placeholder.jpg',
                category: {
                    en: cat.en,
                    vi: cat.vi
                }
            });
        }
    });

    await this.productModel.insertMany(products);
    console.log(`Seeding complete. Inserted ${products.length} bilingual products with local images.`);
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().lean().exec();
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productModel.findOne({ id }).lean().exec();
  }

  async create(product: Product): Promise<Product> {
    // Auto-increment ID logic (simplified)
    const lastProduct = await this.productModel.findOne().sort({ id: -1 }).exec();
    const nextId = lastProduct ? lastProduct.id + 1 : 1;
    const newProduct = new this.productModel({ ...product, id: nextId });
    return newProduct.save();
  }

  async update(id: number, updateData: Partial<Product>): Promise<Product | null> {
    return this.productModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }

  async remove(id: number): Promise<any> {
    return this.productModel.findOneAndDelete({ id }).exec();
  }
}
