import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-showdelivaddress',
  templateUrl: './showdelivaddress.component.html',
  styleUrls: ['./showdelivaddress.component.scss']
})
export class ShowdelivaddressComponent implements OnInit {

  @Input() public data:any;

  constructor(private dialogRef: MatDialogRef<ShowdelivaddressComponent>) { }

  ngOnInit(): void {
    
  }

  close(r:any)
  {
    this.dialogRef.close(r);
  }

}
