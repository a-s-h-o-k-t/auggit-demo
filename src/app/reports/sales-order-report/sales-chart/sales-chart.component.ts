import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { VendorDropDown } from '../sales-order-report.component';
import { ApexChart } from 'ng-apexcharts';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
})
export class SalesChartComponent implements OnInit, OnChanges {
  form!: FormGroup;
  @Input('vendor-filter') vendorDropDownData: VendorDropDown[] = [];
  @Input('sales-orderdata') salesOrderData: any[] = [];
  public chartOptions: any = {};
  filteredData: any[] = [];
  orderValue: number = 0;
  confirmedStatus: number = 0;
  totalPending: number = 0;
  totalOrder: number = 0;
  chartCategories: string[] = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  chartSpec: Partial<ApexChart> = {
    fontFamily: 'Nunito Sans,sans-serif',
    height: 350,
    type: 'area',
    toolbar: {
      show: false,
    },
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      vendorcode: [''],
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe((values) => {
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

    const productMapCons = (getMonth: number, i: any, mapData: any) => {
      i.solistDetails.forEach((item: { pname: string; pqty: string }) => {
        if (!mapData.has(item.pname)) {
          let arr: number[] = Array(12).fill(0);
          arr[getMonth] = Number(item.pqty);
          mapData.set(item.pname, arr);
        } else {
          const d: number[] = mapData.get(item.pname);
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

    const productSales: any[] = [];
    productsMap.forEach((item, key) => {
      if (key === selectedYear) {
        item.forEach((value: number[], key: string) => {
          productSales.push({
            year: selectedYear,
            productName: key,
            salesCountOfAllMonths: value,
          });
        });
      }
    });

    let seriesData: any[] = [];
    if (productSales.length) {
      seriesData = productSales.map((item: any) => {
        return {
          name: item.productName,
          data: item.salesCountOfAllMonths,
        };
      });
    }
    console.log(productSales, '-------1111111---');
    console.log(productsMap, this.filteredData, '-------000000000---');
    console.log(seriesData, '--------22222222222');

    this.chartOptions = {
      companyName: this.filteredData[0].vendorname,
      year: selectedYear,
      series: seriesData,
      chart: this.chartSpec,
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        categories: this.chartCategories,
      },
    };
  }
}
