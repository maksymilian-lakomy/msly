import { ClassBinderBase } from './class-binder';
import { errorMessages } from './error-messages';

type BindClassDecorator = (target: unknown, propertyKey: string) => void;

const assureClassBinderExistence = <T>(
  target: unknown,
  propertyKey: string,
  callback: (classBinder: ClassBinderBase, value: T) => void
) => {
  Object.defineProperty(target, propertyKey, {
    set(value: T) {
      if (!(this instanceof ClassBinderBase)) {
        throw new Error(errorMessages.extendClassBinder);
      }

      callback(this, value);
    },
  });
};

const handleStaticClassName = (
  target: unknown,
  propertyKey: string,
  className: string
) => {
  assureClassBinderExistence(target, propertyKey, (classBinder, value) => {
    const boolValue = !!value;

    if (boolValue && !classBinder.hasClass(className)) {
      classBinder.addClass(className);
    } else if (!boolValue && classBinder.hasClass(className)) {
      classBinder.removeClass(className);
    }
  });
};

const handleFactoryClassName = <T>(
  target: unknown,
  propertyKey: string,
  classNameFactory: (value: T) => string | null
) => {
  let latestBoundClass: string | null = null;

  assureClassBinderExistence<T>(target, propertyKey, (classBinder, value) => {
    const evaluatedClassName: string | null = value
      ? classNameFactory(value)
      : null;

    latestBoundClass && classBinder.removeClass(latestBoundClass);
    evaluatedClassName && classBinder.addClass(evaluatedClassName);

    latestBoundClass = evaluatedClassName;
  });
};

const handlePropertyClassName = (target: unknown, propertyKey: string) => {
  let latestBoundClass: string | null = null;

  assureClassBinderExistence(target, propertyKey, (classBinder, value) => {
    if (typeof value !== 'string' && value !== undefined && value !== null) {
      throw new Error(errorMessages.propertyTypeDifferentThanString);
    }

    const evaluatedClassName = value || null;

    latestBoundClass && classBinder.removeClass(latestBoundClass);
    evaluatedClassName && classBinder.addClass(evaluatedClassName);

    latestBoundClass = evaluatedClassName;
  });
};

export function BindClass(className: string): BindClassDecorator;

export function BindClass<T>(
  classNameFactory: (value: T) => string | null
): BindClassDecorator;

export function BindClass(): BindClassDecorator;

export function BindClass<T>(
  className: string | ((value: T) => string | null) | undefined = undefined
): BindClassDecorator {
  return (target: unknown, propertyKey: string) => {
    if (typeof className === 'string') {
      handleStaticClassName(target, propertyKey, className);
    } else if (typeof className === 'function') {
      handleFactoryClassName(target, propertyKey, className);
    } else if (className === undefined) {
      handlePropertyClassName(target, propertyKey);
    }
  };
}
