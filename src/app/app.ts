import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormService } from './form.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private formService = inject(FormService);

  forms = this.formService.getForms();
}