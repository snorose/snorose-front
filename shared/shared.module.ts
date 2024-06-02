import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperComponent } from './components/atom/swiper/swiper.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ListComponent } from './components/atom/list/list.component';
import { MatListModule } from '@angular/material/list';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from './pipes/date.pipe';
import { HeaderComponent } from './components/layouts/header/header.component';
import { DynamicFormComponent } from './components/moleclues/dynamic-form/dynamic-form.component';
import { InputComponent } from './components/atom/form/input/input.component';
import { PasswordComponent } from './components/atom/form/password/password.component';
import { RadioButtonComponent } from './components/atom/form/radio-button/radio-button.component';
import { SelectComponent } from './components/atom/form/select/select.component';
import { TextareaComponent } from './components/atom/form/textarea/textarea.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConfirmDialogComponent } from './components/atom/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    SwiperComponent,
    ListComponent,
    DatePipe,
    HeaderComponent,
    DynamicFormComponent,
    InputComponent,
    PasswordComponent,
    RadioButtonComponent,
    SelectComponent,
    TextareaComponent,
    ConfirmDialogComponent
  ],
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatRippleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatMenuModule,
    MatCardModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSort,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatBottomSheetModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatAutocompleteModule,
  ],
  exports: [
    DatePipe,
    SwiperComponent,
    ListComponent,
    HeaderComponent,
    DynamicFormComponent,
    RouterLink,
    CommonModule,
    HttpClientModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatRippleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatMenuModule,
    MatCardModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatSort,
    MatSortModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatBottomSheetModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatAutocompleteModule,
  ]
})
export class SharedModule { }
