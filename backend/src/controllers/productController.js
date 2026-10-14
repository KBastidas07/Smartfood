module.exports = (productService) => ({
  list(req, res) {
    try {
      res.json(productService.list(req.query));
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar productos' });
    }
  },

  offers(req, res) {
    try {
      res.json(productService.listOffers());
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener ofertas' });
    }
  },

  detail(req, res) {
    try {
      const detail = productService.getDetail(parseInt(req.params.id));
      if (!detail) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener detalle del producto' });
    }
  }
});
