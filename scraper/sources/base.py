"""Contrato común para cualquier fuente de datos de tiendas."""

from abc import ABC, abstractmethod


class StoreSource(ABC):
    @abstractmethod
    def fetch(self) -> list:
        """Devuelve una lista de productos normalizados (dict)."""
