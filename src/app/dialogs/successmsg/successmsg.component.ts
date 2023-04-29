import { Component, Inject, OnInit } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-successmsg',
  templateUrl: './successmsg.component.html',
  styleUrls: ['./successmsg.component.scss']
})
export class SuccessmsgComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SuccessmsgComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit(): void {        
  }
  
  async closeDialog() {
    try {      
      this.dialogRef.close(); // make sure it only closes if the upper async fn succesfully ran!
    } catch(e) {      
    }
  }

}
