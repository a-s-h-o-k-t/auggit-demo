import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from 'src/app/services/sales.service';

@Component({
  selector: 'app-sales-order-report',
  templateUrl: './sales-order-report.component.html',
  styleUrls: ['./sales-order-report.component.scss'],
})
export class SalesOrderReportComponent implements OnInit {
  salesOrderData: any[] = [];
  paginationIndex: number = 0;
  pageCount: number = 10;
  form!: FormGroup;
  constructor(public salesapi: SalesService, fb: FormBuilder) {
    this.form = fb.group({
      vendorName: ['showAll', Validators.required],
      endDate: [''],
      startDate: [''],
    });
  }

  onClickNext(): void {
    this.paginationIndex += 1;
  }

  onClickPrev(): void {
    this.paginationIndex -= 1;
  }

  onClickPaginationNo(i: number): void {
    this.paginationIndex = i;
  }

  ngOnInit(): void {
    this.loaddata();
  }

  loaddata() {
    this.salesapi.getPendingSOListSO().subscribe((res) => {
      console.log('SO Pending', res);
      if (res.length) {
        let newArr: any[] = [];
        let rowIndex = 0;
        let rowCount = 0;
        for (let data of res) {
          if (rowCount === this.pageCount) {
            rowCount = 0;
            rowIndex++;
          }
          if (!newArr[rowIndex]) {
            newArr[rowIndex] = [];
          }
          newArr[rowIndex].push(data);
          rowCount++;
        }
        this.salesOrderData = newArr;
        this.paginationIndex = 0;
      }
    });
  }
}
