import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Guid } from 'guid-typescript';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-uom',
  templateUrl: './uom.component.html',
  styleUrls: ['./uom.component.scss']
})
export class UomComponent implements OnInit {

  loading:boolean=false;
  
  //Set Element Ref
  @ViewChild("ename") ename : ElementRef | undefined;  
  @ViewChild("esave") esave: ElementRef | undefined;  
  uomForm!: FormGroup;
  
  uniqueID:any;
  code:any;
  name:any;
  digit:any;

  selectedID:any; 
  displayedColumns: string[] = ['UOM_NAME','NO_OF','ACTIONS'];   
  dataSource!: MatTableDataSource<any>;
  savedData:any;    
  
  constructor(public api:ApiService, public dialog : MatDialog, public fb : FormBuilder) { }

  //Validators
 setValidations()
 {
   this.uomForm = this.fb.group({      
    cname : ['', Validators.required],    
    cdigit : ['', Validators.required]    
   })
 }
 
 ngAfterViewInit() {
   this.ename?.nativeElement.focus();
 }  
 ngOnInit(): void {
   this.setValidations();
   this.getMaxCode();  
   this.loaddata();       
 }

 //Load Functions
 loaddata()
 {
   this.api.get_UOMData().subscribe(res=>{
     this.dataSource = new MatTableDataSource(res);    
     this.savedData = res;
     this.dataSource.filterPredicate = function (record,filter) {
         return record.uomname.toLocaleLowerCase() == filter.toLocaleLowerCase();
     }      
   });
 }
 async getMaxCode()
 {   
   return new Promise((resolve) => { 
     this.api.get_UOMMaxID().subscribe(res=>{        
       this.code = res;                     
       resolve({ action: 'success' });
     })   
   });
 }

 //CRUD
 async submit()
 {      
  this.loading = true;
  setTimeout(() => {      
    this.getMaxCode().then((res)=> {           
       this.uniqueID = Guid.create();
       var postData = {
           id: this.uniqueID.value,
           uomcode: this.code,
           uomname: this.name, 
           digits: this.digit,          
           rCreatedDateTime: new Date(),
           rStatus: "A"
       }            
       this.api.Inser_UOMData(postData).subscribe(data => {                     
           let dialogRef = this.dialog.open(SuccessmsgComponent,
           {
               //width: '350px',
               data: "UOM Successfully Saved!"
           });                       
           dialogRef.afterClosed().subscribe(result=>{
             this.clear();
             this.loaddata();
             this.getMaxCode();
             this.loading = false;
             this.ename?.nativeElement.focus();
           })          
       }, err => {
           console.log(err);
           alert("Some Error Occured");
       });       
   });
  }, 200);  
 }

 update()
 {
  this.loading=true;
  setTimeout(() => {      
   var postData = {
       id: this.selectedID,
       uomcode: this.code,
       uomname: this.name,  
       digits: this.digit,         
       rCreatedDateTime: new Date(),
       rStatus: "A"
     }            
     console.log(postData);
     this.api.Update_UOMData(this.selectedID,postData).subscribe(data => {                     
         let dialogRef = this.dialog.open(SuccessmsgComponent,
         {
             //width: '350px',
             data: "UOM Successfully Updated!"
         });                       
         dialogRef.afterClosed().subscribe(result=>{
           this.clear();
           this.loaddata();
           this.getMaxCode();            
           this.setValidations(); 
           this.uomForm.reset();    
           this.loading = false;      
           this.ename?.nativeElement.focus();            
         })          
     }, err => {
         console.log(err);
         alert("Some Error Occured");
     })       
    }, 200);
 } 
 edit(rowdata:any)
 {    
   const dialogRef = this.dialog.open(ConfirmmsgComponent, {
     width: '350px',
     data: "Do you Modify data?"
   });
   dialogRef.afterClosed().subscribe(result => {
     if(result) {
       console.log(rowdata);
       this.selectedID = rowdata.id;        
       this.name = rowdata.uomname;       
       this.code = rowdata.uomcode;       
       const groupname = this.uomForm.get('cname');
       groupname?.clearValidators();
       groupname?.clearAsyncValidators();
       groupname?.updateValueAndValidity();        
     }
   });      
 }
 restore(rowdata:any)
 {    
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
     width: '350px',
     data: "Do you confirm the Restoration of this UOM data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {                                                    
        this.api.Delete_UOMData(rowdata.id).subscribe(data => {   
            let dialogRef = this.dialog.open(SuccessmsgComponent,{
              //width: '350px',
              data: "Successfully Restored!"
            });                    
            dialogRef.afterClosed().subscribe(result=>{
              this.clear();
              this.loaddata();
            })                 
        }, err => {
          console.log(err);
          alert("Some Error Occured");
        })  
      }
   });         
 }
 delete(rowdata:any)
 {    
   const dialogRef = this.dialog.open(ConfirmmsgComponent, {
     width: '350px',
     data: "Do you confirm the deletion of this UOM data?"
   });
   dialogRef.afterClosed().subscribe(result => {
     if(result) {                                                    
       this.api.Delete_UOMData(rowdata.id).subscribe(data => {   
           let dialogRef = this.dialog.open(SuccessmsgComponent,{
             //width: '350px',
             data: "Successfully Deleted!"
           });                    
           dialogRef.afterClosed().subscribe(result=>{
             this.clear();
             this.loaddata();
           })                 
       }, err => {
         console.log(err);
         alert("Some Error Occured");
       })  
     }
   });         
 }  
 clear()
 {
     this.name = "";
     this.code = "";
     this.selectedID=undefined;    
     this.uomForm.reset();     
     this.setValidations();      
     this.ename?.nativeElement.focus();   
 }

 //Enter Key Events (Focus)
 NameEnter(event:any)
 {    
    if(this.uomForm.controls['cname'].status != "INVALID")
    {
      if(typeof this.name!='undefined' && this.name){
        {
            this.esave?.nativeElement?.focus();
        }
      }
    }  
 }

 //Filter 
 applyFilter(filterValue: any)
  {        
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();      
  }


}
