import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { MatDialog } from '@angular/material/dialog';
import { SuccessmsgComponent } from 'src/app/dialogs/successmsg/successmsg.component';

@Component({
  selector: 'app-stockitemlist',
  templateUrl: './stockitemlist.component.html',
  styleUrls: ['./stockitemlist.component.scss']
})

export class StockitemlistComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['ITEMNAME','ITEMSKU','ITEMHSN','ITEMGROUP','ITEMCAT','ITEMUOM','GST','CESS','ACTIONS']; 
  listData!: MatTableDataSource<any>;
    
  ngAfterViewInit() {
    this.listData.paginator = this.paginator;
  }

  constructor(public api:ApiService,public router:Router, public dialog : MatDialog) { }
  itemdata:any;
  groupdata:any;
  catdata:any;

  ngOnInit(): void {
      this.loadItemData();      
  }

  loadItemData()
  {
    this.api.get_ItemData().subscribe(res=>{     
      this.listData = new MatTableDataSource(JSON.parse(res));
      this.listData.paginator = this.paginator;      
      console.log(JSON.parse(res))  ;
    })
  }

  // loadGroupData()
  // {
  //   this.api.get_GroupData().subscribe(res=>{
  //     this.itemdata = res;
  //     console.log(res);
  //   })
  // }

  // loadCategoryData()
  // {
  //   this.api.get_CategoryData().subscribe(res=>{
  //     this.itemdata = res;
  //     console.log(res);
  //   })
  // }

  gotonew()
  {
    this.router.navigateByUrl("stockitem");
  }

  edit(event:any)
  {
    console.log(event);
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: "Do you Modify data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {        
        this.router.navigateByUrl("stockitemupdate/" + event.Id);
      }
    });      
  }

  delete(event:any)
  {
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: "Do you confirm the deletion of this Stock Item?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {                                                    
        this.api.Delete_ItemData(event.Id).subscribe(data => {   
            let dialogRef = this.dialog.open(SuccessmsgComponent,{
              //width: '350px',
              data: "Successfully Deleted!"
            });                    
            dialogRef.afterClosed().subscribe(result=>{             
              this.loadItemData();
            })                 
        }, err => {
          console.log(err);
          alert("Some Error Occured");
        })  
      }
    });         
  }

}

