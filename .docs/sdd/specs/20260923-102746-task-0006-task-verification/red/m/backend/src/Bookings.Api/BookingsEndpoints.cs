using Bookings.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Bookings.Api;

public static class BookingsEndpoints
{
    public static void MapBookings(this WebApplication app)
    {
        app.MapGet("/bookings", async (BookingsDb db, int page = 1) =>
            await db.Bookings
                .OrderBy(b => b.Start)
                .Skip((page - 1) * 20)
                .Take(20)
                .ToListAsync());
    }
}
