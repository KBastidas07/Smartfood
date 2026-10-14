"""
SmartFoodPop - Advanced API Scraping Module (Popayán, Cauca)
Extracción directa de JSON desde APIs internas de VTEX (Sin Selenium, ultra rápido).
Funciona para Olímpica y D1.
"""

import sys
from datetime import datetime

from config import OUTPUT_FILE, VTEX_STORES
from sources.vtex import VtexSource
from writer import write_json

# Configuración de encoding para Windows
if sys.platform == 'win32':
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            getattr(sys.stdout, 'reconfigure')(encoding='utf-8')
    except Exception:
        pass


def build_sources():
    return [VtexSource(**store) for store in VTEX_STORES]


def run_scrapers(sources=None, output_file=OUTPUT_FILE):
    print("=" * 70)
    print(f"🚀 SmartFoodPop API Scanner - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)

    combined = []
    for source in (sources if sources is not None else build_sources()):
        combined.extend(source.fetch())

    write_json(combined, output_file)

    print("=" * 70)
    print(f"✅ ¡ÉXITO TOTAL! Se guardaron {len(combined)} registros limpios en:")
    print(f"   {output_file}")
    print("=" * 70)

    return combined


if __name__ == "__main__":
    run_scrapers()
