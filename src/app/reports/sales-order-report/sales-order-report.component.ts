import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SalesService } from 'src/app/services/sales.service';

export interface VendorDropDown {
  vendorcode: string;
  vendorname: string;
}

@Component({
  selector: 'app-sales-order-report',
  templateUrl: './sales-order-report.component.html',
  styleUrls: ['./sales-order-report.component.scss'],
})
export class SalesOrderReportComponent implements OnInit {
  salesOrderData!: any[];
  filteredSalesOrderData: any[] = [];
  vendorDropDownData: VendorDropDown[] = [];
  paginationIndex: number = 0;
  pageCount: number = 10;
  form!: FormGroup;

  constructor(private salesapi: SalesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      vendorcode: [''],
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
    this.form.valueChanges.subscribe((values) => {
      this.getFilterData(values, this.salesOrderData);
    });
  }

  getFilterData(formValues: any, serverData: any): void {
    let updatedValue: any[] = serverData;
    if (formValues.vendorcode) {
      updatedValue = updatedValue.filter(
        (itm) => itm.vendorcode == formValues.vendorcode
      );
    }
    if (formValues.startDate && formValues.endDate) {
    }
    let newArr: any[] = [];
    let rowIndex = 0;
    let rowCount = 0;

    for (let data of updatedValue) {
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
    this.filteredSalesOrderData = newArr;
  }

  loadData() {
    this.salesapi.getPendingSOListAll().subscribe((res: any[]) => {
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
        this.salesOrderData = res;
        this.getFilterData(this.form.value, res);
      }
    });
  }
}
