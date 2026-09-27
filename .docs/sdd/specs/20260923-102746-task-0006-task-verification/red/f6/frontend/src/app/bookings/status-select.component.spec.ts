import { TestBed } from '@angular/core/testing';
import { StatusSelectComponent } from './status-select.component';

describe('StatusSelectComponent', () => {
  it('offers «Todos» and the three states in Spanish', () => {
    const fixture = TestBed.createComponent(StatusSelectComponent);
    fixture.detectChanges();

    const labels = [...fixture.nativeElement.querySelectorAll('option')].map((o: HTMLOptionElement) => o.textContent?.trim());

    expect(labels).toEqual(['Todos', 'Confirmada', 'Pendiente', 'Cancelada']);
  });

  it('is disabled while the list is loading', () => {
    const fixture = TestBed.createComponent(StatusSelectComponent);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('select').disabled).toBe(true);
  });
});
