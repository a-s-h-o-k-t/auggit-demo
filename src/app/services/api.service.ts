import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

   //URL = "https://localhost:7037/";
   URL = "https://auggitapi.brositecom.com/";

   httpOptions = {
     headers: new HttpHeaders({
       "Content-Type": "application/json"
     })
   };
 
   constructor(private http : HttpClient) { }
 
   POST(path: string, body: Object = {}): Observable<any> { 
     console.log(JSON.stringify(body));
     return this.http
       .post(path, JSON.stringify(body), this.httpOptions)
       .pipe(catchError(this.formatErrors));
   } 
 
   private formatErrors(error: any) {
     return throwError(error.error);    
   }
 
   //Company Details
   Inser_DelivertAddress(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mDeliveryAddresses", postdata);
   }  
   showDeliveryAddress(lcode:any)
   {
     return this.http.get<any>( this.URL + "api/mDeliveryAddresses/getDeliveryAddress?lcode=" +lcode).pipe(map((res:any)=>{
       return res;
     }))
   }
 
   //Company Details
   Inser_CompanyData(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mCompanies", postdata);
   }  
   update_CompanyData(id:any,postdata: any): Observable<any> {
     return this.http.put<any>(this.URL + "api/mCompanies/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   }  
   delete_CompanyData(id:any): Observable<any> {
     return this.http.delete<any>(this.URL + "api/mCompanies/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }    
   get_CompanyData() {
     console.log(this.URL + "api/mCompanies");
     return this.http.get<any>( this.URL + "api/mCompanies").pipe(map((res:any)=>{
       return res;
     }))
   }   
   get_CompanyDataWithID(id:any) {
     return this.http.get<any>( this.URL + "api/mCompanies/"+id).pipe(map((res:any)=>{
       return res;
     }))
   } 
 

  //Ledger Group Details
   Inser_LedgerGroup(postdata: any): Observable<any> {
   return this.POST( this.URL + "api/mLedgerGroups", postdata);
   } 
   Update_LedgerGroup(id:any,postdata: any): Observable<any> {    
     return this.http.put<any>(this.URL + "api/mLedgerGroups/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_LedgerGroup() {
     return this.http.get<any>( this.URL + "api/mLedgerGroups").pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_LedgerGroupwithID(id:any) {
     return this.http.get<any>( this.URL + "api/mLedgerGroups/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_LedgerGroup_MaxID() {
     return this.http.get<any>( this.URL + "api/mLedgerGroups/getMaxID").pipe(map((res:any)=>{
       return res;
     }))
   } 
   delete_LedgerGroup(id:any): Observable<any> {
     return this.http.delete<any>(this.URL + "api/mLedgerGroups/"+id).pipe(map((res:any)=>{
       return res;
     }))
   } 
 
   //Vendor Details  
   Inser_LedgerData(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mLedgers", postdata);
   } 
   Update_LedgerData(id:any,postdata: any): Observable<any> {    
     return this.http.put<any>(this.URL + "api/mLedgers/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_LedgerData() {
     return this.http.get<any>( this.URL + "api/mLedgers").pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_LedgerDataWithID(id:any) {
     return this.http.get<any>( this.URL + "api/mLedgers/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   getMaxLedgerID() {
     return this.http.get<any>( this.URL + "api/mLedgers/getMaxLedgerID").pipe(map((res:any)=>{
       return res;
     }))
   }  
   getCustomersOnly()
   {
     return this.http.get<any>( this.URL + "api/mLedgers/getCustomers").pipe(map((res:any)=>{
       return res;
     }))
   }
   getVendorsOnly()
   {
     return this.http.get<any>( this.URL + "api/mLedgers/getVendors").pipe(map((res:any)=>{
       return res;
     }))
   }
   getOtherLedgers()
   {
     return this.http.get<any>( this.URL + "api/mLedgers/getOthers").pipe(map((res:any)=>{
       return res;
     }))
   }
   getAllLedgers()
   {
     return this.http.get<any>( this.URL + "api/mLedgers/getOthers").pipe(map((res:any)=>{
       return res;
     }))
   }
   
   //Country Details
   Inser_CountryData(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mCountries", postdata);
   } 
   Update_CountryData(id:any,postdata: any): Observable<any> {    
     return this.http.put<any>(this.URL + "api/mCountries/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   } 
   Delete_CountryData(id:any): Observable<any> {
     return this.http.delete<any>(this.URL + "api/mCountries/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }   
   get_CountryData() {
     return this.http.get<any>( this.URL + "api/mCountries").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_CountryDataWithID(id:any) {
     return this.http.get<any>( this.URL + "api/mCountries/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
 
   //State Details
   Inser_StateData(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mStates", postdata);
   } 
   Update_StateData(id:any,postdata: any): Observable<any> {    
     return this.http.put<any>(this.URL + "api/mStates/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   } 
   Delete_StateData(id:any): Observable<any> {
     return this.http.delete<any>(this.URL + "api/mStates/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }   
   get_StateData() {
     return this.http.get<any>( this.URL + "api/mStates").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_StateDataWithID(id:any) {
     return this.http.get<any>( this.URL + "api/mStates/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
 
   //Category
   Inser_CateData(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mCategories", postdata);
   } 
   Update_CateData(id:any,postdata: any): Observable<any> {    
     return this.http.put<any>(this.URL + "api/mCategories/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   } 
   Delete_CateData(id:any): Observable<any> {
     return this.http.delete<any>(this.URL + "api/mCategories/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_CategoryMaxID() {
     return this.http.get<any>( this.URL + "api/mCategories/getMaxCategoryID").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_CategoryData() {
     return this.http.get<any>( this.URL + "api/mCategories").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_CategoryDataWithID(id:any) {
     return this.http.get<any>( this.URL + "api/mCategories/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_CategoryDataWithName(name:any) {
     return this.http.get<any>( this.URL + "api/mCategories/checkDuplicate?name="+name).pipe(map((res:any)=>{
       return res;
     }))
   }  
   
   //Group
   Inser_GroupData(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mItemgroups", postdata);
   } 
   Update_GroupData(id:any,postdata: any): Observable<any> {    
     return this.http.put<any>(this.URL + "api/mItemgroups/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   } 
   Delete_GroupData(id:any): Observable<any> {
     return this.http.delete<any>(this.URL + "api/mItemgroups/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_GroupMaxID() {
     return this.http.get<any>( this.URL + "api/mItemgroups/getMaxID").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_GroupData() {
     return this.http.get<any>( this.URL + "api/mItemgroups").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_GroupDataWithID(id:any) {
     return this.http.get<any>( this.URL + "api/mItemgroups/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_GroupDataWithName(name:any) {
     return this.http.get<any>( this.URL + "api/mItemgroups/checkDuplicate?name="+name).pipe(map((res:any)=>{
       return res;
     }))
   } 
 
   //UOM
   Inser_UOMData(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mUoms", postdata);
   } 
   Update_UOMData(id:any,postdata: any): Observable<any> {    
     return this.http.put<any>(this.URL + "api/mUoms/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   } 
   Delete_UOMData(id:any): Observable<any> {
     return this.http.delete<any>(this.URL + "api/mUoms/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_UOMMaxID() {
     return this.http.get<any>( this.URL + "api/mUoms/getMaxID").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_UOMData() {
     return this.http.get<any>( this.URL + "api/mUoms").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_UOMDataWithID(id:any) {
     return this.http.get<any>( this.URL + "api/mUoms/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_UOMDataWithName(name:any) {
     return this.http.get<any>( this.URL + "api/mUoms/checkDuplicate?name="+name).pipe(map((res:any)=>{
       return res;
     }))
   } 
 
    //Item
   Insert_ItemData(postdata: any): Observable<any> {
     return this.POST( this.URL + "api/mItems", postdata);
   } 
   Update_ItemData(id:any,postdata: any): Observable<any> {    
     return this.http.put<any>(this.URL + "api/mItems/"+id, postdata).pipe(map((res:any)=>{
       return res;
     }))
   } 
   Delete_ItemData(id:any): Observable<any> {
     return this.http.delete<any>(this.URL + "api/mItems/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_ItemMaxID() {
     return this.http.get<any>( this.URL + "api/mItems/getMaxID").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_ItemData() {
     return this.http.get<any>( this.URL + "api/mItems/getItems").pipe(map((res:any)=>{
       return res;
     }))
   } 
   get_ItemDataWithID(id:any) {
     return this.http.get<any>( this.URL + "api/mItems/"+id).pipe(map((res:any)=>{
       return res;
     }))
   }  
   get_ItemDataWithName(name:any) {
     return this.http.get<any>( this.URL + "api/mItems/checkDuplicate?name="+name).pipe(map((res:any)=>{
       return res;
     }))
   }  
 
   //Voucher Types
   get_PurchaseVoucherType(vch:any) {
     return this.http.get<any>( this.URL + "api/mVoucherTypes/getVoucherTypes?vch=" + vch).pipe(map((res:any)=>{
       return res;
     }))
   }  
   //Get Default Accounts
   get_DefaultAccounts() {
     return this.http.get<any>( this.URL + "api/defaultaccounts").pipe(map((res:any)=>{
       return res;
     }))
   } 
  
}
