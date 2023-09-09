import { Subject } from "rxjs";
import { FocusMonitor } from "@angular/cdk/a11y";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatFormFieldControl } from "@angular/material/form-field";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { ControlValueAccessor, NgControl, NgForm, FormGroupDirective } from '@angular/forms';
import { Component, OnInit, Input, ElementRef, OnDestroy, HostBinding, Renderer2, HostListener, Optional, Self, DoCheck } from '@angular/core';
import { FileInput } from "../../models/file-input.model";
import { FileInputMixinBase } from "../../models/file-input-base-component.model";

@Component({
  selector: 'ngx-mat-file-input',
  styleUrls: ['./mat-file-input.component.css'],
  template: `
    <input #input type="file" [multiple]="multiple ? '' : null" [accept]="accept">
    <span class="filename" [title]="fileNames">{{ fileNames }}</span>
  `,
  providers: [{ provide: MatFormFieldControl, useExisting: MatFileInputComponent }]
})
export class MatFileInputComponent extends FileInputMixinBase implements MatFormFieldControl<FileInput>, ControlValueAccessor, OnInit, OnDestroy, DoCheck {
  static nextId = 0;
  @HostBinding() id = `ngx-mat-file-input-${MatFileInputComponent.nextId++}`;

  @HostBinding('attr.aria-describedby') describedBy = '';

  private _placeholder = '';
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }

  private _multiple = false;
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean | string) {
    this._multiple = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  private _required = false;
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(req: boolean | string) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  @HostBinding('class.file-input-disabled')
  get isDisabled() {
    return this.disabled;
  }
  @Input()
  get disabled(): boolean {
    return this._elementRef.nativeElement.disabled;
  }
  set disabled(dis: boolean | string) {
    this.setDisabledState( coerceBooleanProperty(dis) );
    this.stateChanges.next();
  }

  focused = false;
  controlType = 'file-input';

  @Input() autofilled = false;

  @Input() valuePlaceholder = '';
  @Input() accept: string | null = null;

  @Input()
  get value(): FileInput | null {
    return this.empty ? null : new FileInput(this._elementRef.nativeElement.value || []);
  }
  set value(fileInput: FileInput | null) {
    if (fileInput) {
      this.writeValue(fileInput);
      this.stateChanges.next();
    }
  }

  /**
   * Whether the current input has files
   */
  get empty() {
    return !this._elementRef.nativeElement.value || this._elementRef.nativeElement.value.length === 0;
  }

  @HostBinding('class.mat-form-field-should-float')
  get shouldLabelFloat() {
    return this.focused || !this.empty || this.valuePlaceholder !== undefined;
  }

  private _onChange = (_: any) => {};
  private _onTouched = () => {};

  get fileNames() {
    return this.value ? this.value.fileNames : this.valuePlaceholder;
  }


  /**
   * @see https://angular.io/api/forms/ControlValueAccessor
   */
  constructor(
      private fm: FocusMonitor,
      private _elementRef: ElementRef,
      private _renderer: Renderer2,
      _defaultErrorStateMatcher: ErrorStateMatcher,
      @Optional()
      @Self()
      ngControl: NgControl,
      @Optional() _parentForm: NgForm,
      @Optional() _parentFormGroup: FormGroupDirective,
  ) {
    super(_defaultErrorStateMatcher, _parentForm, _parentFormGroup, ngControl, new Subject<void>());

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(_elementRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  /**
   * Remove all files from the file input component
   * @param [event] optional event that may have triggered the clear action
   */
  clear(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.value = new FileInput([]);
    this._elementRef.nativeElement.querySelector('input').value = null;
    this._onChange(this.value);
  }

  /**
   * Open the file selection dialog
   */
  open() {
    if (this.disabled) {
      return;
    }

    this._elementRef.nativeElement.querySelector('input').click();
  }

  /* ========================= Methods From Angular Interfaces ======================== */
  ngOnInit() {
    this.multiple = coerceBooleanProperty(this.multiple);
  }
  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this._elementRef.nativeElement);
  }
  ngDoCheck(): void {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();
    }
  }


  /* ======================== Methods From ControlValueAccessor ======================= */
  /**
   * @inheritDoc
   */
  writeValue(obj: FileInput | null): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'value', obj instanceof FileInput ? obj.files : null);
  }

  /**
   * @inheritDoc
   */
  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  /**
   * @inheritDoc
   */
  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  /**
   * @inheritDoc
   */
  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }


  /* ======================== Methods From MatFormFieldControl ======================== */
  /**
   * @inheritDoc
   */
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  /**
   * @inheritDoc
   */
  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input' && !this.disabled) {
      this._elementRef.nativeElement.querySelector('input').focus();
      this.focused = true;
      this.open();
    }
  }


  /* ================================== Host Listener ================================= */
  @HostListener('change', ['$event'])
  change(event: Event) {
    const fileList: FileList | null = (<HTMLInputElement>event.target).files;
    const fileArray: File[] = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        fileArray.push(fileList[i]);
      }
    }
    this.value = new FileInput(fileArray);
    this._onChange(this.value);
  }

  @HostListener('focusout')
  blur() {
    this.focused = false;
    this._onTouched();
  }
}
