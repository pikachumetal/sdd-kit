import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BookingListComponent } from './booking-list.component';

describe('BookingListComponent', () => {
  it('lists the bookings returned by the API', async () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const fixture = TestBed.createComponent(BookingListComponent);
    fixture.detectChanges();

    TestBed.inject(HttpTestingController).expectOne('/api/bookings').flush([{ id: 1, room: 'Sala 1', start: '09:00' }]);
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
  });
});
