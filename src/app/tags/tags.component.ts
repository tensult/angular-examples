import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MyErrorStateMatcher } from '../utils';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  submittedValue: any;

  constructor() { }
  tagsControl: FormArray;
  matcher = new MyErrorStateMatcher();

  private getTagsControl() {
    return new FormArray([
      this.getTagFormGroup()
    ], this.tagsValidator);
  }

  private getTagFormGroup() {
    return new FormGroup({
      name: new FormControl(undefined, [
        Validators.required
      ]),
      value: new FormControl()
    });
  }

  moveToAddValue(event) {
    const element = event.srcElement.nextElementSibling; // get the sibling element
    if (element) {
      return element.focus();
    }
  }
  tagsValidator(tagsControl: FormArray) {
    const tagNames = tagsControl.controls.reduce((tagNamesObj, tagControl: FormGroup) => {
      const nameControl = tagControl.controls.name;
      if (nameControl.value) {
        const tagName = nameControl.value.toLowerCase();
        tagNamesObj[tagName] = tagNamesObj[tagName] || 0;
        tagNamesObj[tagName]++;
      }
      return tagNamesObj;
    }, {} as any);

    let errorChoices = null;

    tagsControl.controls.forEach((tagControl: FormGroup, index) => {
      const nameControl = tagControl.controls.name;
      nameControl.setErrors(undefined);
      if (nameControl.value) {
        const tagName = nameControl.value.toLowerCase();
        if (tagNames[tagName] > 1) {
          errorChoices = errorChoices || {};
          nameControl.setErrors({ notUnique: true });
          errorChoices[index.toString()] = tagName;
        }
      } else {
        nameControl.setErrors({ required: true });
      }
    });
    return errorChoices;
  }

  addTag(index) {
    if (index === this.tagsControl.controls.length - 1 &&
      this.tagsControl.controls[index].valid) {
      this.tagsControl.push(this.getTagFormGroup());
    }
  }

  removeTag(index) {
    this.tagsControl.removeAt(index);
  }

  onSubmit() {
    if (!this.tagsControl.valid) {
      this.submittedValue = undefined;
      return;
    }
    this.submittedValue = JSON.stringify(this.tagsControl.value, null, 2);
    this.tagsControl = this.getTagsControl();
  }

  ngOnInit() {
    this.tagsControl = this.getTagsControl();
  }

}
