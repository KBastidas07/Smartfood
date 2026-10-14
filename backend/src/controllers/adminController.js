module.exports = (productService) => ({
  create(req, res) {
    try {
      const { name, description, category_id, unit, image_url, prices } = req.body;

      if (!name || !category_id) {
        return res.status(400).json({ error: 'El nombre y la categoría son obligatorios' });
      }

      const newProduct = productService.create({
        name,
        description,
        category_id,
        unit,
        image_url,
        prices: prices || [
          { store_id: 1, price: 5000, previous_price: 5000, is_offer: false, offer_description: '' }
        ]
      });

      res.status(201).json({
        message: 'Producto creado exitosamente por el administrador',
        product: newProduct
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar producto' });
    }
  },

  update(req, res) {
    try {
      const updated = productService.update(req.params.id, req.body);

      if (!updated) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json({
        message: 'Producto actualizado exitosamente',
        product: updated
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  },

  remove(req, res) {
    try {
      const deleted = productService.delete(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: 'Producto no encontrado o ya eliminado' });
      }

      res.json({ message: 'Producto eliminado del catálogo correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar producto' });
    }
  }
});
