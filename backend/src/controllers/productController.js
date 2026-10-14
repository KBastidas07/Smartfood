const { QueryValidationError, parsePositiveInt } = require('../domain/queryHelpers');

const INVALID_ID_MESSAGE = 'El identificador del producto debe ser un entero positivo';

/*
 * RF03, RF05, RF07: capa HTTP de productos.
 * SRP: traduce petición/respuesta (validación del id, códigos 400/404/500); la lógica está en los servicios.
 * ISP: recibe tres servicios acotados (consulta, detalle y comparación); ya no ve create/update/delete.
 * DIP: depende de los servicios inyectados desde app.js, no de repositorios ni de datos.
 */
module.exports = (productService, productDetailService, comparisonService) => ({
  compare(req, res) {
    try {
      res.json(comparisonService.compare(req.query));
    } catch (error) {
      if (error instanceof QueryValidationError) return res.status(error.status).json({ error: error.message });
      res.status(500).json({ error: 'Error al comparar productos' });
    }
  },

  list(req, res) {
    try {
      res.json(productService.list(req.query));
    } catch (error) {
      if (error instanceof QueryValidationError) return res.status(error.status).json({ error: error.message });
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
      const productId = parsePositiveInt(req.params.id);
      if (productId === null) {
        return res.status(400).json({ error: INVALID_ID_MESSAGE });
      }
      const detail = productDetailService.getDetail(productId);
      if (!detail) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json(detail);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener detalle del producto' });
    }
  }
});
