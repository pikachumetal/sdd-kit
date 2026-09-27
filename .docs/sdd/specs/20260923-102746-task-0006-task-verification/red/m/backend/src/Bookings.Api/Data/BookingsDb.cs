using Microsoft.EntityFrameworkCore;

namespace Bookings.Api.Data;

public class BookingsDb(DbContextOptions<BookingsDb> options) : DbContext(options)
{
    public DbSet<Booking> Bookings => Set<Booking>();
}
