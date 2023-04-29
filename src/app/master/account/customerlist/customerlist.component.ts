import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { ConfirmmsgComponent } from 'src/app/dialogs/confirmmsg/confirmmsg.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-customerlist',
  templateUrl: './customerlist.component.html',
  styleUrls: ['./customerlist.component.scss']
})
export class CustomerlistComponent implements OnInit {

  constructor(public api:ApiService,public router: Router,public dialog : MatDialog) { }
  selectedID:any;
  type = 'bar';
  data:any;

  vendorData:any;
  ventorTemp:any=[];
  filteredVendorData:any = [];

  svd:any

  options = {    
    legend: {
      display: true,
      font : {
        family : "'Roboto', sans-serif",
        size : 14        
      }        
    },
    tooltips: {
        enabled: true,        
    },
    labels :{
      display: false
    },
    responsive: true,
    maintainAspectRatio: true,  
    scales: {
      xAxes: [{        
        ticks: {
          display: true,        
        },
        gridLines: {
          display: false,
          drawOnChartArea: false
        },
        font : {
          //family : "'Roboto', sans-serif",                
        }   
      }],
      yAxes: [{
        ticks: {
          display: true,
          drawOnChartArea: true,
          callback: function(value:any, index:any, values:any) {
            return value.toLocaleString("en-IN",{style:"currency", currency:"INR"});
          },
          font : {
            //family : "'Roboto', sans-serif",                
          }                
        },
        gridLines: {
          display: false,
          drawOnChartArea: false
        }
      }]
    }  
  };

  searchledger:any;

  ngOnInit(): void {
    this.loadData();
    this.data = {
        labels: ['07/11/2022','08/11/2022','09/11/2022','10/11/2022','11/11/2022','12/11/2022','13/11/2022'], //months
        datasets: [{
        label: "7 Days Sales",
        data: [19000,21000,15000,20100,30000,27000,32000],
        backgroundColor: ['#646FD4','#0AA1DD','#6BCB77','#6FEDD6','#E15FED','#3E00FF','#F98404','#7ECA9C'],
      }]
    }
  }  

  vindex:any;
  search(): void {    
    if(this.searchledger.length>0)
    {                 
      this.ventorTemp = [];                
      this.ventorTemp.push(this.vendorData.filter((i: { companyDisplayName: string; }) => i.companyDisplayName.toLowerCase().includes(this.searchledger.toLowerCase())));                           
      this.filteredVendorData = this.ventorTemp[0];    
      console.log(this.filteredVendorData);                                   ;
    }  
    else
    {
        this.filteredVendorData = this.vendorData;
    }
  }

  loadData()
  {
    this.api.getCustomersOnly().subscribe(res=>{
      this.vendorData = res;
      this.filteredVendorData= res;
      this.svd = res[0];
      this.selectedID = this.svd.id;
      console.log(this.vendorData);
      console.log(JSON.parse(res))
    });
  }

  gotoNew()
  {
    this.router.navigateByUrl('/customer');
  }

  gotoVendor(v:any)
  {
    this.svd = v;
    this.selectedID = v.id;
  }


  editled(l:any)
  {
    console.log(event);
    const dialogRef = this.dialog.open(ConfirmmsgComponent, {
      width: '350px',
      data: "Do you Modify data?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {        
        this.router.navigateByUrl('customerupdate/'+ l.id );  
      }
    });    
  }

  deleteled(l:any)
  {

  }


}
