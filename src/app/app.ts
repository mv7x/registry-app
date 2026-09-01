import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Records } from './services/records';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private recordsService = inject(Records);

  records = this.recordsService.getAll();
}