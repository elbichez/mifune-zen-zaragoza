"""
title: Herramientas Mifune (ejemplo)
description: Ejemplo de implementación de una herramienta del agente
              recepcionista de Mifune. Las otras 4 herramientas
              (buscar_cliente, crear_reserva, consultar_reservas_cliente,
              cancelar_reserva) siguen la misma estructura y manejo de
              errores, pero no se incluyen en este repo público.
"""

import os
import psycopg2


class Tools:
    def __init__(self):
        pass

    def consultar_disponibilidad(self, fecha: str, turno: str) -> str:
        """
        Consulta cuántas plazas quedan libres en un turno concreto del
        restaurante Mifune.

        :param fecha: Fecha en formato YYYY-MM-DD, por ejemplo 2026-06-20
        :param turno: Turno de cena, debe ser '20:30' o '22:30'
        :return: Texto indicando cuántas plazas quedan libres
        """
        AFORO_TOTAL = 8

        # La contraseña se lee de una variable de entorno, nunca se
        # escribe en el código. Ver .env.example para configurarla.
        DB_CONFIG = {
            "host": "host.docker.internal",
            "port": 5432,
            "dbname": "mi_base_datos",
            "user": "mi_usuario",
            "password": os.environ.get("MIFUNE_DB_PASSWORD"),
        }

        try:
            conexion = psycopg2.connect(**DB_CONFIG)
            cursor = conexion.cursor()

            cursor.execute(
                """
                SELECT COALESCE(SUM(personas), 0)
                FROM reservas
                WHERE fecha = %s AND turno = %s AND estado != 'cancelada'
                """,
                (fecha, turno),
            )

            ocupadas = cursor.fetchone()[0]
            libres = AFORO_TOTAL - ocupadas

            cursor.close()
            conexion.close()

            if libres <= 0:
                return (
                    f"El turno de {turno} del {fecha} está completo "
                    f"(0 plazas libres)."
                )
            else:
                return (
                    f"Quedan {libres} plazas libres en el turno de "
                    f"{turno} del {fecha}."
                )

        except Exception as e:
            return f"Error al consultar la base de datos: {e}"
