# ClassBinder

**ClassBinder** gracefully overcomes one of my oldest issues with Angular – styling host element.

This is something that bugged me since my very first days with Angular, after switching from Vue.js. This library is
a result of years of struggle to come up with a lightweight, decent solution.

With something more robust than `HostBinding()` 😉

## Table of Contents

- [Class Binder](#class-binder)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
  - [NPM](#npm)
- [Example](#example)
  - [Styling root component with `ViewEncapsulation.Emulated`](#styling-root-component-with-viewencapsulationemulated)
  - [Styling root component with `ViewEncapsulation.None`](#styling-root-component-with-viewencapsulationnone)
  - [BindClass()](#bindclass)
    - [Static class name](#static-class-name)
    - [Factory class name](#factory-class-name)
    - [Property class name](#property-class-name)
- [Limitations](#limitations)

## Installation

### NPM

```bash
  npm install @mlakomy/class-binder
```

## Example

```typescript
import { ClassBinder } from '@mlakomy/class-binder';

@Component({
  selector: 'app-root',
  template: '',
})
export class Component extends ClassBinder('root') {}
```

Extending `ClassBinder` class will result in adding class `.root` to `app-root` element.

### Styling root component with `ViewEncapsulation.Emulated`

Styling host element with `ViewEncapsulation.Enabled` slightly differs from writing your usual SCSS. In order to
target your element properly, you have to do it like so:

```SCSS
:host.root {
  display: flex;
  color: black;
}
```

### Styling root component with `ViewEncapsulation.None`

When you don't use any kind of encapsulation, you can add your class to SCSS in very straightforward way:

```SCSS
.root {
  display: flex;
  color: black;
}
```

### BindClass()

In order to make our life easier ClassBinder also comes with some magic 🧙 in form of custom decorator – `BindClass()`.
Basically it is a neat way of assigning classes dynamically to your host element.

**Note:** I've written all examples below with usage of `Input()` decorator in mind, but of course it is not necessary.
Also, visibility of your property doesn't matter too.

#### Static class name

```typescript
import { ClassBinder, BindClass } from '@mlakomy/class-binder';

@Component()
export class Component extends ClassBinder('root') {
  @Input() @BindClass('root--disabled') public disabled: boolean = false;
}
```

Based on value of `disabled` property, ClassBinder will dynamically add or remove `.root--disabled` class from host
element.

Type of your property doesn't have to be a `boolean`. It can be any type, `BindClass()` decides whether it should add or
remove the class based on `truthy / falsy` values.

#### Factory class name

```typescript
import { ClassBinder, BindClass } from '@mlakomy/class-binder';

const classFactory = (value: number): string | null => {
  if (value < 0) {
    return `root--negative`;
  } else if (value > 0) {
    return `root--positive`;
  }

  return null;
};

@Component()
export class Component extends ClassBinder('root') {
  @Input() @BindClass(classFactory) public value: nuber = 0;
}
```

Each time the `value` property change, `BindClass()` will evaluate class name all over again (and of course remove the
old one). It is really powerful tool that gives you a way to organize your dynamic classes in a very clean and reusable
way.

#### Property class name

```typescript
import { ClassBinder, BindClass } from '@mlakomy/class-binder';

type Color = 'primary' | 'secondary' | 'error';

@Component()
export class Component extends ClassBinder('root') {
  @Input() @BindClass() public color: Color | null = 'primary';
}
```

The most simple approach to bind classes to the host element. `BindClass()` will use current value of the property. In
this case it would give following results: `.root .primary` on your host element.

It is important to note, that value of this property must be either of type `string | null | undefined`. Each different
type will result in runtime error.

## Limitations

- The most obvious limitation of this is that it requires extending `ClassBinder` class, and as we are all aware,
  currently in TypeScript you can only extend from one class.

  My ideal solution would be to make `ClassBinder` as a class decorator, but as I'm aware Angular won't treat your
  component as injectable, if you extend its constructor via decorator.
