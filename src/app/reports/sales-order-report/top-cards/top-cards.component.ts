import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-top-cards',
  templateUrl: './top-cards.component.html',
  styleUrls: ['./top-cards.component.scss'],
})
export class TopCardsComponent implements OnInit, OnChanges {
  @Input('total-order') totalOrder!: number;
  @Input('total-pending') totalPending!: number;
  @Input('confirmed-status') confirmedStatus!: number;
  @Input('order-value') orderValue!: number;
  topcards: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.topcards = [
      {
        bgcolor: 'success',
        icon: 'bi bi-card-checklist',
        title: this.totalOrder,
        subtitle: 'Total SO list',
      },
      {
        bgcolor: 'danger',
        icon: 'bi bi-bag',
        title: this.totalPending,
        subtitle: 'Total pending invoice ',
      },
      {
        bgcolor: 'warning',
        icon: 'bi bi-basket3',
        title: this.confirmedStatus,
        subtitle: 'Total confirmed status',
      },
      {
        bgcolor: 'info',
        icon: 'bi bi-cash-coin',
        title: this.orderValue,
        subtitle: 'Total ordered value',
      },
    ];
  }

  ngOnInit(): void {}
}
