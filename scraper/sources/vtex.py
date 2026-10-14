"""Fuente para tiendas que usan la API Intelligent Search de VTEX (Olímpica, D1, ...)."""

from datetime import datetime

import requests

from .base import StoreSource

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'es-CO,es;q=0.9'
}


def clean_price(price_float):
    """Convierte el precio float de la API a entero (ej: 27990)."""
    try:
        return int(float(price_float))
    except (ValueError, TypeError):
        return 0


class VtexSource(StoreSource):
    def __init__(self, store_name, account_id, query="*", page=1, count=20):
        self.store_name = store_name
        self.account_id = account_id
        self.query = query
        self.page = page
        self.count = count

    def fetch(self):
        """Consulta la API VTEX; el endpoint es el mismo para todas las tiendas, solo cambia el subdominio."""
        print(f"🌐 [API {self.store_name.capitalize()}] Consultando catálogo (query: '{self.query}')...")
        products = []

        url = f"https://{self.account_id}.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/"
        params = {
            "query": self.query,  # Término de búsqueda ("*", "leche", "arroz", etc.)
            "map": "ft",          # ft = fulltext search
            "page": self.page,
            "count": self.count   # Máximo recomendado: 50 por página
        }

        try:
            response = requests.get(url, params=params, headers=HEADERS, timeout=15)
            response.raise_for_status()
            data = response.json()

            total_found = data.get("recordsFiltered", 0)
            print(f"✅ Éxito: Se encontraron {total_found} productos en total. Procesando los primeros {len(data.get('products', []))}...")

            for item in data.get("products", []):
                products.append(self._normalize(item))

        except requests.exceptions.RequestException as e:
            print(f"⚠️ Error conectando con API de {self.store_name}: {e}")

        return products

    def _normalize(self, item):
        name = item.get("productName", "Producto sin nombre")

        # Estructura VTEX: products -> items -> sellers -> commertialOffer -> Price
        seller_info = item.get("items", [{}])[0].get("sellers", [{}])[0].get("commertialOffer", {})
        price = seller_info.get("Price", 0)
        list_price = seller_info.get("ListPrice", 0)

        is_offer = price < list_price if list_price > 0 else False

        return {
            "name": name,
            "price": clean_price(price),
            "original_price": clean_price(list_price),
            "unit": "Unidad",
            "store": self.store_name,
            "is_offer": is_offer,
            "offer_desc": "Oferta VTEX" if is_offer else "",
            "scraped_at": datetime.now().isoformat(),
            "source_url": f"https://www.{self.store_name}.com.co/{item.get('linkText', '')}"
        }
