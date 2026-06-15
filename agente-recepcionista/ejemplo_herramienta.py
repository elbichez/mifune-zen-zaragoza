"""
title: Herramientas Mifune (ejemplo)
description: Ejemplo de implementación de las herramientas del agente
              recepcionista de Mifune (v2, con resolución de fechas en
              lenguaje natural). Las otras 4 herramientas
              (buscar_cliente, crear_reserva, consultar_reservas_cliente,
              cancelar_reserva) siguen la misma estructura y manejo de
              errores, pero no se incluyen en este repo público.
"""

import os
from datetime import datetime, timedelta
import psycopg2


def resolver_fecha(fecha: str) -> str:
    """
    Convierte expresiones temporales en lenguaje natural ("hoy", "mañana",
    "este viernes"...) a fecha ISO YYYY-MM-DD, usando el reloj del sistema.

    El LLM nunca calcula fechas por su cuenta: siempre pasa el texto
    literal del usuario, y esta función hace el cálculo real.

    Si la expresión no se reconoce, devuelve "ERROR_FECHA_NO_SOPORTADA"
    en lugar de lanzar una excepción, para que las herramientas puedan
    devolver un mensaje limpio al LLM sin llegar a consultar la base de
    datos con un valor inválido.
    """
    hoy = datetime.now().date()
    texto = fecha.strip().lower()

    if texto in ["hoy", "esta noche", "esta tarde"]:
        return hoy.isoformat()

    if texto == "mañana":
        return (hoy + timedelta(days=1)).isoformat()

    if texto == "pasado mañana":
        return (hoy + timedelta(days=2)).isoformat()

    dias_semana = {
        "lunes": 0, "martes": 1, "miércoles": 2, "miercoles": 2,
        "jueves": 3, "viernes": 4, "sábado": 5, "sabado": 5, "domingo": 6,
    }

    for dia, numero in dias_semana.items():
        if dia in texto:
            delta = (numero - hoy.weekday()) % 7
            # delta == 0 significa que hoy es ese día de la semana.
            # Se interpreta como "hoy" (margen suficiente para cenas).
            return (hoy + timedelta(days=delta)).isoformat()

    try:
        fecha_parsed = datetime.strptime(texto, "%Y-%m-%d").date()
        return fecha_parsed.isoformat()
    except ValueError:
        pass

    return "ERROR_FECHA_NO_SOPORTADA"


class Tools:
    def __init__(self):
        pass

    def consultar_disponibilidad(self, fecha: str, turno: str) -> str:
        """
        Consulta cuántas plazas quedan libres en un turno concreto del
        restaurante Mifune.

        :param fecha: Expresión temporal en lenguaje natural (ej: 'hoy',
                       'mañana', 'este viernes') o fecha en formato
                       YYYY-MM-DD. Pasar siempre el texto literal del
                       usuario; esta función se encarga de interpretarlo.
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
            fecha_real = resolver_fecha(fecha)

            if fecha_real == "ERROR_FECHA_NO_SOPORTADA":
                return (
                    f"No puedo procesar la fecha '{fecha}'. Pide al "
                    f"usuario, de forma educada, que indique un día "
                    f"concreto o un día de la semana cercano."
                )

            conexion = psycopg2.connect(**DB_CONFIG)
            cursor = conexion.cursor()

            cursor.execute(
                """
                SELECT COALESCE(SUM(personas), 0)
                FROM reservas
                WHERE fecha = %s AND turno = %s AND estado != 'cancelada'
                """,
                (fecha_real, turno),
            )

            ocupadas = cursor.fetchone()[0]
            libres = AFORO_TOTAL - ocupadas

            cursor.close()
            conexion.close()

            if libres <= 0:
                return (
                    f"El turno de {turno} del {fecha_real} está completo "
                    f"(0 plazas libres)."
                )
            else:
                return (
                    f"Quedan {libres} plazas libres en el turno de "
                    f"{turno} del {fecha_real}."
                )

        except Exception as e:
            return f"Error al consultar la base de datos: {e}"
