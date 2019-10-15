import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MyErrorStateMatcher } from '../utils';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
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

  @ViewChild('searchInput', { static: true })
  searchInput: ElementRef;

  selectable = true;
  removable = true;
  searchFilters: IDictionary<string>[];

  searchFilterErrorIndex = -1;

  matcher = new MyErrorStateMatcher();

  searchFields: IDictionary<any>;
  filteredSearchFields: Observable<IDictionary<any>>;
  currentSearchFieldName: string;
  searchFiltersJSON: string;

  handleSearchInputEnter(autoCompleteObj: MatAutocompleteTrigger) {
    if (this.currentSearchFieldName && this.searchInputControl.valid) {
      this.searchFilters.push({ name: this.currentSearchFieldName, value: this.searchInputControl.value });
      this.searchFiltersJSON = JSON.stringify(this.searchFilters, null, 2);
      this.clear();
      autoCompleteObj.closePanel();
    }
  }

  handleSearchFieldSelection(searchFieldName) {
    this.currentSearchFieldName = searchFieldName;
    this.searchInputControl.patchValue('');
  }

  handleSearchFilterSelection(index) {
    const clickedSearchFilter = this.searchFilters[index];
    this.removeSearchFilter(index);
    this.currentSearchFieldName = clickedSearchFilter.name;
    this.searchInputControl.patchValue(clickedSearchFilter.value);
    this.searchInput.nativeElement.focus();
  }

  clear() {
    this.currentSearchFieldName = undefined;
    this.searchInputControl.reset();
  }

  removeSearchFilter(index) {
    if (index === this.searchFilterErrorIndex) {
      this.searchInputControl.setErrors(undefined);
    }
    this.searchFilters.splice(index, 1);
    this.searchFiltersJSON = JSON.stringify(this.searchFilters, null, 2);
  }

  private _filterSearchFields(value: string): IDictionary<any> {
    if (this.currentSearchFieldName) {
      return {};
    }
    const allSearchFields = ObjectUtil.clone(this.searchFields);
    if (!value) {
      return allSearchFields;
    }
    const filterValue = value.replace(/\s+/g, '').toLowerCase();
    const matchedFieldNames = Object.keys(allSearchFields).filter((searchFieldName) => {
      return searchFieldName.toLowerCase().startsWith(filterValue);
    });
    if (!matchedFieldNames.length) {
      this.searchInputControl.setErrors({ invalidField: true });
      return allSearchFields;
    }
    return matchedFieldNames.reduce((matchedSearchFields, searchFieldName) => {
      matchedSearchFields[searchFieldName] = allSearchFields[searchFieldName];
      return matchedSearchFields;
    }, {});
  }

  searchBarValidator() {
    const that = this;
    return (control: AbstractControl) => {
      if (!control.value || !that.currentSearchFieldName) {
        that.searchFilterErrorIndex = -1;
        return undefined;
      }
      control.setErrors(undefined);
      that.searchFilterErrorIndex = that.searchFilters.findIndex((searchFilter) => {
        return that.currentSearchFieldName === searchFilter.name &&
          searchFilter.value === control.value;
      });


      if (that.searchFilterErrorIndex !== -1) {
        control.setErrors({ notUnique: true });
        return { notUnique: true };
      }
    };
  }

  ngOnInit() {
    this.searchInputControl = new FormControl(undefined, [Validators.required, this.searchBarValidator()]);
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
        map(searchFieldName => this._filterSearchFields(searchFieldName)));
  }
}
