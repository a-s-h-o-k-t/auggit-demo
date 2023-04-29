import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { SsalesService } from 'src/app/services/ssales.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-servicesalelist',
  templateUrl: './servicesalelist.component.html',
  styleUrls: ['./servicesalelist.component.scss']
})
export class ServicesalelistComponent implements OnInit {

  constructor(public salesapi:SsalesService, public router: Router, public dialog : MatDialog) { }
  sdata:any;
  ngOnInit(): void {
    this. loaddata();
  }

  loaddata()
  {
    this.salesapi.getSalesListAll().subscribe(res=>{
      console.log("SALES",res);
      this.sdata=res;
    })
  }  

  createNewSales()
  {
    this.router.navigateByUrl("servicesales");
  }

  editsales(data:any)
  {
    var msg = "";
    if(data.pending==0){
      msg = "SALES is Completed! Do you want to Edit"
    }
    else
    { msg = "Do you Modify data?" }
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: msg
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.router.navigateByUrl("servicesalesupdate/" + data.invno);
      }
    });      
  }

  deletesales(data:any)
  {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: "Do you Delete data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        console.log(data);
        this.salesapi.Delete_Sales(data.invno,"Service Sale").subscribe(res=>{
          this.salesapi.Delete_SalesDetails(data.invno,"Service Sale").subscribe(res=>{   
            this.salesapi.Delete_Accounts(data.invno,"Service Sale").subscribe(res=>{  
              this.salesapi.Delete_SavedDefSalesFields(data.invno,"Service Sale").subscribe(res=>{           
                Swal.fire({
                  icon:'success',
                  title:'Deleted!',
                  text:'Service SALES ' + data.pono + ' Deleted Successfully'         
                });
              this.loaddata();
            });  
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
