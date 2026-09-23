namespace Bookings.Api.Data;

public class Booking
{
    public int Id { get; set; }
    public string Room { get; set; } = "";
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string Owner { get; set; } = "";
}
