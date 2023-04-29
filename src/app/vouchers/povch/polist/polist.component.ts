import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GrnService } from 'src/app/services/grn.service';
import { PoService } from 'src/app/services/po.service';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-polist',
  templateUrl: './polist.component.html',
  styleUrls: ['./polist.component.scss']
})
export class PolistComponent implements OnInit {

  constructor(public poapi:PoService, public grnapi:GrnService ,public router: Router, public dialog : MatDialog) { }

  podata:any;

  ngOnInit(): void {
      this.loaddata();
  } 

  loaddata()
  {
    this.grnapi.getPendingPoListAll().subscribe(res=>{
      console.log(res);
      this.podata=res;
    })
  }

  createNewPo()
  {
    this.router.navigateByUrl("po");
  }

  editpo(data:any)
  {
    var msg = "";
    if(data.pending==0){
      msg = "PO is Completed! Do you want to Edit"
    }
    else
    { msg = "Do you Modify PO data?" }
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: msg
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.router.navigateByUrl("poupdate/" + data.pono);
      }
    });      
  }

  deletepo(data:any)
  {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: "Do you Delete PO data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {        
        this.poapi.Delete_PO(data.pono,data.vtype).subscribe(res=>{
          this.poapi.Delete_PODetails(data.pono,data.vtype).subscribe(res=>{
            this.poapi.deleteDefFields(data.pono,data.vtype).subscribe(res=>{
              Swal.fire({
                icon:'success',
                title:'PO Deleted!',
                text:'PO ' + data.pono + ' Deleted Successfully'         
              });
              this.loaddata();
            });    
          });                  
        })    
      }
    });      
  }

  convertbill(data:any)
  {
    
  }


}
