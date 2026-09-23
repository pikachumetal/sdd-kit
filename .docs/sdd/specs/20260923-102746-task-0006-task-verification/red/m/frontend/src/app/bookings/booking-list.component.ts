import { Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Booking } from './booking';

@Component({
  selector: 'app-booking-list',
  template: `
    <ul class="booking-list">
      @for (booking of bookings.value() ?? []; track booking.id) {
        <li>{{ booking.room }} · {{ booking.start }}</li>
      }
    </ul>
  `,
  styleUrl: './booking-list.component.css',
})
export class BookingListComponent {
  readonly bookings = httpResource<Booking[]>(() => '/api/bookings');
}
