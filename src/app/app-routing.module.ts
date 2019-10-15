import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogExampleComponent } from './dialog-example/dialog-example.component';
import { DynamicFormFieldComponent } from './dynamic-form-field/dynamic-form-field.component';
import { TagsComponent } from './tags/tags.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: 'dialog', component: DialogExampleComponent },
  { path: 'dynamic-form-field', component: DynamicFormFieldComponent },
  { path: 'search', component: SearchComponent },
  { path: 'tags', component: TagsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
