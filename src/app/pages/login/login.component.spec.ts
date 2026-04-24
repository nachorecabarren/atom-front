import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should have valid form with correct email', () => {
    component.loginForm.setValue({ email: 'test@test.com' });
    expect(component.loginForm.valid).toBeTrue();
  });

  it('should have invalid form with incorrect email', () => {
    component.loginForm.setValue({ email: 'notanemail' });
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should not submit if form is invalid', () => {
    spyOn(component as any, 'onSubmit').and.callThrough();
    component.loginForm.setValue({ email: '' });
    component.onSubmit();
    expect(component.isLoading).toBeFalse();
  });

  it('should show create dialog when pendingEmail is set', () => {
    component.pendingEmail = 'test@test.com';
    component.showCreateDialog = true;
    fixture.detectChanges();
    expect(component.showCreateDialog).toBeTrue();
  });

  it('should clear pendingEmail on cancel', () => {
    component.pendingEmail = 'test@test.com';
    component.showCreateDialog = true;
    component.onCancelCreate();
    expect(component.pendingEmail).toBe('');
    expect(component.showCreateDialog).toBeFalse();
  });
});
