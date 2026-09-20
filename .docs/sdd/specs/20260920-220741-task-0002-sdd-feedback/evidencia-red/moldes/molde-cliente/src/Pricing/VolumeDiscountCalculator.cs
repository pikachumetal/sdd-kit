using System;
using System.Collections.Generic;
using System.Linq;

namespace Nortia.Pricing;

/// <summary>
/// Calcula el precio de escalón aplicable a una línea de pedido según la cantidad
/// de unidades pedidas, y el importe de rappel al cierre de un periodo de facturación.
/// </summary>
public class VolumeDiscountCalculator
{
    /// <summary>
    /// Devuelve el precio unitario del escalón que corresponde a la cantidad pedida.
    /// Los escalones están ordenados de menor a mayor umbral; se aplica el último
    /// escalón cuyo umbral no supere la cantidad.
    /// </summary>
    public decimal PrecioDeEscalon(int cantidad, IReadOnlyList<EscalonTarifa> escalones)
    {
        if (escalones == null || escalones.Count == 0)
            throw new ArgumentException("La tarifa debe tener al menos un escalón.", nameof(escalones));

        var escalonAplicable = escalones
            .Where(e => cantidad >= e.UmbralUnidades)
            .OrderByDescending(e => e.UmbralUnidades)
            .FirstOrDefault();

        return escalonAplicable?.PrecioUnitario
            ?? escalones.OrderBy(e => e.UmbralUnidades).First().PrecioUnitario;
    }

    /// <summary>
    /// Calcula el importe de rappel sobre el total facturado en un periodo,
    /// aplicando el porcentaje pactado con el mayorista.
    /// </summary>
    public decimal CalcularRappelDePeriodo(decimal totalFacturado, decimal porcentajeRappel)
    {
        var importe = totalFacturado * (porcentajeRappel / 100m);
        return RedondearBancario(importe);
    }

    /// <summary>
    /// Redondea un importe de descuento a dos decimales con el criterio de
    /// redondeo bancario (al par más cercano), para no acumular sesgo en cierres
    /// de periodo con muchas líneas.
    /// </summary>
    public decimal RedondearBancario(decimal importe) =>
        Math.Round(importe, 2, MidpointRounding.ToEven);
}

public record EscalonTarifa(int UmbralUnidades, decimal PrecioUnitario);
