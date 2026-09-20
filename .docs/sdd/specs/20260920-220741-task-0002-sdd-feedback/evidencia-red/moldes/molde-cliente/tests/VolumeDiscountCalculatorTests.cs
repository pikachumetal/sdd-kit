using System.Collections.Generic;
using Nortia.Pricing;
using Xunit;

namespace Nortia.Pricing.Tests;

public class VolumeDiscountCalculatorTests
{
    private readonly VolumeDiscountCalculator _calculator = new();

    [Fact]
    public void CalculaPrecioDeEscalon_CuandoSuperaElUmbral()
    {
        var escalones = new List<EscalonTarifa>
        {
            new(0, 4.50m),
            new(500, 3.90m),
            new(1000, 3.40m),
        };

        var precio = _calculator.PrecioDeEscalon(750, escalones);

        Assert.Equal(3.90m, precio);
    }

    [Fact]
    public void UsaElPrecioBase_CuandoNoSuperaNingunUmbral()
    {
        var escalones = new List<EscalonTarifa> { new(0, 4.50m), new(500, 3.90m) };

        var precio = _calculator.PrecioDeEscalon(200, escalones);

        Assert.Equal(4.50m, precio);
    }

    [Fact]
    public void RedondeaImporteFinal_ConCriterioBancario()
    {
        var rappel = _calculator.CalcularRappelDePeriodo(10125.00m, 2.5m);

        Assert.Equal(253.12m, rappel);
    }
}
