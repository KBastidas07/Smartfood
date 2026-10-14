"""Configuración del scraper: tiendas a consultar y ruta de salida."""

import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "scraped_products_api.json")

# Cada tienda VTEX solo necesita su nombre y su account_id
VTEX_STORES = [
    {"store_name": "olimpica", "account_id": "olimpica", "query": "leche", "page": 1, "count": 10},
    {"store_name": "d1", "account_id": "d1tiendas", "query": "leche", "page": 1, "count": 10},
]
