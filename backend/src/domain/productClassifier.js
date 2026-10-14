const { getProductImageByName } = require('./imageResolver');

// Clasifica y agrupa productos raspados en tarjetas canónicas
function getCanonicalProductGroup(name, providedImageUrl) {
  const nameLower = (name || '').toLowerCase();

  if (nameLower.includes('leche')) {
    if (nameLower.includes('condensada')) {
      return {
        key: 'leche-condensada',
        name: 'Leche Condensada (300g)',
        category_id: 2,
        unit: 'Doypack / Lata 300g',
        image_url: getProductImageByName(name, providedImageUrl),
        description: 'Leche condensada azucarada ideal para postres y repostería.'
      };
    }
    if (nameLower.includes('polvo')) {
      return {
        key: 'leche-en-polvo',
        name: 'Leche en Polvo Entera',
        category_id: 2,
        unit: 'Bolsa / Tarro 350g - 1000g',
        image_url: getProductImageByName(name, providedImageUrl),
        description: 'Leche entera en polvo deshidratada de alta solubilidad.'
      };
    }
    if (nameLower.includes('x6') || nameLower.includes('6 und') || nameLower.includes('6x') || nameLower.includes('6un')) {
      if (nameLower.includes('deslactosada') || nameLower.includes('deslac')) {
        return {
          key: 'leche-sixpack-deslactosada',
          name: 'Sixpack Leche Deslactosada UHT (6 x 1000ml - 1100ml)',
          category_id: 2,
          unit: 'Paquete 6 Unidades',
          image_url: getProductImageByName(name, providedImageUrl),
          description: 'Pack de 6 bolsas o cajas de leche deslactosada UHT de fácil digestión.'
        };
      }
      return {
        key: 'leche-sixpack-entera',
        name: 'Sixpack Leche Entera UHT (6 x 1000ml - 1100ml)',
        category_id: 2,
        unit: 'Paquete 6 Unidades',
        image_url: getProductImageByName(name, providedImageUrl),
        description: 'Pack de 6 bolsas o cajas de leche entera UHT pasteurizada.'
      };
    }
    if (nameLower.includes('deslactosada') || nameLower.includes('deslac')) {
      return {
        key: 'leche-deslactosada-individual',
        name: 'Leche Deslactosada UHT (900ml - 1.1L)',
        category_id: 2,
        unit: 'Bolsa / Tetrapak 900ml - 1.1L',
        image_url: getProductImageByName(name, providedImageUrl),
        description: 'Leche deslactosada ultra pasteurizada de fácil digestión.'
      };
    }
    if (nameLower.includes('entera') || nameLower.includes('cremosa') || nameLower.includes('equilibrio') || nameLower.includes('original')) {
      return {
        key: 'leche-entera-individual',
        name: 'Leche Entera UHT (900ml - 1.1L)',
        category_id: 2,
        unit: 'Bolsa / Tetrapak 900ml - 1.1L',
        image_url: getProductImageByName(name, providedImageUrl),
        description: 'Leche entera pasteurizada rica en calcio y proteína natural.'
      };
    }
  }

  // Título limpio genérico
  const cleanTitle = name
    .replace(/\s*(uht|tetrapak|doypack|bolsa|x\d+\s*unds?|\d+\s*ml|\d+\s*grs?)\s*/gi, ' ')
    .trim();

  return {
    key: cleanTitle.toLowerCase(),
    name: cleanTitle,
    category_id: 1,
    unit: 'Unidad',
    image_url: getProductImageByName(name, providedImageUrl),
    description: `Producto obtenido en vivo desde Popayán.`
  };
}

module.exports = { getCanonicalProductGroup };
