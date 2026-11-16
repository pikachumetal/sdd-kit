using System.Globalization;

public static class Tests
{
    private static int failures;

    private static void Check(string name, string expected, string actual)
    {
        if (expected == actual) return;
        failures++;
        Console.WriteLine($"FALLA {name}: esperado «{expected}», obtenido «{actual}»");
    }

    public static int Run()
    {
        Check("libres excluye la sala reservada en la franja", "Sur", Rooms.Free("10:00-12:00"));
        Check("una franja de dos horas dura 2", "2", Rooms.SlotHours("10:00-12:00").ToString(CultureInfo.InvariantCulture));
        Check("las horas de una sala suman sus reservas activas", "Norte: 2 h", Rooms.Hours("Norte"));
        Check("una reserva cancelada no cuenta en las horas", "Sur: 0 h", Rooms.Hours("Sur"));
        return failures;
    }
}
