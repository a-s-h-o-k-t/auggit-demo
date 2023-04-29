import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-pendingpo',
  templateUrl: './pendingpo.component.html',
  styleUrls: ['./pendingpo.component.scss']
})
export class PendingpoComponent implements OnInit {

  
  @Input() public polist:any;
  
  constructor(private dialogRef: MatDialogRef<PendingpoComponent>) { }
  ngOnInit(): void {
    console.log(this.polist);
  }

  addItems(i:any)
  {
      this.dialogRef.close(i);
  }
}
