import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogTestComponent } from './dialog-test/dialog-test.component';
import { DynamicFormFieldComponent } from './dynamic-form-field/dynamic-form-field.component';

const routes: Routes = [
  { path: 'dialog', component: DialogTestComponent },
  { path: 'dynamic-form-field', component: DynamicFormFieldComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
