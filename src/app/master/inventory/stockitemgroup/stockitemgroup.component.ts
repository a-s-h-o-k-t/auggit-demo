import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Guid } from 'guid-typescript';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-stockitemgroup',
  templateUrl: './stockitemgroup.component.html',
  styleUrls: ['./stockitemgroup.component.scss']
})
export class StockitemgroupComponent implements OnInit {

   //Set Element Ref
 @ViewChild("ename") ename : ElementRef | undefined;
 @ViewChild("eunder") eunder : MatSelect | undefined;  
 @ViewChild("esave") esave: ElementRef | undefined;  

 loading:boolean=false;

 //Variable Declaration
 groupForm!: FormGroup;
 
 uniqueID:any;
 groupcode:any;
 groupname:any;
 groupundername:any;  
 groupundercode:any; 

 selectedID:any; 
 displayedColumns: string[] = ['GROUP_NAME','ACTIONS'];   
 dataSource!: MatTableDataSource<any>;
 savedData:any;    

 constructor(public api:ApiService, public dialog : MatDialog, public fb : FormBuilder) { }

 //Validators
 setValidations()
 {
   this.groupForm = this.fb.group({      
     cgroupname : ['', Validators.required],
     cgroupunder : ['', Validators.required]     
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
   this.api.get_GroupData().subscribe(res=>{
     this.dataSource = new MatTableDataSource(res);    
     this.savedData = res;
     this.dataSource.filterPredicate = function (record,filter) {
         return record.groupname.toLocaleLowerCase() == filter.toLocaleLowerCase();
     }      
   });
 }
 async getMaxCode()
 {   
   return new Promise((resolve) => { 
     this.api.get_GroupMaxID().subscribe(res=>{        
       this.groupcode = res;                     
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
           groupcode: this.groupcode,
           groupname: this.groupname,
           groupunder: this.groupundercode,
           rCreatedDateTime: new Date(),
           rStatus: "A"
       }            
       this.api.Inser_GroupData(postData).subscribe(data => {                     
           let dialogRef = this.dialog.open(SuccessmsgComponent,
           {
               //width: '350px',
               data: "Group Successfully Saved!"
           });                       
           dialogRef.afterClosed().subscribe(result=>{
             this.clear();
             this.loaddata();
             this.getMaxCode();
             this.ename?.nativeElement.focus();
             this.loading = false;
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
  this.loading = true;
  setTimeout(() => {   
   var postData = {
       id: this.selectedID,
       groupcode: this.groupcode,
       groupname: this.groupname,
       groupunder: this.groupundercode,
       rCreatedDateTime: new Date(),
       rStatus: "A"
     }            
     console.log(postData);
     this.api.Update_GroupData(this.selectedID,postData).subscribe(data => {                     
         let dialogRef = this.dialog.open(SuccessmsgComponent,
         {
             //width: '350px',
             data: "Group Successfully Updated!"
         });                       
         dialogRef.afterClosed().subscribe(result=>{
           this.clear();
           this.loaddata();
           this.getMaxCode();            
           this.setValidations(); 
           this.groupForm.reset();          
           this.ename?.nativeElement.focus();     
           this.loading = false;       
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
     data: "Do you Modify Stock Group?"
   });
   dialogRef.afterClosed().subscribe(result => {
     if(result) {
       console.log(rowdata);
       this.selectedID = rowdata.id;        
       this.groupname = rowdata.groupname;
       this.groupundercode = rowdata.groupunder;
       this.groupcode = rowdata.catcode;       
       const groupname = this.groupForm.get('cgroupname');
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
     data: "Do you confirm the Restoration of Stock Group?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {                                                    
        this.api.Delete_GroupData(rowdata.id).subscribe(data => {   
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
     data: "Do you confirm the deletion of this Stock Group?"
   });
   dialogRef.afterClosed().subscribe(result => {
     if(result) {                                                    
       this.api.Delete_GroupData(rowdata.id).subscribe(data => {   
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
     this.groupname = "";
     this.groupundercode = "";
     this.selectedID=undefined;    
     this.groupForm.reset();     
     this.setValidations();
     this.ename?.nativeElement.focus();   
 }

 //Enter Key Events (Focus)
 catNameEnter(event:any)
 {    
    if(this.groupForm.controls['cgroupname'].status != "INVALID")
    {
      if(typeof this.groupname!='undefined' && this.groupname){
        {
            this.eunder?.focus();
        }
      }
    }  
 }
 catUnderEnter(event:any)
 {
   if(typeof this.groupundercode!='undefined' && this.groupundercode){
     {
       this.esave?.nativeElement.focus();
     }
   }
 }  

 //Dropdown Events
 changeGroup(event:MatSelectChange)  
 {
   this.groupundercode = event.value;
   console.log(event.value);
 }

 //Filter 
 applyFilter(filterValue: any)
  {        
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();      
  }


}
