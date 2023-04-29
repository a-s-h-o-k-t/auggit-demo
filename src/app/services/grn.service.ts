import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GrnService {
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

  getVendors() {
    return this.http.get<any>(this.URL + 'api/vGrns/getVendorAccounts').pipe(
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

  getMaxInvoiceNo(vchtype: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.URL +
          'api/vGrns/getMaxInvno?vchtype=' +
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

  Insert_GRN(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vGrns', postdata);
  }

  Insert_Bulk_GRN_Details(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vGrnDetails/insertBulk', postdata);
  }

  Insert_Ledger(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/accountentries', postdata);
  }

  Insert_Overdue(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/overdue', postdata);
  }

  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vGrnCusFields', postdata);
  }

  getPendingPoServiceListAll() {
    return this.http
      .get<any>(this.URL + 'api/vGrns/GetPendingPOServiceListAll')
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoListAll() {
    return this.http.get<any>(this.URL + 'api/vGrns/GetPendingPOListAll').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getPendingPoList(vendorcode: any) {
    return this.http
      .get<any>(
        this.URL + 'api/vGrns/GetPendingPOList?vendorcode=' + vendorcode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPendingPoListDetails(vendorcode: any) {
    return this.http
      .get<any>(
        this.URL + 'api/vGrns/getPendingPOListDetails?vendorcode=' + vendorcode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getPurchaseAccounts() {
    return this.http.get<any>(this.URL + 'api/vGrns/getPurchaseAccounts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getDefaultAccounts() {
    return this.http.get<any>(this.URL + 'api/vGrns/getDefaultAccounts').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getGRNListAll() {
    return this.http.get<any>(this.URL + 'api/vGrns/GetGRNListAll').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  Delete_GRN(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vGrns/deleteGRN?invno=' + invno + '&vtype=' + vtype
    );
  }
  Delete_GRNDetails(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vGrns/deleteGRNDetails?invno=' + invno + '&vtype=' + vtype
    );
  }
  Delete_Accounts(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL +
        'api/vGrns/deleteGRNAccounts?invno=' +
        invno +
        '&vtype=' +
        vtype
    );
  }
  Delete_overdue(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vGrns/deleteGRNOverdue?invno=' + invno + '&vtype=' + vtype
    );
  }
  Delete_CusdefFields(invno: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL +
        'api/vGrns/deleteCusDefField?invno=' +
        invno +
        '&vtype=' +
        vtype
    );
  }

  getSavedAccounts(): Observable<any> {
    return this.http.get(this.URL + 'api/purchaseDefAccs');
  }
  get_GRN(invno: any): Observable<any> {
    return this.http.get(this.URL + 'api/vGrns/getGRNData?invno=' + invno);
  }
  get_GRNDetails(invno: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vGrns/getGRNDetailsData?invno=' + invno
    );
  }
  getSavedDefFields(invno: any) {
    return this.http
      .get<any>(this.URL + 'api/vGrns/getSavedDefData?invno=' + invno)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
}
