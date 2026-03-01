import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatSelectDTO } from '../../common/model/api.model';

@Component({
  selector: 'app-seat-layout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-layout.component.html',
  styleUrl: './seat-layout.component.scss'
})
export class SeatLayoutComponent implements OnInit {
  @Input() seats: SeatSelectDTO[] = [];
  @Output() selectionChange = new EventEmitter<SeatSelectDTO[]>();

  rows: string[] = [];
  seatsByRow: { [key: string]: SeatSelectDTO[] } = {};
  selectedSeats: Set<string> = new Set();

  ngOnInit(): void {
    this.organizeSeats();
  }

  private organizeSeats(): void {
    const rowSet = new Set<string>();
    this.seats.forEach(seat => {
      rowSet.add(seat.row);
      if (!this.seatsByRow[seat.row]) {
        this.seatsByRow[seat.row] = [];
      }
      this.seatsByRow[seat.row].push(seat);
    });
    
    this.rows = Array.from(rowSet).sort();
    this.rows.forEach(row => {
      this.seatsByRow[row].sort((a, b) => parseInt(a.seatNumber.substring(1)) - parseInt(b.seatNumber.substring(1)));
    });
  }

  toggleSeat(seat: SeatSelectDTO): void {
    if (seat.status !== 1) return; // Only available seats

    if (this.selectedSeats.has(seat.id)) {
      this.selectedSeats.delete(seat.id);
    } else {
      this.selectedSeats.add(seat.id);
    }

    const selectedList = this.seats.filter(s => this.selectedSeats.has(s.id));
    this.selectionChange.emit(selectedList);
  }

  getSeatClass(seat: SeatSelectDTO): string {
    if (seat.status !== 1) return 'seat--occupied';
    if (this.selectedSeats.has(seat.id)) return 'seat--selected';
    if (seat.seatType === 2) return 'seat--premium'; // Assuming 2 is Premium
    return 'seat--available';
  }
}
