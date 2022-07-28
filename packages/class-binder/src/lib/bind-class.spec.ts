import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ClassBinder } from './class-binder';
import { BindClass } from './bind-class';
import { errorMessages } from './error-messages';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

describe('ClassBinder', () => {
  describe('extends ClassBinder', () => {
    describe('static class name', () => {
      @Component({
        selector: 'msly-class-binder-component',
        template: '',
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class ClassBinderComponent extends ClassBinder('block') {
        @BindClass('block--modifier') booleanValue = true;

        @Input() @BindClass('block--input-modifier') inputBooleanValue = false;
      }

      let spectator: Spectator<ClassBinderComponent>;
      const createComponent = createComponentFactory(ClassBinderComponent);

      beforeEach(() => (spectator = createComponent()));

      it('should add class ".block--modifier" when value equals to "true"', () => {
        spectator.component.booleanValue = true;

        expect(spectator.element).toHaveClass('block--modifier');
      });

      it('should not add class ".block--modifier" when value equals to "false"', () => {
        spectator.component.booleanValue = false;

        expect(spectator.element).not.toHaveClass('block--modifier');
      });

      it('should dynamically add and remove class ".block--input-modifier" when value changes', () => {
        spectator.component.booleanValue = true;

        expect(spectator.element).toHaveClass('block--modifier');

        spectator.component.booleanValue = false;

        expect(spectator.element).not.toHaveClass('block--modifier');
      });

      it('should add class ".block--input-modifier" when value equals to "true" and is changed by @Input()', () => {
        spectator.setInput('inputBooleanValue', true);

        expect(spectator.element).toHaveClass('block--input-modifier');
      });

      it('should not add class ".block--input-modifier" when value equals to "false" and is changed by @Input()', () => {
        spectator.setInput('inputBooleanValue', false);

        expect(spectator.element).not.toHaveClass('block--input-modifier');
      });

      it('should dynamically add and remove class ".block--input-modifier" when value is changed by @Input()', () => {
        spectator.setInput('inputBooleanValue', true);

        expect(spectator.element).toHaveClass('block--input-modifier');

        spectator.setInput('inputBooleanValue', false);

        expect(spectator.element).not.toHaveClass('block--input-modifier');
      });
    });

    enum ClassName {
      'Primary' = 'primary',
      'Secondary' = 'secondary',
    }

    describe('property class name', () => {
      @Component({
        selector: 'msly-class-binder-component',
        template: '',
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class ClassBinderComponent extends ClassBinder('block') {
        @BindClass() enumValue: ClassName | null = null;
      }

      let spectator: Spectator<ClassBinderComponent>;
      const createComponent = createComponentFactory(ClassBinderComponent);

      beforeEach(() => (spectator = createComponent()));

      it('should not add class ".{suffix}" when value is falsy', () => {
        spectator.component.enumValue = null;

        expect(spectator.element.className).toEqual('block');
      });

      it('should add class ".{suffix} when value is not falsy"', () => {
        spectator.component.enumValue = ClassName.Primary;

        expect(spectator.element).toHaveClass(ClassName.Primary);
      });

      it('should dynamically change class ".{suffix}" when value changes', () => {
        spectator.component.enumValue = ClassName.Primary;

        expect(spectator.element).toHaveClass(ClassName.Primary);

        spectator.component.enumValue = ClassName.Secondary;

        expect(spectator.element).not.toHaveClass(ClassName.Primary);
        expect(spectator.element).toHaveClass(ClassName.Secondary);
      });
    });

    describe('factory class name', () => {
      @Component({
        selector: 'msly-class-binder-component',
        template: '',
        changeDetection: ChangeDetectionStrategy.OnPush,
      })
      class ClassBinderComponent extends ClassBinder('block') {
        @BindClass<ClassName>((value) => `block--${value}`)
        enumValue: ClassName | null = null;
      }

      let spectator: Spectator<ClassBinderComponent>;
      const createComponent = createComponentFactory(ClassBinderComponent);

      beforeEach(() => (spectator = createComponent()));

      it('should not add class ".block--{suffix}" when value is falsy', () => {
        spectator.component.enumValue = null;

        expect(spectator.element.className).toEqual('block');
      });

      it('should add class ".block--{suffix} when value is not falsy"', () => {
        spectator.component.enumValue = ClassName.Primary;

        expect(spectator.element).toHaveClass(`block--${ClassName.Primary}`);
      });

      it('should dynamically change class ".block--{suffix}" when value changes', () => {
        spectator.component.enumValue = ClassName.Primary;

        expect(spectator.element).toHaveClass(`block--${ClassName.Primary}`);

        spectator.component.enumValue = ClassName.Secondary;

        expect(spectator.element).not.toHaveClass(
          `block--${ClassName.Primary}`
        );
        expect(spectator.element).toHaveClass(`block--${ClassName.Secondary}`);
      });
    });
  });

  describe('does not extend ClassBinder', () => {
    it('should throw error when component does not extend ClassBinder', () => {
      @Component({
        selector: 'msly-no-class-binder-component',
        template: '',
      })
      class NoClassBinderComponent {
        @BindClass('block--modifier') public bindClass = true;
      }

      expect(() => new NoClassBinderComponent()).toThrowError(
        errorMessages.extendClassBinder
      );
    });
  });
});
