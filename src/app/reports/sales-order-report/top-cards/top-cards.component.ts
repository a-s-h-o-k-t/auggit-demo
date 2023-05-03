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
        icon: 'bi bi-wallet',
        title: changes['totalOrder'].currentValue,
        subtitle: 'Total SO list',
      },
      {
        bgcolor: 'danger',
        icon: 'bi bi-coin',
        title: changes['totalPending'].currentValue,
        subtitle: 'Total pending invoice ',
      },
      {
        bgcolor: 'warning',
        icon: 'bi bi-basket3',
        title: changes['confirmedStatus'].currentValue,
        subtitle: 'Total confirmed status',
      },
      {
        bgcolor: 'info',
        icon: 'bi bi-bag',
        title: changes['orderValue'].currentValue,
        subtitle: 'Total ordered value',
      },
    ];
  }

  ngOnInit(): void {}
}
