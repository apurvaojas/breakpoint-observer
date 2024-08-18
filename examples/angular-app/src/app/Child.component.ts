import { Component, Optional } from '@angular/core';
import {
  ActiveBreakpoint,
  BreakpointObserverDirective,
  BreakpointService,
  BreakpointsList,
} from '@breakpoint-observer/angular';

// Setting Up Own Breakpoints
BreakpointService.setOptions({
  breakpoints: [{ mobile: 0 }, { tablet: 500 }, { desktop: 800 }],
});

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h3>Active Breakpoint:</h3>
      <pre>{{ activeBreakpoint | json }} </pre>
      <br />
      <h3>Breakpoints List:</h3>
      <pre>{{ breakpointsList | json }} </pre>
    </div>
  `,
})
export class ChildComponent {
  activeBreakpoint: ActiveBreakpoint;
  breakpointsList: BreakpointsList;

  constructor(
    @Optional() private observer?: BreakpointObserverDirective
  ) {}

  ngOnInit() {
    if (this.observer) {
      this.activeBreakpoint = this.observer.activeBreakpoint;
      this.breakpointsList = this.observer.breakpointsList;
      this.observer.breakpointChange.subscribe((args) => {
        this.activeBreakpoint = args[0];
        this.breakpointsList = args[1];
      });
    }
  }
}
