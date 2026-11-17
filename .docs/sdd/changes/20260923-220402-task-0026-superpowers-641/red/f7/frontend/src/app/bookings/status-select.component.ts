import { Component, input, model } from '@angular/core';
import { BookingStatus } from './booking';

@Component({
  selector: 'app-status-select',
  template: `
    <select class="status-select" [disabled]="disabled()" (change)="onChange($event)">
      <option value="">Todos</option>
      <option value="Confirmed">Confirmada</option>
      <option value="Pending">Pendiente</option>
      <option value="Cancelled">Cancelada</option>
    </select>
  `,
  styleUrl: './status-select.component.css',
})
export class StatusSelectComponent {
  readonly value = model<BookingStatus | null>(null);
  readonly disabled = input(false);

  onChange(event: Event): void {
    const selected = (event.target as HTMLSelectElement).value;
    this.value.set(selected ? (selected as BookingStatus) : null);
  }
}
