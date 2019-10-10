import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { DialogExampleComponent } from '../dialog-example/dialog-example.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogExampleComponent>) { }

  ngOnInit() {
    this.dialogRef.updatePosition({
      top: `30px`,
      right: `40px`
    });
  }

}
