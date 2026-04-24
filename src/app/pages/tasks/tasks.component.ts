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
  selectedDate: Date | null = null;

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
    this.selectedDate = new Date();
  }

  get filteredAndSortedTasks(): Task[] {
    let filtered = [...this.tasks];

    // Filtrar por fecha si está seleccionada
    if (this.selectedDate) {
      const selectedDay = new Date(this.selectedDate);
      selectedDay.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDay);
      nextDay.setDate(nextDay.getDate() + 1);

      filtered = filtered.filter((task) => {
        const taskDate = new Date(task.createdAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate >= selectedDay && taskDate < nextDay;
      });
    }

    // Ordenar cronológicamente (más vieja primero)
    return filtered.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  onPreviousDay(): void {
    if (this.selectedDate) {
      const prevDay = new Date(this.selectedDate);
      prevDay.setDate(prevDay.getDate() - 1);
      this.selectedDate = prevDay;
    }
  }

  onNextDay(): void {
    if (this.selectedDate) {
      const nextDay = new Date(this.selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      this.selectedDate = nextDay;
    }
  }

  onDateChange(event: any): void {
    const date = event.target.value;
    if (date) {
      this.selectedDate = new Date(date + 'T00:00:00');
    }
  }

  getFormattedDate(): string {
    if (!this.selectedDate) return '';
    return this.selectedDate.toISOString().split('T')[0];
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
          this.resetForm();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  private resetForm(): void {
    this.taskForm.reset();
    this.showCreateForm = false;
    this.editingTask = null;
  }

  onCancelForm(): void {
    this.resetForm();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
