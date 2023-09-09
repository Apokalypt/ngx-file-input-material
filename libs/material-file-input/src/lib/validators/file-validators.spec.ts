import { FormControl } from "@angular/forms";
import { FileInput } from "../models/file-input.model";
import { FileValidators } from "./file-validators";

describe('FileValidators', () => {
    describe('Method - maxContentSize', () => {
        it('should not mark control as invalid when no value is provided', () => {
            const control = new FormControl(null, FileValidators.maxContentSize(100));

            expect(control.valid).toBeTruthy();
        });

        it('should not mark control as invalid when value is provided and size is less than max size', () => {
            const buffer = new ArrayBuffer(10);
            const input = new FileInput([new File([buffer], 'file1.txt', { type: 'text/plain', lastModified: 1 })]);

            const control = new FormControl(input, FileValidators.maxContentSize(100));
            expect(control.valid).toBeTruthy();
        });

        it('should mark control as invalid when value is provided and size is greater than max size', () => {
            const buffer = new ArrayBuffer(150);
            const input = new FileInput([new File([buffer], 'file1.txt', { type: 'text/plain', lastModified: 1 })]);

            const control = new FormControl(input, FileValidators.maxContentSize(100));
            expect(control.invalid).toBeTruthy();
            expect(control.errors).toEqual({ maxContentSize: { actualSize: 150, maxSize: 100 } })
        });
    });

    describe('Method - minContentSize', () => {
        it('should not mark control as invalid when no value is provided', () => {
            const control = new FormControl(null, FileValidators.minContentSize(100));

            expect(control.valid).toBeTruthy();
        });

        it('should not mark control as invalid when value is provided and size is greater than min size', () => {
            const buffer = new ArrayBuffer(150);
            const input = new FileInput([new File([buffer], 'file1.txt', { type: 'text/plain', lastModified: 1 })]);

            const control = new FormControl(input, FileValidators.minContentSize(100));
            expect(control.valid).toBeTruthy();
        });

        it('should mark control as invalid when value is provided and size is less than min size', () => {
            const buffer = new ArrayBuffer(10);
            const input = new FileInput([new File([buffer], 'file1.txt', { type: 'text/plain', lastModified: 1 })]);

            const control = new FormControl(input, FileValidators.minContentSize(100));
            expect(control.invalid).toBeTruthy();
            expect(control.errors).toEqual({ minContentSize: { actualSize: 10, minSize: 100 } })
        });
    });
});
