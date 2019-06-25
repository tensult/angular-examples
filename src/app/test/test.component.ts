import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  constructor(public dialog: MatDialog) { 
  }

  ngOnInit() {
  }

  showDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '450px',
      height: '230px'
    });
    setTimeout(() => {
      dialogRef.close();
    }, 10000);
  }

}
