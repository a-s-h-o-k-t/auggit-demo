import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { map, Observable, startWith } from 'rxjs';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ApiService } from '../../../services/api.service';
import Swal from 'sweetalert2';

export interface lg {
  groupcode: string;
  groupname: string;      
}
@Component({
  selector: 'app-ledgerupdate',
  templateUrl: './ledgerupdate.component.html',
  styleUrls: ['./ledgerupdate.component.scss']
})
export class LedgerupdateComponent implements OnInit {

  loading:boolean=false;
  countryData:any;  
  stateData:any;

  ledgercode:any;
  parentTextBox = new FormControl('');  
  filteredParent !: Observable<lg[]>;
  parent: lg[] = [];
  showbank=false;
  //uniqueID:any;
  ledgerForm!:FormGroup;
  ledgerName:any;
  ledgerUnder:any;
  ledgerUnderName:any;  
  accholdername:any;
  accno:any;ifsccode:any;swiftcode:any;bankname:any;branchname:any;
  address:any;
  country:any;
  state:any;
  countrycode:any;
  statecode:any;
  pincode:any;gstin:any;
  oldid:any;

  private _filterParent(value: string): lg[] {         
    const filterValue = value.toLowerCase();
    return this.parent.filter((prod) =>
      prod.groupname.toLowerCase().includes(filterValue)
    )      
  }  

  constructor(public api:ApiService, public fb : FormBuilder,public dialog : MatDialog, public router:Router, public activatedRoute:ActivatedRoute) { }

  countrychange(event:any,val:any)
  { 
    console.log(val);           
    this.country = val.countryname;
    this.countrycode = val.countryname;  
  }

  statechange(event:any,val:any)
  {            
    console.log(val);
    this.state = val.statename;
    this.statecode = val.stetecode;  
  }

  loadParentGroup()
  {
    this.api.get_LedgerGroup().subscribe(res=>{
        this.parent = res;   
        this.filteredParent = this.parentTextBox.valueChanges.pipe(            
          startWith(''),
          map((prod) =>
            prod ? this._filterParent(prod) : this.parent.slice()
          )      
        );                                             
    });    
  }

  //loadFunctions
  loadCountrydata()
  {
    this.api.get_CountryData().subscribe(res=>{
      this.countryData = res;
      console.log(res);
    });
  }
  loadStatedata()
  {
    this.api.get_StateData().subscribe(res=>{
      this.stateData = res;
      console.log(res);
    });
  }

  parentChanged(event:any,r:any)
  {
    if (event.isUserInput == true) {     
    this.ledgerUnderName = r.groupname;    
    this.ledgerUnder = r.groupcode;    
    console.log(this.ledgerUnderName);        
    console.log(this.ledgerUnder);  
    var val = r.groupname.substring(0,4).toLowerCase();      
    if(val == "bank")    
      this.showbank = true;
    else    
      this.showbank = false;
    }        
  }

 cancelandGoBack()
 {
  this.router.navigateByUrl("ledgerlist");
 }


  gotoList()
  {
    this.router.navigateByUrl("ledgerlist");
  }

  setValidations(): void
  {
    this.ledgerForm = this.fb.group({
      cledgerName : ['', Validators.required],    
      cledgerUnder : ['', Validators.required], 
      caccholdername : ['', Validators.nullValidator],    
      caccno : ['', Validators.nullValidator], 
      cifsccode : ['', Validators.nullValidator], 
      cswiftcode : ['', Validators.nullValidator], 
      cbankname : ['', Validators.nullValidator], 
      cbranchname : ['', Validators.nullValidator], 
      caddress : ['', Validators.nullValidator], 
      cstate : ['', Validators.nullValidator], 
      ccountry : ['', Validators.nullValidator], 
      cpincode : ['', Validators.nullValidator], 
      cgstin : ['', Validators.nullValidator], 
    });
  }

  ngOnInit(): void {
   this.setValidations();
   this.loadParentGroup();   
   this.loadStatedata();
   this.loadCountrydata();

   this.oldid = this.activatedRoute.snapshot.paramMap.get('id');    
   this.api.get_LedgerDataWithID(this.oldid).subscribe(res=>{
       console.log("Previous",res);              
       this.ledgerName = res.companyDisplayName;
       this.ledgerUnderName = res.groupName;
       this.ledgerUnder = res.groupCode;
       this.ledgercode = res.ledgerCode;
       this.country = res.bilingCountry;
       this.state = res.stateName;
       this.statecode = res.stateCode;
       this.address = res.bilingAddress;
       this.pincode = res.bilingPincode;
       this.gstin = res.gstNo;
       this.accholdername = res.accholdername;
       this.accno = res.accNo;
       this.ifsccode = res.ifscCode;
       this.swiftcode = res.swiftCode;
       this.bankname = res.bankName;
       this.branchname = res.branch; 
       
       var val = res.groupName.substring(0,4).toLowerCase();      
       if(val == "bank")    
         this.showbank = true;
       else    
         this.showbank = false;           
   });
  }       

  validate()
  {
    if(this.ledgerUnder != undefined)
    {
      if(this.ledgerUnder.length == 0)
      {
        Swal.fire({
          icon: 'error',
          title: 'Select Ledger Group!',
          text: 'Please Select Ledger Group!'
        })
        return false;
      }
      else
      {
        return true;
      }
    } 
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Select Ledger Group!',
        text: 'Please Select Ledger Group!'
      })
      return false;
    }   
  }

  submit()
  {   
    var res = this.validate();
    if(res == true)
    { 
      if(this.ledgerForm.valid)
      {
        this.loading=true;
        setTimeout(() => {                       
            this.update();        
        }, 200); 
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
  }

  update()
  {
    if(this.address == null || this.address == undefined )
    {  this.address = ""; }
    if(this.country == null || this.country == undefined )
    {  this.country = ""; }
    if(this.statecode == null || this.statecode == undefined )
    {  this.statecode = ""; }
    if(this.pincode == null || this.pincode == undefined )
    {  this.pincode = ""; }
    if(this.gstin == null || this.gstin == undefined )
    {  this.gstin = ""; }
    if(this.state == null || this.state == undefined )
    {  this.state = ""; }
    if(this.statecode == null || this.statecode == undefined )
    {  this.statecode = ""; }
    if(this.accholdername == null || this.accholdername == undefined )
    {  this.accholdername = ""; }
    if(this.accno == null || this.accno == undefined )
    {  this.accno = ""; }
    if(this.ifsccode == null || this.ifsccode == undefined )
    {  this.ifsccode = ""; }
    if(this.swiftcode == null || this.swiftcode == undefined )
    {  this.swiftcode = ""; }
    if(this.bankname == null || this.bankname == undefined )
    {  this.bankname = ""; }
    if(this.branchname == null || this.branchname == undefined )
    {  this.branchname = ""; }
 
    //this.uniqueID = Guid.create();
    var postdata = {
      id: this.oldid,
      type: "",      
      salutation: "",
      firstName: "",
      lastName: "",
      ledgerCode: this.ledgercode,
      companyDisplayName: this.ledgerName,
      companyMobileNo: "",
      companyEmailID: "",
      companyWebSite: "",
      groupName: this.ledgerUnderName,
      groupCode: this.ledgerUnder.toString(),
      contactPersonName: "",
      contactPhone: "",
      designation: "",
      department: "",
      mobileNo: "",
      emailID: "",      
      currency: "",
      balancetoPay: "",
      balancetoCollect: "",
      paaymentTerm: "",
      creditLimit: "",
      bankDetails: "",
      stateName: this.state,
      stateCode: this.statecode,
      gstTreatment: "",
      gstNo: this.gstin,
      panNo: "",
      cinNo: "",
      bilingAddress: this.address,
      bilingCountry: this.country,
      bilingCity: "",
      bilingState: this.statecode,
      bilingPincode: this.pincode,
      bilingPhone: "",
      deliveryAddress: "",
      deliveryCountry: "",
      deliveryCity: "",
      deliveryState: "",
      deliveryPinCode: "",
      deliveryPhone: "",
      notes: "",
      rCreatedDateTime: new Date(),
      rStatus : 'A',
      accholdername: this.accholdername,
      accNo: this.accno,
      ifscCode: this.ifsccode,
      swiftCode: this.swiftcode,
      bankName: this.bankname,
      branch: this.branchname,      
    }
    console.log(postdata);

    this.api.Update_LedgerData(this.oldid,postdata).subscribe(data => {  
      this.loading = false;                   
      let dialogRef = this.dialog.open(SuccessmsgComponent,
        {        
          data: "Ledger Successfully Updated!"
        });                       
        dialogRef.afterClosed().subscribe(result=>{
          this.clearAll();
          this.loading = false;   
          this.router.navigateByUrl("ledgerlist");
        })          
      }, err => {
        console.log(err);
        alert("Some Error Occured");
        this.loading = false;   
    });
  }

  clearAll()
  {
    this.ledgercode = "";
    this.ledgerName = "";
    this.ledgerUnderName = "";
    this.ledgerUnder="";
    this.state="";
    this.statecode="";
    this.gstin="";  
    this.address="";
    this.country="";  
    this.statecode="";
    this.pincode="";

    this.accholdername="";
    this.accno="";
    this.ifsccode="";
    this.swiftcode="";
    this.bankname="";
    this.branchname="";   
    this.ledgerForm.reset();      
    this.setValidations();  
  }

  goback()
  {
    this.router.navigateByUrl("ledgerlist");
  }

  gotoNew(){
    this.router.navigateByUrl("ledger");
  }

}
