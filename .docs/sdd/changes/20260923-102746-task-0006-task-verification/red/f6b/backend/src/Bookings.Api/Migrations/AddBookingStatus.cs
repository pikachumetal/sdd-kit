using Microsoft.EntityFrameworkCore.Migrations;

namespace Bookings.Api.Migrations;

public partial class AddBookingStatus : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder) =>
        migrationBuilder.AddColumn<string>(
            name: "Status",
            table: "Bookings",
            nullable: false,
            defaultValue: "Confirmed");

    protected override void Down(MigrationBuilder migrationBuilder) =>
        migrationBuilder.DropColumn(name: "Status", table: "Bookings");
}
