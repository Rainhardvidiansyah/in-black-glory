

export class ProductImageResponseDto{
  id: string;
  url: string;
  isPrimary: boolean;

  constructor(image: { id: string; url: string; isPrimary: boolean }) {
    this.id = image.id;
    this.url = image.url;
    this.isPrimary = image.isPrimary;
  }
}