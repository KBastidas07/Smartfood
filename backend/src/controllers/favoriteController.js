module.exports = (favoriteService) => ({
  list(req, res) {
    try {
      res.json({ favorites: favoriteService.listProductsForUser(req.user.id) });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener favoritos' });
    }
  },

  toggle(req, res) {
    try {
      const { product_id } = req.body;
      if (!product_id) {
        return res.status(400).json({ error: 'ID de producto no proporcionado' });
      }

      const result = favoriteService.toggle(req.user.id, product_id);
      res.json({
        message: result.isFavorite ? 'Producto guardado en favoritos' : 'Producto removido de favoritos',
        isFavorite: result.isFavorite
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar favoritos' });
    }
  }
});
