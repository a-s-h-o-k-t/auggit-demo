import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  SalesOrderData,
  VendorDropDown,
} from '../sales-order-report.component';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
})
export class SalesChartComponent implements OnInit, OnChanges {
  form!: FormGroup;
  @Input('vendor-filter') vendorDropDownData: VendorDropDown[] = [];
  @Input('sales-orderdata') salesOrderData: SalesOrderData[] = [];
  public chartOptions: any = {};
  filteredData: SalesOrderData[] = [];
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
    this.form.valueChanges.subscribe((values) => {
      console.log(values, '------from val');
      this.getFilterData(this.salesOrderData, values.vendorcode);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.salesOrderData && this.vendorDropDownData) {
      this.getFilterData(
        this.salesOrderData,
        this.vendorDropDownData[0].vendorcode
      );
    }
  }

  getFilterData(
    serverData: any[],
    vendorData: string,
    selectedYear: number = 2023
  ): void {
    let updatedValue: any[] = serverData;
    if (this.form.value.vendorcode === '' && vendorData) {
      this.form.get('vendorcode')?.setValue(vendorData);
    }
    if (vendorData) {
      updatedValue = updatedValue.filter((itm) => itm.vendorcode == vendorData);
      console.log(updatedValue, 'updated value');
    }
    this.filteredData = updatedValue;

    this.totalOrder = this.filteredData.length;
    this.totalPending = this.filteredData.filter(
      (itm) => Number(itm.pending) > 0
    ).length;

    this.orderValue = Math.round(
      this.filteredData.reduce(
        (prev: any, curr: any) => Number(prev) + Number(curr.orderedvalue),
        0
      )
    );
    this.confirmedStatus = this.filteredData.filter(
      (itm) => Number(itm.pending) === 0
    ).length;

    const productMapCons = (
      getMonth: number,
      i: SalesOrderData,
      mapData: any
    ) => {
      i.solistDetails.forEach((item: { pname: string; pqty: string }) => {
        if (!mapData.has(item.pname)) {
          let arr: number[] = Array(12).fill(0);
          arr[getMonth] = Number(item.pqty);
          mapData.set(item.pname, arr);
        } else {
          const d: number[] = mapData.get(item.pname);
          console.log(d[getMonth], '--------');

          d.splice(getMonth, 1, d[getMonth] + Number(item.pqty));
        }
      });
    };

    const productsMap = new Map();
    for (let i of this.filteredData) {
      let sodate = i.sodate;
      let splited = sodate.split(' ')[0].split('-');
      let time = sodate.split(' ')[1];
      let formatedDate = splited[1] + '/' + splited[0] + '/' + splited[2];
      let finalDateString = formatedDate + ' ' + time;
      const getYear = new Date(finalDateString).getFullYear();
      const getMonth = new Date(finalDateString).getMonth();
      if (!productsMap.has(getYear)) {
        let soldProductMap = new Map();
        productMapCons(getMonth, i, soldProductMap);
        productsMap.set(getYear, soldProductMap);
      } else {
        const oldData = productsMap.get(getYear); // month i mapData --> fn
        productMapCons(getMonth, i, oldData);
      }
    }

    console.log(productsMap, '-------000000000---');

    // const productSales: any[] = [];
    // productsMap.forEach((item, key) => {
    //   if (key === selectedYear) {
    //     item.forEach((value: number[], key: string) => {
    //       productSales.push({
    //         year: selectedYear,
    //         productName: key,
    //         salesCountOfAllMonths: value,
    //       });
    //     });
    //   }
    // });

    //  let orderSeries: any = this.filteredData.map((item: any) => {
    //    return { name: item.vendorname, data: [Number(item.ordered)] };
    //  });

    // this.chartOptions = {
    // vendorName:"",
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
    //     chartCategories : [
    //   '2023-01-01T00:00:00.000Z',
    //   '2023-02-01T00:00:00.000Z',
    //   '2023-03-01T00:00:00.000Z',
    //   '2023-04-01T00:00:00.000Z',
    //   '2023-05-01T00:00:00.000Z',
    //   '2023-06-01T00:00:00.000Z',
    //   '2023-07-01T00:00:00.000Z',
    //   '2023-08-01T00:00:00.000Z',
    //   '2023-09-01T00:00:00.000Z',
    //   '2023-10-01T00:00:00.000Z',
    //   '2023-11-01T00:00:00.000Z',
    //   '2023-12-01T00:00:00.000Z',
    // ];

    //   },
    //   tooltip: {
    //     x: {
    //       format: 'dd/MM/yy HH:mm',
    //     },
    //   },
    //   fill: {
    //   type: "gradient",
    //   gradient: {
    //     shadeIntensity: 1,
    //     opacityFrom: 0.7,
    //     opacityTo: 0.9,
    //     stops: [0, 90, 100]
    //   }
    // },
    // };
  }
}
