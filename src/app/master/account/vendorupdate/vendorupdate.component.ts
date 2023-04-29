import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ApiService } from '../../../services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendorupdate',
  templateUrl: './vendorupdate.component.html',
  styleUrls: ['./vendorupdate.component.scss']
})
export class VendorupdateComponent implements OnInit {

  loading:boolean=false;
  
  countryData:any;  
  stateData:any;
  
  uniqueID:any;
  vendorForm!: FormGroup;
  type:any;
  salutation:any;
  firstName:any;
  lastName:any;
  displayName:any;
  mobile:any;
  email:any;
  website:any;
  currency:any;
  balanceToPay:any;
  balanceToColl:any;
  paymentTerm:any;
  creditLimit:any;
  bankDetails:any;
  gstTreatment:any;
  gstNo:any;
  state:any;
  statecode:any;
  panNo:any;
  cinNo:any;
  bAddress:any;
  bCountry:any;
  bCity:any;
  bState:any;
  bPincode:any;
  bPhone:any;
  dAddress:any;
  dCountry:any;
  dCity:any;
  dState:any;
  dPincode:any;
  dPhone:any;
  cpName:any;
  cpPhone:any;
  cpDesignation:any;
  cpDepartment:any;
  cpMobile:any;
  cpEmail:any;
  remarks:any;

  regTypeData = [
    { text : 'Registred Business - Regular', value : 'Registred Business - Regular' },
    { text : 'Registred Business - Composition', value : 'Registred Business - Composition' },
    { text : 'Unregistred Business', value : 'Unregistred Business' },
    { text : 'Overseas Business', value : 'Overseas Business' },
    { text : 'Deemed Export', value : 'Deemed Export' },
  ]

  constructor(public api:ApiService, public fb : FormBuilder,public dialog : MatDialog, public router:Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.setValidations()
    this.loadCountrydata();
    this.loadStatedata();
    this.uniqueID = this.activatedRoute.snapshot.paramMap.get('id');    
    this.api.get_LedgerDataWithID(this.uniqueID).subscribe(res=>{
        console.log("Previous",res);
        this.type = res.type;
        this.salutation = res.salutation;
        this.firstName = res.firstName;
        this.lastName = res.lastName;
        this.displayName = res.companyDisplayName;
        this.mobile = res.companyMobileNo;
        this.email = res.companyEmailID;
        this.website = res.companyWebSite;
        this.currency = res.currency;
        this.statecode = res.stateCode;
        this.gstTreatment = res.gstTreatment;
        this.gstNo = res.gstNo;
        this.panNo = res.panNo;
        this.cinNo = res.cinNo;
        this.balanceToPay = res.balancetoPay;
        this.balanceToColl = res.balancetoCollect;
        this.paymentTerm = res.paaymentTerm;
        this.creditLimit = res.creditLimit;
        this.bankDetails = res.bankDetails;
        this.bAddress = res.bilingAddress;
        this.bCountry = res.bilingCountry;
        this.bCity = res.bilingCity;
        this.bState = res.bilingState;
        this.bPincode = res.bilingPincode;
        this.bPhone = res.bilingPhone;
        this.dAddress = res.deliveryAddress;
        this.dCountry = res.deliveryCountry;
        this.dCity = res.deliveryCity;
        this.dState = res.deliveryState;
        this.dPincode = res.deliveryPinCode;
        this.dPhone = res.deliveryPhone;

        this.cpName = res.contactPersonName;
        this.cpPhone = res.contactPhone;
        this.cpDesignation = res.designation;
        this.cpDepartment = res.department;
        this.cpMobile = res.mobileNo;
        this.cpEmail = res.emailID;
        this.remarks = res.notes;
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

  setValidations()
  {
    this.vendorForm = this.fb.group({      
      ctype:null,
      csalutation: null,
      cfirstName: ['', Validators.required],
      clastName: null,
      cdisplayName: ['', Validators.required],
      cmobile: ['', Validators.required],
      cemail: null,
      cwebsite: null,
      ccurrency:null,
      cbalanceToPay: null,
      cbalanceToColl: null,
      cpaymentTerm: null,
      ccreditLimit: null,
      cbankDetails: null,
      cgstTreatment:  ['', Validators.required],
      cgstNo:null,
      cstate:  ['', Validators.required],
      cstatecode:null,
      cpanNo:null,
      ccinNo:null,
      cbAddress:null,
      cbCountry:null,
      cbCity:null,
      cbState:null,
      cbPincode:null,
      cbPhone:null,
      cdAddress:null,
      cdCountry:null,
      cdCity:null,
      cdState:null,
      cdPincode:null,
      cdPhone:null,
      ccpName:null,
      ccpPhone:null,
      ccpDesignation:null,
      ccpDepartment:null,
      ccpMobile:null,
      ccpEmail:null,
      cremarks:null
    })
  }

  changeCurrency(event: MatSelectChange) 
  {
    this.currency = event.value;        
  } 
  changeGstTreatment(event: MatSelectChange)
  {
    this.gstTreatment = event.value;
  }
  changeState(event: MatSelectChange)
  {
    this.statecode = event.value;
    this.state = event.source.triggerValue      
  } 
  typeChange(event:any)
  {
    console.log(event.value);
    this.type = event.value;
  }

  submit()
  {
    if(this.vendorForm.valid)
    {
      this.loading = true;
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

  update()
  {    
    var postdata = {
      id: this.uniqueID,
      type: this.type,      
      salutation: this.salutation,
      firstName: this.firstName,
      lastName: this.lastName,
      companyDisplayName: this.displayName,
      companyMobileNo: this.mobile,
      companyEmailID: this.email,
      companyWebSite: this.website,
      groupName: "SUNDRY CREDITOR",
      groupCode: "LG0031",
      contactPersonName: this.cpName,
      contactPhone: this.cpPhone,
      designation: this.cpDesignation,
      department: this.cpDepartment,
      mobileNo: this.cpPhone,
      emailID: this.cpEmail,      
      currency: this.currency,
      balancetoPay: this.balanceToPay,
      balancetoCollect: this.balanceToColl,
      paaymentTerm: this.paymentTerm,
      creditLimit: this.creditLimit,
      bankDetails: this.bankDetails,
      stateName: this.state,
      stateCode: this.statecode,
      gstTreatment: this.gstTreatment,
      gstNo: this.gstNo,
      panNo: this.panNo,
      cinNo: this.cinNo,
      bilingAddress: this.bAddress,
      bilingCountry: this.bCountry,
      bilingCity: this.bCity,
      bilingState: this.bState,
      bilingPincode: this.bPincode,
      bilingPhone: this.bPhone,
      deliveryAddress: this.dAddress,
      deliveryCountry: this.dCountry,
      deliveryCity: this.dCity,
      deliveryState: this.dState,
      deliveryPinCode: this.dPincode,
      deliveryPhone: this.dPhone,
      notes: this.remarks,
      rCreatedDateTime: new Date(),
      rStatus : 'A'
    }
    console.log(postdata);
    this.api.Update_LedgerData(this.uniqueID,postdata).subscribe(data => { 
      this.loading = false;                    
      let dialogRef = this.dialog.open(SuccessmsgComponent,
        {
          //width: '350px',
          data: "Successfully Updated!"
        });                       
        dialogRef.afterClosed().subscribe(result=>{
          //this.clearAll();
          this.router.navigateByUrl("/vendorlist")  
        })          
      }, err => {
        console.log(err);
        alert("Some Error Occured");
    })     
  }

  gotoList()
  {
      this.router.navigateByUrl("vendorlist");
  }

  gotoNew()
  {
    this.router.navigateByUrl("vendor");
  }

  clearAll()
  {
    this.type="";
    this.salutation="";
    this.firstName="";
    this.lastName="";
    this.displayName="";
    this.mobile="";
    this.email="";
    this.website="";
    this.currency="";
    this.balanceToPay="";
    this.balanceToColl="";
    this.paymentTerm="";
    this.creditLimit="";
    this.bankDetails="";
    this.gstTreatment="";
    this.gstNo="";
    this.state="";
    this.statecode="";
    this.panNo="";
    this.cinNo="";
    this.bAddress="";
    this.bCountry="";
    this.bCity="";
    this.bState="";
    this.bPincode="";
    this.bPhone="";
    this.dAddress="";
    this.dCountry="";
    this.dCity="";
    this.dState="";
    this.dPincode="";
    this.dPhone="";
    this.cpName="";
    this.cpPhone="";
    this.cpDesignation="";
    this.cpDepartment="";
    this.cpMobile="";
    this.cpEmail="";
    this.remarks="";
  }

  goback()
  {
    this.router.navigateByUrl("vendorlist");
  }

}
