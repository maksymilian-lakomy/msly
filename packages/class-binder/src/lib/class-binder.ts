import { ElementRef, inject, Renderer2 } from '@angular/core';

export abstract class ClassBinderBase {
  private readonly _elementRef: ElementRef<HTMLElement> = inject(ElementRef);
  private readonly _renderer2: Renderer2 = inject(Renderer2);

  public addClass(className: string): void {
    this._renderer2.addClass(this._elementRef.nativeElement, className);
  }

  public removeClass(className: string): void {
    this._renderer2.removeClass(this._elementRef.nativeElement, className);
  }

  public hasClass(className: string): boolean {
    return this._elementRef.nativeElement.classList.contains(className);
  }
}

export const ClassBinder = (className: string): typeof ClassBinderBase => {
  class ClassBinder extends ClassBinderBase {
    constructor() {
      super();

      this.addClass(className);
    }
  }

  return ClassBinder;
};
