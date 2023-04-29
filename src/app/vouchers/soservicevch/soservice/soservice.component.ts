import { Component,ElementRef,OnInit,QueryList,ViewChild,ViewChildren,ɵpublishDefaultGlobalUtils } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Guid } from 'guid-typescript';
import { map, Observable, of, startWith, VirtualTimeScheduler } from 'rxjs';
import { SsoService } from 'src/app/services/sso.service';
import Swal from 'sweetalert2';
import { ShowdelivaddressComponent } from '../../models/showdelivaddress/showdelivaddress.component';
import { AdddelivaddressComponent } from '../../models/adddelivaddress/adddelivaddress.component';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';
import { SalesService } from 'src/app/services/sales.service';
import { Router } from '@angular/router';
export interface iaccounts {
  acccode:string;
  accname:string;
  accvalue:string;
  acckey:string;
}

export interface Acc {
  ledgername: string;
  ledgercode: string; 
}

export interface iprodutcs {
  id:Guid;
  sono:any;
  sodate:Date;
  godown: string;
  product: string;
  productcode: string;  
  sku: string;
  hsn: string;
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
  customercode:string,
  sotype:string
}

export interface Vendor {
  CompanyDisplayName : string;
  id: string;
  BilingAddress: string;
}

export interface sref {
  refname : string;
}

export interface Product {
  itemname: string;
  itemcode: string;
  sku: string;
  hsn: string;
  gst: string;
}


@Component({
  selector: 'app-soservice',
  templateUrl: './soservice.component.html',
  styleUrls: ['./soservice.component.scss']
})
export class SoserviceComponent implements OnInit {

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
  @ViewChildren('egodown') private egodown!: QueryList<ElementRef>;
  @ViewChildren('eqty') private eqty!: QueryList<ElementRef>;
  @ViewChildren('eqtymt') private eqtymt!: QueryList<ElementRef>;
  @ViewChildren('erate') private erate!: QueryList<ElementRef>;
  @ViewChildren('etransport') private etransport!: QueryList<ElementRef>;
  @ViewChildren('epacking') private epacking!: QueryList<ElementRef>;
  @ViewChildren('edisc') private edisc!: QueryList<ElementRef>;
  @ViewChildren('ediscvalue') private ediscvalue!: QueryList<ElementRef>;
  @ViewChildren('etax') private etax!: QueryList<ElementRef>;
  @ViewChildren('etaxvalue') private etaxvalue!: QueryList<ElementRef>;
  @ViewChildren('eamt') private eamt!: QueryList<ElementRef>;
  //Venndors
  @ViewChild('evendorname') evendorname: ElementRef | undefined;
  @ViewChild('epodate') epodate: ElementRef | undefined;

  filteredVendors!: Observable<Vendor[]>;
  vendorSearch = new FormControl('');
  vendorsArray: Vendor[] = [];

  filteredSref!: Observable<sref[]>;
  refSearch = new FormControl('');
  salesRefArray: sref[] = [];

  filteredProducts!: Observable<Product[]>;
  prodSearch = new FormControl('');
  prodArray: Product[] = [];
  
  vchType="SO-SERVICE";
  loading:boolean =false;

  salerefname:any;
  //Variables
  _company='1';
  _branch='1';
  _fy='1';
  _fyname='23-24';

  formGRN!: FormGroup;
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
  billno: any;
  pono: any;
  podate: any;
  vchtype: any;
  vchaccount: any;
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
    
  changeRef()
  {
    this.salerefname = "";         
  }

  SaleRefChanged(event: any, data: any)
  {    
    this.salerefname = data.refname;
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

  //Grid
  ELEMENT_DATA: iprodutcs[] = [
    {      
      id: this.getGUID(),
      godown:'',
      sono: 1,
      sodate: new Date,
      product: '',
      productcode:'',
      sku: '',
      hsn: '',
      qty: 0,
      qtymt:0,
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
      customercode:'', sotype:''
    }
  ];
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
  dataSource = this.ELEMENT_DATA;

  //Acc Grid
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

  //Other Acc
  OTHERACC_DATA: iaccounts[] = [
    {
      acccode:'',
      accname:'',
      accvalue:'',
      acckey:'',
    }
  ]  
  otheraccdataSource = this.OTHERACC_DATA;
  otheracclistData!: MatTableDataSource<any>;
  otheraccdisplayedColumns: string[] = [
    //'acccode',
    'accname',
    'accvalue',
    //'acckey'         
  ];

  addRow() {
    return new Promise((resolve) => {
      const newRow = {
        id: this.getGUID(),
        godown:'',
        sono: 1,
        sodate: this.podate,
        product: '',
        productcode:'',
        sku: '',
        hsn: '',
        qty: 0,
        qtymt:0,
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
        customercode:'',sotype:''
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
    this.totAmt = 0;
    this.totTaxValue = 0;
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

  onAccAmountKeyup(event:any,i:any)
  {
    this.calculateall();
  }

  onOtherAccAmountKeyup(event:any,i:any)
  {
    var accname = this.otheracclistData.filteredData[i].accname;
    console.log(accname);
    if(accname == "Transport Charges (Receivable)")
    {
      var trasport = this.otheracclistData.filteredData[i].accvalue;      
      for(let i=0;i<this.listData.filteredData.length;i++)
      {
        this.listData.filteredData[i].transport = trasport;
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
        this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
      }
      this.calculate();
    }
    else if(accname == "Packing Charge (Receivable)")
    {
      console.log("packing Entre");
      var packing = this.otheracclistData.filteredData[i].accvalue;      
      for(let i=0;i<this.listData.filteredData.length;i++)
      {
        console.log("packing", packing);
        this.listData.filteredData[i].packing = packing;
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
        this.onCalculation(totqty, rate, disc, gst, i,transport,packing,insurence);
      }
      this.calculate();
    }
    this.calculateall();
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

  otheraccaddRow() {
    return new Promise((resolve) => {
      const newRow = {        
        acccode:'',
        accname:'',
        accvalue:'',
        acckey:''        
      };
      this.OTHERACC_DATA.push(newRow);
      of(this.OTHERACC_DATA).subscribe(
        (data: iaccounts[]) => {
          this.otheracclistData = new MatTableDataSource(data);          
        },
        (error) => {
          console.log(error);
        }
      );
      resolve({ action: 'success' });      
    });
  }  

  addNewOtherAccDataRow() {
    return new Promise((resolve) => {
      const newRow = {
        acccode:'',
        accname:'',
        accvalue:'',
        acckey:''
      };
      this.OTHERACC_DATA.push(newRow);
      of(this.OTHERACC_DATA).subscribe(
        (data: iaccounts[]) => {
          this.otheracclistData = new MatTableDataSource(data);          
        },
        (error) => {
          console.log(error);
        }
      );
      resolve({ action: 'success' });      
    });
  }

  addOtherAccDataRow(acode:any,aname:any,avalue:any,akey:any) { 
    console.log(acode,aname,avalue,akey);  
    if(this.otheracclistData.filteredData)
    var obj = this.otheracclistData.filteredData.find(o => o.acckey === akey);
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
          this.OTHERACC_DATA.push(newRow);
          of(this.OTHERACC_DATA).subscribe(
            (data: iaccounts[]) => {
              this.otheracclistData = new MatTableDataSource(data);          
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
       
    if(parseFloat(this.tcsrate)>0)
    {      
      if(this.nettotal == ""){this.nettotal="0";}
      if(this.tcsrate == ""){this.tcsrate="0";}
      if(parseFloat(this.tcsrate) > 0)
      {
        var tcsAmout = (parseFloat(this.nettotal) * parseFloat(this.tcsrate) / 100).toFixed(2);
        this.closingtotal = (parseFloat(this.nettotal) + parseFloat(tcsAmout)).toFixed(2);
        this.tcsvalue = parseFloat(tcsAmout);
      }
      else
      {        
        this.closingtotal = parseFloat(this.nettotal);
        this.tcsvalue = 0;
      }
    }
    else
    {      
      if(parseFloat(this.tcsvalue) > 0)
      {
        if(this.nettotal == ""){this.nettotal="0";}
        if(this.tcsvalue == ""){this.tcsvalue="0";}
        this.closingtotal = parseFloat(this.nettotal) + parseFloat(this.tcsvalue);
        var per = ((parseFloat(this.tcsvalue) / parseFloat(this.nettotal)) * 100).toFixed(0);
        this.tcsrate = per;
      }
      else
      {
        if(this.nettotal == ""){this.nettotal="0";}
        if(this.tcsvalue == ""){this.tcsvalue="0";}
        this.closingtotal = parseFloat(this.nettotal);        
        this.tcsrate = 0;
      }
    }     
    this.closingtotal = parseFloat(this.closingtotal) + parseFloat(this.roundedoff);           
  }


  accChanged(event: any, data: any, rowindex: any)
  {
     if (event.isUserInput == true) {
       console.log(data);
       this.acclistData.filteredData[rowindex].acccode = data.ledgercode;
     }
  }

  otheraccChanged(event: any, data: any, rowindex: any)
  {
     if (event.isUserInput == true) {
       console.log(data);
       this.otheracclistData.filteredData[rowindex].acccode = data.ledgercode;
     }
  }
  
  constructor(public salesapi : SalesService ,public soapi: SsoService, public fb: FormBuilder,
  public router : Router ,public dialog: MatDialog) {}

  getGUID()
  {
    var gid:any;
    gid = Guid.create();
    return gid.value;
  }

  getMaxPoNo(type:any,)
  {
    return new Promise((resolve) => { 
      this.soapi.getMaxInvoiceNo(type,this._branch,this._fy,this._fyname).subscribe(res=>{
          this.pono = res;
          resolve({ action: 'success' });
      })
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

  defaultAccounts: Acc[] = [];
  loadDefalutAccounts()
  {
    this.salesapi.getDefaultAccounts().subscribe(res=>{
      this.defaultAccounts = JSON.parse(res); 
      console.log("Def",this.defaultAccounts);      
    });
  } 
  filterDefAccounts(name: string) {
    return name &&  this.defaultAccounts.filter(
      accs => accs.ledgername.toLowerCase().includes(name?.toLowerCase())
    ) || this.defaultAccounts;
  }


  setValidator()
  {
    this.formGRN = this.fb.group({
      cinvno: ['', [Validators.nullValidator]],
      cinvdate: ['', [Validators.nullValidator]],
      cvendorname: ['', [Validators.required]],
      cpono: ['', [Validators.required]],    
      cpodate: ['', [Validators.required]], 
      cvchtype : ['', [Validators.nullValidator]], 
      cvchaccount : ['', [Validators.nullValidator]], 
      crefno: ['', [Validators.nullValidator]],   
      csubinvno: ['', [Validators.nullValidator]],   
      csupinvdate: ['', [Validators.nullValidator]] ,
      cexpdelidate: ['', [Validators.nullValidator]] ,
      cpaymentTerm: ['', [Validators.nullValidator]] ,
    });
  }

  ngOnInit(): void {    
    this.podate = new Date;
    this.setValidator();       
    this.loadVendors();
    this.loadDefalutAccounts();
    this.loadProducts();
    this.loadSaleRef();
    this.getMaxPoNo(this.vchType);
    this.loadsdef();
    of(this.ELEMENT_DATA).subscribe(
      (data: iprodutcs[]) => {
        this.listData = new MatTableDataSource(data);
        console.log(data);
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
     //Add Empty Line to Other Accounts GRID
     of(this.OTHERACC_DATA).subscribe(
      (data: iaccounts[]) => {
        this.otheracclistData = new MatTableDataSource(data);        
      },
      (error) => {
        console.log(error);
      }
    );    
    
    if(this.vchtype == undefined)
    {
     this.callChangeVoucherType();
    }
  }   

  callChangeVoucherType()
  {
    // let dialogRef = this.dialog.open(PurchaseVtypeComponent,
    //   { 
    //   });                       
    //   dialogRef.afterClosed().subscribe(result=>{                           
    //      console.log(result);
    //      console.log(result.vtype);
    //      console.log(result.vacco);
    //      this.vchtype = result.vtype;
    //      this.vchaccount = result.vacco;
    //   });
  }

  // get getTotal() {
  //   return this.listData.data
  //     .map((x) => +x.result )
  //     .reduce((a, b) => a + b);
  // }

  loadVendors() {
    this.soapi.getVendors().subscribe((res) => {
      this.vendorsArray = JSON.parse(res);
      console.log(this.vendorsArray);
      this.filteredVendors = this.vendorSearch.valueChanges.pipe(
        startWith(''),
        map((vendor) =>
          vendor ? this._filtervendors(vendor) : this.vendorsArray.slice()
        )
      );
    });
  }
  ShowAddDelivery()
  {
    this.soapi.showDeliveryAddress(this.vendorcode).subscribe(res=>{         
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

  private _filtervendors(value: string): Vendor[] {
    const filterValue = value.toLowerCase();
    return this.vendorsArray.filter((vendor) =>
      vendor.CompanyDisplayName.toLowerCase().includes(filterValue)
    );
  }

  loadProducts() {
    this.soapi.getProducts().subscribe((res) => {
      this.prodArray = res;           
    });
  }
  filterProducts(name: string) {
    return name &&  this.prodArray.filter(
      items => items.itemname.toLowerCase().includes(name?.toLowerCase())
    ) || this.prodArray;
  }

  selectVendor()
  {
    this.vendordiv = true;
    this.evendorname?.nativeElement.focus();
  }

  alertFields()
  {
    console.log("fields",this.sdef);
  }

  loadsdef() {
    this.soapi.getDefSOFields().subscribe((res) => {
      this.sdef = res; 
      console.log("def",this.sdef);
    });
  }

  //Dropdown Functions
  
  vendorChanged(event: any, data: any) {
    if (event.isUserInput == true) {          
      this.selectedvendor = data;  
      this.vendorcode = data.LedgerCode.toString();
      this.vendorname = data.CompanyDisplayName;    
      this.vendorgstno = data.GSTNo;
      this.vendorbilling = data.BilingAddress;
      this.vendordelivery = data.DeliveryAddress;
      this.vendorgstTreatment = data.GSTTreatment;
      this.vendorstate = data.StateName;
      this.vendorstatecode = data.stateCode;
      this.calculate();
    }
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
  
  prodChanged(event: any, data: any, rowindex: any) {    
    if (event.isUserInput == true) { 
      console.log(data)
      this.listData.filteredData[rowindex].product = data.itemname; 
      this.listData.filteredData[rowindex].productcode = data.itemcode.toString(); 
      this.listData.filteredData[rowindex].sku = data.itemsku; 
      this.listData.filteredData[rowindex].hsn = data.itemhsn; 
      this.egodown.toArray()[rowindex].nativeElement.select();
      this.egodown.toArray()[rowindex].nativeElement.focus();
    }
  }

  getPayTerm(event:any,)
  {
    this.paymentTerm = event.source.triggerValue;    
  }

  onProdKeydown(event: any, rowindex: any) {    
    this.eqty.toArray()[rowindex].nativeElement.select();
    this.eqty.toArray()[rowindex].nativeElement.focus();
  }

  onSkuKeydown(event: any, rowindex: any) {
    this.ehsn.toArray()[rowindex].nativeElement.focus();
  }

  onHsnKeydown(event: any, rowindex: any) {
    this.egodown.toArray()[rowindex].nativeElement.select();
    this.egodown.toArray()[rowindex].nativeElement.focus();
  }

  ongodownKeydown(event: any, rowindex: any)
  {
    this.eqty.toArray()[rowindex].nativeElement.select();
    this.eqty.toArray()[rowindex].nativeElement.focus();
  }

  onQtyKeydown(event: any, rowindex: any) {    
   
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){ qty = "0";
      this.listData.filteredData[rowindex].qty = 0;      
    }
    if(qtymt == "" || qtymt == null || qtymt == undefined){ 
      this.listData.filteredData[rowindex].qtymt = 0;
      qtymt = "0";
    }
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);

    this.erate.toArray()[rowindex].nativeElement.select();
    this.erate.toArray()[rowindex].nativeElement.focus();
    //}
  }

  onQtyMTKeydown(event: any, rowindex: any) {

    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){ qty = "0";
      this.listData.filteredData[rowindex].qty = 0;      
    }
    if(qtymt == "" || qtymt == null || qtymt == undefined){ 
      this.listData.filteredData[rowindex].qtymt = 0;
      qtymt = "0";
    }
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();    
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.listData.filteredData[rowindex].qtymt = qtymt;
    this.erate.toArray()[rowindex].nativeElement.select();
    this.erate.toArray()[rowindex].nativeElement.focus();
    //}
  }

  onRateKeydown(event: any, rowindex: any) { 
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
    var rate = this.listData.filteredData[rowindex].rate;
    var disc = this.listData.filteredData[rowindex].disc;
    var gst = this.listData.filteredData[rowindex].gst;
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}  
    this.onCalculation(totqty, rate, disc, gst, rowindex,0,0,0);
    this.calculate();
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
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
    if(qtymt == "" || qtymt == null || qtymt == undefined){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
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
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
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
    if(qtymt == "" || qtymt == null || qtymt == undefined){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
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
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
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
    if(qtymt == "" || qtymt == null || qtymt == undefined){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
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
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
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
    if(qtymt == "" || qtymt == null || qtymt == undefined){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
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
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.etax.toArray()[rowindex].nativeElement.select();
    this.etax.toArray()[rowindex].nativeElement.focus();
    //}
  }

  onTaxKeydown(event: any, rowindex: any) {
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
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
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
    this.eamt.toArray()[rowindex].nativeElement.focus();
    //}
  }

  onAmountKeydown(event: any, rowindex: any) {   
    var qty = this.listData.filteredData[rowindex].qty;
    var qtymt = this.listData.filteredData[rowindex].qtymt;
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){qtymt="0";}
    var totqty = parseFloat(qty)+ parseFloat(qtymt);  
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
    if(qty == "" || qty == null || qty == undefined){ qty = "0";}
    if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0";}
    if(this.tpRate == "" || this.tpRate == null || this.tpRate == undefined ){ this.tpRate= "0"; };
    if(this.pkRate == "" || this.pkRate == null || this.pkRate == undefined){ this.pkRate= "0"; };
    if(this.insRate == "" || this.insRate == null || this.insRate == undefined){ this.insRate= "0"; }    
    this.applyTRRate(this.tpRate);
    this.applyPKRate(this.pkRate);
    this.applyINRate(this.insRate);
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }
      totqty = parseFloat(qty)+ parseFloat(qtymt);            
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }  
      totqty = parseFloat(qty)+ parseFloat(qtymt);      
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }
      totqty = parseFloat(qty)+ parseFloat(qtymt);      
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

  onCalculation(qty: any, rate: any, disc: any, gst: any, index: any,transport:any,packing:any,insurence:any) {
    if(qty == "" || qty == null || qty == undefined){qty="0";}
    if(rate == "" || rate == null || rate == undefined){rate="0";}
    if(disc == "" || disc == null || disc == undefined){disc="0";}
    if(gst == "" || gst == null || gst == undefined){gst="0";}
    if(transport == "" || transport == null || transport == undefined){transport="0";}
    if(packing == "" || packing == null || packing == undefined){packing="0";}
    if(insurence == "" || insurence == null || insurence == undefined){insurence="0";}
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
    this.getTotal();
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }    
      totqty = parseFloat(qty)+ parseFloat(qtymt);
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }
      totqty = parseFloat(qty)+ parseFloat(qtymt);            
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }  
      totqty = parseFloat(qty)+ parseFloat(qtymt);
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }  
      totqty = parseFloat(qty)+ parseFloat(qtymt);      
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }     
      totqty = parseFloat(qty)+ parseFloat(qtymt);
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
      if(qtymt == "" || qtymt == null || qtymt == undefined){ qtymt = "0"; }
      totqty = parseFloat(qty)+ parseFloat(qtymt);      
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

  purchaseDiscount: any;
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

  insertGrnDetails()
  {
    return new Promise((resolve) => { 
      this.dataSource.forEach(element => {
        element.sono = this.pono.toString(),
        element.sodate = this.podate,
        element.id = this.getGUID(),
        element.company = this._company,
        element.branch = this._branch,
        element.fy = this._fy,
        element.customercode = this.vendorcode.toString(),
        element.sotype = this.vchType
      });     
      this.dataSource.forEach((element, index) => {
        var amount = element.amount;
        if(amount === 0)
        {
          this.dataSource.splice(index,1);
        }
      });     
      this.soapi.Insert_Bulk_SO_Details(this.dataSource).subscribe(res=>{                             
        resolve({ action: 'success' });
      });   
    });
  }

  insertGrn()
  {
    return new Promise((resolve) => { 
      var postData = {
        id : this.getGUID(),      
        sono : this.pono,
        sodate : this.podate,
        company : this._company,
        branch : this._branch,
        fy : this._fy,
        refno : this.refno,
        customercode : this.vendorcode.toString(),
        customername : this.vendorname,    
        expDeliveryDate : this.expdelidate,
        payTerm : this.paymentTerm,
        remarks : this.remarks,
        invoicecopy : this.invoicecopy,
        subTotal : this.subtotal,
        discountTotal :this.disctotal,
        cgstTotal : this.cgsttotal,
        sgstTotal : this.sgsttotal,
        igstTotal : this.igsttotal,        
        roundedoff : this.roundedoff,
        net : this.nettotal,
        rCreatedDateTime : new Date,
        rStatus: 'A',
        trRate: this.tpRate,
        trValue : this.tpValue,        
        pkRate : this.pkRate,
        pkValue : this.pkValue,
        inRate : this.insRate,
        inValue: this.insValue,
        tcsRate : this.tcsrate,
        tcsValue : this.tcsvalue,sotype : this.vchType,
        closingValue:this.closingtotal,
        salerefname: this.salerefname,
        deliveryaddress : this.vendordelivery
      }
      this.soapi.Insert_SO(postData).subscribe(res=>{
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
            sono: this.pono.toString()
            ,sotype : this.vchType
          }
          console.log(postdata);
          this.soapi.insertCusFields(postdata).subscribe(res=>{
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
    if(this.salerefname == "" || this.salerefname == null || this.salerefname == undefined)
    {
      Swal.fire({
        icon:'error',
        title:'Select Sale Ref',
        text:'Please Select Sales Ref!'          
      });
      this.loading = false;      
      return false;       
    }
    else
    {
       res = true;       
    }  
    if(this.vendorcode == "" || this.vendorcode == null || this.vendorcode == undefined)
    {
      Swal.fire({
        icon:'error',
        title:'Select Customer',
        text:'Please Select Customer Details!'          
      });
      this.loading = false;      
      return false;       
    }
    else
    {
       res = true;       
    }
    if(this.dataSource.length>0)
    {   
      var val = this.nettotal;
      if(parseFloat(val)>0)
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
        this.loading=false;
        return false;      
      }
    }
    else
    {
      Swal.fire({
        icon:'info',
        title:'Plase Add Products',
        text:'No Products Added or Values not Specified!'          
      });
      this.loading=false;
      return false;
    }    
    return res;
  }

  submit() 
  {    
    this.loading = true; 
    setTimeout(() => {

      var res = this.validate();
      if(res == true)
      {
        console.log("true")
        //Get Invoice No 
        this.getMaxPoNo(this.vchType).then(res=>{
          //Insert GRN Product Details     
          this.insertGrnDetails().then(res=>{
            this.insertCustomFields().then(res=>{
              //Insert GRN Details
              this.insertGrn().then(res=>{         
                //Show SuccessAlert
                this.showSuccessMsg();
                this.loading=false;
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

  showSuccessMsg()
  {
    let dialogRef = this.dialog.open(SuccessmsgComponent,
      {
          //width: '350px',
          data: "Voucher Successfully Saved!"
      });                       
      dialogRef.afterClosed().subscribe(result=>{
        this.clear();                        
        //this.eitemname?.nativeElement.focus();
      });
  }

  clear() {
      this.getMaxPoNo(this.vchType);
      this.podate = new Date;
      this.pono = "";      
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
      this.pkRate=0;
      this.pkValue=0;this.tpRate=0;this.tpValue=0;this.insRate=0;this,this.insValue=0;this.tcsrate=0;this.tcsvalue=0;
      this.loadsdef();  
      this.removeAll()               
      this.calculate();      
  }  

  gotolist()
  {
    this.router.navigateByUrl("soservicelist");
  }

}
