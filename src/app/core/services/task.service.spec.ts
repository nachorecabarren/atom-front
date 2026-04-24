import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getTasksByUser with correct url', () => {
    service.getTasksByUser('123').subscribe();
    const req = httpMock.expectOne('/api/tasks/user/123');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should call createTask with correct url and body', () => {
    const dto = { title: 'Test', description: 'Desc', userId: '123' };
    service.createTask(dto).subscribe();
    const req = httpMock.expectOne('/api/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush({ id: '1', ...dto, status: 'pending', createdAt: new Date() });
  });

  it('should call updateTaskStatus with correct url and body', () => {
    service.updateTaskStatus('1', 'completed').subscribe();
    const req = httpMock.expectOne('/api/tasks/1/status');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ status: 'completed' });
    req.flush({});
  });

  it('should call deleteTask with correct url', () => {
    service.deleteTask('1').subscribe();
    const req = httpMock.expectOne('/api/tasks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call updateTask with correct url and body', () => {
    const data = { title: 'Updated', description: 'Updated desc' };
    service.updateTask('1', data).subscribe();
    const req = httpMock.expectOne('/api/tasks/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(data);
    req.flush({});
  });
});
