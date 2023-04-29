import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { ApiService } from '../../../services/api.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stockitem',
  templateUrl: './stockitem.component.html',
  styleUrls: ['./stockitem.component.scss']
})
export class StockitemComponent implements OnInit {

  @ViewChild("eitemname") eitemname : ElementRef | undefined;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  itemcode:any;
  itemname:any;
  itemsku:any="";
  itemhsn:any="";
  itemundercode:any; 
  itemcatcode:any;   
  itemuomcode:any;
  itemuomname:any;  
  taxabletype:any;   
  gst:any=0;
  cess:any=0;
  vat:any;
  rateofduty:any=1;  
  groupData:any;
  categoryData:any;
  uomData:any;
  gstapplicable:any = "NO";
  typeofsupply:any = "Goods";  
  itemForm!:FormGroup;
  selectedID:any;
  uniqueID:any;
  loading:boolean=false;

  gstreadonly:boolean=true;
  cessreadonly:boolean=true;

  constructor(public api:ApiService, public dialog : MatDialog, public fb : FormBuilder, public router : Router) { }

  ngAfterViewInit() {
    this.eitemname?.nativeElement.focus();
  }  

  ngOnInit(): void {
    this.setValidations();
    this.loadgroup();
    this.loadcategory();
    this.loaduom();
  }

  loadgroup()
  {
    this.api.get_GroupData().subscribe(res=>{
      console.log(res);
      this.groupData = res;
    })
  }
  loadcategory()
  {
    this.api.get_CategoryData().subscribe(res=>{
      console.log(res);
      this.categoryData = res;
    })
  }
  loaduom()
  {
    this.api.get_UOMData().subscribe(res=>{
      console.log(res);
      this.uomData = res;
    })
  }

  setValidations()
  {
    this.itemForm = this.fb.group({      
      citemname : ['', [Validators.required]],
      citemsku : ['', [Validators.nullValidator]],
      citemhsn : ['', [Validators.nullValidator]],
      citemunder : ['', [Validators.required]],
      citemcatcode : ['', [Validators.required]],
      citemuomcode : ['', [Validators.required]],
      ctaxabletype : ['', [Validators.required]],    
      cgst : ['', [Validators.nullValidator]],             
      ccess : ['', [Validators.nullValidator]],                 
      ctypeofsupply : ['', [Validators.nullValidator]],             
    })
  }

  async getMaxCode()
  {   
    return new Promise((resolve) => { 
      this.api.get_CategoryMaxID().subscribe(res=>{        
        this.itemcode = res;                     
        resolve({ action: 'success' });
      })   
    });
  }

  submit(){      
      if(this.itemForm.valid)
      {
        if(this.custumValidate() == true)
        {
          this.saveDetails();
        }
      }
      else
      {
        Swal.fire({
          icon:'info',
          title:'Fill Mandatory Fields',
          text:'Plese fill all mandatory fields'
        })
      }
  }

  custumValidate()
  {         
      var val;   
      if(this.taxabletype == "Taxable")
      {
        if(this.gst == "" || this.gst == undefined || this.gst == Number.isNaN)
        {          
          Swal.fire({
            icon: 'info',
            title: 'GST Error',
            text: 'Please Check GST Details'
          })          
          return false;
        }
        else{
          val = true;
        }
        if(this.cess == "" || this.cess == undefined || this.cess == Number.isNaN)
        {          
          Swal.fire({
            icon: 'info',
            title: 'CESS Error',
            text: 'Please Check CESS Details'
          })
          return false;
        } 
        else{
          val = true;
        }      
      }
      else
      {
        val = true;
      }     
      return val;   
  }

  saveDetails()
  {  
    if(this.itemsku == null || this.itemsku == undefined )
    {  this.itemsku = ""; }
    if(this.itemhsn == null || this.itemhsn == undefined )
    {  this.itemhsn = ""; }
    if(this.typeofsupply == null || this.typeofsupply == undefined )
    {  this.typeofsupply = "Goods"; }

    this.loading = true;
    setTimeout(() => {
      this.getMaxCode().then((res)=> {           
        this.uniqueID = Guid.create();
        var postData = {
            id: this.uniqueID.value,                   
            itemcode: this.itemcode,
            itemname: this.itemname,
            itemunder: this.itemundercode,
            itemcategory: this.itemcatcode,
            uom: this.itemuomcode,
            gstApplicable: this.gstapplicable,
            gstCalculationtype: "N/A",
            taxable: this.taxabletype,
            gst: this.gst,
            cess: this.cess,
            vat: this.vat,
            typeofSupply: this.typeofsupply,
            rateofDuty: this.rateofduty,        
            rCreatedDateTime: new Date(),
            rStatus: "A",
            itemsku: this.itemsku,
            itemhsn: this.itemhsn
        }            
        this.api.Insert_ItemData(postData).subscribe(data => {                     
            let dialogRef = this.dialog.open(SuccessmsgComponent,
            {
                //width: '350px',
                data: "Stock Item Successfully Saved!"
            });                       
            dialogRef.afterClosed().subscribe(result=>{
              this.getMaxCode();
              this.clear();                                      
            })          
        }, err => {
            console.log(err);
            alert("Some Error Occured");
            this.loading=false;
        })       
      });
    }, 200);  
  }

  clear()
  {
    this.itemname = "";
    this.itemsku = "";
    this.itemhsn = "";
    this.gst = "";
    this.cess = "";    
    this.loading = false;
    this.setValidations();  
    this.itemForm.reset();
    this.formDirective.resetForm();    
  }

  //Dropdown 
  changeGroup(event:any)
  {
      this.itemundercode = event.value;      
  }
  changeCategory(event:any)
  { 
      this.itemcatcode = event.value;
  }

  changeTOS(event:any)
  {    
    this.typeofsupply = event.source.triggerValue;  
  }

  changeTaxability(event:any)
  {    
    this.taxabletype = event.source.triggerValue;   
    console.log(this.taxabletype); 
    if(this.taxabletype == "Taxable"){ this.gstreadonly = false; this.cessreadonly= false;  this.gst="0"; this.cess="0"; }
    if(this.taxabletype == "Nil Rated"){ this.gstreadonly = true; this.cessreadonly= true; this.gst="0"; this.cess="0"; }
    if(this.taxabletype == "Exempt"){ this.gstreadonly = true; this.cessreadonly= true; this.gst="0"; this.cess="0"; }
    if(this.taxabletype == "Not Applicable"){ this.gstreadonly = true; this.cessreadonly= true; this.gst="0"; this.cess="0"; }
  }

  changeUOM(event:any)
  {    
    this.itemuomcode = event.value;
    this.itemuomname = event.source.triggerValue;
  }

  toggleGST()
  {
      if(this.gstapplicable == "YES")
      {
        this.gstapplicable = "NO";
      }
      else
      {
        this.gstapplicable = "YES";
      }

  }

  //Enter Key Events
  itemNameEnter(event:any)
  {
    if(typeof this.itemname!='undefined' && this.itemname){
      {
          //this.eunder?.focus();
      }
    }
  }

  gotoList()
  {
    this.router.navigateByUrl("/stockitemlist") ;
  }

}
