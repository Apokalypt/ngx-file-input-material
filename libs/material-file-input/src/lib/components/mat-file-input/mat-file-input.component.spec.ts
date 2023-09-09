import { By } from "@angular/platform-browser";
import { ErrorStateMatcher } from "@angular/material/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroupDirective, NG_VALUE_ACCESSOR, NgControl, NgForm } from "@angular/forms";

import { MatFileInputComponent } from './mat-file-input.component';
import { FileInput } from "../../models/file-input.model";

/**
 * Shows error state on a control if it is touched and has any error.
 * Used as global ErrorStateMatcher for all tests.
 */
class FileInputSpecErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, _: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.errors !== null && control.touched);
  }
}

/**
 * Shows error state on a control with exactly two validation errors.
 * Used to change the ErrorStateMatcher of a single component.
 */
class OverrideErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, _: FormGroupDirective | NgForm | null): boolean {
    return !!(control && control.errors && Object.keys(control.errors).length === 2);
  }
}

describe('MatFileInputComponent', () => {
  let component: MatFileInputComponent;
  let fixture: ComponentFixture<MatFileInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatFileInputComponent ],
      providers: [
        { provide: NgControl, useValue: NG_VALUE_ACCESSOR },
        { provide: ErrorStateMatcher, useClass: FileInputSpecErrorStateMatcher }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MatFileInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have no files by default', () => {
    expect(component.value).toBeNull();
  });

  it('should add file from Input', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    component.value = new FileInput([file]);
    expect(component.value.files.length).toBe(1);
  });

  it('should set/get placeholder', () => {
    const plh = 'Upload file';
    component.placeholder = plh;
    expect(component.placeholder).toBe(plh);
  });

  it('should set/get valuePlaceholder', () => {
    const plh = 'Filenames here';
    component.valuePlaceholder = plh;
    expect(component.valuePlaceholder).toBe(plh);
  });

  it('should replace valuePlaceholder with fileNames when adding a file', () => {
    component.valuePlaceholder = 'Initial text';
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    component.value = new FileInput([file]);
    expect(component.fileNames).toBe(file.name);
  });

  it('should set/get disabled state', () => {
    component.disabled = true;
    expect(component.disabled).toBeTruthy();
  });

  it('should have `accept` attribute', () => {
    const inputDebugEl = fixture.debugElement.query(By.css('input'));
    expect(inputDebugEl.attributes['accept']).toBe('null');

    component.accept = '.json';
    fixture.detectChanges();

    expect(inputDebugEl.attributes['accept']).toBe('.json');

    expect(component.fileNames).toBe('');
  });

  it('should have `multiple` attribute', () => {
    const inputDebugEl = fixture.debugElement.query(By.css('input'));
    expect(inputDebugEl.properties['multiple']).toBeNull();

    component.multiple = true;
    fixture.detectChanges();

    expect(inputDebugEl.properties['multiple']).toBe('');
  });

  it('should propagate onContainerClick()', () => {
    spyOn(component, 'open').and.stub();
    component.onContainerClick({
      target: {
        tagName: 'not-input'
      } as Partial<Element>
    } as MouseEvent);
    expect(component.open).toHaveBeenCalled();
  });

  it('should not propagate onContainerClick(), when disabled', () => {
    spyOn(component, 'open').and.stub();
    component.disabled = true;
    component.onContainerClick({
      target: {
        tagName: 'not-input'
      } as Partial<Element>
    } as MouseEvent);
    expect(component.open).not.toHaveBeenCalled();
  });

  it('should remove file from Input', fakeAsync(() => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    component.value = new FileInput([file]);
    fixture.nativeElement.querySelector('input').dispatchEvent(new Event('input'));
    tick();
    fixture.detectChanges();
    expect(component.value.files.length).toBe(1);

    component.clear();
    tick();
    fixture.detectChanges();
    expect(component.empty).toBeTruthy();
    expect(component.value).toBeNull();
  }));

  it('should recognize all error state changes', () => {
    spyOn(component.stateChanges, 'next');
    component.ngControl = <any>{ control: <any>{ errors: null, touched: false } };
    expect(component.errorState).toBeFalsy();
    expect(component.stateChanges.next).not.toHaveBeenCalled();

    fixture.detectChanges();
    expect(component.errorState).toBeFalsy();
    expect(component.stateChanges.next).not.toHaveBeenCalled();
    component.ngControl = <any>{ control: <any>{ errors: ['some error'], touched: true } };

    expect(component.stateChanges.next).not.toHaveBeenCalled();

    fixture.detectChanges();
    expect(component.errorState).toBeTruthy();
    expect(component.stateChanges.next).toHaveBeenCalledTimes(1);
  });

  it('should use input ErrorStateMatcher over provided', () => {
    component.ngControl = <any>{ control: <any>{ errors: ['some error'], touched: true } };

    fixture.detectChanges();
    expect(component.errorState).toBeTruthy();

    component.errorStateMatcher = new OverrideErrorStateMatcher();
    expect(component.errorState).toBeTruthy();

    fixture.detectChanges();
    expect(component.errorState).toBeFalsy();
    component.ngControl = <any>{ control: <any>{ errors: ['some error', 'another error'] } };
    expect(component.errorState).toBeFalsy();

    fixture.detectChanges();
    expect(component.errorState).toBeTruthy();
  });
});
