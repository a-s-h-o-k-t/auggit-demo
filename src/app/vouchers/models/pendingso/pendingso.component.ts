import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pendingso',
  templateUrl: './pendingso.component.html',
  styleUrls: ['./pendingso.component.scss']
})
export class PendingsoComponent implements OnInit {

  @Input() public polist:any;
  
  constructor(private dialogRef: MatDialogRef<PendingsoComponent>) { }
  ngOnInit(): void {
      console.log(this.polist);
  }

  addItems(i:any)
  {
      this.dialogRef.close(i);
  }

}
