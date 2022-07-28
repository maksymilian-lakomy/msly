import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { Component } from '@angular/core';
import { ClassBinder } from './class-binder';

describe('ClassBinder', () => {
  @Component({
    selector: 'msly-class-binder-component',
    template: '',
    styles: [''],
  })
  class ClassBinderComponent extends ClassBinder('block') {}

  let spectator: Spectator<ClassBinderComponent>;
  const createComponent = createComponentFactory(ClassBinderComponent);

  beforeEach(() => (spectator = createComponent()));

  it('should bind ".block" class to component', () => {
    expect(spectator.element).toHaveClass('block');
  });
});
