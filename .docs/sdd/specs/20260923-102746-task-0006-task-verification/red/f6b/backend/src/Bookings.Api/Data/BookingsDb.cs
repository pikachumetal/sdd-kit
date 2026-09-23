using Microsoft.EntityFrameworkCore;

namespace Bookings.Api.Data;

public class BookingsDb(DbContextOptions<BookingsDb> options) : DbContext(options)
{
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder) =>
        modelBuilder.Entity<Booking>().Property(b => b.Status).HasConversion<string>();
}
