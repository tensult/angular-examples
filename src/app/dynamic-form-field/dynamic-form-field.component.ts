import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/utils/error_state';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.css']
})
export class DynamicFormFieldComponent implements OnInit {

  choicesControl: FormArray;

  questionForm: FormGroup;

  matcher = new MyErrorStateMatcher();

  ngOnInit() {
    this.choicesControl = new FormArray([
      new FormControl(undefined, [
        Validators.required
      ])
    ]);
    this.questionForm = new FormGroup({
      type: new FormControl(undefined, [
        Validators.required
      ]),
      title: new FormControl(undefined, [
        Validators.required
      ]),
      choices: this.choicesControl
    });
  }

  addChoice(index) {
    if (index === this.choicesControl.controls.length - 1 &&
      this.choicesControl.controls[index].valid) {
      this.choicesControl.push(new FormControl(undefined, [
        Validators.required
      ]));
    }
  }

  removeChoice(index) {
    this.choicesControl.removeAt(index);
  }
}
