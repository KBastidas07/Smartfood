function getProductImageByName(name, providedImageUrl) {
  if (providedImageUrl && /^https?:\/\//i.test(providedImageUrl)) {
    return providedImageUrl;
  }

  const nameLower = (name || '').toLowerCase();

  if (nameLower.includes('arroz')) {
    return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80';
  }
  if (nameLower.includes('leche')) {
    return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80';
  }
  if (nameLower.includes('huevo')) {
    return 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80';
  }
  if (nameLower.includes('aceite') || nameLower.includes('aderezo') || nameLower.includes('sal') || nameLower.includes('condimento')) {
    return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80';
  }
  if (nameLower.includes('detergente') || nameLower.includes('jabón') || nameLower.includes('suavizante') || nameLower.includes('limpieza')) {
    return 'https://images.unsplash.com/photo-1585832770485-e68a5fc88280?auto=format&fit=crop&w=600&q=80';
  }
  if (nameLower.includes('frijol') || nameLower.includes('lenteja') || nameLower.includes('garbanzo') || nameLower.includes('grano')) {
    return 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=80';
  }

  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';
}

module.exports = { getProductImageByName };
