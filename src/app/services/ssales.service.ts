import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SsalesService {
  //URL = "https://localhost:7037/";
  URL = 'https://auggitapi.brositecom.com/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  POST(path: string, body: Object = {}): Observable<any> {
    console.log(JSON.stringify(body));
    return this.http
      .post(path, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(this.formatErrors));
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  getMaxInvoiceNo(vchtype: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.URL +
          'api/vSSales/getMaxInvno?vchtype=' +
          vchtype +
          '&branch=' +
          branch +
          '&fycode=' +
          fycode +
          '&fy=' +
          fy
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getCustomers() {
    return this.http
      .get<any>(this.URL + 'api/vSSales/getCustomerAccounts')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getProducts() {
    return this.http.get<any>(this.URL + 'api/mItems').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSalesAccounts() {
    return this.http.get<any>(this.URL + 'api/vSSales/getSalesAccounts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getDefaultAccounts() {
    return this.http.get<any>(this.URL + 'api/vSSales/getDefaultAccounts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  Insert_Sales(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSSales', postdata);
  }

  Insert_Bulk_Sales_Details(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSSalesDetails/insertBulk', postdata);
  }

  Insert_Ledger(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/accountentries', postdata);
  }

  Insert_Overdue(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/overdue', postdata);
  }

  getPendingSOListDetails(cuscode: any) {
    return this.http
      .get<any>(
        this.URL + 'api/vSSales/getPendingSOListDetails?customercode=' + cuscode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingSOListAll() {
    return this.http
      .get<any>(this.URL + 'api/vSSales/getPendingSOListAll')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingSOListSO() {
    return this.http.get<any>(this.URL + 'api/vSSales/getPendingSOListSO').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getPendingSOListSOService() {
    return this.http
      .get<any>(this.URL + 'api/vSSales/getPendingSOListSOService')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  Delete_SavedDefSalesFields(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL +
        'api/vSSales/deleteSalesCusFields?invno=' +
        invno +
        '&vtype=' +
        vtype
    );
  }
  Delete_Sales(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vSSales/deleteSales?invno=' + invno + '&vtype=' + vtype
    );
  }
  Delete_SalesDetails(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL +
        'api/vSSales/deleteSALESDetails?invno=' +
        invno +
        '&vtype=' +
        vtype
    );
  }
  Delete_Accounts(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL +
        'api/vSSales/deleteSSalesAccounts?invno=' +
        invno +
        '&vtype=' +
        vtype
    );
  }
  Delete_overdue(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL +
        'api/vSales/deleteSSalesOverdue?invno=' +
        invno +
        '&vtype=' +
        vtype
    );
  }

  getSalesListAll() {
    return this.http.get<any>(this.URL + 'api/vSSales/GetSalesListAll').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  get_Sales(invno: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSSales/getSalesData?invno=' + invno);
  }
  get_SalesDetails(invno: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vSSales/getSalesDetailsData?invno=' + invno
    );
  }

  getSavedAccounts(): Observable<any> {
    return this.http.get(this.URL + 'api/saleDefAccs');
  }

  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSSalesCusFields', postdata);
  }

  getSavedDefSalesFields(invno: any) {
    return this.http
      .get<any>(this.URL + 'api/vSSales/getSavedDefSalesFields?invno=' + invno)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
