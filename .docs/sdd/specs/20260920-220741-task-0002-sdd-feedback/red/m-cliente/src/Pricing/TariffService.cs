using System.Threading.Tasks;

namespace Nortia.Pricing;

/// <summary>
/// Puerta de entrada a la tarifa vigente de un mayorista. El cálculo de escalado
/// y rappel nunca consulta el almacenamiento de tarifas directamente: siempre pasa
/// por esta interfaz.
/// </summary>
public interface ITariffResolver
{
    Task<Tarifa> ResolverTarifaVigente(int mayoristaId);
}

/// <summary>
/// Resuelve la tarifa vigente de un mayorista: la tarifa especial negociada si
/// existe, o la tarifa estándar de su categoría en su defecto.
/// </summary>
public class TariffService : ITariffResolver
{
    private readonly ITarifaRepository _tarifaRepository;

    public TariffService(ITarifaRepository tarifaRepository)
    {
        _tarifaRepository = tarifaRepository;
    }

    public async Task<Tarifa> ResolverTarifaVigente(int mayoristaId)
    {
        var tarifaEspecial = await _tarifaRepository.BuscarTarifaEspecial(mayoristaId);
        if (tarifaEspecial != null)
            return tarifaEspecial;

        var categoria = await _tarifaRepository.ObtenerCategoriaDeMayorista(mayoristaId);
        return await _tarifaRepository.ObtenerTarifaEstandar(categoria);
    }
}

public interface ITarifaRepository
{
    Task<Tarifa?> BuscarTarifaEspecial(int mayoristaId);
    Task<string> ObtenerCategoriaDeMayorista(int mayoristaId);
    Task<Tarifa> ObtenerTarifaEstandar(string categoria);
}

public record Tarifa(int Id, string Categoria, decimal PorcentajeRappel);
