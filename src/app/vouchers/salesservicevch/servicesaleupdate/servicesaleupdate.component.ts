import { Component,ElementRef,OnInit,QueryList,ViewChild,ViewChildren,ɵpublishDefaultGlobalUtils } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { map, Observable, of, startWith, VirtualTimeScheduler } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { SsoService } from 'src/app/services/sso.service';
import Swal from 'sweetalert2';
import { PendingsoComponent } from '../../models/pendingso/pendingso.component';
import { ShowdelivaddressComponent } from '../../models/showdelivaddress/showdelivaddress.component';
import { AdddelivaddressComponent } from '../../models/adddelivaddress/adddelivaddress.component';
import { SsalesService } from 'src/app/services/ssales.service';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';

export interface iprodutcs {
  id:Guid;
  invno:any;
  invdate:Date;
  product: string;
  productcode: string;  
  sku: string;
  hsn: string;
  godown: string;
  qty: number;
  qtymt: string;
  rate: number;
  transport: number;
  packing: number;
  insurence: number;
  subtotal: number;  
  disc: number;
  discvalue: number;
  taxable: number;
  gst: number;
  gstvalue: number;
  amount: number;
  rCreatedDateTime: Date;
  rStatus: string;
  company:string;
  branch:string;
  fy:string,
  customercode:string;
  sono:string;
  sodate:string;vtype:string
}

export interface iaccounts {
  acccode:string;
  accname:string;
  accvalue:string;
  acckey:string;
}

export interface Vendor {
  CompanyDisplayName : string;
  id: string;
  BilingAddress: string;
}

export interface Product {
  itemname: string;
  itemcode: string;
  sku: string;
  hsn: string;
  gst: string;
}
export interface sref {
  refname : string;
}
export interface Acc {
  ledgername: string;
  ledgercode: string; 
}

@Component({
  selector: 'app-servicesaleupdate',
  templateUrl: './servicesaleupdate.component.html',
  styleUrls: ['./servicesaleupdate.component.scss']
})
export class ServicesaleupdateComponent implements OnInit {


  TDSData=[
    { id:0, name:'NO TDS', per:0 },
    { id:1, name:'COB [13%]', per:13 },
    { id:2, name:'Commission or Brokerage [5%]', per:5 },
    { id:3, name:'Dividend [10%]', per:10 },
    { id:4, name:'Other Interest than securities [10%]', per:10 },
    { id:5, name:'Professional Fees [10%]', per:10 }
  ]  

  @ViewChild('table') tabledata!: MatTable<Element>;
  @ViewChildren('eprod') private eprod!: QueryList<ElementRef>;
  @ViewChildren('esku') private esku!: QueryList<ElementRef>;
  @ViewChildren('ehsn') private ehsn!: QueryList<ElementRef>;
  @ViewChildren('eqty') private eqty!: QueryList<ElementRef>;
  @ViewChildren('erate') private erate!: QueryList<ElementRef>;
  @ViewChildren('eqtymt') private eqtymt!: QueryList<ElementRef>;
  @ViewChildren('edisc') private edisc!: QueryList<ElementRef>;
  @ViewChildren('ediscvalue') private ediscvalue!: QueryList<ElementRef>;
  @ViewChildren('etax') private etax!: QueryList<ElementRef>;
  @ViewChildren('etaxvalue') private etaxvalue!: QueryList<ElementRef>;
  @ViewChildren('eamt') private eamt!: QueryList<ElementRef>;
  @ViewChildren('egodown') private egodown!: QueryList<ElementRef>;
  @ViewChildren('etransport') private etransport!: QueryList<ElementRef>;
  @ViewChildren('epacking') private epacking!: QueryList<ElementRef>;

  //Venndors
  @ViewChild('evendorname') evendorname: ElementRef | undefined;

  filteredVendors!: Observable<Vendor[]>;
  vendorSearch = new FormControl('');
  vendorsArray: Vendor[] = [];
  vendors:any;

  salesRefArray: sref[] = [];
  filteredSref!: Observable<sref[]>;
  refSearch = new FormControl('');

  filteredProducts!: Observable<Product[]>;
  prodSearch = new FormControl('');
  prodArray: Product[] = [];

  filteredAccounts!: Observable<Acc[]>;
  accSearch = new FormControl('');
  accArray: Acc[] = [];
  accArrayFind:any;
  defaultAccounts: Acc[] = [];

  salesDiscountAcc: any;
  transportAcc:any;
  packingAcc:any;
  insurenceAcc:any;
  tcsAcc:any;
  roundingAcc:any;

  //Variables
  _company='1';
  _branch='1';
  _fy='1';
  formGRN!: FormGroup;  
  loading:boolean=false;
  vendorpodata:any;
  vendorpodatacount=0;  
  vendorcode: any;
  vendorname: any;  
  vendordiv = false;
  selectedvendor: any;
  vendorgstno: any;
  vendorbilling: any;
  vendordelivery: any;
  vendorgstTreatment: any;
  vendorstate: any;
  vendorstatecode: any;
  vendoroutstanding: any = 0.0;
  purchaseAccounts:any;
  invno: any;
  invdate: any;
  billno: any;
  pono: any;
  podate: any;
  vchtype: any;
  vchaccountcode:any;
  vchaccount: any;
  purchaseDiscount: any;
  refno: any;
  subinvno: any;
  subinvdate: any;
  expdelidate: any;
  subtotal: any = 0.0;
  disctotal: any = 0.0;
  gsttotal: any = 0.0;
  cgsttotal: any = 0.0;
  sgsttotal:any = 0.0;
  igsttotal:any = 0.0;  
  tdstotal:any = 0.00;
  roundedoff:any = 0.00;
  nettotal: any = 0.0;
  selectedID: any;
  tdstype:any;
  tdscode:any=0;  
  tdsper:any;
  paymentTerm:any;
  remarks:any;
  invoicecopy:any;
  insValue:any= 0.0;
  tcsvalue:any=0;
  tcsrate:any=0.0;
  sdef:any;
  
  tpRate:any= 0;
  tpValue:any= 0.0;
  pkRate:any= 0;
  pkValue:any= 0.0;
  insRate:any= 0;
  closingtotal: any = 0.0;
  showGST:any= false;
  salerefname:any;
  payterm:any;

  changeTDS(event:any)
  {
      this.tdscode = event.value;
      this.tdstype = event.source.triggerValue;  
      console.log(this.tdscode);
      console.log(this.tdstype);
      var value = this.TDSData.filter(e=> e.id == this.tdscode);      
      this.tdsper = value[0].per;
      this.calculate();
  } 

  getTotalQty() {
    return this.listData.data.map(t => t.qty).reduce((v, value) => v + value);
  }
  getTotalQtyMT() {
    return this.listData.data.map(t => t.qtymt).reduce((v, value) => v + value);
  }
  getTotalSub()
  {
    return this.listData.data.map(t => t.subtotal).reduce((v, value) => v + value);
  }
  getTotalTaxable()
  {
    return this.listData.data.map(t => t.taxable).reduce((v, value) => v + value);
  }
  getTotalAmount()
  {
    return this.listData.data.map(t => t.amount).reduce((v, value) => v + value);
  }

   
  ShowAddDelivery()
  {
    this.api.showDeliveryAddress(this.vendorcode).subscribe(res=>{         
        let dialogRef = this.dialog.open(ShowdelivaddressComponent,
        {
          maxWidth: '90vw',
          maxHeight: '90vh',
          height: '55%',
          width: '25%',
          panelClass: 'full-screen-modal'
        });   
        dialogRef.componentInstance.data = JSON.parse(res);               
        dialogRef.afterClosed().subscribe(result=>{  
          this.vendordelivery = result.addr;
      });    
    })  
  }

  AddDelivery()
  {
    let dialogRef = this.dialog.open(AdddelivaddressComponent,
      {
        maxWidth: '90vw',
        maxHeight: '90vh',
        height: '55%',
        width: '25%',
        panelClass: 'full-screen-modal'
      });   
    //dialogRef.componentInstance.data = "";               
    dialogRef.afterClosed().subscribe(result=>{  
        this.saveDeliveryAddress(result);
    });      
  }

  saveDeliveryAddress(addr:any)
  {
     var postdata={
      id: this.getGUID(),
      company: this._company,
      ledgercode: this.vendorcode,
      deliveryAddress: addr
     }     
     this.soapi.Inser_DelivertAddress(postdata).subscribe(res=>{      
      this.vendordelivery = addr;     
      Swal.fire({
        icon: 'success',
        title:'Saved',
        text:'Address Saved!'
      })                              
     });   
  }

  //Grid
  ELEMENT_DATA: iprodutcs[] = [
    {      
      id: this.getGUID(),
      invno:'1',
      invdate: new Date,
      product: '',
      productcode:'',
      sku: '',
      hsn: '',
      godown: '',
      qty: 0,
      qtymt: '',
      rate: 0,
      transport: 0,
      packing: 0,
      insurence: 0,
      subtotal: 0,
      disc: 0,
      discvalue: 0,
      taxable:0,
      gst: 0,
      gstvalue: 0,
      amount: 0,
      rCreatedDateTime:new Date,
      rStatus:'A',
      company:'',
      branch:'',
      fy:'',
      customercode:'',
      sono:'',
      sodate:'',vtype:''
    }
  ];
  dataSource = this.ELEMENT_DATA;
  listData!: MatTableDataSource<any>;
  displayedColumns: string[] = [
    'product',
    //'sku',      
    //'hsn',
    //'godown',
    'qty',
    //'qtymt',
    'rate',
    //'transport',
    //'packing',
    //'insurence',
    'subtotal',
    'disc',
    //'discvalue',
    'taxable',
    'gst',
    //'gstvalue',
    'amount',
    'select',
  ];
  
  ACC_DATA: iaccounts[] = [
    {
      acccode:'',
      accname:'',
      accvalue:'',
      acckey:'',
    }
  ]  
  
  accdataSource = this.ACC_DATA;
  acclistData!: MatTableDataSource<any>;
  accdisplayedColumns: string[] = [
    //'acccode',
    'accname',
    'accvalue',
    //'acckey'         
  ];

  addRow() {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        invno:'1',
        invdate: this.invdate,
        product: '',
        productcode:'',
        sku: '',
        hsn: '',
        godown: '',
        qty: 0,
        qtymt: '',
        rate: 0,
        transport: 0,
        packing: 0,
        insurence: 0,
        subtotal : 0,
        disc: 0,
        discvalue: 0,
        taxable:0,
        gst: 0,
        gstvalue: 0,
        amount: 0,
        rCreatedDateTime: new Date,
        rStatus:'A',
        company:'',
        branch:'',
        fy:'',
        customercode:'',sono:'',sodate:'',vtype:''
      };
      this.ELEMENT_DATA.push(newRow);

      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);          
        },
        (error) => {
          console.log(error);
        }
      );
      resolve({ action: 'success' });      
    });
  }
  remove(index: any) {
    if (this.listData.data.length > 1) 
    {
      this.listData.data.splice(index, 1);
      this.listData.data = [...this.listData.data]; // new ref!
      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
      console.log(this.listData);
      //this.accemprtyGrid();
      this.calculate();
    }
  }
  removeAll() {   
    this.listData.data.splice(0, this.listData.data.length);
      this.listData.data = [...this.listData.data]; // new ref!
      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
      this.addRow();
  }
  emprtyGrid() {   
    this.listData.data.splice(0, this.listData.data.length);
      this.listData.data = [...this.listData.data]; // new ref!
      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );      
  }
  showGst()
  {
    if(this.showGST == true)
    {
      this.showGST = false
    }
    else
    {
      this.showGST = true;
    }
  }
  //Account Grid
  accaddRow() {
    return new Promise((resolve) => {
      const newRow = {        
        acccode:'',
        accname:'',
        accvalue:'',
        acckey:''        
      };
      this.ACC_DATA.push(newRow);
      of(this.ACC_DATA).subscribe(
        (data: iaccounts[]) => {
          this.acclistData = new MatTableDataSource(data);          
        },
        (error) => {
          console.log(error);
        }
      );
      resolve({ action: 'success' });      
    });
  }    
  accremove(index: any) {
    if (this.acclistData.data.length > 1) 
    {
      this.acclistData.data.splice(index, 1);
      this.acclistData.data = [...this.acclistData.data]; // new ref!
      of(this.ACC_DATA).subscribe(
        (data: iaccounts[]) => {
          this.acclistData = new MatTableDataSource(data);
          console.log(data);
        },
        (error) => {
          console.log(error);
        }
      );
      console.log(this.acclistData);
    }
  }
  accremoveAll() {         
    this.acclistData.data.splice(0, this.acclistData.data.length);
      this.acclistData.data = [...this.acclistData.data]; // new ref!
      of(this.ACC_DATA).subscribe(
        (data: iaccounts[]) => {
          this.acclistData = new MatTableDataSource(data);          
        },
        (error) => {
          console.log(error);
        }
      );
      //this.addNewAccDataRow();
  } 
  
  constructor(public salesapi: SsalesService, public fb: FormBuilder,
     public dialog: MatDialog, public api:ApiService,public soapi:SsoService,public activatedRoute:ActivatedRoute, public router: Router) {}

  getGUID()
  {
    var gid:any;
    gid = Guid.create();
    return gid.value;
  }

  getMaxInvoiceNo()
  {
    // return new Promise((resolve) => { 
    //   this.salesapi.getMaxInvoiceNo().subscribe(res=>{
    //       this.invno = res;
    //       resolve({ action: 'success' });
    //   })
    // });
  }
  
  changeVendor()
  {
    this.selectedvendor = undefined;  
    this.vendorcode = "";
    this.vendorname = "";
    this.vendorgstno = "";
    this.vendorbilling = "";
    this.vendorgstTreatment = "";
    this.vendorstate = "";
    this.vendorstatecode = "";
  }

  setValidator()
  {
    this.formGRN = this.fb.group({
      cpacc: ['', [Validators.nullValidator]],
      cinvno: ['', [Validators.required]],
      cinvdate: ['', [Validators.required]],
      cvendorname: ['', [Validators.required]],
      cpono: ['', [Validators.nullValidator]],    
      cpodate: ['', [Validators.nullValidator]], 
      cvchtype : ['', [Validators.nullValidator]], 
      cvchaccount : ['', [Validators.nullValidator]], 
      crefno: ['', [Validators.nullValidator]],   
      csubinvno: ['', [Validators.nullValidator]],   
      csupinvdate: ['', [Validators.nullValidator]] ,
      cexpdelidate: ['', [Validators.nullValidator]] ,
      cpaymentTerm: ['', [Validators.nullValidator]] ,
    });
  }

  ngAfterViewInit()
  {
    //if(this.vchtype == undefined)
    //{
     //this.callChangeVoucherType();
    //}
  } 

  ngOnInit(): void {   
    this.invdate = new Date;     
    this.setValidator();       
    this.loadCustomers();    
    this.loadProducts();
    this.loadSalesAccounts();
    this.loadDefalutAccounts();
    // this.getMaxInvoiceNo();
    // this.loadsdef();
    this.loadSavedAccounts();
    this.loadSaleRef();

    //Add Empty Line to data GRID
    of(this.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);        
      },
      (error) => {
        console.log(error);
      }
    );        
    //Add Empty Line to Accounts GRID
    of(this.ACC_DATA).subscribe(
      (data: iaccounts[]) => {
        this.acclistData = new MatTableDataSource(data);        
      },
      (error) => {
        console.log(error);
      }
    );    
    // if(this.vchtype == undefined)
    // {
    //  this.callChangeVoucherType();
    // }
    this.invno = this.activatedRoute.snapshot.paramMap.get('id');    
    this.loadPreviousBills();

  } 
  

  // loadPreviousBills()
  // {
  //   this.loadSO();
  //   this.loadSODetails();
  //   this.applyTRRate(this.tpRate);
  //       this.applyPKRate(this.pkRate);        
  //       this.applyINRate(this.insRate); 
  //       this.textBoxCalculation();   
  // }

  loadSavedSdef()
  {
    this.salesapi.getSavedDefSalesFields(this.invno).subscribe((res) => {
      this.sdef = JSON.parse(res);
      if(this.sdef.length==0)
      {
        this.loadsdef();
      }  
    });
  }

  loadSavedSdefFromSO(pono:any)
  {
    this.soapi.getSavedDefSOFields(pono).subscribe((res) => {
      this.sdef = JSON.parse(res);      
      if(this.sdef.length==0)
      {
        this.loadsdef();
      } 
    });
  }
 
  loadPreviousBills()
  {
    this.vchtype = "Service Sale";
    this.loadSavedSdef();
     this.loadSODetails().then(res=>{
      this.loadSO().then(res=>{
        setTimeout(() => {         
          this.applyTRRate(this.tpRate);
          this.applyPKRate(this.pkRate);        
          this.applyINRate(this.insRate); 
          this.textBoxCalculation();   
        }, 100);        
      });
    })        
  }


  loadSO()
  {
    return new Promise((resolve) => { 
      this.salesapi.get_Sales(this.invno).subscribe((res)=>{  
        console.log("po",res);        
        this.pono = res[0].sono;
        this.podate = res[0].sodate;
        this.expdelidate = res[0].expDeliveryDate;
        this.refno = res[0].refno;
        this.vendorcode = res[0].customercode;      
        this.vendorname = res[0].customername;
        this.remarks = res[0].remarks;
        this.roundedoff = res[0].roundedoff;
        this.tpRate = res[0].trRate;
        this.pkRate = res[0].pkRate;
        this.insRate = res[0].inRate;
        this.tcsrate = res[0].tcsRate;     
        this.salerefname = res[0].salerefname;    
        this.vendordelivery = res[0].deliveryaddress;         
        this.expdelidate = res[0].expDeliveryDate;
        this.refno = res[0].ref;
        this.vendorcode = res[0].customercode;
        this.vendorname = res[0].customername;
        this.remarks = res[0].remarks;
        this.roundedoff = res[0].roundedoff;      
        this.subinvno = res[0].vinvno;
        this.subinvdate = res[0].vinvdate;
        this.expdelidate = res[0].expDeliveryDate;      
        this.refno = res[0].refno;
        this.salerefname =  res[0].salerefname;
        this.payterm = res[0].payTerm;              
        //this.vchtype = res[0].vchtype; 
        this.findvendor(this.vendorcode); 
        this.findsalesAccount(res[0].saleaccount); 
        resolve({ action: 'success' });    
      });
    });
  }
  findvendor(code:any)
  {
    const found = this.vendors.find((obj:any) => {
      return obj.LedgerCode === parseInt(code);
    });           
    this.vendorgstno = found.GSTNo;
    this.vendorbilling = found.BilingAddress;
    this.vendordelivery = found.DeliveryAddress;
    this.vendorgstTreatment = found.GSTTreatment;
    this.vendorstate = found.StateName;
    this.vendorstatecode = found.stateCode;
  }
  findsalesAccount(code:any)
  {
    console.log("Sales account",code);
    const found = this.accArrayFind.find((obj:any) => {
      return obj.ledgercode === parseInt(code);
    }); 
    console.log("Found Sales account",found);
    this.vchaccount = found.ledgername;  
    this.vchaccountcode= found.ledgercode;  
  }
  loadSODetails()
  {
    return new Promise((resolve) => {
    this.emprtyGrid();
    this.salesapi.get_SalesDetails(this.invno).subscribe(res=>{          
      console.log(res);  
      res.forEach((v:any) => {                      
        this.addDataRow(v.productcode,v.product,v.sku,v.hsn,v.godown,v.qty,v.qtymt,v.rate,v.disc,v.gst);
      });
      this.textBoxCalculation();
      });
      resolve({ action: 'success' });    
    });
  }  

  loadSavedAccounts()
  {
    this.salesapi.getSavedAccounts().subscribe((res) => {
        console.log(res);   
        this.salesDiscountAcc = res[0].discAcc;
        this.transportAcc = res[0].tranAcc;
        this.packingAcc = res[0].packAcc;
        this.insurenceAcc = res[0].insuAcc;
        this.tcsAcc = res[0].tcsAcc;   
        this.roundingAcc = res[0].rounding;      
    });
  }

  loadSaleRef() {
    this.soapi.get_SaleRef().subscribe((res) => {
      this.salesRefArray = res;   
      this.filteredSref = this.refSearch.valueChanges.pipe(
        startWith(''),
        map((vendor) =>
          vendor ? this._filterref(vendor) : this.salesRefArray.slice()
        )
      );
    });
  }
  private _filterref(value: string): sref[] {
    const filterValue = value.toLowerCase();
    return this.salesRefArray.filter((vendor) =>
      vendor.refname.toLowerCase().includes(filterValue)
    );
  }
  changeRef()
  {
    this.salerefname = "";         
  }

  SaleRefChanged(event: any, data: any)
  {    
    this.salerefname = data.refname;
  }
  loadsdef() {
    this.soapi.getDefSOFields().subscribe((res) => {
      this.sdef = res; 
      console.log("def",this.sdef);
    });
  }

  callChangeVoucherType()
  {
      // let dialogRef = this.dialog.open(ServicesaleComponent,
      // {         
      // });                       
      // dialogRef.afterClosed().subscribe(result=>{                                    
      //    this.vchtype = result.vtype;
      //    //this.vchaccount = result.vacco;
      // });
      this.vchtype = "Service Sale"
  }
  
  loadCustomers() {
    this.salesapi.getCustomers().subscribe((res) => {
      this.vendorsArray = JSON.parse(res);
      this.vendors = JSON.parse(res);
      this.findvendor(this.vendorcode);  
      console.log("Vendors",this.vendorsArray);
      this.filteredVendors = this.vendorSearch.valueChanges.pipe(
        startWith(''),
        map((vendor) =>
          vendor ? this._filtercustomers(vendor) : this.vendorsArray.slice()
        )
      );
    });
  }
  private _filtercustomers(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendorsArray.filter((vendor) =>
      vendor.CompanyDisplayName.toLowerCase().includes(filterValue)
    );
  }

  loadProducts() {
    this.salesapi.getProducts().subscribe((res) => {
      this.prodArray = res;            
    });
  }
  filterProducts(name: string) {
    return name &&  this.prodArray.filter(
      items => items.itemname.toLowerCase().includes(name?.toLowerCase())
    ) || this.prodArray;
  }
 
  loadSalesAccounts()
  {
    this.salesapi.getSalesAccounts().subscribe(res=>{
      this.accArray = JSON.parse(res);   
      this.accArrayFind= JSON.parse(res);   
      console.log("acc", this.accArray)       ;
       this.filteredAccounts = this.accSearch.valueChanges.pipe(
         startWith(''),
         map((acc) =>
           acc ? this._filterAccounts(acc) : this.accArray.slice()
         )
       );
    });
  }
  private _filterAccounts(value: string): Acc[] {
    const filterValue = value.toLowerCase();
    return this.accArray.filter((acc) =>
      acc.ledgername.toLowerCase().includes(filterValue)
    );
  }

  loadDefalutAccounts()
  {
    this.salesapi.getDefaultAccounts().subscribe(res=>{
      this.defaultAccounts = JSON.parse(res); 
      console.log(this.defaultAccounts);      
    });
  } 
  filterDefAccounts(name: string) {
    return name &&  this.defaultAccounts.filter(
      accs => accs.ledgername.toLowerCase().includes(name?.toLowerCase())
    ) || this.defaultAccounts;
  }

  selectVendor()
  {
    this.vendordiv = true;
    this.evendorname?.nativeElement.focus();
  }

  //Dropdown Functions
  vendorChanged(event: any, data: any) {
    if (event.isUserInput == true) {      
      this.salesapi.getPendingSOListDetails(data.LedgerCode).subscribe(res=>{                    
          this.vendorpodatacount = res.length;
          this.vendorpodata = res;
          console.log(res);
      });
      this.selectedvendor = data;  
      this.vendorcode = data.LedgerCode.toString();
      this.vendorname = data.CompanyDisplayName;    
      this.vendorgstno = data.GSTNo;
      this.vendorbilling = data.BilingAddress;
      this.vendorgstTreatment = data.GSTTreatment;
      this.vendorstate = data.StateName;
      this.vendorstatecode = data.stateCode;
      this.calculate();
    }
  }

  accountChanged(event: any, data: any)
  {
    if (event.isUserInput == true) { 
      this.vchaccountcode = data.ledgercode;
      // if(this.acclistData.filteredData.length>0)
      // {  
      //   this.acclistData.filteredData[0].acccode = data.ledgercode;
      // }
    }
  }

  accChanged(event: any, data: any, rowindex: any)
  {
     if (event.isUserInput == true) {
       console.log(data);
       this.acclistData.filteredData[rowindex].acccode = data.ledgercode;
     }
  }
  
  prodChanged(event: any, data: any, rowindex: any) {    
    if (event.isUserInput == true) {       
      console.log(rowindex);
      console.log(data);
      console.log(this.listData);
      console.log(data.itemname);
      this.listData.filteredData[rowindex].product = data.itemname.toString();       
      this.listData.filteredData[rowindex].productcode = data.itemcode.toString(); 
      this.listData.filteredData[rowindex].sku = data.itemsku; 
      this.listData.filteredData[rowindex].hsn = data.itemhsn; 
      console.log(this.listData);
      console.log(this.listData.filteredData[rowindex].product);
      console.log(this.listData);
      this.egodown.toArray()[rowindex].nativeElement.value = "";
      this.egodown.toArray()[rowindex].nativeElement.focus();
    }
  }

  getPayTerm(event:any,)
  {
    this.paymentTerm = event.source.triggerValue;    
  }

  ongodownKeydown(event: any, rowindex: any)
  {
    //this.eqty.toArray()[rowindex].nativeElement.value = '';
    this.eqty.toArray()[rowindex].nativeElement.select();
    this.eqty.toArray()[rowindex].nativeElement.focus();
  }

  onProdKeydown(event: any, rowindex: any) {    
    //this.egodown.toArray()[rowindex].nativeElement.value = "";
    this.egodown.toArray()[rowindex].nativeElement.select();
    this.egodown.toArray()[rowindex].nativeElement.focus();
  }

  onSkuKeydown(event: any, rowindex: any) {
    this.ehsn.toArray()[rowindex].nativeElement.select();
    this.ehsn.toArray()[rowindex].nativeElement.focus();
  }

  onHsnKeydown(event: any, rowindex: any) {
    //this.eqty.toArray()[rowindex].nativeElement.value = '';
    this.eqty.toArray()[rowindex].nativeElement.select();
    this.eqty.toArray()[rowindex].nativeElement.focus();
  }


  onAccAmountKeyup(event:any)
  {
    this.calculateall();
  }

 
  textBoxCalculation()
  {
    for(let i=0;i< this.listData.filteredData.length;i++)
    {
      var qty = this.listData.filteredData[i].qty;
      var qtymt = this.listData.filteredData[i].qtymt;
      if(qty == ""){qty="0";}      
      var totqty = parseFloat(qty);
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing;
      var insurence = this.listData.filteredData[i].insurence;
      if(transport == ""){transport="0";}
      if(packing == ""){packing="0";}
      if(insurence == ""){insurence="0";}
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    this.calculate();    
  }

  onQtyKeydown(event: any, rowindex: any) {       
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){ qty = "0";
    this.listData.filteredData[rowindex].qty = 0;      
    }
    var totqty = parseFloat(qty);
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.eqtymt.toArray()[rowindex].nativeElement.select();
    this.eqtymt.toArray()[rowindex].nativeElement.focus();    
  }

  onQtyMTKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){ qty = "0";
    this.listData.filteredData[rowindex].qty = 0;      
    }
    var totqty = parseFloat(qty);
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();    
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.listData.filteredData[rowindex].qtymt = qtymt;
    this.erate.toArray()[rowindex].nativeElement.select();
    this.erate.toArray()[rowindex].nativeElement.focus();    
  }

  onRateKeydown(event: any, rowindex: any) { 
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    var totqty = parseFloat(qty);  
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.listData.filteredData[rowindex].rate = rate;
    this.edisc.toArray()[rowindex].nativeElement.select()
    this.edisc.toArray()[rowindex].nativeElement.focus();  
  }

  onTransportRateKeydown(event: any, rowindex: any) {                
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    var totqty = parseFloat(qty);
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    var transport = this.listData.filteredData[rowindex].transport;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    if(transport == "" || transport == null || transport == undefined){transport="0";}      
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,0,0);
    this.calculate();
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.listData.filteredData[rowindex].transport = transport;
    this.epacking.toArray()[rowindex].nativeElement.select()
    this.epacking.toArray()[rowindex].nativeElement.focus();    
  }

  onPackingRateKeydown(event: any, rowindex: any) {    
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    var totqty = parseFloat(qty);
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;    
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    if(transport == "" || transport == null || transport == undefined){transport="0";}    
    if(packing == "" || packing == null || packing == undefined){packing="0";}        
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,0);
    this.calculate();
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.listData.filteredData[rowindex].packing = packing;
    this.edisc.toArray()[rowindex].nativeElement.select()
    this.edisc.toArray()[rowindex].nativeElement.focus();    
  }

  onInsurenceRateKeydown(event: any, rowindex: any) {    
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    var totqty = parseFloat(qty); 
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;    
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing;
    var insurence = this.listData.filteredData[rowindex].insurence;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    if(transport == "" || transport == null || transport == undefined){transport="0";}    
    if(packing == "" || packing == null || packing == undefined){packing="0";} 
    if(insurence == "" || insurence == null || insurence == undefined){insurence="0";}       
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,insurence);
    this.calculate();
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.listData.filteredData[rowindex].packing = packing;
    this.edisc.toArray()[rowindex].nativeElement.select()
    this.edisc.toArray()[rowindex].nativeElement.focus();    
  }

  onDiscKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    var totqty = parseFloat(qty);
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;    
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing;
    var insurence = this.listData.filteredData[rowindex].insurence;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    if(transport == "" || transport == null || transport == undefined){transport="0";}    
    if(packing == "" || packing == null || packing == undefined){packing="0";} 
    if(insurence == "" || insurence == null || insurence == undefined){insurence="0";} 
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,insurence);
    this.calculate();
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.etax.toArray()[rowindex].nativeElement.select();
    this.etax.toArray()[rowindex].nativeElement.focus();    
  }

  onTaxKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    var totqty = parseFloat(qty);
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;    
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing;
    var insurence = this.listData.filteredData[rowindex].insurence;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    if(transport == "" || transport == null || transport == undefined){transport="0";}    
    if(packing == "" || packing == null || packing == undefined){packing="0";} 
    if(insurence == "" || insurence == null || insurence == undefined){insurence="0";} 
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,insurence);
    this.calculate();
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.eamt.toArray()[rowindex].nativeElement.focus();    
  }

  onAmountKeydown(event: any, rowindex: any) {   
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    var totqty = parseFloat(qty);
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;    
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing;
    var insurence = this.listData.filteredData[rowindex].insurence;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    if(transport == "" || transport == null || transport == undefined){transport="0";}    
    if(packing == "" || packing == null || packing == undefined){packing="0";} 
    if(insurence == "" || insurence == null || insurence == undefined){insurence="0";} 
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,insurence);
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    if (rowindex + 1 == this.listData.data.length) {
      this.addRow().then((res) => {
        setTimeout(() => {
          this.eprod.toArray()[rowindex + 1].nativeElement.select();
          this.eprod.toArray()[rowindex + 1].nativeElement.focus();
        }, 500);
      });
    }
    else
    {
      this.eprod.toArray()[rowindex + 1].nativeElement.select();
      this.eprod.toArray()[rowindex + 1].nativeElement.focus();
    }
    this.calculate();
  }

  onCalculation(qty: any, rate: any, disc: any, gst: any, index: any,transport:any,packing:any,insurence:any) {    
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}
    if(transport == "" || transport == null || transport == undefined){transport="0";}
    if(packing == "" || packing == null || packing == undefined){packing="0";}
    if(insurence == "" || insurence == null || insurence == undefined){insurence="0";}
    
    var sub = (parseFloat(qty) * parseFloat(rate));
    var totalrate = (parseFloat(qty) * parseFloat(rate)) + (parseFloat(transport) + parseFloat(packing) + parseFloat(insurence));
    //console.log(totalrate);
    var discvalue = ((totalrate * parseFloat(disc)) / 100).toFixed(2);
    //console.log(discvalue);
    var afterdisc = totalrate - parseFloat(discvalue);
    //console.log(afterdisc);
    var gstvalue = ((afterdisc * parseFloat(gst)) / 100).toFixed(2);
    //console.log(gstvalue);
    var net = afterdisc + parseFloat(gstvalue);
    //console.log(net);
    this.listData.filteredData[index].subtotal = sub.toFixed(2);    
    this.listData.filteredData[index].taxable = afterdisc.toFixed(2);
    this.listData.filteredData[index].amount = net.toFixed(2);    
    this.listData.filteredData[index].gstvalue = gstvalue;
    this.listData.filteredData[index].discvalue = discvalue;
    this.listData._updateChangeSubscription();
    this.getTotal();
  }       

  totQty:any=0;
  totQtyMT:any=0;
  totSub:any=0;
  totTax:any=0;
  totAmt:any=0;
  totTaxValue:any=0;
  getTotal()
  {
    this.totQty = 0;
    this.totQtyMT = 0;
    this.totSub = 0;
    this.totTax = 0;
    this.totTaxValue = 0;
    this.totAmt = 0;    
    for(let i=0;i<this.listData.filteredData.length;i++)
    {      
      this.totQty = this.totQty + parseFloat(this.listData.filteredData[i].qty);
      this.totQtyMT = this.totQtyMT + parseFloat(this.listData.filteredData[i].qtymt);
      this.totSub = this.totSub + parseFloat(this.listData.filteredData[i].subtotal);
      this.totTax = this.totTax + parseFloat(this.listData.filteredData[i].taxable);
      this.totTaxValue = this.totTaxValue + parseFloat(this.listData.filteredData[i].gstvalue);
      this.totAmt = this.totAmt + parseFloat(this.listData.filteredData[i].amount);      
    }
    this.totQty = this.totQty.toFixed(2);
    this.totQtyMT = this.totQtyMT.toFixed(2);
    this.totSub = this.totSub.toFixed(2);
    this.totTax = this.totTax.toFixed(2);
    this.totTaxValue = this.totTaxValue.toFixed(2);
    this.totAmt = this.totAmt.toFixed(2);    
  }  
  

  
  applyTransportValue(event:any)
  {    
    var T = event.target.value;   
    var _totqty = 0;
    var _qty = "0";
    var _qtymt = "0";     
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      _qty = this.listData.filteredData[i].qty;
      _qtymt = this.listData.filteredData[i].qtymt;
      if(_qty == "" || _qty == null || _qty == undefined){ _qty = "0"; }
      if(_qtymt == "" || _qtymt == null || _qtymt == undefined){ _qtymt = "0"; }       
      _totqty = _totqty + parseFloat(_qty)+ parseFloat(_qtymt);
    }
    var eachRowValue = parseFloat(T) / _totqty;
    this.tpRate = eachRowValue.toFixed(2);  
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";     
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt; 
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);
      var rate = this.listData.filteredData[i].rate;         
      this.listData.filteredData[i].transport = ( totqty * eachRowValue ).toFixed(2);      
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;  
         
      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    this.calculate();
  }
  applyTransportRate(event:any)
  {    
    var T = event.target.value;      
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";                
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;     
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);         
      this.listData.filteredData[i].transport = totqty * parseFloat(T)      
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;  
      
      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }

      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totTransport=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totTransport =  totTransport + parseFloat(this.listData.filteredData[i].transport);
    }
    this.tpValue = totTransport.toFixed(2);
    this.calculate();
  }

  applyPackingValue(event:any)
  {  
    var T = event.target.value;   
    var _totqty = 0;
    var _qty = "0";
    var _qtymt = "0";     
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      _qty = this.listData.filteredData[i].qty;
      _qtymt = this.listData.filteredData[i].qtymt; 
      if(_qty == "" || _qty == null || _qty == undefined){ _qty = "0"; }
      if(_qtymt == "" || _qtymt == null || _qtymt == undefined){ _qtymt = "0"; }        
      _totqty = _totqty + parseFloat(_qty)+ parseFloat(_qtymt);
    }
    var eachRowValue = parseFloat(T) / _totqty;
    this.pkRate = eachRowValue.toFixed(2);  
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";     
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;   
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);
      var rate = this.listData.filteredData[i].rate;         
      this.listData.filteredData[i].packing = ( totqty * eachRowValue ).toFixed(2);      
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;   

      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }
        
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    this.calculate();        
  }  
  applyPackingRate(event:any)
  {    
    var P = event.target.value;       
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";         
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;89
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);   
      this.listData.filteredData[i].packing = totqty * parseFloat(P)
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;   
      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }  
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totPacking=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totPacking = totPacking + parseFloat(this.listData.filteredData[i].packing);
    }
    this.pkValue = totPacking.toFixed(2);
    this.calculate();
  }

  applyInsurenceValue(event:any)
  {    
    var T = event.target.value;   
    var _totqty = 0;
    var _qty = "0";
    var _qtymt = "0";     
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      _qty = this.listData.filteredData[i].qty;
      _qtymt = this.listData.filteredData[i].qtymt;   
      if(_qty == "" || _qty == null || _qty == undefined){ _qty = "0"; }
      if(_qtymt == "" || _qtymt == null || _qtymt == undefined){ _qtymt = "0"; }    
      _totqty = _totqty + parseFloat(_qty)+ parseFloat(_qtymt);
    }
    var eachRowValue = parseFloat(T) / _totqty;
    this.insRate = eachRowValue.toFixed(2);  
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";     
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);
      var rate = this.listData.filteredData[i].rate;         
      this.listData.filteredData[i].insurence = ( totqty * eachRowValue ).toFixed(2);      
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    this.calculate();        
  }
  applyInsurenceRate(event:any)
  {    
    var I = event.target.value;       
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);   
      this.listData.filteredData[i].insurence = totqty * parseFloat(I)
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totinsurence=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totinsurence = totinsurence + parseFloat(this.listData.filteredData[i].insurence);
    }
    this.insValue = totinsurence.toFixed(2);
    this.calculate();
  }


  applyTRRate(value:any)
  {      
    var T = value;      
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";                
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;     
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);        
      this.listData.filteredData[i].transport = totqty * parseFloat(T)      
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;  
      
      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }

      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totTransport=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totTransport =  totTransport + parseFloat(this.listData.filteredData[i].transport);
    }
    this.tpValue = totTransport.toFixed(2);
    this.calculate();
  }
  applyPKRate(value:any)
  {     
    var P = value;       
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";         
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;89
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);    
      this.listData.filteredData[i].packing = totqty * parseFloat(P)
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;   
      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }  
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totPacking=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totPacking = totPacking + parseFloat(this.listData.filteredData[i].packing);
    }
    this.pkValue = totPacking.toFixed(2);
    this.calculate();
    this.calculate();        
  }  
  applyINRate(value:any)
  {
    var I = value;       
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;
      if(qty == "" || qty == null || qty == undefined){ qty = "0"; }
      totqty = parseFloat(qty);
      this.listData.filteredData[i].insurence = totqty * parseFloat(I)
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
      if(rate == "" || rate == null || rate == undefined){ rate = "0"; }
      if(disc == "" || disc == null || disc == undefined){ disc = "0"; }
      if(gst == "" || gst == null || gst == undefined){ gst = "0"; }
      if(transport == "" || transport == null || transport == undefined){ transport = "0"; }
      if(packing == "" || packing == null || packing == undefined){ packing = "0"; }
      if(insurence == "" || insurence == null || insurence == undefined){ insurence = "0"; }
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totinsurence=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totinsurence = totinsurence + parseFloat(this.listData.filteredData[i].insurence);
    }
    this.insValue = totinsurence.toFixed(2);
    this.calculate();                 
  }


  calculate()
  {        
    this.accremoveAll();
    this.subtotal = 0.00;
    this.disctotal = 0.00;
    var gstAmount = 0.00;
    this.nettotal = 0.00;
    if(this.tdsper == undefined) { this.tdsper = 0.0;}
    if(this.tdsper == "") { this.tdsper = 0.0;}
    if(this.roundedoff == undefined) { this.roundedoff = 0.0;}
    if(this.roundedoff == "") { this.roundedoff = 0.0;}
    
    var igst0 = 0.00;
    var igst5 = 0.00;
    var igst12 = 0.00;
    var igst18 = 0.00;
    var igst28 = 0.00;
    var cgst0 = 0.00;
    var cgst2p5 = 0.00;
    var cgst6 = 0.00;
    var cgst9 = 0.00;
    var cgst14 = 0.00;
    var sgst0 = 0.00;
    var sgst2p5 = 0.00;
    var sgst6 = 0.00;
    var sgst9 = 0.00;
    var sgst14 = 0.00;

    for(let i=0;i<this.listData.filteredData.length;i++)
    {       
      this.subtotal = this.subtotal + parseFloat(this.listData.filteredData[i].subtotal);
       
      //this.acclistData.filteredData[0].acccode = 0;
      //this.acclistData.filteredData[0].accname = "SUB TOTAL";
      //this.acclistData.filteredData[0].accvalue = this.subtotal;
      //this.acclistData.filteredData[0].acckey = "SUBTOTAL";
      
      this.disctotal = this.disctotal + parseFloat(this.listData.filteredData[i].discvalue);        
      //var DISCKEY = "PURCHASE DISCOUNTS";            
      //var filteredAccount = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === DISCKEY);      
      //this.purchaseDiscount = filteredAccount?.ledgercode;
      //this.addAccDataRow(this.purchaseDiscount,DISCKEY, 0, DISCKEY);
      //this.acclistData.filteredData[1].accvalue = this.disctotal * -1;
        
      console.log(this.vendorstatecode);
      if(this.vendorstatecode == '33')
      {
        var __gst = this.listData.filteredData[i].gst;
        var __gstvalue = this.listData.filteredData[i].gstvalue;
        if(parseFloat(__gst) == 0)
        {
          var CKEY="CGST 0";
          var SKEY="SGST 0";
          cgst0 = cgst0 + 0;
          sgst0 = sgst0 + 0;
          var fac = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === CKEY);                 
          this.addAccDataRow(fac?.ledgercode,CKEY,cgst0,CKEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === CKEY))].accvalue = cgst0; 
          var fas = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === SKEY);             
          this.addAccDataRow(fas?.ledgercode,SKEY,sgst0,SKEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === SKEY))].accvalue = sgst0; 
        }
        if(parseFloat(__gst) == 5)
        {
          var CKEY="CGST 2.5";
          var SKEY="SGST 2.5";
          cgst2p5 = (cgst2p5 + parseFloat(__gstvalue)/2);
          sgst2p5 = (sgst2p5 + parseFloat(__gstvalue)/2);          
          var fac = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === CKEY);           
          this.addAccDataRow(fac?.ledgercode,CKEY,cgst2p5,CKEY);          
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === CKEY))].accvalue = cgst2p5; 
          var fas = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === SKEY); 
          this.addAccDataRow(fas?.ledgercode,SKEY,sgst2p5,SKEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === SKEY))].accvalue = sgst2p5; 
        }
        if(parseFloat(__gst) == 12)
        {
          var CKEY="CGST 6";
          var SKEY="SGST 6";
          cgst6 = (cgst6 + parseFloat(__gstvalue)/2);
          sgst6 = (sgst6 + parseFloat(__gstvalue)/2);
          var fac = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === CKEY); 
          this.addAccDataRow(fac?.ledgercode,CKEY,cgst6,CKEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === CKEY))].accvalue = cgst6; 
          var fas = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === SKEY);
          this.addAccDataRow(fas?.ledgercode,SKEY,sgst6,SKEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === SKEY))].accvalue = sgst6; 
        }
        if(parseFloat(__gst) == 18)
        {
          console.log("called", __gst, __gstvalue);
          var CKEY="CGST 9";
          var SKEY="SGST 9";
          cgst9 = (cgst9 + parseFloat(__gstvalue)/2);
          sgst9 = (sgst9 + parseFloat(__gstvalue)/2);
          console.log("called one", cgst9, sgst9);
          var fac = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === CKEY); 
          this.addAccDataRow(fac?.ledgercode,CKEY,cgst9.toFixed(2),CKEY);          
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === CKEY))].accvalue = cgst9; 
          var fas = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === SKEY); 
          this.addAccDataRow(fas?.ledgercode,SKEY,sgst9.toFixed(2),SKEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === SKEY))].accvalue = sgst9; 
        }
        if(parseFloat(__gst) == 28)
        {
          var CKEY="CGST 14";
          var SKEY="SGST 14";
          cgst14 = (cgst14 + parseFloat(__gstvalue)/2);
          sgst14 = (sgst14 + parseFloat(__gstvalue)/2);
          var fac = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === CKEY); 
          this.addAccDataRow(fac?.ledgercode,CKEY,cgst14,CKEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === CKEY))].accvalue = cgst14; 
          var fas = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === SKEY); 
          this.addAccDataRow(fas?.ledgercode,SKEY,sgst14,SKEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === SKEY))].accvalue = sgst14; 
        }              
      }
      else if(this.vendorstatecode != '33')
      {
        var __gst = this.listData.filteredData[i].gst;
        var __gstvalue = this.listData.filteredData[i].gstvalue;
        if(parseFloat(__gst) == 0)
        {
          var KEY="IGST 0";
          igst0 = igst0 + 0;                
          var fa = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === KEY);              
          this.addAccDataRow(fa?.ledgercode,KEY,igst0,KEY);
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === KEY))].accvalue = igst0; 
        }
        if(parseFloat(__gst) == 5)
        {
          var KEY="IGST 5";
          igst5 = igst5 + parseFloat(__gstvalue);   
          console.log("FA",this.defaultAccounts);            
          var fa = this.defaultAccounts.find((o: { ledgername: string; })=> o.ledgername === KEY);  
          console.log("FA",fa);            
          this.addAccDataRow(fa?.ledgercode,KEY,igst5,KEY);          
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === KEY))].accvalue = igst5;                 
        }
        if(parseFloat(__gst) == 12)
        {
          var KEY="IGST 12";
          igst12 = igst12 + parseFloat(__gstvalue);
          var fa = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === KEY);              
          this.addAccDataRow(fa?.ledgercode,KEY,igst12,KEY);              
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === KEY))].accvalue = igst12; 
        }
        if(parseFloat(__gst) == 18)
        {
          var KEY="IGST 18";
          igst18 = igst18 + parseFloat(__gstvalue);
          var fa = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === KEY);              
          this.addAccDataRow(fa?.ledgercode,KEY,igst18,KEY);               
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === KEY))].accvalue = igst18; 
        }
        if(parseFloat(__gst) == 28)
        {
          var KEY="IGST 28";
          igst28 = igst28 + parseFloat(__gstvalue);
          var fa = this.defaultAccounts.find((o: { ledgername: string; }) => o.ledgername === KEY);              
          this.addAccDataRow(fa?.ledgercode,KEY,igst28,KEY);           
          this.acclistData.filteredData[this.acclistData.filteredData.indexOf(this.acclistData.filteredData.find(o => o.acckey === KEY))].accvalue = igst28; 
        }
      }
     
      gstAmount = gstAmount + parseFloat(this.listData.filteredData[i].gstvalue);      
      //this.nettotal = this.nettotal + parseFloat(this.listData.filteredData[i].amount);     
    }        

    //this.tdstotal=0.0;
    //if(this.tdsper > 0)
    //{
      //  this.tdstotal = (this.nettotal * this.tdsper / 100).toFixed(2);
    //}

    //this.nettotal = this.nettotal - this.tdstotal;  
    //this.nettotal = this.nettotal + parseFloat(this.roundedoff);

    if(this.vendorstatecode == '33')
    {
      this.cgsttotal = (gstAmount / 2).toFixed(2);
      this.sgsttotal = (gstAmount / 2).toFixed(2);
      this.igsttotal = 0.00;
    }
    else
    {
      this.cgsttotal = 0.00;
      this.sgsttotal = 0.00;
      this.igsttotal = gstAmount;
    }  

    this.calculateall();  
  }

  calculateall()
  {     
    var netTotal = 0;
    for(let i=0;i<this.acclistData.filteredData.length;i++)
    {             
      netTotal = netTotal + parseFloat(this.acclistData.filteredData[i].accvalue); 
    }    
    
    this.nettotal = ((netTotal + parseFloat(this.subtotal)) - parseFloat(this.disctotal)).toFixed(2);     

    if(this.tpValue == ""){this.tpValue="0";}
    if(this.pkValue == ""){this.pkValue="0";}
    if(this.insValue == ""){this.insValue="0";}

    this.nettotal = parseFloat(this.nettotal) + parseFloat(this.tpValue);   
    this.nettotal = parseFloat(this.nettotal) + parseFloat(this.pkValue);   
    this.nettotal = parseFloat(this.nettotal) + parseFloat(this.insValue);       
    
    if(this.tcsrate == ""){this.tcsrate="0";}
    if(this.tcsvalue == ""){this.tcsvalue="0";}
    if(parseFloat(this.tcsrate)>0)
    {
      var tcsAmout = (parseFloat(this.nettotal) * parseFloat(this.tcsrate) / 100).toFixed(2);
      this.closingtotal = parseFloat(this.nettotal) + parseFloat(tcsAmout);
      this.tcsvalue = parseFloat(tcsAmout);        
    }
    else
    {
      this.closingtotal = parseFloat(this.nettotal) + parseFloat(this.tcsvalue);
      var per = ((parseFloat(this.tcsvalue) / parseFloat(this.nettotal)) * 100).toFixed(2);
      this.tcsrate = per;   
    } 
    
    this.closingtotal = parseFloat(this.closingtotal) + parseFloat(this.roundedoff);   
        
  }
 
  insertGrnDetails()
  {
    if(this.pono == "" || this.pono == undefined){ this.pono = ""; this.podate = undefined; }
    return new Promise((resolve) => { 
      this.dataSource.forEach(element => {
        element.invno = this.invno,
        element.invdate = this.invdate,
        element.id = this.getGUID(),
        element.customercode = this.vendorcode,
        element.branch = this._branch,
        element.company = this._company, 
        element.fy = this._fy,
        element.sono = this.pono,
        element.sodate = this.podate,element.vtype = this.vchtype
      });   
      this.dataSource.forEach((element, index) => {
        var amount = element.amount;
        if(amount === 0)
        {
          this.dataSource.splice(index,1);
        }
      });       
      this.salesapi.Insert_Bulk_Sales_Details(this.dataSource).subscribe(res=>{                             
        resolve({ action: 'success' });
      });   
    }); 
  }

  insertGrn()
  {    
    console.log("GRN",this.invno);
    return new Promise((resolve) => { 
      var postData = {
        id : this.getGUID(),
        invno : this.invno,
        invdate : this.invdate,
        sono : this.pono,
        sodate : this.podate,
        refno : this.refno,
        customercode : this.vendorcode,
        customername : this.vendorname,
        vinvno : this.subinvno,
        vinvdate : this.subinvdate,
        expDeliveryDate : this.expdelidate,
        payTerm : this.paymentTerm,
        remarks : this.remarks,
        invoicecopy : this.invoicecopy,
        subTotal : this.subtotal,
        discountTotal :this.disctotal,
        cgstTotal : this.cgsttotal,
        sgstTotal : this.sgsttotal,
        igstTotal : this.igsttotal,
        tds : this.tdstotal,
        roundedoff : this.roundedoff,
        net : this.nettotal,
        rCreatedDateTime : this.invdate,
        rStatus: 'A',
        company: this._company,
        branch: this._branch,
        fy: this._fy,
        trRate: this.tpRate,
        trValue : this.tpValue,        
        pkRate : this.pkRate,
        pkValue : this.pkValue,
        inRate : this.insRate,
        inValue: this.insValue,
        tcsRate : this.tcsrate,
        tcsValue : this.tcsvalue,closingValue:this.closingtotal,
        salerefname: this.salerefname,
        vchtype: this.vchtype,
        saleaccount: this.vchaccountcode.toString(),
        deliveryaddress : this.vendordelivery
      }
      this.salesapi.Insert_Sales(postData).subscribe(res=>{
        resolve({ action: 'success' });
      });        
    });   
  }

  insertVendorLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.vendorcode,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: "SALES",
        entrytype: "DR",
        cr: 0,
        dr: this.nettotal,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      console.log(postdata);
      this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }
  insertBuyerLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.vchaccountcode.toString(),
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: "SALES",
        entrytype: "CR",
        cr: this.subtotal,
        dr: 0,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }
  insertDiscountLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.salesDiscountAcc,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: "SALES",
        entrytype: "CR",
        cr: this.disctotal,
        dr: 0,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      console.log("Discount",postdata);
      this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }
  insertLedgerEntry()
  {
    return new Promise((resolve) => { 
    for(let i=0;i<this.acclistData.filteredData.length;i++)
    {                
        setTimeout(()=>{
        var postdata = {      
          id: this.getGUID(),
          acccode: this.acclistData.filteredData[i].acccode.toString(),
          vchno: this.invno.toString(),
          vchdate: this.invdate,
          vchtype: "SALES",
          entrytype: "CR",
          cr: parseFloat(this.acclistData.filteredData[i].accvalue).toFixed(2),
          dr: 0,
          rCreatedDateTime: new Date,
          rStatus: "A"  
        }
        console.log(postdata);
        this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
          resolve({ action: 'success' });
        });
        },500);
    }
    resolve({ action: 'success' });
    });
  } 
  insertTransportLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.transportAcc,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: "SALES",
        entrytype: "CR",
        cr: this.tpValue,
        dr: 0,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }
  insertPackingLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.packingAcc,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: "SALES",
        entrytype: "CR",
        cr: this.pkValue,
        dr: 0,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }
  insertInsurenceLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.insurenceAcc,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: "SALES",
        entrytype: "CR",
        cr: this.insValue,
        dr: 0,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }
  insertTcsLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.tcsAcc,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: "SALES",
        entrytype: "CR",
        cr: this.tcsvalue,
        dr: 0,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  } 
  insertRoundingLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.roundingAcc,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: "SALES",
        entrytype: "CR",
        cr: this.roundedoff,
        dr: 0,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }      
      this.salesapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }

  insertOverDue()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        entrytype: "CUSTOMER_OVERDUE",
        vouchertype : this.vchtype,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        ledgercode: this.vendorcode,
        amount: this.nettotal,
        received:0,
        dueon: this.invdate,
        status:"UNPAID",
        comp: this._company,
        branch: this._branch,
        fy:this._fy,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      console.log(postdata);
      this.salesapi.Insert_Overdue(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }

  validate()
  {     
    var res:boolean=true;
    var c=0;
    for(let i=0;i<this.acclistData.filteredData.length;i++)
    {
      var val = this.acclistData.filteredData[i].acccode.toString();
      if(val == "")
      {
          c = c+1; 
      }
      if(c>0)
      {
        Swal.fire({
          icon:'info',
          title:'Taxation Details Not Correct!',
          text:'Plase Refresh and Continue!'          
        });   
      }
    }    
    if(this.pono != undefined && this.pono != "")      
    {      
      if(this.podate == "" || this.podate == undefined )
      {
        Swal.fire({
          icon:'info',
          title:'SO Date Need!',
          text:'Please Select SO Date!'          
        });       
        res = false; 
        return res;
      }
      else
      {
        res = true;  
      }  
    }                 
    if(this.vchtype == "" || this.vchtype == undefined)
    {
      Swal.fire({
        icon:'info',
        title:'Voucher Type Need!',
        text:'Please Select Voucher Type!'          
       });
       res = false; 
       return res;
    }
    else
    {
      res = true; 
    }                                    
    if(this.vchaccountcode == "" || this.vchaccountcode == undefined)
    {   
      Swal.fire({
        icon:'info',
        title:'Sales Account Need!',
        text:'Please Select Sales Account!'          
      });
      res = false;
      return res;  
    }
    else
    {
      res = true; 
    }   
    if(this.salerefname == null || this.salerefname == "" || this.salerefname == " " || this.salerefname == undefined)      
    {        
      Swal.fire({
        icon:'info',
        title:'Plase Select Sales Ref',
        text:'No Sales Ref not Specified!'          
      });
      res = false;
    }     
    else
    {      
      res = true;
    }  
    if(parseFloat(this.nettotal)>0)
    {
      res = true;     
    }
    else
    {
      Swal.fire({
        icon:'info',
        title:'Plase Add Products',
        text:'No Products Added or Values not Specified!'          
      });
      res = false; 
      return res;
    }       
    
    return res;
  }

  insertCustomFields()
  {
    return new Promise((resolve) => {            
      for(let i=0;i<this.sdef.length;i++)
      {
        setTimeout(()=>{
          var postdata = {      
            id: this.getGUID(),
            efieldname: this.sdef[i].efieldname,
            efieldvalue: this.sdef[i].efieldvalue,
            grnno: this.invno.toString(),
            grntype : this.vchtype
          }
          console.log(postdata);
          this.salesapi.insertCusFields(postdata).subscribe(res=>{
            resolve({ action: 'success' });
          });
          },500);
      }
      resolve({ action: 'success' });       
    });
  }

  submit() 
  {    
    
  //  this.loading = true; 
    setTimeout(() => {
      var res = this.validate();
      if(res == true)
      {
        console.log("true")
        //Get Invoice No 
        this.deleteExistingSO().then(res=>{
          //Insert GRN Product Details     
          this.insertGrnDetails().then(res=>{                        
                this.insertGrn().then(res=>{         
                  this.insertCustomFields().then(res=>{ 
                    this.insertLedgerEntry().then(res=>{          
                      this.insertVendorLedger().then(res=>{               
                        this.insertBuyerLedger().then(res=>{
                          this.insertDiscountLedger().then(res=>{  
                            this.insertTransportLedger().then(res=>{  
                              this.insertPackingLedger().then(res=>{  
                                this.insertInsurenceLedger().then(res=>{  
                                  this.insertTcsLedger().then(res=>{
                                    this.insertRoundingLedger().then(res=>{                
                                      this.insertOverDue().then(res=>{   
                                         this.showSuccessMsg();    
                                      });
                                   });
                                 });
                               });                             
                           });
                         });                
                       });
                     });
                   });   
                 }); 
              });
            });
          });
        });
      }  
      else
      {
        console.log("false")
      }       
    },500);
  }


  deleteExistingSO()
  {
    return new Promise((resolve) => { 
      this.salesapi.Delete_Sales(this.invno, this.vchtype).subscribe(res=>{
         this.salesapi.Delete_SalesDetails(this.invno, this.vchtype).subscribe(res=>{           
          this.salesapi.Delete_Accounts(this.invno, this.vchtype).subscribe(res=>{  
            this.salesapi.Delete_SavedDefSalesFields(this.invno, this.vchtype).subscribe(res=>{            
               resolve({ action: 'success' });
            });    
           });    
         });                  
      })         
    });
  }

  showSuccessMsg()
  {
      let dialogRef = this.dialog.open(SuccessmsgComponent,
      {
          //width: '350px',
          data: "Voucher Successfully Updated!"
      });                       
      dialogRef.afterClosed().subscribe(result=>{
        this.clear();                        
        this.router.navigateByUrl("servicesaleslist");
      });
  }

  clear() {
      this.getMaxInvoiceNo();
      this.invdate = new Date;
      this.pono = undefined;
      this.podate = undefined;
      this.vendordiv = false;
      this.selectedvendor = "";  
      this.vendorcode = "";
      this.vendorname = "";    
      this.vendorgstno = "";
      this.vendorbilling = "";
      this.vendorgstTreatment = "";
      this.vendorstate = "";
      this.vendorstatecode = "";
      this.subinvno = "";
      this.subinvdate = undefined;
      this.expdelidate = undefined;
      this.paymentTerm = "";
      this.refno = "";
      this.remarks = "";   
      this.roundedoff = "0";  
      this.removeAll()               
      this.calculate(); 
      this.calculateall();
      this.loadsdef();     
  }

  update() {}

  showPendingSODetails()
  {
      let dialogRef = this.dialog.open(PendingsoComponent,
        {
          maxWidth: '90vw',
          maxHeight: '90vh',
          height: '95%',
          width: '195%',
          panelClass: 'full-screen-modal'
        });   
      dialogRef.componentInstance.polist = this.vendorpodata;               
      dialogRef.afterClosed().subscribe(result=>{  
        this.pono = result.sono;
        this.loadSavedSdefFromSO(this.pono);
        this.podate = result.sodate;
        this.tpRate = result.tr;
        this.pkRate = result.pk;
        this.insRate = result.ins;
        this.tcsrate = result.tcs;
        this.roundedoff = result.rounded;
        console.log(result.solistDetails);
        var data = result.solistDetails;
        this.emprtyGrid();
        data.forEach((v:any) => {                      
            this.addDataRow(v.pcode,v.pname,v.sku,v.hsn,v.godown,v.pqty,v.qtymt,v.rate,v.disc,v.gst);
        });
        this.applyPK(this.pkRate);
        this.applyTR(this.tpRate);
        this.applyIN(this.insRate); 
        this.textBoxCalculation();     
        console.log(this.listData);
      });      
  }

  applyTR(rate:any)
  {    
    var T = rate;      
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";      
      qty = this.listData.filteredData[i].qty;
      totqty = parseFloat(qty);        
      this.listData.filteredData[i].transport = totqty * parseFloat(T)      
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totTransport=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totTransport =  totTransport + parseFloat(this.listData.filteredData[i].transport);
    }
    this.tpValue = totTransport.toFixed(2);    
  }
  applyPK(rate:any)
  {    
    var P = rate;       
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";         
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;89
      if(qty == ""){qty="0";}
      totqty = parseFloat(qty);     
      this.listData.filteredData[i].packing = totqty * parseFloat(P)
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totPacking=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totPacking = totPacking + parseFloat(this.listData.filteredData[i].packing);
    }
    this.pkValue = totPacking.toFixed(2);    
  }
  applyIN(rate:any)
  {    
    var I = rate;       
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;
      if(qty == ""){qty="0";}
      totqty = parseFloat(qty);   
      this.listData.filteredData[i].insurence = totqty * parseFloat(I)
      var rate = this.listData.filteredData[i].rate;
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
      this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
    }
    var totinsurence=0;
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      totinsurence = totinsurence + parseFloat(this.listData.filteredData[i].insurence);
    }
    this.insValue = totinsurence.toFixed(2);    
  }

  addDataRow(pcode:any,pname:any,sku:any,hsn:any,godown:any,qty:any,qtymt:any,rate:any,disc:any,tax:any) {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        invno:'1',
        invdate: this.invdate,
        product: pname,
        productcode:pcode,
        sku: sku,
        hsn: hsn,
        godown: godown,
        qty: qty,
        qtymt: qtymt,
        rate: rate,    
        transport: 0,
        packing: 0,
        insurence: 0,    
        subtotal : 0,
        disc: disc,
        discvalue: 0,
        taxable:0,
        gst: tax,
        gstvalue: 0,
        amount: 0,
        rCreatedDateTime: new Date,
        rStatus:'A',
        company:'',
        branch:'',
        fy:'',
        customercode:'',
        sono:'',
        sodate:'',vtype:''
      };
      this.ELEMENT_DATA.push(newRow);
      of(this.ELEMENT_DATA).subscribe(
        (data: iprodutcs[]) => {
          this.listData = new MatTableDataSource(data);          
        },
        (error) => {
          console.log(error);
        }
      );
      resolve({ action: 'success' });      
    });
  }
 
  addAccDataRow(acode:any,aname:any,avalue:any,akey:any) { 
    console.log(acode,aname,avalue,akey);  
    if(this.acclistData.filteredData)
    var obj = this.acclistData.filteredData.find(o => o.acckey === akey);
    console.log(obj);
    if(obj==undefined || obj.length == 0)
    {     
        return new Promise((resolve) => {
          const newRow = {
            acccode:acode,
            accname:aname,
            accvalue:avalue,
            acckey:akey
          };
          this.ACC_DATA.push(newRow);
          of(this.ACC_DATA).subscribe(
            (data: iaccounts[]) => {
              this.acclistData = new MatTableDataSource(data);          
            },
            (error) => {
              console.log(error);
            }
          );
          resolve({ action: 'success' });      
        });
    }
    else
    {
       return new Promise((resolve) => {
         resolve({ action: 'success' });  
       }); 
    }    
  }

  

  addNewAccDataRow() {
    return new Promise((resolve) => {
      const newRow = {
        acccode:'',
        accname:'',
        accvalue:'',
        acckey:''
      };
      this.ACC_DATA.push(newRow);
      of(this.ACC_DATA).subscribe(
        (data: iaccounts[]) => {
          this.acclistData = new MatTableDataSource(data);          
        },
        (error) => {
          console.log(error);
        }
      );
      resolve({ action: 'success' });      
    });
  }

  gotoList()
  {
    this.router.navigateByUrl("servicesaleslist");
  }

}
