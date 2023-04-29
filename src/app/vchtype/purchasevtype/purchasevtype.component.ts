import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-purchasevtype',
  templateUrl: './purchasevtype.component.html',
  styleUrls: ['./purchasevtype.component.scss']
})
export class PurchasevtypeComponent implements OnInit {

  vchdata:any;
  vtype:any;
  vacco:any;

  constructor(public api:ApiService,public dialogRef: MatDialogRef<PurchasevtypeComponent>) { }

  ngOnInit(): void {
      this.loaddata();
  }

  loaddata()
  {
    this.api.get_PurchaseVoucherType("Purchase").subscribe(res=>{
      this.vchdata = JSON.parse(res);
    });
  }

  selectVoucher(row:any)
  {
    try {  
      this.vtype = row.vchname;
      this.vacco = row.voucherAccount;
      this.dialogRef.close({
        "vtype" : this.vtype,
        "vacco" : this.vacco
      }); 
    } catch(e) {      
    }
  }

}
