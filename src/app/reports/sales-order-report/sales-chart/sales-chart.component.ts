import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VendorDropDown } from '../sales-order-report.component';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
})
export class SalesChartComponent implements OnInit, OnChanges {
  form!: FormGroup;
  @Input('vendor-filter') vendorDropDownData: VendorDropDown[] = [];
  @Input('sales-orderdata') salesOrderData: any[] = [];
  public chartOptions: any;
  filteredData!: any[];
  orderValue: number = 0;
  confirmedStatus: number = 0;
  totalPending: number = 0;
  totalOrder: number = 0;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      vendorcode: [''],
    });
  }

  ngOnInit(): void {
    console.log(this.salesOrderData, '--------------sales order data');
    this.form.valueChanges.subscribe((values) => {
      this.getFilterData(this.salesOrderData, {}, values.vendorcode);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.salesOrderData && this.vendorDropDownData) {
      console.log(this.salesOrderData, 'sales order data');
    }
    this.getFilterData(
      this.salesOrderData,
      {},
      this.vendorDropDownData[0].vendorcode
    );
    console.log(this.vendorDropDownData, 'drop down data');
  }

  getFilterData(serverData: any, formValues?: any, vendorData?: string): void {
    let updatedValue: any[] = serverData;
    if (this.form.value.vendorcode === '') {
      this.form.value.vendorcode = vendorData;
    }
    if (vendorData) {
      updatedValue = updatedValue.filter((itm) => itm.vendorcode == vendorData);
      console.log(updatedValue, 'updated value');
    }
    this.filteredData = updatedValue;

    let orderSeries: any = this.filteredData.map((item: any) => {
      return { name: item.vendorname, data: [Number(item.ordered)] };
    });

    let orderValueTotal = this.filteredData.map((item: any) => {
      return Number(item.orderedvalue);
    });

    let confirmedCount = this.filteredData.map((item: any) => {
      return Number(item.received);
    });

    this.totalOrder = this.filteredData.length;
    this.totalPending = this.filteredData.length;
    this.orderValue = orderValueTotal.reduce(
      (a: any, b: any) => Math.round(a + b),
      0
    );
    this.confirmedStatus = confirmedCount.reduce((a: any, b: any) => a + b, 0);
    // this.chartOptions = {
    //   series: orderSeries,
    //   chart: {
    //     height: 350,
    //     type: 'area',
    //     zoom: {
    //       enabled: true,
    //     },
    //   },
    //   dataLabels: {
    //     enabled: false,
    //   },
    //   stroke: {
    //     curve: 'smooth',
    //   },
    //   xaxis: {
    //     type: 'datetime',
    //     categories: [
    //       '2018-09-19T00:00:00.000Z',
    //       '2018-09-19T01:30:00.000Z',
    //       '2018-09-19T02:30:00.000Z',
    //       '2018-09-19T03:30:00.000Z',
    //       '2018-09-19T04:30:00.000Z',
    //       '2018-09-19T05:30:00.000Z',
    //       '2023-04-21T07:59:12.000Z',
    //     ],
    //   },
    //   tooltip: {
    //     x: {
    //       format: 'dd/MM/yy HH:mm',
    //     },
    //   },
    // };
  }

  // getProductSaleReport(data: any): void {
  //   let orderSeries: any = data.map((item: any) => {
  //     return { name: item.vendorname, data: [Number(item.ordered)] };
  //   });
  //   let orderValueTotal = data.map((item: any) => {
  //     return Number(item.orderedvalue);
  //   });
  //   let confirmedCount = data.map((item: any) => {
  //     return Number(item.received);
  //   });
  //   this.totalOrder = data.length;
  //   this.totalPending = data.length;
  //   this.orderValue = orderValueTotal.reduce(
  //     (a: any, b: any) => Math.round(a + b),
  //     0
  //   );
  //   this.confirmedStatus = confirmedCount.reduce((a: any, b: any) => a + b, 0);

  //   console.log(orderSeries, 'order');

  //   this.chartOptions = {
  //     series: orderSeries,
  //     chart: {
  //       height: 350,
  //       type: 'area',
  //       zoom: {
  //         enabled: true,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: false,
  //     },
  //     stroke: {
  //       curve: 'smooth',
  //     },
  //     xaxis: {
  //       type: 'datetime',
  //       categories: [
  //         '2018-09-19T00:00:00.000Z',
  //         '2018-09-19T01:30:00.000Z',
  //         '2018-09-19T02:30:00.000Z',
  //         '2018-09-19T03:30:00.000Z',
  //         '2018-09-19T04:30:00.000Z',
  //         '2018-09-19T05:30:00.000Z',
  //         '2023-04-21T07:59:12.000Z',
  //       ],
  //     },
  //     tooltip: {
  //       x: {
  //         format: 'dd/MM/yy HH:mm',
  //       },
  //     },
  //   };
  // }
}
