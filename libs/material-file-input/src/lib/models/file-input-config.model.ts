import { InjectionToken } from '@angular/core';
import { ByteUnit } from "../enums/byte-unit.enum";

/**
 * Optional token to provide custom configuration to the module
 */
export const NGX_MAT_FILE_INPUT_CONFIG = new InjectionToken<FileInputConfig>(
    'ngx-mat-file-input.config'
);

/**
 * Provide additional configuration to dynamically customize the module injection
 */
export interface FileInputConfig {
    /**
     * Default unit of the initial value when formatting bytes using the BytesPipe.
     * @default 'B'
     */
    initialValueUnit?: ByteUnit;
    /**
     * Default unit to use when formatting bytes using the BytesPipe.
     */
    destinationValueUnit?: ByteUnit;

    /**
     * Default decimal to use when formatting bytes using the BytesPipe.
     * @default 0
     */
    defaultPrecision?: number;
}
