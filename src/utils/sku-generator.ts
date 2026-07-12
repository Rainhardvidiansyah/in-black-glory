export function generateSku(productName: string, size: string, color: string): string {
  const productCode = productName
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .split(' ')
    .slice(0, 2)
    .join('');

  const sizeCode = size.toUpperCase();
  const colorCode = color.toUpperCase().slice(0, 3);

  return `${productCode}-${sizeCode}-${colorCode}`;
}