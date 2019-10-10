import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { MyErrorStateMatcher } from '../utils';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.css']
})
export class DynamicFormFieldComponent implements OnInit {

  choicesControl: FormArray;

  questionForm: FormGroup;

  matcher = new MyErrorStateMatcher();

  submittedValue: string;

  private getNewChoiceControl() {
    return new FormArray([
      this.getNewChoiceFormGroup()
    ], this.choiceValidator);
  }

  choiceValidator(choicesControl: FormArray) {
    const choiceValues = choicesControl.controls.reduce((choiceValuesObj, choiceControl: FormGroup) => {
      const valueControl = choiceControl.controls.value;
      if (valueControl.value) {
        const choiceValue = valueControl.value.toLowerCase();
        choiceValuesObj[choiceValue] = choiceValuesObj[choiceValue] || 0;
        choiceValuesObj[choiceValue]++;
      }
      return choiceValuesObj;
    }, {} as any);

    let errorChoices = null;

    choicesControl.controls.forEach((choiceControl: FormGroup, index) => {
      const valueControl = choiceControl.controls.value;
      valueControl.setErrors(undefined);
      if (valueControl.value) {
        const choiceValue = valueControl.value.toLowerCase();
        if (choiceValues[choiceValue] > 1) {
          errorChoices = errorChoices || {};
          valueControl.setErrors({ notUnique: true });
          errorChoices[index.toString()] = choiceValue;
        }
      }
    });
    return errorChoices;
  }

  validateSubmit() {
    if (!this.choicesControl.valid) {
      return;
    }
    let errors: any = null;
    if (this.choicesControl.controls.length < 2) {
      errors = errors || {};
      errors.lessChoices = true;
    }

    const answers = this.choicesControl.controls.filter((choiceControl: FormGroup) => {
      return choiceControl.controls.isAnswer.value;
    });
    if (answers.length === 0) {
      errors = errors || {};
      errors.noAnswers = true;
    }
    this.choicesControl.setErrors(errors);
  }

  private getNewChoiceFormGroup() {
    return new FormGroup({
      value: new FormControl(undefined, [
        Validators.required
      ]),
      isAnswer: new FormControl()
    });
  }

  ngOnInit() {
    this.choicesControl = this.getNewChoiceControl();
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
      this.choicesControl.push(this.getNewChoiceFormGroup());
    }
  }

  removeChoice(index) {
    this.choicesControl.removeAt(index);
  }

  resetForm() {
    this.questionForm.reset();
    this.choicesControl = this.getNewChoiceControl();
    this.questionForm.setControl('choices', this.choicesControl);
  }

  onSubmit() {
    this.validateSubmit();
    if (!this.questionForm.valid) {
      this.submittedValue = undefined;
      return;
    }
    this.submittedValue = JSON.stringify(this.questionForm.value, null, 2);
    this.resetForm();
  }

  markAnswer(event, index) {
    if (event.checked && this.questionForm.controls.type.value === 'MultipleChoice') {
      this.choicesControl.controls.forEach((control: FormGroup, cIndex) => {
        if (cIndex !== index) {
          control.controls.isAnswer.reset();
        }
      });
    }
  }
}
