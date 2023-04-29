import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SsoService {
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

  getDefSOFields() {
    return this.http.get<any>(this.URL + 'api/sdefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getSavedDefSOFields(sono: any) {
    return this.http
      .get<any>(this.URL + 'api/vSSOes/getSavedDefSOFields?sono=' + sono)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  getVendors() {
    return this.http.get<any>(this.URL + 'api/vSSOes/getCustomerAccounts').pipe(
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

  getMaxInvoiceNo(type: any, branch: any, fycode: any, fy: any) {
    return this.http
      .get<any>(
        this.URL +
          'api/vSSOes/getMaxInvno?sotype=' +
          type +
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
  Inser_DelivertAddress(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/mDeliveryAddresses', postdata);
  }
  showDeliveryAddress(lcode: any) {
    return this.http
      .get<any>(
        this.URL + 'api/mDeliveryAddresses/getDeliveryAddress?lcode=' + lcode
      )
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }
  insertCusFields(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/ssoCusFields', postdata);
  }

  Insert_SO(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSSOes', postdata);
  }

  Insert_Bulk_SO_Details(postdata: any): Observable<any> {
    return this.POST(this.URL + 'api/vSSODetails/insertBulk', postdata);
  }
  Delete_SOCusFields(sono: any): Observable<any> {
    return this.http.get(
      this.URL + 'api/vSSOes/deleteDefSOFields?sono=' + sono
    );
  }

  Delete_SO(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSSOes/deleteSO?sono=' + sono);
  }

  Delete_SODetails(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSSOes/deleteSODetails?sono=' + sono);
  }

  get_SO(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSSOes/getSOData?sono=' + sono);
  }
  get_SODetails(sono: any): Observable<any> {
    return this.http.get(this.URL + 'api/vSSOes/getSODetailsData?sono=' + sono);
  }

  get_SaleRef() {
    return this.http.get<any>(this.URL + 'api/salesRefs').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
}
