import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ApiService } from '../../../services/api.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {
  
  loading:boolean=false;
  countryForm !: FormGroup;
  constructor(public api:ApiService, public fb : FormBuilder,public dialog : MatDialog, public router:Router) { }
  uniqueID:any;
  selectedID:any;  
  cname:any;
  curname:any;
  curshortname:any;
  cursymbol:any;
  displayedColumns: string[] = ['COUNTRY_NAME', 'CURRENCY_NAME','CURRENCY_SHORT_NAME', 'CURRENCY_SYMBOL','ACTIONS'];  
  dataSource : any[] = [];

  ngOnInit(): void {         
      this.setValidations();
      this.loaddata();   
  }

  setValidations()
  {
    this.countryForm = this.fb.group({      
      ccname : ['', Validators.required],
      ccurname : ['', Validators.required],
      ccursname: ['', Validators.required],
      ccursymbol : ['', Validators.required],
    })
  }

  loaddata()
  {
    this.api.get_CountryData().subscribe(res=>{
      this.dataSource = res;
      console.log(res);
    });
  }

  submit()
  {
    setTimeout(() => {  
      if(this.countryForm.valid)
      {
        this.loading = true;
        this.uniqueID = Guid.create();
        var postdata = 
        {
          id: this.uniqueID.value,
          countryname: this.cname,
          currencyname: this.curname,
          currencyshortname : this.curshortname,
          currencysymbol: this.cursymbol,
          rCreatedDateTime : new Date(),
          rStatus: "A"
        }
        console.log(postdata);
        this.api.Inser_CountryData(postdata).subscribe(data => {                     
            let dialogRef = this.dialog.open(SuccessmsgComponent,
              {
                //width: '350px',
                data: "Country Successfully Saved!"
              });                       
            dialogRef.afterClosed().subscribe(result=>{
              this.clear();
              this.loaddata();
              this.loading = false;
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
      if(this.countryForm.valid)
      {
        this.loading = true;
        var postdata = 
        {
          id: this.selectedID,      
          countryname: this.cname,
          currencyname: this.curname,
          currencyshortname : this.curshortname,
          currencysymbol: this.cursymbol,
          rCreatedDateTime : new Date(),
          rStatus: "A"
        }
        console.log(postdata);
        this.api.Update_CountryData( this.selectedID,postdata).subscribe(data => {                     
            let dialogRef = this.dialog.open(SuccessmsgComponent,
              {
                //width: '350px',
                data: "Country Successfully Updated!"
              });                       
            dialogRef.afterClosed().subscribe(result=>{
                this.clear();
                this.loaddata();
                this.loading = false;
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
        this.api.Delete_CountryData(rowdata.id).subscribe(data => {   
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
        this.api.Delete_CountryData(rowdata.id).subscribe(data => {   
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
        this.cname = rowdata.countryname;
        this.curname = rowdata.currencyname;
        this.cursymbol = rowdata.currencysymbol;
      }
    });      
  }
 
  clear()
  {      
      this.selectedID=undefined;      
      this.cname = "";
      this.curname = "";
      this.cursymbol = "";
      this.countryForm.reset();
  }

}
