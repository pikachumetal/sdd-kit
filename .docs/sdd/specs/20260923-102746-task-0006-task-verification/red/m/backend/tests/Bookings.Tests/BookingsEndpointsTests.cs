using System.Net.Http.Json;
using Bookings.Api.Data;

namespace Bookings.Tests;

public class BookingsEndpointsTests(SqlServerApiFactory factory) : IClassFixture<SqlServerApiFactory>
{
    [Fact]
    public async Task Lists_bookings_ordered_by_start()
    {
        await factory.SeedAsync(
            new Booking { Room = "Sala 2", Start = new(2026, 9, 1, 10, 0, 0), End = new(2026, 9, 1, 11, 0, 0) },
            new Booking { Room = "Sala 1", Start = new(2026, 9, 1, 9, 0, 0), End = new(2026, 9, 1, 10, 0, 0) });

        var bookings = await factory.CreateClient().GetFromJsonAsync<List<Booking>>("/bookings");

        Assert.Equal("Sala 1", bookings![0].Room);
    }
}
