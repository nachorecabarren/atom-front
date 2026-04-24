import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set isLoggedIn in localStorage', () => {
    service.setLoggedIn();
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
  });

  it('should return true when user is authenticated', () => {
    localStorage.setItem('isLoggedIn', 'true');
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false when user is not authenticated', () => {
    localStorage.removeItem('isLoggedIn');
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should set and get current user', () => {
    const mockUser = {
      id: '123',
      email: 'test@test.com',
      createdAt: new Date(),
    };
    service.setCurrentUser(mockUser);
    expect(service.getCurrentUser()).toEqual(mockUser);
  });

  it('should clear current user on logout', () => {
    const mockUser = {
      id: '123',
      email: 'test@test.com',
      createdAt: new Date(),
    };
    service.setCurrentUser(mockUser);
    service.logout();
    httpMock.expectOne('/api/users/logout').flush({});
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should call findUserByEmail with correct url', () => {
    service.findUserByEmail('test@test.com').subscribe();
    const req = httpMock.expectOne('/api/users/test@test.com');
    expect(req.request.method).toBe('GET');
    req.flush({ user: null });
  });

  it('should call createUser with correct url and body', () => {
    service.createUser('test@test.com').subscribe();
    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@test.com' });
    req.flush({ id: '123', email: 'test@test.com', createdAt: new Date() });
  });
});
