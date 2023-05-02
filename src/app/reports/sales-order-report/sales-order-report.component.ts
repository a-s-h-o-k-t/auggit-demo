import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesService } from 'src/app/services/sales.service';

interface VendorDropDown {
  vendorcode: string;
  vendorname: string;
}
@Component({
  selector: 'app-sales-order-report',
  templateUrl: './sales-order-report.component.html',
  styleUrls: ['./sales-order-report.component.scss'],
})
export class SalesOrderReportComponent implements OnInit {
  salesOrderData: any[] = [];
  vendorDropDownData: VendorDropDown[] = [];
  paginationIndex: number = 0;
  pageCount: number = 10;
  form!: FormGroup;
  constructor(private salesapi: SalesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      vendorName: [''],
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
    this.loadData();
    this.form?.get('vendorName')?.valueChanges.subscribe((selectedValue) => {
      console.log('vendor changed');
      console.log(selectedValue);
    });
  }

  loadData() {
    this.salesapi.getPendingSOListSO().subscribe((res) => {
      console.log('SO Pending', res);
      if (res.length) {
        const newMap = new Map();
        res
          .map((item: any) => {
            return {
              vendorname: item.vendorname,
              vendorcode: item.vendorcode,
            };
          })
          .forEach((item: VendorDropDown) => newMap.set(item.vendorcode, item));
        this.vendorDropDownData = [...newMap.values()];
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
