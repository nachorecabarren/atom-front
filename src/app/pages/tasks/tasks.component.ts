import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TaskService, Task } from '../../core/services/task.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  tasks: Task[] = [];
  isLoading = false;
  showCreateForm = false;
  editingTask: Task | null = null;

  taskForm: FormGroup;

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.taskService
      .getTasksByUser(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onCreateTask(): void {
    if (this.taskForm.invalid) return;

    const user = this.authService.getCurrentUser();
    if (!user) return;
    this.isLoading = true;
    this.taskService
      .createTask({
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        userId: user.id,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task) => {
          this.tasks = [...this.tasks, task];
          this.taskForm.reset();
          this.showCreateForm = false;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onToggleStatus(task: Task): void {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    this.taskService
      .updateTaskStatus(task.id, newStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.tasks = this.tasks.map((t) =>
            t.id === updated.id ? updated : t,
          );
        },
      });
  }

  onDeleteTask(id: string): void {
    this.taskService
      .deleteTask(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.tasks = this.tasks.filter((t) => t.id !== id);
        },
      });
  }

  onEditTask(task: Task): void {
    this.editingTask = task;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
    });
    this.showCreateForm = true;
  }

  onUpdateTask(task: Task): void {
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    this.taskService
      .updateTaskStatus(task.id, newStatus)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.tasks = this.tasks.map((t) =>
            t.id === updated.id ? updated : t,
          );
        },
        error: () => {
          console.error('Error updating task status');
        },
      });
  }

  onSaveEdit(): void {
    if (this.taskForm.invalid || !this.editingTask) return;
    this.isLoading = true;
    this.taskService
      .updateTask(this.editingTask.id, {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.tasks = this.tasks.map((t) =>
            t.id === updated.id ? updated : t,
          );
          this.taskForm.reset();
          this.showCreateForm = false;
          this.editingTask = null;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  onCancelForm(): void {
    this.taskForm.reset();
    this.showCreateForm = false;
    this.editingTask = null;
  }

  onLogout(): void {
    this.authService.logout();
  }
}
