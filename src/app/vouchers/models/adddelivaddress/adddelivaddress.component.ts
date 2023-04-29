import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-adddelivaddress',
  templateUrl: './adddelivaddress.component.html',
  styleUrls: ['./adddelivaddress.component.scss']
})
export class AdddelivaddressComponent implements OnInit {

  addr:any
  constructor(private dialogRef: MatDialogRef<AdddelivaddressComponent>) { }

  ngOnInit(): void {
    
  }

  close()
  {
    this.dialogRef.close(this.addr);
  }





}
