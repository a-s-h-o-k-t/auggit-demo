import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SalesService } from 'src/app/services/sales.service';

interface VendorDropDown {
  vendorCode: string;
  vendorName: string;
}

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
})
export class SalesChartComponent implements OnInit {
  form!: FormGroup;
  vendorDropDownData: VendorDropDown[] = [];
  public chartOptions: any;

  constructor(private salesApi: SalesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      vendorName: [''],
    });

    this.chartOptions = {
      series: [44, 55, 41, 17, 15],
      chart: {
        width: 380,
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'gradient',
      },
      legend: {
        formatter: function (val: any, opts: any) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }

  ngOnInit(): void {}
  loadData() {
    this.salesApi.getPendingSOListSO().subscribe((res) => {
      console.log(res, '......res');
      if (res.length) {
        console.log(res, '......res');
        const newMap = new Map();
        res
          .map((item: any) => {
            return {
              vendorName: item.vendorName,
              vendorCode: item.vendorCode,
            };
          })
          .forEach((item: VendorDropDown) => newMap.set(item.vendorCode, item));
        this.vendorDropDownData = [...newMap.values()];
      }
    });
  }
}
