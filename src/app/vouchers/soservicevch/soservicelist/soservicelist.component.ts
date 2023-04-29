import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SalesService } from 'src/app/services/sales.service';
import { SsoService } from 'src/app/services/sso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-soservicelist',
  templateUrl: './soservicelist.component.html',
  styleUrls: ['./soservicelist.component.scss']
})
export class SoservicelistComponent implements OnInit {

  constructor(public salesapi:SalesService, public soapi:SsoService,public router: Router, public dialog : MatDialog) { }
  podata:any;

  ngOnInit(): void {
    this.loaddata();
  }
  loaddata()
  {
    this.salesapi.getPendingSOListSOService().subscribe(res=>{
      console.log("SO Pending",res);
      this.podata=res;
    })
  }  
  createNewSo()
  {
    this.router.navigateByUrl("soservice");
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
        this.router.navigateByUrl("soserviceupdate/" + data.sono);
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
        this.soapi.Delete_SO(data.sono).subscribe(res=>{
          this.soapi.Delete_SODetails(data.sono).subscribe(res=>{
            Swal.fire({
              icon:'success',
              title:'Deleted!',
              text:'PO ' + data.pono + ' Deleted Successfully'         
            });
            this.loaddata();
          });                  
        })    
      }
    });      
  }

  convertbill(data:any)
  {
    
  }

}
