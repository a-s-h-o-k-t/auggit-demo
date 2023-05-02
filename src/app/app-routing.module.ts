import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockitemComponent } from './master/inventory/stockitem/stockitem.component';
import { StockitemlistComponent } from './master/inventory/stockitemlist/stockitemlist.component';
import { StockitemcategoryComponent } from './master/inventory/stockitemcategory/stockitemcategory.component';
import { StockitemgroupComponent } from './master/inventory/stockitemgroup/stockitemgroup.component';
import { UomComponent } from './master/inventory/uom/uom.component';
import { StockitemupdateComponent } from './master/inventory/stockitemupdate/stockitemupdate.component';
import { LedgerComponent } from './master/account/ledger/ledger.component';
import { LedgerlistComponent } from './master/account/ledgerlist/ledgerlist.component';
import { LedgerupdateComponent } from './master/account/ledgerupdate/ledgerupdate.component';
import { VendorlistComponent } from './master/account/vendorlist/vendorlist.component';
import { VendorComponent } from './master/account/vendor/vendor.component';
import { VendorupdateComponent } from './master/account/vendorupdate/vendorupdate.component';
import { CustomerComponent } from './master/account/customer/customer.component';
import { CustomerlistComponent } from './master/account/customerlist/customerlist.component';
import { CustomerupdateComponent } from './master/account/customerupdate/customerupdate.component';
import { CountryComponent } from './master/other/country/country.component';
import { StateComponent } from './master/other/state/state.component';
import { PoComponent } from './vouchers/povch/po/po.component';
import { PolistComponent } from './vouchers/povch/polist/polist.component';
import { PoupdateComponent } from './vouchers/povch/poupdate/poupdate.component';
import { PoserviceComponent } from './vouchers/poservicevch/poservice/poservice.component';
import { PoservicelistComponent } from './vouchers/poservicevch/poservicelist/poservicelist.component';
import { PoserviceupdateComponent } from './vouchers/poservicevch/poserviceupdate/poserviceupdate.component';
import { GrnComponent } from './vouchers/grnvch/grn/grn.component';
import { GrnlistComponent } from './vouchers/grnvch/grnlist/grnlist.component';
import { GrnupdateComponent } from './vouchers/grnvch/grnupdate/grnupdate.component';
import { GrnserviceComponent } from './vouchers/grnservicevch/grnservice/grnservice.component';
import { GrnservicelistComponent } from './vouchers/grnservicevch/grnservicelist/grnservicelist.component';
import { GrnserviceupdateComponent } from './vouchers/grnservicevch/grnserviceupdate/grnserviceupdate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SovoucherComponent } from './vouchers/sovch/sovoucher/sovoucher.component';
import { SolistComponent } from './vouchers/sovch/solist/solist.component';
import { SoupdateComponent } from './vouchers/sovch/soupdate/soupdate.component';
import { SoserviceComponent } from './vouchers/soservicevch/soservice/soservice.component';
import { SoservicelistComponent } from './vouchers/soservicevch/soservicelist/soservicelist.component';
import { SoserviceupdateComponent } from './vouchers/soservicevch/soserviceupdate/soserviceupdate.component';
import { SalesComponent } from './vouchers/salesvch/sales/sales.component';
import { SaleslistComponent } from './vouchers/salesvch/saleslist/saleslist.component';
import { SalesupdateComponent } from './vouchers/salesvch/salesupdate/salesupdate.component';
import { ServicesaleComponent } from './vouchers/salesservicevch/servicesale/servicesale.component';
import { ServicesalelistComponent } from './vouchers/salesservicevch/servicesalelist/servicesalelist.component';
import { ServicesaleupdateComponent } from './vouchers/salesservicevch/servicesaleupdate/servicesaleupdate.component';
import { SalesOrderReportComponent } from './reports/sales-order-report/sales-order-report.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stockitem', component: StockitemComponent },
  { path: 'stockitemlist', component: StockitemlistComponent },
  { path: 'stockitemupdate/:id', component: StockitemupdateComponent },
  { path: 'stockitemgroup', component: StockitemgroupComponent },
  { path: 'stockitemcategory', component: StockitemcategoryComponent },
  { path: 'uom', component: UomComponent },
  { path: 'ledger', component: LedgerComponent },
  { path: 'ledgerlist', component: LedgerlistComponent },
  { path: 'ledgerupdate/:id', component: LedgerupdateComponent },
  { path: 'vendor', component: VendorComponent },
  { path: 'vendorlist', component: VendorlistComponent },
  { path: 'vendorupdate/:id', component: VendorupdateComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'customerlist', component: CustomerlistComponent },
  { path: 'customerupdate/:id', component: CustomerupdateComponent },
  { path: 'country', component: CountryComponent },
  { path: 'state', component: StateComponent },
  { path: 'po', component: PoComponent },
  { path: 'polist', component: PolistComponent },
  { path: 'poupdate/:id', component: PoupdateComponent },
  { path: 'poservice', component: PoserviceComponent },
  { path: 'poservicelist', component: PoservicelistComponent },
  { path: 'poserviceupdate/:id', component: PoserviceupdateComponent },
  { path: 'grn', component: GrnComponent },
  { path: 'grnlist', component: GrnlistComponent },
  { path: 'grnupdate/:id', component: GrnupdateComponent },
  { path: 'servicegrn', component: GrnserviceComponent },
  { path: 'servicegrnlist', component: GrnservicelistComponent },
  { path: 'servicegrnupdate/:id', component: GrnserviceupdateComponent },
  { path: 'so', component: SovoucherComponent },
  { path: 'solist', component: SolistComponent },
  { path: 'soupdate/:id', component: SoupdateComponent },
  { path: 'soservice', component: SoserviceComponent },
  { path: 'soservicelist', component: SoservicelistComponent },
  { path: 'soserviceupdate/:id', component: SoserviceupdateComponent },
  { path: 'sales', component: SalesComponent },
  { path: 'saleslist', component: SaleslistComponent },
  { path: 'salesupdate/:id', component: SalesupdateComponent },
  { path: 'servicesales', component: ServicesaleComponent },
  { path: 'servicesaleslist', component: ServicesalelistComponent },
  { path: 'servicesalesupdate/:id', component: ServicesaleupdateComponent },
  { path: 'so-report', component: SalesOrderReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
