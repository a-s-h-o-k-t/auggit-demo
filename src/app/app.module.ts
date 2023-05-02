import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';

import { HeaderComponent } from './applayout/header/header.component';
import { SidebarComponent } from './applayout/sidebar/sidebar.component';
import { StockitemComponent } from './master/inventory/stockitem/stockitem.component';
import { StockitemgroupComponent } from './master/inventory/stockitemgroup/stockitemgroup.component';
import { SuccessmsgComponent } from './dialogs/successmsg/successmsg.component';
import { StockitemlistComponent } from './master/inventory/stockitemlist/stockitemlist.component';
import { StockitemcategoryComponent } from './master/inventory/stockitemcategory/stockitemcategory.component';
import { UomComponent } from './master/inventory/uom/uom.component';
import { ConfirmmsgComponent } from './dialogs/confirmmsg/confirmmsg.component';
import { StockitemupdateComponent } from './master/inventory/stockitemupdate/stockitemupdate.component';
import { LedgerComponent } from './master/account/ledger/ledger.component';
import { LedgerlistComponent } from './master/account/ledgerlist/ledgerlist.component';
import { LedgerupdateComponent } from './master/account/ledgerupdate/ledgerupdate.component';
import { VendorComponent } from './master/account/vendor/vendor.component';
import { VendorlistComponent } from './master/account/vendorlist/vendorlist.component';
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
import { PurchasevtypeComponent } from './vchtype/purchasevtype/purchasevtype.component';
import { PendingpoComponent } from './vouchers/models/pendingpo/pendingpo.component';
import { PendingsoComponent } from './vouchers/models/pendingso/pendingso.component';
import { GrnserviceComponent } from './vouchers/grnservicevch/grnservice/grnservice.component';
import { GrnservicelistComponent } from './vouchers/grnservicevch/grnservicelist/grnservicelist.component';
import { GrnserviceupdateComponent } from './vouchers/grnservicevch/grnserviceupdate/grnserviceupdate.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SolistComponent } from './vouchers/sovch/solist/solist.component';
import { SovoucherComponent } from './vouchers/sovch/sovoucher/sovoucher.component';
import { SoupdateComponent } from './vouchers/sovch/soupdate/soupdate.component';
import { AdddelivaddressComponent } from './vouchers/models/adddelivaddress/adddelivaddress.component';
import { ShowdelivaddressComponent } from './vouchers/models/showdelivaddress/showdelivaddress.component';
import { SoserviceComponent } from './vouchers/soservicevch/soservice/soservice.component';
import { SoservicelistComponent } from './vouchers/soservicevch/soservicelist/soservicelist.component';
import { SoserviceupdateComponent } from './vouchers/soservicevch/soserviceupdate/soserviceupdate.component';
import { SalesComponent } from './vouchers/salesvch/sales/sales.component';
import { SaleslistComponent } from './vouchers/salesvch/saleslist/saleslist.component';
import { SalesupdateComponent } from './vouchers/salesvch/salesupdate/salesupdate.component';
import { SalesvtypeComponent } from './vchtype/salesvtype/salesvtype.component';
import { ServicesaleComponent } from './vouchers/salesservicevch/servicesale/servicesale.component';
import { ServicesalelistComponent } from './vouchers/salesservicevch/servicesalelist/servicesalelist.component';
import { ServicesaleupdateComponent } from './vouchers/salesservicevch/servicesaleupdate/servicesaleupdate.component';
import { SalesOrderReportComponent } from './reports/sales-order-report/sales-order-report.component';
import { GetProductDetailsPipe } from './reports/sales-order-report/get-product-details.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    StockitemComponent,
    StockitemgroupComponent,
    SuccessmsgComponent,
    StockitemlistComponent,
    StockitemcategoryComponent,
    UomComponent,
    ConfirmmsgComponent,
    StockitemupdateComponent,
    LedgerComponent,
    LedgerlistComponent,
    LedgerupdateComponent,
    VendorComponent,
    VendorlistComponent,
    VendorupdateComponent,
    CustomerComponent,
    CustomerlistComponent,
    CustomerupdateComponent,
    CountryComponent,
    StateComponent,
    PoComponent,
    PolistComponent,
    PoupdateComponent,
    PoserviceComponent,
    PoservicelistComponent,
    PoserviceupdateComponent,
    GrnComponent,
    GrnlistComponent,
    GrnupdateComponent,
    PurchasevtypeComponent,
    PendingpoComponent,
    PendingsoComponent,
    GrnserviceComponent,
    GrnservicelistComponent,
    GrnserviceupdateComponent,
    DashboardComponent,
    SolistComponent,
    SovoucherComponent,
    SoupdateComponent,
    AdddelivaddressComponent,
    ShowdelivaddressComponent,
    SoserviceComponent,
    SoservicelistComponent,
    SoserviceupdateComponent,
    SalesComponent,
    SaleslistComponent,
    SalesupdateComponent,
    SalesvtypeComponent,
    ServicesaleComponent,
    ServicesalelistComponent,
    ServicesaleupdateComponent,
    SalesOrderReportComponent,
    GetProductDetailsPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTabsModule,
    MatRadioModule,
    MatTableModule,
    MatIconModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatToolbarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
