import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksComponent } from './tasks.component';
import { AuthService } from '../../core/services/auth.service';

describe('TasksComponent', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;

  const mockAuthService = {
    getCurrentUser: () => ({
      id: '123',
      email: 'test@test.com',
      createdAt: new Date(),
    }),
    logout: jasmine.createSpy('logout'),
    isAuthenticated: () => true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty tasks list initially', () => {
    expect(component.tasks).toEqual([]);
  });

  it('should have invalid form when empty', () => {
    expect(component.taskForm.invalid).toBeTrue();
  });

  it('should have valid form with title and description', () => {
    component.taskForm.setValue({ title: 'Test', description: 'Desc' });
    expect(component.taskForm.valid).toBeTrue();
  });

  it('should reset form on cancel', () => {
    component.taskForm.setValue({ title: 'Test', description: 'Desc' });
    component.showCreateForm = true;
    component.onCancelForm();
    expect(component.showCreateForm).toBeFalse();
    expect(component.taskForm.value).toEqual({
      title: null,
      description: null,
    });
  });

  it('should set editingTask on edit', () => {
    const mockTask = {
      id: '1',
      title: 'Test',
      description: 'Desc',
      status: 'pending',
      createdAt: new Date(),
      userId: '123',
    };
    component.onEditTask(mockTask);
    expect(component.editingTask).toEqual(mockTask);
    expect(component.showCreateForm).toBeTrue();
  });

  it('should call logout on authService', () => {
    component.onLogout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
