import { TestBed } from "@angular/core/testing";
import { BytesPipe } from './bytes.pipe';
import { NGX_MAT_FILE_INPUT_CONFIG } from "../models/file-input-config.model";
import { ByteUnit } from "../enums/byte-unit.enum";

describe('PIPE - bytes', () => {
  describe('No configuration injected', () => {
    it('should use default values for all property when not defined', () => {
      const pipe = new BytesPipe();

      const values: [number, string][] = [
        [0, '0 B'],
        [1, '1 B'],
        [1024, '1 kB'],
        [1048, '1 kB'],
        [1048576, '1 MB'],
      ];
      for (const [value, resExpected] of values) {
        // Default precision : 0
        // Default from : ByteUnit.B
        // Default to : *higher unit where parsing result in a value greater than 1*

        const res = pipe.transform(value);
        expect(res).toEqual(resExpected);
      }
    });

    it('should parse higher unit to lower one', () => {
      const pipe = new BytesPipe();

      const values: [number, ByteUnit, string][] = [
        [0, ByteUnit.GB, '0 B'],
        [1, ByteUnit.GB, '1073741824 B'],
        [0.5, ByteUnit.GB, '536870912 B'],
      ];
      for (const [value, unit, resExpected] of values) {
        // Default precision : 0

        const res = pipe.transform(value, undefined, unit, ByteUnit.B);
        expect(res).toEqual(resExpected);
      }
    });

    it('should use right precision and round to nearest', () => {
      const pipe = new BytesPipe();

      // Test ceil round
      const res1 = pipe.transform(861, 3, ByteUnit.B, ByteUnit.kB);
      expect(res1).toEqual('0.841 kB');
      // Test floor round
      const res2 = pipe.transform(861, 4, ByteUnit.B, ByteUnit.kB);
      expect(res2).toEqual('0.8408 kB');
    });

    it('should return the value when it is invalid', () => {
        const pipe = new BytesPipe();

        const values: any[] = [
            undefined,
            null,
            'test',
            {},
            [],
            () => {},
        ];
        for (const value of values) {
            const res = pipe.transform(value);
            expect(res).toEqual(value);
        }
    });

    it('should return the value when precision is invalid', () => {
        const pipe = new BytesPipe();

        const values: any[] = [
            'test',
            {},
            [],
            () => {},
            -1,
            1.5,
        ];
        for (const value of values) {
            const res = pipe.transform(100, value);
            expect(res).toEqual(100);
        }
    });
  });

  describe('Configuration injected', () => {
      beforeEach(() => {
          TestBed.configureTestingModule({
                providers: [
                    {
                        provide: NGX_MAT_FILE_INPUT_CONFIG,
                        useValue: {
                            initialValueUnit: ByteUnit.MB,
                            destinationValueUnit: ByteUnit.GB,
                            defaultPrecision: 2
                        }
                    }
                ]
          });
      });

        it('should use default values for all property when not defined', () => {
            const pipe = new BytesPipe(TestBed.inject(NGX_MAT_FILE_INPUT_CONFIG));

            const res = pipe.transform(659);
            expect(res).toEqual('0.64 GB');
        });
  });
});
