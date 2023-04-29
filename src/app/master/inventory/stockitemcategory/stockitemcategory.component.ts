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
  selector: 'app-stockitemcategory',
  templateUrl: './stockitemcategory.component.html',
  styleUrls: ['./stockitemcategory.component.scss']
})
export class StockitemcategoryComponent implements OnInit {

  //Set Element Ref
  @ViewChild("ename") ename : ElementRef | undefined;
  @ViewChild("eunder") eunder : MatSelect | undefined;  
  @ViewChild("esave") esave : ElementRef | undefined;

  loading:boolean=false;
  //Variable Declaration
  categoryForm!: FormGroup;
  uniqueID:any;
  catcode:any;
  catname:any;
  catundername:any;  
  catundercode:any;    
  selectedID:any;  
  displayedColumns: string[] = ['CATEGORY_NAME','ACTIONS'];  
  dataSource!: MatTableDataSource<any>;
  savedData:any;    

  constructor(public api:ApiService, public dialog : MatDialog, public fb : FormBuilder) { }
  //Validators
  setValidations()
  {
    this.categoryForm = this.fb.group({      
      ccatname : ['', Validators.required],
      ccatunder : ['', Validators.required]     
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
    this.api.get_CategoryData().subscribe(res=>{      
      this.dataSource = new MatTableDataSource(res);  
      this.savedData = res;
      console.log(res);
    });
  }

  async getMaxCode()
  {   
    return new Promise((resolve) => { 
      this.api.get_CategoryMaxID().subscribe(res=>{        
        this.catcode = res;                     
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
            catcode: this.catcode,
            catname: this.catname,
            catunder: this.catundercode,
            rCreatedDateTime: new Date(),
            rStatus: "A"
        }            
        this.api.Inser_CateData(postData).subscribe(data => {                     
            let dialogRef = this.dialog.open(SuccessmsgComponent,
            {
                //width: '350px',
                data: "Category Successfully Saved!"
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
        })       
      });
    }, 200);   
  }
  update()
  {
    this.loading = true;
    setTimeout(() => {          
    var postData = {
        id: this.selectedID,
        catcode: this.catcode,
        catname: this.catname,
        catunder: this.catundercode,
        rCreatedDateTime: new Date(),
        rStatus: "A"
      }            
      console.log(postData);
      this.api.Update_CateData(this.selectedID,postData).subscribe(data => {                     
          let dialogRef = this.dialog.open(SuccessmsgComponent,
          {
              //width: '350px',
              data: "Category Successfully Updated!"
          });                       
          dialogRef.afterClosed().subscribe(result=>{
            this.clear();
            this.loaddata();
            this.getMaxCode();            
            this.setValidations();       
            this.categoryForm.reset();     
            this.ename?.nativeElement.focus(); 
            this.loading = false;           
          })          
      }, err => {
          console.log(err);
          alert("Some Error Occured");
      })   
    }, 200);    
  }
  clear()
  {
      this.catname = "";
      this.catundercode = "";
      this.selectedID=undefined;   
      this.setValidations();   
      this.categoryForm.reset();         
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
        this.catname = rowdata.catname;
        this.catundercode = rowdata.catunder;
        this.catcode = rowdata.catcode;       
        const catname = this.categoryForm.get('ccatname');
        catname?.clearValidators();
        catname?.clearAsyncValidators();
        catname?.updateValueAndValidity();  
      }
    });      
  }
  restore(rowdata:any)
  {    
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: "Do you confirm the Restoration of this Category data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {                                                    
        this.api.delete_LedgerGroup(rowdata.id).subscribe(data => {   
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
      data: "Do you confirm the deletion of this Category data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {                                                    
        this.api.Delete_CateData(rowdata.id).subscribe(data => {   
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

  //Enter Key Events (Focus)
  catNameEnter(event:any)
  {
    if(typeof this.catname!='undefined' && this.catname){
      {
          this.eunder?.focus();
      }
    }
  }
  catUnderEnter(event:any)
  {
    if(typeof this.catundercode!='undefined' && this.catundercode){
      {
        this.esave?.nativeElement.focus();
      }
    }
  } 

  //Dropdown Events
  changeCategory(event:MatSelectChange)  
  {
    this.catundercode = event.value;
    console.log("sel" +event.value);
    this.ename?.nativeElement.focus();
  }

   //Filter 
  applyFilter(filterValue: any)
  {        
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();      
  }

}
