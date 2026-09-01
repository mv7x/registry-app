import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Records } from './services/records';
import { FormRecord, Department } from './models/form-record';
import {
  arabicOnlyValidator,
  englishOnlyValidator,
  futureDateValidator
} from './validators/form-record.validators';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private recordsService = inject(Records);
  private fb = inject(FormBuilder);

  records = signal<FormRecord[]>([]);
  loading = signal(true);

  editingId: string | null = null;
  errorMessage = '';

  deleteTarget: FormRecord | null = null;
  deleteErrorMessage = '';

  form = this.fb.nonNullable.group({
    code: [
      '',
      [Validators.required, Validators.pattern(/^\d{1,4}$/)]
    ],
    arabicName: [
      '',
      [Validators.required, arabicOnlyValidator()]
    ],
    englishName: [
      '',
      [Validators.required, englishOnlyValidator()]
    ],
    department: [
      '',
      Validators.required
    ],
    submissionDeadline: [
      '',
      [Validators.required, futureDateValidator()]
    ]
  });

  constructor() {
    this.loadRecords();
  }

  private loadRecords(): void {
    this.loading.set(true);

    this.recordsService.getAll().subscribe({
      next: records => {
        this.records.set(records);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage = 'Failed to load records.';
        this.loading.set(false);
      }
    });
  }

  startEdit(record: FormRecord): void {
    this.editingId = record.id;
    this.errorMessage = '';

    this.form.setValue({
      code: record.code,
      arabicName: record.arabicName,
      englishName: record.englishName,
      department: record.department,
      submissionDeadline: record.submissionDeadline.slice(0, 10)
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.errorMessage = '';
    this.form.reset();
  }

  openDeleteDialog(record: FormRecord): void {
    this.deleteTarget = record;
    this.deleteErrorMessage = '';
  }

  cancelDelete(): void {
    this.deleteTarget = null;
    this.deleteErrorMessage = '';
  }

  confirmDelete(): void {
    if (!this.deleteTarget) {
      return;
    }

    const recordToDelete = this.deleteTarget;

    this.deleteTarget = null;
    this.deleteErrorMessage = '';

    this.records.update(records =>
      records.filter(record => record.id !== recordToDelete.id)
    );

    this.recordsService.delete(recordToDelete.id).subscribe({
      next: () => {
        // The row was already removed optimistically.
      },
      error: () => {
        this.records.update(records => {
          const alreadyRestored = records.some(
            record => record.id === recordToDelete.id
          );

          if (alreadyRestored) {
            return records;
          }

          return [...records, recordToDelete];
        });

        this.deleteErrorMessage =
          `Failed to delete ${recordToDelete.arabicName}.`;
      }
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();

    const currentRecords = this.records();

    const duplicateCode = currentRecords.some(
      record =>
        record.code === value.code &&
        record.id !== this.editingId
    );

    if (duplicateCode) {
      this.form.controls.code.setErrors({ unique: true });
      return;
    }

    const duplicateRecord = currentRecords.some(
      record =>
        record.id !== this.editingId &&
        record.code === value.code &&
        record.arabicName === value.arabicName &&
        record.englishName === value.englishName &&
        record.department === value.department &&
        record.submissionDeadline === value.submissionDeadline
    );

    if (duplicateRecord) {
      this.form.setErrors({ duplicate: true });
      return;
    }

    if (this.editingId !== null) {
      const existing = currentRecords.find(
        record => record.id === this.editingId
      );

      if (!existing) {
        return;
      }

      const updated: FormRecord = {
        ...existing,
        code: value.code,
        arabicName: value.arabicName,
        englishName: value.englishName,
        department: value.department as Department,
        submissionDeadline: value.submissionDeadline
      };

      this.recordsService.update(this.editingId, updated).subscribe({
        next: savedRecord => {
          this.records.update(records =>
            records.map(record =>
              record.id === savedRecord.id ? savedRecord : record
            )
          );

          this.cancelEdit();
        },
        error: () => {
          this.errorMessage = 'Failed to save changes.';
        }
      });
    }
  }
}