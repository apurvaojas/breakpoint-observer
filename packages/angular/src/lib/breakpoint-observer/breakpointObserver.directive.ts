import {
  Directive,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import {
  ActiveBreakpoint,
  BreakpointService,
  BreakpointsList,
  onBreakPointChangeCallbackArgs,
} from '@breakpoint-observer/core';

@Directive({
  selector: '[libBreakpointObserver]',
  standalone: true,
})
export class BreakpointObserverDirective implements OnInit, OnDestroy {
  @Output() breakpointChange =
    new EventEmitter<onBreakPointChangeCallbackArgs>();

  public breakpointsList?: BreakpointsList;
  public activeBreakpoint?: ActiveBreakpoint;

  private breakpointService?: BreakpointService;

  onBreakPointChange(...args: onBreakPointChangeCallbackArgs) {
    this.activeBreakpoint = args[0];
    this.breakpointsList = args[1];
    this.breakpointChange.emit(args);
  }

  ngOnInit() {
    this.breakpointService = BreakpointService.getInstance();

    this.breakpointService.on(
      'onBreakPointChange',
      this.onBreakPointChange.bind(this)
    );
  }

  ngOnDestroy() {
    this.breakpointService?.off?.(
      'onBreakPointChange',
      this.onBreakPointChange.bind(this)
    );
  }
}
