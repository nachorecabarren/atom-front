import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  userId: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  userId: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasksByUser(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks/user/${userId}`);
  }

  createTask(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, dto);
  }

  updateTaskStatus(id: string, status: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}/status`, {status});
  }

  updateTask(id: string, data: { title: string; description: string }): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}`, data);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }
}
