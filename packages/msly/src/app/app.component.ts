import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClassBinder } from '@msly/class-binder';

@Component({
  selector: 'mlakomy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends ClassBinder('root') {}
