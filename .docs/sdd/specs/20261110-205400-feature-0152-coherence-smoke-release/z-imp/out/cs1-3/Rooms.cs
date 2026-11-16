using System.Globalization;

public record Booking(string Room, string Day, string Slot, string Status);

public static class Rooms
{
    public static readonly string[] All = ["Norte", "Sur"];

    public static readonly List<Booking> Bookings =
    [
        new("Norte", "lun", "10:00-12:00", "active"),
        new("Sur", "mar", "09:00-10:00", "cancelled"),
    ];

    public static double SlotHours(string slot)
    {
        var times = slot.Split('-').Select(ToHours).ToArray();
        return times[1] - times[0];
    }

    public static string Free(string slot) =>
        string.Join(", ", All.Where(room => !Bookings.Any(b => b.Room == room && b.Slot == slot && b.Status == "active")));

    public static string Hours(string room)
    {
        var hours = Bookings.Where(b => b.Room == room && b.Status == "active").Sum(b => SlotHours(b.Slot));
        return $"{room}: {hours.ToString(CultureInfo.InvariantCulture)} h";
    }

    private static double ToHours(string time)
    {
        var parts = time.Split(':');
        return int.Parse(parts[0]) + int.Parse(parts[1]) / 60.0;
    }
}
