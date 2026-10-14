module.exports = (reviewService) => ({
  listByProduct(req, res) {
    try {
      const productId = parseInt(req.params.productId);
      res.json({ reviews: reviewService.listByProduct(productId) });
    } catch (error) {
      res.status(500).json({ error: 'Error al consultar reseñas' });
    }
  },

  create(req, res) {
    try {
      const { product_id, rating, comment } = req.body;

      if (!product_id || !rating || !comment) {
        return res.status(400).json({ error: 'La calificación y el comentario son requeridos' });
      }

      const numericRating = parseInt(rating);
      if (numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5 estrellas' });
      }

      const newReview = reviewService.add({
        user_id: req.user.id,
        user_name: req.user.name,
        product_id,
        rating: numericRating,
        comment
      });

      res.status(201).json({
        message: 'Reseña publicada con éxito',
        review: newReview
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al publicar reseña' });
    }
  }
});
