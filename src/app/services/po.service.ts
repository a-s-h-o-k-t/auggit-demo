import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PoService {
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

  getMaxInvoiceNo(potype: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.URL +
          'api/vPOes/getMaxInvno?potype=' +
          potype +
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

  getDefPOFields() {
    return this.http.get<any>(this.URL + 'api/pdefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getSavedDefFields(pono: any) {
    return this.http
      .get<any>(this.URL + 'api/vPOes/getSavedDefPOFields?pono=' + pono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  get_PO(pono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vPOes/getPOData?pono=' + pono);
  }
  get_PODetails(pono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vPOes/getPODetailsData?pono=' + pono);
  }

  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/poCusFields', postdata);
  }
  Insert_PO(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vPOes', postdata);
  }
  Insert_Bulk_PO_Details(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vPODetails/insertBulk', postdata);
  }

  Delete_PO(pono: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vPOes/deletePO?pono=' + pono + '&vtype=' + vtype
    );
  }
  Delete_PODetails(pono: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vPOes/deletePODetails?pono=' + pono + '&vtype=' + vtype
    );
  }
  deleteDefFields(pono: any, vtype: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vPOes/deletePODefFields?pono=' + pono + '&vtype=' + vtype
    );
  }
}
