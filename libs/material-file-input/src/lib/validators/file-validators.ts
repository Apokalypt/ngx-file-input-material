import { AbstractControl, ValidatorFn } from "@angular/forms";
import { FileInput } from "../models/file-input.model";

type FileInputControl = AbstractControl<FileInput | undefined>;

type FileInputMaxSizeError = { maxContentSize: { actualSize: number, maxSize: number } };
type FileInputMinSizeError = { minContentSize: { actualSize: number, minSize: number } };

export abstract class FileValidators {
    static maxContentSize(maxSizeInBytes: number): ValidatorFn {
        return (control: FileInputControl): null | FileInputMaxSizeError => {
            const input = control.value;
            if (!input) {
                return null;
            }

            const size = input.files.reduce((acc, file) => acc + file.size, 0);
            if (size > maxSizeInBytes) {
                return { maxContentSize: { actualSize: size, maxSize: maxSizeInBytes } };
            }

            return null;
        };
    }

    static minContentSize(minSizeInBytes: number): ValidatorFn {
        return (control: FileInputControl): null | FileInputMinSizeError => {
            const input = control.value;
            if (!input) {
                return null;
            }

            const size = input.files.reduce((acc, file) => acc + file.size, 0);
            if (size < minSizeInBytes) {
                return { minContentSize: { actualSize: size, minSize: minSizeInBytes } };
            }

            return null;
        }
    }
}
