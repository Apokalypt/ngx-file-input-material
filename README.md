# Material File Input

This project is the continuation of the abandoned version started by [merlosy](https://github.com/merlosy)
called [ngx-material-file-input](https://github.com/merlosy/ngx-material-file-input). I've decided to take up the idea
again in order to maintain it and make it evolve in future versions of Angular.

## Table of contents

- [Angular compatibility](#angular-compatibility)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
  - [Module - MatFileInputModule](#module---matfileinputmodule)
  - [Component - MatFileInput](#component---matfileinput)
  - [Pipe - BytesPipe](#pipe---bytespipe)
  - [Validators - FileValidators](#validators---filevalidators)
- [Help and support](#help-and-support)
- [Contributing](#contributing)

## Angular compatibility

| Angular version | Material File Input version                                                 |
|-----------------|-----------------------------------------------------------------------------|
| <= 13.x         | *see [merlosy project](https://github.com/merlosy/ngx-material-file-input)* |
| 14.x            | 14.x                                                                        |
| 15.x            | *soon*                                                                      |
| 16.x            | *soon*                                                                      |
| 17.x            | *soon*                                                                      |

## Installation

```bash 
npm install ngx-mat-file-input
```

## Usage

TODO

## API Reference

### Module - MatFileInputModule

Includes the `MatFileInput` component.

```typescript
import { MatFileInputModule } from 'ngx-mat-file-input';

@NgModule({
  imports: [
    MatFileInputModule
  ]
})
export class AppModule { }
```

### Component - MatFileInput

- Selector: `ngx-mat-file-input`
- Exported as: `MatFileInput`
- Extended from: [`MatFormFieldControl`](https://v14.material.angular.io/components/form-field/api#MatFormFieldControl)

#### Inputs

| Name              | Type      | Default | Description                                                                                                                                                             |
|-------------------|-----------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `accept`          | `string`  | `*`     | The file types accepted by the input. The values allowed are those defined by the [standards](https://developer.mozilla.org/fr/docs/Web/HTML/Element/input/file#accept) |
| `multiple`        | `boolean` | `false` | Whether the input accepts multiple files.                                                                                                                               |
| `autofilled`      | `boolean` | `false` | Whether the input is currently in an autofilled state.                                                                                                                  |
| `placeholder`     | `string`  |         | Placeholder shown for the input.                                                                                                                                        |
| `valuePlaceholder`| `string`  |         | Placeholder for file names, empty by default.                                                                                                                           |
| `disabled`        | `boolean` | `false` | Whether the input is disabled.                                                                                                                                          |
| `required`        | `boolean` | `false` | Whether the input is required.                                                                                                                                          |
| `value`           | `File[]`  | `[]`    | The value of the input.                                                                                                                                                 |


#### Properties

In addition to Inputs, certain properties are exposed to allow you to access certain data:

| Name    | Type         | Description                 |
|---------|--------------|-----------------------------|
| `empty` | `boolean`    | Whether the input is empty. |
| `clear` | `() => void` | Clears the input.           |

#### Example

```html
<ngx-mat-file-input
  accept="image/*"
  [autofilled]="true"
  valuePlaceholder="No file selected"> </ngx-mat-file-input>
```

### Pipe - BytesPipe

Converts a number of bytes into a human-readable string.

#### Arguments

| Name        | Type     | Default            | Description                                                                 |
|-------------|----------|--------------------|-----------------------------------------------------------------------------|
| `precision` | `number` | `0`                | The number of digits after the decimal point.                               |
| `from`      | `string` | `B`                | The unit of the input value. The values allowed are `B`, `KB`, `MB`, `GB`.  |
| `to`        | `string` | *highest possible* | The unit of the output value. The values allowed are `B`, `KB`, `MB`, `GB`. |

#### Usage

```html
{{ 1024 | bytes }} <!-- 1 kB -->
{{ 1024 | bytes: 2 }} <!-- 1.00 kB -->
{{ 1000024 | bytes:2:'MB' }} <!-- 1.00 TB -->
{{ 1024 | bytes:2:'MB':'GB' }} <!-- 1.02 GB -->
```

### Validators - FileValidators

This class provide some utils function to validate files using [Angular Form Validators](https://v14.angular.io/api/forms/Validators).

#### maxContentSize

Control that the sum of the size of the files does not exceed a certain value. If the value is exceeded, the error
`maxContentSize` is added to the control with the following format :

```JSON
{
  "maxContentSize": {
    "actualSize": "number",
    "maxSizeInBytes": "number"
  }
}
```

#### minContentSize

Control that the sum of the size of the files is greater than a certain value. If the value is not reached, the error
`minContentSize` is added to the control with the following format :

```JSON
{
  "minContentSize": {
    "actualSize": "number",
    "minSizeInBytes": "number"
  }
}
```

## Help and support

TODO

## Contributing

TODO
