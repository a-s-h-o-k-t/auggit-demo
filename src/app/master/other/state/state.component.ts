import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ApiService } from '../../../services/api.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {
  loading:boolean=false;
  stateForm !: FormGroup;
  constructor(public api: ApiService, public fb : FormBuilder,public dialog : MatDialog, public router:Router) { }
  uniqueID:any;  
  code:any;
  name:any;  
  displayedColumns: string[] = ['COUNTRY','STATE_NAME','STATE_CODE','ACTIONS'];  
  dataSource : any[] = [];
  countryData:any;
  selectedID:any;
  selectedCountry:any;

  changeCountry(event: MatSelectChange)
  {
    this.selectedCountry = event.value; 
    console.log(this.selectedCountry);     
  } 

  ngOnInit(): void {    
     console.log(this.selectedID);  
      this.setValidations();
      this.loaddata();   
      this.loadCountrydata();
  }

  setValidations()
  {
    this.stateForm = this.fb.group({
      cCountry : ['', Validators.required],    
      cname : ['', Validators.required],    
      ccode : ['', Validators.required],   
    })
  }

  loadCountrydata()
  {
    this.api.get_CountryData().subscribe(res=>{
      this.countryData = res;
      console.log(res);
    });
  }

  loaddata()
  {
    this.api.get_StateData().subscribe(res=>{
      this.dataSource = res;
      console.log(res);
    });
  }

  submit()
  {
    setTimeout(() => {          
      if(this.stateForm.valid)
      {
        this.loading=true;
        this.uniqueID = Guid.create();
        var postdata = 
        {
          id: this.uniqueID.value,
          country : this.selectedCountry,
          stetecode : this.code,      
          statename : this.name,
          rCreatedDateTime : new Date(),
          rStatus: "A"
        }
        console.log(postdata);
        this.api.Inser_StateData(postdata).subscribe(data => {                     
            let dialogRef = this.dialog.open(SuccessmsgComponent,
              {
                //width: '350px',
                data: "Country Successfully Saved!"
              });                       
            dialogRef.afterClosed().subscribe(result=>{
              this.clear();
              this.loaddata();
              this.loading=false;
            })          
        }, err => {
            console.log(err);
            alert("Some Error Occured");
        })     
      }
      else
      {
        Swal.fire({
          icon:'info',
          title:'Fill Mandatory Fields',
          text:'Plese fill all mandatory fields'
        })
      }
    }, 200);
  }

  update()
  {   
    setTimeout(() => {          
      if(this.stateForm.valid)
      { 
        this.loading=true;
        var postdata = 
        {
          id: this.selectedID,
          country : this.selectedCountry,
          stetecode : this.code,      
          statename : this.name,
          rCreatedDateTime : new Date(),
          rStatus: "A"
        }
        console.log(postdata);
        this.api.Update_StateData( this.selectedID,postdata).subscribe(data => {                     
            let dialogRef = this.dialog.open(SuccessmsgComponent,
              {
                //width: '350px',
                data: "Country Successfully Updated!"
              });                       
            dialogRef.afterClosed().subscribe(result=>{
                this.clear();
                this.loaddata();
                this.loading=false;
            })          
        }, err => {
            console.log(err);
            alert("Some Error Occured");
        })
      }
      else
      {
        Swal.fire({
          icon:'info',
          title:'Fill Mandatory Fields',
          text:'Plese fill all mandatory fields'
        })
      }
    }, 200);
  }
  
  restore(rowdata:any)
  {    
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: "Do you confirm the Restoration of this Country data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {                                                    
        this.api.Delete_StateData(rowdata.id).subscribe(data => {   
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
      data: "Do you confirm the deletion of this Country data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {                                                    
        this.api.Delete_StateData(rowdata.id).subscribe(data => {   
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
        this.selectedCountry = rowdata.country;
        this.code = rowdata.stetecode;
        this.name = rowdata.statename;        
      }
    });      
  }
 
  clear()
  {      
    this.selectedID=undefined;
    this.code = "";
    this.name = "";      
    this.stateForm.reset();
  }

}
