import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';
import { FileInputConfig, NGX_MAT_FILE_INPUT_CONFIG } from "../models/file-input-config.model";
import { ByteUnit } from "../enums/byte-unit.enum";

type FormatConfig = { max: number, prev?: ByteUnit };

@Pipe({
  name: 'bytes'
})
export class BytesPipe implements PipeTransform {
  static readonly KILOBYTE = 1024;
  static readonly FORMATS: Record<ByteUnit, FormatConfig> = {
    [ByteUnit.B]: { max: BytesPipe.KILOBYTE },
    [ByteUnit.kB]: { max: Math.pow(BytesPipe.KILOBYTE, 2), prev: ByteUnit.B },
    [ByteUnit.MB]: { max: Math.pow(BytesPipe.KILOBYTE, 3), prev: ByteUnit.kB },
    [ByteUnit.GB]: { max: Math.pow(BytesPipe.KILOBYTE, 4), prev: ByteUnit.MB },
    [ByteUnit.TB]: { max: Number.MAX_SAFE_INTEGER, prev: ByteUnit.GB },
  };

  constructor(
      @Optional()
      @Inject(NGX_MAT_FILE_INPUT_CONFIG)
      private _config?: FileInputConfig
  ) { }

  transform(input: string | number, precision?: number, from?: ByteUnit, to?: ByteUnit): any {
    // Validate input format
    if (input == null || Array.isArray(input)) {
      // Handle special cases where input is null or an array but the parsed value is not NaN
      return input;
    }
    const value = this._parseInput(input);
    if (Number.isNaN( value )) {
      return input;
    }

    // Validate decimal format
    if (Array.isArray(precision)) {
      // Handle special cases where precision is an array but the parsed value is not NaN
      return input;
    }
    precision = this._parsePrecision(precision ?? this._config?.defaultPrecision ?? 0);
    if (Number.isNaN( precision )) {
      return input;
    }

    // Validate unit format
    if (from && !BytesPipe.FORMATS[from]) {
      return input;
    }
    if (to && !BytesPipe.FORMATS[to]) {
      return input;
    }

    // Convert input value into bytes format
    let bytes = value;
    let unit = from ?? this._config?.initialValueUnit ?? ByteUnit.B;
    while (unit !== 'B') {
      bytes *= BytesPipe.KILOBYTE;
      unit = BytesPipe.FORMATS[unit as keyof typeof BytesPipe.FORMATS].prev!;
    }

    const destinationUnit = to ?? this._config?.destinationValueUnit;
    if (destinationUnit) {
      const format = BytesPipe.FORMATS[destinationUnit];

      return this._formatResult(this._calculateResult(format, bytes), precision, destinationUnit);
    }

    for (const key in BytesPipe.FORMATS) {
      if (!BytesPipe.FORMATS.hasOwnProperty(key)) {
        continue;
      }

      const unit = key as keyof typeof BytesPipe.FORMATS;
      const format = BytesPipe.FORMATS[unit];
      if (bytes < format.max) {
        return this._formatResult(this._calculateResult(format, bytes), precision, unit);
      }
    }
  }

  private _parseInput(input: string | number): number {
    if (typeof input === 'number') {
      return input;
    }

    return Number(input);
  }

  private _parsePrecision(precision: number): number {
    if (Number.isNaN( precision )) {
      return Number.NaN;
    }

    if (!Number.isInteger( precision ) || precision < 0) {
      return Number.NaN;
    }

    return precision;
  }

  private _calculateResult(format: FormatConfig, bytes: number): number {
    const prev = format.prev ? BytesPipe.FORMATS[format.prev] : undefined;
    return prev ? bytes / prev.max : bytes;
  }

  private _formatResult(result: number, precision: number, unit: ByteUnit): string {
    const resultWithDecimal = Math.round(result * Math.pow(10, precision)) / Math.pow(10, precision);

    return `${resultWithDecimal} ${unit}`;
  }
}
