const fs = require('fs');
const { getCanonicalProductGroup } = require('../domain/productClassifier');

// Cargar productos extraídos por el scraper si existe el archivo JSON
function loadScrapedProducts(productRepository, scrapedPath) {
  if (!fs.existsSync(scrapedPath)) return;

  try {
    const rawData = fs.readFileSync(scrapedPath, 'utf8');
    const scrapedItems = JSON.parse(rawData);
    const storeMap = { 'd1': 1, 'olimpica': 2, 'exito': 3 };

    const canonicalMap = new Map();

    scrapedItems.forEach((item) => {
      if (!item.name || !item.price) return;
      const storeId = storeMap[(item.store || '').toLowerCase()] || 1;
      const groupInfo = getCanonicalProductGroup(item.name, item.image_url);

      if (!canonicalMap.has(groupInfo.key)) {
        canonicalMap.set(groupInfo.key, {
          groupInfo,
          storePrices: new Map()
        });
      }

      const group = canonicalMap.get(groupInfo.key);
      // Mantener el mejor precio si hay múltiples presentaciones de la misma tienda en el grupo
      if (!group.storePrices.has(storeId) || item.price < group.storePrices.get(storeId).price) {
        group.storePrices.set(storeId, {
          store_id: storeId,
          price: item.price,
          previous_price: item.original_price || item.price,
          is_offer: item.is_offer || false,
          offer_description: item.offer_desc || ''
        });
      }
    });

    let addedCount = 0;
    canonicalMap.forEach((data) => {
      const groupInfo = data.groupInfo;
      const pricesList = Array.from(data.storePrices.values());

      // Verificar si se puede asociar con algún producto inicial de la app
      const existingProd = productRepository.findAll().find(p => p.name.toLowerCase().includes(groupInfo.key) || groupInfo.key.includes(p.name.toLowerCase()));

      if (existingProd) {
        pricesList.forEach(newPrice => {
          const idx = existingProd.prices.findIndex(pr => pr.store_id === newPrice.store_id);
          if (idx !== -1) existingProd.prices[idx] = newPrice;
          else existingProd.prices.push(newPrice);
        });
      } else {
        addedCount++;
        productRepository.prepend({
          id: 2000 + addedCount,
          name: groupInfo.name,
          description: groupInfo.description,
          category_id: groupInfo.category_id,
          unit: groupInfo.unit,
          image_url: groupInfo.image_url,
          prices: pricesList
        });
      }
    });

    console.log(`📦 [Scraper Data] Se agruparon ${scrapedItems.length} registros del scraper en ${canonicalMap.size} tarjetas comparativas canónicas.`);
  } catch (e) {
    console.warn('⚠️ Error al cargar productos del scraper:', e.message);
  }
}

module.exports = { loadScrapedProducts };
