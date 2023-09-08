import { NgModule } from '@angular/core';
import { FocusMonitor } from "@angular/cdk/a11y";
import { BytesPipe } from './pipes/bytes.pipe';
import { MatFileInputComponent } from './components/mat-file-input/mat-file-input.component';

@NgModule({
  declarations: [MatFileInputComponent, BytesPipe],
  providers: [FocusMonitor],
  exports: [MatFileInputComponent, BytesPipe]
})
export class MatFileInputModule { }
