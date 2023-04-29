import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmmsg',
  templateUrl: './confirmmsg.component.html',
  styleUrls: ['./confirmmsg.component.scss']
})
export class ConfirmmsgComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmmsgComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }

    ngOnInit(): void {

    }

    onNoClick(): void {
      this.dialogRef.close();
    }

}
