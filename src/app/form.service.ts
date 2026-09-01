import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FormRecord {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/forms';

  getForms(): Observable<FormRecord[]> {
    return this.http.get<FormRecord[]>(this.apiUrl);
  }
}