using System.Net.Http.Json;
using Bookings.Api.Data;

namespace Bookings.Tests;

public class BookingStatusTests(SqlServerApiFactory factory) : IClassFixture<SqlServerApiFactory>
{
    [Fact]
    public async Task Existing_bookings_are_confirmed_after_the_migration()
    {
        await factory.SeedRawAsync("INSERT INTO Bookings (Room, Start, [End], Owner) VALUES ('Sala 1', '2026-09-01T09:00', '2026-09-01T10:00', 'ana')");

        var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

        Assert.All(bookings!, b => Assert.Equal(BookingStatus.Confirmed, b.Status));
    }

    [Fact]
    public async Task New_bookings_start_pending()
    {
        Assert.Equal(BookingStatus.Pending, new Booking().Status);
    }

    [Fact]
    public async Task Filters_by_status()
    {
        await factory.SeedAsync(
            new Booking { Room = "Sala 1", Status = BookingStatus.Cancelled },
            new Booking { Room = "Sala 2", Status = BookingStatus.Confirmed });

        var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings?status=Cancelled");

        Assert.Equal(["Sala 1"], bookings!.Select(b => b.Room));
    }
}
