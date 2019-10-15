import { Component, OnInit, ViewChild } from '@angular/core';
import { MyErrorStateMatcher } from '../utils';
import { FormControl, Validators } from '@angular/forms';
import { IDictionary } from '../types/dictionary';
import { map, startWith } from 'rxjs/operators';
import { ObjectUtil } from '../utils/object';
import { Observable } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchInputControl: FormControl;

  selectable = true;
  removable = true;
  searchFilters: IDictionary<string>[];

  matcher = new MyErrorStateMatcher();

  searchFields: IDictionary<any>;
  filteredSearchFields: Observable<IDictionary<any>>;
  currentSearchFieldName: string;

  handleSearchInputEnter(event, autoCompleteObj: MatAutocompleteTrigger) {
    if (this.currentSearchFieldName && this.searchInputControl.valid) {
      this.searchFilters.push({ name: this.currentSearchFieldName, value: this.searchInputControl.value });
      this.clear();
      autoCompleteObj.closePanel();
    }
  }

  handleSearchFieldSelection(searchFieldName) {
    this.currentSearchFieldName = searchFieldName;
    this.searchInputControl.patchValue('');
  }

  clear() {
    this.currentSearchFieldName = undefined;
    this.searchInputControl.reset();
  }

  removeSearchFilter(index) {
    this.searchFilters.splice(index, 1);
  }

  private _filterSearchFields(value: string): IDictionary<any> {
    if (this.currentSearchFieldName) {
      return {};
    }
    const filterValue = value.replace(/\s+/g, '').toLowerCase();
    const allSearchFields = ObjectUtil.clone(this.searchFields);
    const matchedFieldNames = Object.keys(allSearchFields).filter((searchFieldName) => {
      return searchFieldName.toLowerCase().startsWith(filterValue);
    });
    if (!matchedFieldNames.length) {
      this.searchInputControl.setErrors({ invalidFiled: true });
      return allSearchFields;
    }
    return matchedFieldNames.reduce((matchedSearchFields, searchFieldName) => {
      matchedSearchFields[searchFieldName] = allSearchFields[searchFieldName];
      return matchedSearchFields;
    }, {});
  }


  ngOnInit() {
    this.searchInputControl = new FormControl(undefined, Validators.required);
    this.searchFilters = [];
    this.searchFields = {
      cloudAccountName: {
        displayValue: 'Cloud Account Name',
      },
      tags: {
        displayValue: 'Tag',
        hint: 'Format Name:Value'
      }
    };
    this.filteredSearchFields = this.searchInputControl.valueChanges
      .pipe(
        startWith(''),
        map(searchFieldName => searchFieldName ?
          this._filterSearchFields(searchFieldName) :
          ObjectUtil.clone(this.searchFields))
      );
  }
}
