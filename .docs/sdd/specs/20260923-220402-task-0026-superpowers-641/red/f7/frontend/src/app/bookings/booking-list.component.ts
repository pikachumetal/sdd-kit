import { Component, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { Booking, BookingStatus } from './booking';
import { StatusSelectComponent } from './status-select.component';

@Component({
  selector: 'app-booking-list',
  imports: [StatusSelectComponent],
  template: `
    <app-status-select [(value)]="status" [disabled]="bookings.isLoading()" />
    <ul class="booking-list">
      @for (booking of bookings.value() ?? []; track booking.id) {
        <li>{{ booking.room }} · {{ booking.start }}</li>
      }
    </ul>
  `,
  styleUrl: './booking-list.component.css',
})
export class BookingListComponent {
  readonly status = signal<BookingStatus | null>(null);
  readonly bookings = httpResource<Booking[]>(() => {
    const status = this.status();
    return status ? `/api/bookings?status=${status}` : '/api/bookings';
  });
}
