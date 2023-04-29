import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-salesvtype',
  templateUrl: './salesvtype.component.html',
  styleUrls: ['./salesvtype.component.scss']
})
export class SalesvtypeComponent implements OnInit {

  vchdata:any;
  vtype:any;
  vacco:any;

  constructor(public api:ApiService,public dialogRef: MatDialogRef<SalesvtypeComponent>) { }

  ngOnInit(): void {
      this.loaddata();
  }

  loaddata()
  {
    this.api.get_PurchaseVoucherType("Sales").subscribe(res=>{
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
