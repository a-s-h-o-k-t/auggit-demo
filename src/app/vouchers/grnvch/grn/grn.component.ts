import { Component,ElementRef,OnInit,QueryList,ViewChild,ViewChildren,ɵpublishDefaultGlobalUtils } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { map, Observable, of, startWith, VirtualTimeScheduler } from 'rxjs';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { ApiService } from 'src/app/services/api.service';
import { GrnService } from 'src/app/services/grn.service';
import { PoService } from 'src/app/services/po.service';
import { PurchasevtypeComponent } from 'src/app/vchtype/purchasevtype/purchasevtype.component';
import Swal from 'sweetalert2';
import { PendingpoComponent } from '../../models/pendingpo/pendingpo.component';

export interface iprodutcs {
  id:Guid;
  grnno:any;
  grndate:Date;
  product: string;
  productcode: string;  
  sku: string;
  hsn: string;
  godown: string;
  qty: number;
  qtymt: number;
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
  vendorcode:string;
  pono:string
  podate:string,
  vchtype:string
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

export interface Acc {
  ledgername: string;
  ledgercode: string; 
}

@Component({
  selector: 'app-grn',
  templateUrl: './grn.component.html',
  styleUrls: ['./grn.component.scss']
})
export class GrnComponent implements OnInit {

  TDSData=[
    { id:0, name:'NO TDS', per:0 },
    { id:1, name:'COB [13%]', per:13 },
    { id:2, name:'Commission or Brokerage [5%]', per:5 },
    { id:3, name:'Dividend [10%]', per:10 },
    { id:4, name:'Other Interest than securities [10%]', per:10 },
    { id:5, name:'Professional Fees [10%]', per:10 }
  ]  
  
  @ViewChild('pacc') pacc: ElementRef | undefined;

  @ViewChild('table') tabledata!: MatTable<Element>;
  @ViewChildren('eprod') private eprod!: QueryList<ElementRef>;
  @ViewChildren('esku') private esku!: QueryList<ElementRef>;
  @ViewChildren('ehsn') private ehsn!: QueryList<ElementRef>;
  @ViewChildren('eqty') private eqty!: QueryList<ElementRef>;
  @ViewChildren('eqtymt') private eqtymt!: QueryList<ElementRef>;
  @ViewChildren('erate') private erate!: QueryList<ElementRef>;
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

  filteredProducts!: Observable<Product[]>;
  prodSearch = new FormControl('');
  prodArray: Product[] = [];

  filteredAccounts!: Observable<Acc[]>;
  accSearch = new FormControl('');
  accArray: Acc[] = [];

  defaultAccounts: Acc[] = [];

  //Variables
  _company='1';
  _branch='1';
  _fy='1';
  _fyname='23-24';

  formGRN!: FormGroup;  
  loading:boolean =false;
  vendorpodata:any;
  vendorpodatacount=0;  
  vendorcode: any;
  vendorname: any;  
  vendordelivery:any;
  vendordiv = false;
  selectedvendor: any;
  vendorgstno: any;
  vendorbilling: any;
  vendorgstTreatment: any;
  vendorstate: any;
  vendorstatecode: any;
  vendoroutstanding: any = 0.0;
  purchaseAccounts:any;
  invno: any;
  invdate: any;
  billno: any;
  pono: any="";
  podate: any;
  vchtype: any;
  vchaccountcode:any;
  vchaccount: any;
  salerefname:any="0";
  payterm:any;

  //Def Accounts
  purchaseDiscountAcc: any;
  transportAcc:any;
  packingAcc:any;
  insurenceAcc:any;
  tcsAcc:any;
  roundingAcc:any;

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
  closingtotal: any = 0.0;
  selectedID: any;
  tdstype:any;
  tdscode:any=0;  
  tdsper:any;
  paymentTerm:any;
  remarks:any;
  invoicecopy:any;

  tpRate:any= 0;
  tpValue:any= 0.0;
  pkRate:any= 0;
  pkValue:any= 0.0;
  insRate:any= 0;
  insValue:any= 0.0;
  showGST:any= false;
  tcsvalue:any=0;
  tcsrate:any=0.0;
  sdef:any;    

  changeTDS(event:any)
  {
      this.tdscode = event.value;
      this.tdstype = event.source.triggerValue;       
      var value = this.TDSData.filter(e=> e.id == this.tdscode);      
      this.tdsper = value[0].per;
      this.calculate();
  } 

  //Grid
  ELEMENT_DATA: iprodutcs[] = [
    {      
      id: this.getGUID(),
      grnno:'1',
      grndate: new Date,
      product: '',
      productcode:'',
      sku: '',
      hsn: '',
      godown: '',
      qty: 0,
      qtymt: 0,
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
      vendorcode:'',
      pono:'',
      podate:'',vchtype:''
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
        grnno:'1',
        grndate: this.invdate,
        product: '',
        productcode:'',
        sku: '',
        hsn: '',
        godown: '',
        qty: 0,
        qtymt: 0,
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
        vendorcode:'',pono:'',podate:'',vchtype:''
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
        },
        (error) => {
          console.log(error);
        }
      );      
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
        },
        (error) => {
          console.log(error);
        }
      );      
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
        },
        (error) => {
          console.log(error);
        }
      );      
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
  
  constructor(public grnapi: GrnService, public fb: FormBuilder, public dialog: MatDialog, 
    public api:ApiService, public router: Router, public poapi:PoService) {}

  getGUID()
  {
    var gid:any;
    gid = Guid.create();
    return gid.value;
  }

  getMaxInvoiceNo()
  {
    return new Promise((resolve) => { 
      this.grnapi.getMaxInvoiceNo(this.vchtype,this._branch,this._fy,this._fyname).subscribe(res=>{
          this.invno = res;
          resolve({ action: 'success' });
      })
    });
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

  gotoGrnList()
  {
    this.router.navigateByUrl("grnlist");
  }

  setValidator()
  {
    this.formGRN = this.fb.group({
      cinvno: ['', [Validators.required]],
      cpacc: ['', [Validators.required]],
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
    if(this.vchtype == undefined)
    {
     this.callChangeVoucherType();
    }
  } 

  ngOnInit(): void {   
    this.invdate = new Date;     
    this.setValidator();       
    this.loadVendors();    
    this.loadProducts();
    this.loadPurchaseAccounts();
    this.loadDefalutAccounts();
    this.loadSavedAccounts();
    this.getMaxInvoiceNo();
    this.loadpdef();    

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
  }   

  callChangeVoucherType()
  {
      let dialogRef = this.dialog.open(PurchasevtypeComponent,
      {         
      });                       
      dialogRef.afterClosed().subscribe(result=>{                                    
         this.vchtype = result.vtype;
         this.getMaxInvoiceNo();
         //this.vchaccount = result.vacco;
      });
  }

  loadSavedAccounts()
  {
    this.grnapi.getSavedAccounts().subscribe((res) => {
        console.log(res);   
        this.purchaseDiscountAcc = res[0].discAcc;
        this.transportAcc = res[0].tranAcc;
        this.packingAcc = res[0].packAcc;
        this.insurenceAcc = res[0].insuAcc;
        this.tcsAcc = res[0].tcsAcc;  
        this.roundingAcc = res[0].rounding;       
    });
  }
  
  loadVendors() {
    this.grnapi.getVendors().subscribe((res) => {
      this.vendorsArray = JSON.parse(res);      
      this.filteredVendors = this.vendorSearch.valueChanges.pipe(
        startWith(''),
        map((vendor) =>
          vendor ? this._filtervendors(vendor) : this.vendorsArray.slice()
        )
      );
    });
  }
  private _filtervendors(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendorsArray.filter((vendor) =>
      vendor.CompanyDisplayName.toLowerCase().includes(filterValue)
    );
  }

  loadProducts() {
    this.grnapi.getProducts().subscribe((res) => {
      this.prodArray = res;            
    });
  }
  filterProducts(name: string) {
    return name &&  this.prodArray.filter(
      items => items.itemname.toLowerCase().includes(name?.toLowerCase())
    ) || this.prodArray;
  }
 
  loadPurchaseAccounts()
  {
    this.grnapi.getPurchaseAccounts().subscribe(res=>{
      this.accArray = JSON.parse(res);         
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
    this.grnapi.getDefaultAccounts().subscribe(res=>{
      this.defaultAccounts = JSON.parse(res);          
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
      this.grnapi.getPendingPoListDetails(data.LedgerCode).subscribe(res=>{                    
          this.vendorpodatacount = res.length;          
          this.vendorpodata = res;                          
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

  loadpdef() {
    this.poapi.getDefPOFields().subscribe((res) => {
      this.sdef = res; 
      console.log("def",this.sdef);
    });
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
    //  if (event.isUserInput == true) {       
    //    this.acclistData.filteredData[rowindex].acccode = data.ledgercode;
    //  }
  }
  
  prodChanged(event: any, data: any, rowindex: any) {    
    if (event.isUserInput == true) {             
      this.listData.filteredData[rowindex].product = data.itemname.toString();       
      this.listData.filteredData[rowindex].productcode = data.itemcode.toString(); 
      this.listData.filteredData[rowindex].sku = data.itemsku; 
      this.listData.filteredData[rowindex].hsn = data.itemhsn;      
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
    this.eqty.toArray()[rowindex].nativeElement.select();
    this.eqty.toArray()[rowindex].nativeElement.focus();
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

  onQtyKeydown(event: any, rowindex: any) {
    //console.log(rowindex);
    //console.log(this.listData.filteredData[rowindex]);
    //if (event.key === "Enter") {   
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == ""){qty="0";}
    if(qtymt == ""){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();
    this.erate.toArray()[rowindex].nativeElement.select();
    this.erate.toArray()[rowindex].nativeElement.focus();
    //}
  }

  onQtyMTKeydown(event: any, rowindex: any) {
    //console.log(rowindex);
    //console.log(this.listData.filteredData[rowindex]);
    //if (event.key === "Enter") {

    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == ""){qty="0";}
    if(qtymt == ""){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);
    var qty = this.listData.filteredData[rowindex].qty;
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();    
    this.listData.filteredData[rowindex].qtymt = qtymt;
    this.erate.toArray()[rowindex].nativeElement.select();
    this.erate.toArray()[rowindex].nativeElement.focus();
    //}
  }

  onRateKeydown(event: any, rowindex: any) {
    //console.log(rowindex);
    //console.log(this.listData.filteredData[rowindex]);
    //if (event.key === "Enter") {
      var qty = this.listData.filteredData[rowindex].qty;
      var qtymt = this.listData.filteredData[rowindex].qtymt;
      if(qty == ""){qty="0";}
      if(qtymt == ""){qtymt="0";}
      var totqty = parseFloat(qty)+ parseFloat(qtymt);
      var qty = this.listData.filteredData[rowindex].qty;
      var rate = this.listData.filteredData[rowindex].rate;
      var disc = this.listData.filteredData[rowindex].disc;
      var gst = this.listData.filteredData[rowindex].gst;
      this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();
    this.listData.filteredData[rowindex].rate = rate;
    this.edisc.toArray()[rowindex].nativeElement.select()
    this.edisc.toArray()[rowindex].nativeElement.focus();
    //}
  }

  onTransportRateKeydown(event: any, rowindex: any) {         
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == ""){qty="0";}
    if(qtymt == ""){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);   
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;   
    var transport = this.listData.filteredData[rowindex].transport;
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,0,0);
    this.calculate();
    this.listData.filteredData[rowindex].transport = transport;
    this.epacking.toArray()[rowindex].nativeElement.select()
    this.epacking.toArray()[rowindex].nativeElement.focus();    
  }

  onPackingRateKeydown(event: any, rowindex: any) {    
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == ""){qty="0";}
    if(qtymt == ""){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);   
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;   
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing;    
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,0);
    this.calculate();
    this.listData.filteredData[rowindex].packing = packing;
    this.edisc.toArray()[rowindex].nativeElement.select()
    this.edisc.toArray()[rowindex].nativeElement.focus();    
  }

  onInsurenceRateKeydown(event: any, rowindex: any) {    
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == ""){qty="0";}
    if(qtymt == ""){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);   
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;   
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing;    
    var insurence = this.listData.filteredData[rowindex].insurence;    
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,insurence);
    this.calculate();
    this.listData.filteredData[rowindex].packing = packing;
    this.edisc.toArray()[rowindex].nativeElement.select()
    this.edisc.toArray()[rowindex].nativeElement.focus();    
  }

  onDiscKeydown(event: any, rowindex: any) {  
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == ""){qty="0";}
    if(qtymt == ""){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);   
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;   
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing; 
    var insurence = this.listData.filteredData[rowindex].insurence; 
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,insurence);
    this.calculate();
    this.etax.toArray()[rowindex].nativeElement.select();
    this.etax.toArray()[rowindex].nativeElement.focus();   
  }

  onTaxKeydown(event: any, rowindex: any) {
    //console.log(rowindex);
    //console.log(this.listData.filteredData[rowindex]);
    //if (event.key === "Enter") {
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == ""){qty="0";}
    if(qtymt == ""){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);   
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;   
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing; 
    var insurence = this.listData.filteredData[rowindex].insurence; 
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,insurence);
    this.calculate();
    this.eamt.toArray()[rowindex].nativeElement.focus();
    //}
  }

  onAmountKeydown(event: any, rowindex: any) {   
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == ""){qty="0";}
    if(qtymt == ""){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);   
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;   
    var transport = this.listData.filteredData[rowindex].transport;
    var packing = this.listData.filteredData[rowindex].packing; 
    var insurence = this.listData.filteredData[rowindex].insurence; 
    this.onCalculation(totqty, rate, disc, gst, rowindex,transport,packing,insurence);
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

  applyTR(rate:any)
  {    
    var T = rate;      
    for(let i=0;i<this.listData.filteredData.length;i++)
    {
      var totqty = 0;
      var qty = "0";
      var qtymt = "0";      
      qty = this.listData.filteredData[i].qty;
      qtymt = this.listData.filteredData[i].qtymt;     
      totqty = parseFloat(qty)+ parseFloat(qtymt);            
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
      if(qtymt == ""){qtymt="0";}
      totqty = parseFloat(qty)+ parseFloat(qtymt);      
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
      if(qtymt == ""){qtymt="0";}
      totqty = parseFloat(qty)+ parseFloat(qtymt);      
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
      totqty = parseFloat(qty)+ parseFloat(qtymt);
      var rate = this.listData.filteredData[i].rate;         
      this.listData.filteredData[i].transport = ( totqty * eachRowValue ).toFixed(2);      
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
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
      totqty = parseFloat(qty)+ parseFloat(qtymt);            
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
      totqty = parseFloat(qty)+ parseFloat(qtymt);
      var rate = this.listData.filteredData[i].rate;         
      this.listData.filteredData[i].packing = ( totqty * eachRowValue ).toFixed(2);      
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
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
      if(qty == ""){qty="0";}
      if(qtymt == ""){qtymt="0";}
      totqty = parseFloat(qty)+ parseFloat(qtymt);      
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
      totqty = parseFloat(qty)+ parseFloat(qtymt);
      var rate = this.listData.filteredData[i].rate;         
      this.listData.filteredData[i].insurence = ( totqty * eachRowValue ).toFixed(2);      
      var disc = this.listData.filteredData[i].disc;
      var gst = this.listData.filteredData[i].gst;
      var transport = this.listData.filteredData[i].transport;
      var packing = this.listData.filteredData[i].packing; 
      var insurence = this.listData.filteredData[i].insurence;     
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
      if(qty == ""){qty="0";}
      if(qtymt == ""){qtymt="0";}
      totqty = parseFloat(qty)+ parseFloat(qtymt);      
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
    this.calculate();
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

 
  onCalculation(qty: any, rate: any, disc: any, gst: any, index: any,transport:any,packing:any,insurence:any) {
    //var totalrate = parseFloat(rate) + parseFloat(transport) + parseFloat(packing);    
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
  }

  onAccAmountKeyup(event:any,i:any)
  {
    this.calculateall();
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
      var per = ((parseFloat(this.tcsvalue) / parseFloat(this.nettotal)) * 100).toFixed();
      this.tcsrate = per;
    } 
    
    this.closingtotal = parseFloat(this.closingtotal) + parseFloat(this.roundedoff);   
        
  }

  insertGrnDetails()
  {
    return new Promise((resolve) => { 
      this.dataSource.forEach(element => {
        element.grnno = this.invno.toString(),
        element.grndate = this.invdate,
        element.id = this.getGUID(),
        element.vendorcode = this.vendorcode,
        element.branch = this._branch,
        element.company = this._company, 
        element.fy = this._fy,
        element.pono = this.pono,
        element.podate = this.podate
        element.vchtype = this.vchtype
      });   
      this.dataSource.forEach((element, index) => {
        var amount = element.amount;
        if(amount === 0)
        {
          this.dataSource.splice(index,1);
        }
      });       
      this.grnapi.Insert_Bulk_GRN_Details(this.dataSource).subscribe(res=>{                             
        resolve({ action: 'success' });
      });   
    }); 
  }

  insertGrn()
  {    
    return new Promise((resolve) => { 
      var postData = {
        id : this.getGUID(),
        grnno : this.invno,
        grndate : this.invdate,
        pono : this.pono,
        podate : this.podate,
        refno : this.refno,
        vendorcode : this.vendorcode,
        vendorname : this.vendorname,
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
        tcsValue : this.tcsvalue,
        closingValue:this.closingtotal,
        salerefname: this.salerefname,
        vchtype: this.vchtype,
        saleaccount: this.vchaccountcode.toString(),
        deliveryaddress : ""
      }
      this.grnapi.Insert_GRN(postData).subscribe(res=>{
        resolve({ action: 'success' });
      });        
    });   
  }

  insertVendorLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.vendorcode.toString(),
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: this.vchtype,
        entrytype: "CR",
        cr: this.closingtotal,
        dr: 0,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }      
      this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
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
        vchtype: this.vchtype,
        entrytype: "DR",
        cr: 0,
        dr: this.subtotal,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }

  insertDiscountLedger()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        acccode: this.purchaseDiscountAcc,
        vchno: this.invno.toString(),
        vchdate: this.invdate,
        vchtype: this.vchtype,
        entrytype: "DR",
        cr: 0,
        dr: this.disctotal,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      console.log("Discount",postdata);
      this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
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
          vchtype: this.vchtype,
          entrytype: "DR",
          cr: 0,
          dr: parseFloat(this.acclistData.filteredData[i].accvalue).toFixed(2),
          rCreatedDateTime: new Date,
          rStatus: "A"  
        }        
        this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
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
        vchtype: this.vchtype,
        entrytype: "DR",
        cr: 0,
        dr: this.tpValue,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
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
        vchtype: this.vchtype,
        entrytype: "DR",
        cr: 0,
        dr: this.pkValue,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
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
        vchtype: this.vchtype,
        entrytype: "DR",
        cr: 0,
        dr: this.insValue,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
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
        vchtype: this.vchtype,
        entrytype: "DR",
        cr: 0,
        dr: this.tcsvalue,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }
      this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
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
        vchtype: this.vchtype,
        entrytype: "DR",
        cr: 0,
        dr: this.roundedoff,
        rCreatedDateTime: new Date,
        rStatus: "A"  
      }      
      this.grnapi.Insert_Ledger(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
  }

  insertOverDue()
  {
    return new Promise((resolve) => { 
      var postdata = {      
        id: this.getGUID(),
        entrytype: "VENDOR_OVERDUE",
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
      this.grnapi.Insert_Overdue(postdata).subscribe(res=>{
        resolve({ action: 'success' });
      });
    });
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
          this.grnapi.insertCusFields(postdata).subscribe(res=>{
            resolve({ action: 'success' });
          });
          },500);
      }
      resolve({ action: 'success' });       
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
          title:'PO Date Need!',
          text:'Please Select PO Date!'          
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
        title:'Purchase Account Need!',
        text:'Please Select Purchase Account!'          
      });
      res = false;
      return res;  
    }
    else
    {
      res = true; 
    }
    if(this.subinvno == "" || this.subinvno == undefined)
    {
      Swal.fire({
        icon:'info',
        title:'Vendor Bill No Need!',
        text:'Please Enter Bill Vendor Bill No!'          
      });
      res = false;
      return res;      
    }
    else
    {
      res = true; 
    } 
    if(this.subinvdate == "" || this.subinvdate == undefined)
    {
      Swal.fire({
        icon:'info',
        title:'Vendor Bill Date Need!',
        text:'Please Select Vendor Bill Date!'          
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
      return res;
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

  submit() 
  {    
    var res = this.validate();
    if(res == true)
    {
      if(this.formGRN.valid)
      {
        this.loading = true;
        this.getMaxInvoiceNo().then(res=>{
          //Insert GRN Product Details     
          this.insertGrnDetails().then(res=>{
            //Insert GRN Details
            this.insertCustomFields().then(res=>{     
              this.insertGrn().then(res=>{
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
        Swal.fire({
          icon:'info',
          title:'Fill Mandatory Fields',
          text:'Plese fill all mandatory fields'
        });
        this.loading = false;
      }
    }   
  }

  showSuccessMsg()
  {
      let dialogRef = this.dialog.open(SuccessmsgComponent,
      {
          //width: '350px',
          data: "Voucher Successfully Saved!"
      });                       
      dialogRef.afterClosed().subscribe(result=>{
        this.loading = false;
        this.clear();                        
        //this.eitemname?.nativeElement.focus();
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
      this.tpRate="";
      this.tpValue = "";
      this.pkRate="";
      this.pkValue="";
      this.insRate="";
      this.insValue="";
      this.tcsrate="";
      this.tcsvalue="";
      this.removeAll()               
      this.calculate();
      this.calculateall();
      this.loadpdef();
  }

  update() {}

  showPendingPODetails()
  {
      let dialogRef = this.dialog.open(PendingpoComponent,
        {
          maxWidth: '90vw',
          maxHeight: '90vh',
          height: '95%',
          width: '195%',
          panelClass: 'full-screen-modal'
        });   
      dialogRef.componentInstance.polist = this.vendorpodata;               
      dialogRef.afterClosed().subscribe(result=>{  
        console.log("SPO",result);
        this.pono = result.pono;
        this.loadSavedSdef(this.pono);
        this.tpRate = result.tr;
        this.pkRate = result.pk;
        this.insRate = result.ins;
        this.tcsrate = result.tcs;
        this.roundedoff = result.rounded;
        var dateString = result.podate.substring(0,10);        
        var dateParts = dateString.split("-");        
        var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]); 
        this.podate = dateObject;
        console.log(dateObject);
        var data = result.polistDetails;
        this.emprtyGrid();
        data.forEach((v:any) => {      
          if(v.sel == true)
          {                
            this.addDataRow(v.pcode,v.pname,v.sku,v.hsn,v.godown,v.pqty,v.rate,v.disc,v.tax);
          }
        });
        this.applyPK(this.pkRate);
        this.applyTR(this.tpRate);
        this.applyIN(this.insRate); 
        this.textBoxCalculation();              
      });      
  }

  loadSavedSdef(pono:any)
  {
    this.poapi.getSavedDefFields(pono).subscribe((res) => {
      this.sdef = JSON.parse(res);
      console.log(this.sdef); 
    });
  }

  textBoxCalculation()
  {
    for(let i=0;i< this.listData.filteredData.length;i++)
    {
      var qty = this.listData.filteredData[i].qty;
      var qtymt = this.listData.filteredData[i].qtymt;
      if(qty == ""){qty="0";}
      if(qtymt == ""){qtymt="0";}
      var totqty = parseFloat(qty)+ parseFloat(qtymt);
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

  addDataRow(pcode:any,pname:any,sku:any,hsn:any,godown:any,qty:any,rate:any,disc:any,tax:any) {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        grnno:'1',
        grndate: this.invdate,
        product: pname,
        productcode:pcode,
        sku: sku,
        hsn: hsn,
        godown: godown,
        qty: qty,
        qtymt: 0,
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
        vendorcode:'',
        pono:'',
        podate:'',vchtype:''
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
    if(this.acclistData.filteredData)
    var obj = this.acclistData.filteredData.find(o => o.acckey === akey);    
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

}
