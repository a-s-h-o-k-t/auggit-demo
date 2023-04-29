import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { GrnService } from 'src/app/services/grn.service';
import { PoserviceService } from 'src/app/services/poservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-poservicelist',
  templateUrl: './poservicelist.component.html',
  styleUrls: ['./poservicelist.component.scss']
})
export class PoservicelistComponent implements OnInit {

  constructor(public grnapi:GrnService, public poapi: PoserviceService ,public router: Router, public dialog : MatDialog) { }

  podata:any;

  ngOnInit(): void {
      this.loaddata();
  } 

  loaddata()
  {
    this.grnapi.getPendingPoServiceListAll().subscribe(res=>{
      console.log(res);
      this.podata=res;
    })
  }

  createNewPo()
  {
    this.router.navigateByUrl("poservice");
  }

  editpo(data:any)
  {
    var msg = "";
    if(data.pending==0){
      msg = "PO is Completed! Do you want to Edit"
    }
    else
    { msg = "Do you Modify data?" }
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: msg
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.router.navigateByUrl("poserviceupdate/" + data.pono);
      }
    });      
  }

  deletepo(data:any)
  {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: "Do you Delete data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(data);
        this.poapi.Delete_PO(data.sono,data.vtype).subscribe(res=>{
          this.poapi.Delete_PODetails(data.sono,data.vtype).subscribe(res=>{
            this.poapi.deleteDefFields(data.sono,data.vtype).subscribe(res=>{
              Swal.fire({
                icon:'success',
                title:'Deleted!',
                text:'SO ' + data.pono + ' Deleted Successfully'         
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
