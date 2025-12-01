export class LocalizedString {
  en: string;
  vi: string;
}

export class Product {
  id: number;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
  quantity: number;
  rating: number;
  image: string;
  category: LocalizedString;
  sold: number;
  createdAt?: Date;
}
