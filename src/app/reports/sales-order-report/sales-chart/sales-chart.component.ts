import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SalesService } from 'src/app/services/sales.service';
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

  constructor(private salesApi: SalesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      vendorcode: [''],
    });
  }

  ngOnInit(): void {
    console.log(this.vendorDropDownData, 'vendor data');
    this.form.valueChanges.subscribe((values) => {
      this.getFilterData(values, this.salesOrderData);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.salesOrderData, '...........sales order data');
    this.productSaleReport();
  }

  productSaleReport() {
    let orderSeries: any = this.salesOrderData.map((item) =>
      Number(item.ordered)
    );
    let orderName: any = this.salesOrderData.map((item) => item.vendorname);

    this.chartOptions = {
      series: orderSeries,
      chart: {
        width: 380,
        type: 'donut',
      },
      labels: orderName,
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

  getFilterData(formValues: any, serverData: any): void {
    console.log(formValues, serverData, 'ddddd');
    let updatedValue: any[] = serverData;
    if (formValues.vendorcode) {
      updatedValue = updatedValue.filter(
        (itm) => itm.vendorcode == formValues.vendorcode
      );
      console.log(updatedValue, 'updated value');
    }
  }
}
