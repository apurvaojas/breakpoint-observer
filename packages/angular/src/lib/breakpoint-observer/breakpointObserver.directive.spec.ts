/* eslint-disable @typescript-eslint/ban-types */
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BreakpointService,
  onBreakPointChangeCallbackArgs,
} from '@breakpoint-observer/core';
import { BreakpointObserverDirective } from './breakpointObserver.directive';

// Mock BreakpointService
jest.mock('@breakpoint-observer/core', () => ({
  BreakpointService: class {
    public breakpoints = {
      sm: { min: 0, max: 599 },
      md: { min: 600, max: 959 },
      lg: { min: 960, max: 1279 },
      xl: { min: 1280, max: Infinity },
    };

    public activeBreakpoint = {
      breakpoint: 'sm',
      maxWidth: 599,
      minWidth: 0,
    };

    constructor() {
      //
    }

    private listeners: { [key: string]: Function[] } = {};

    on(event: string, listener: Function) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(listener);
      this.emit(event, this.activeBreakpoint, this.breakpoints);
    }

    updateBreakpoint(breakpoint: keyof typeof this.breakpoints) {
      this.activeBreakpoint = {
        breakpoint,
        maxWidth: this.breakpoints[breakpoint].max,
        minWidth: this.breakpoints[breakpoint].min,
      };
      this.emit('onBreakPointChange', this.activeBreakpoint, this.breakpoints);
    }

    emit(event: string, ...args: any[]) {
      if (this.listeners[event]) {
        this.listeners[event].forEach((listener) => listener(...args));
      }
    }

    static getInstance() {
      return new this();
    }
  },
}));

@Component({
  template: `<div
    libBreakpointObserver
    (breakpointChange)="onBreakpointChange($event)"
  ></div>`,
})
class TestComponent {
  onBreakpointChange(event: onBreakPointChangeCallbackArgs) {
    //
  }
}

describe('BreakpointObserverDirective', () => {
  let directive: BreakpointObserverDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BreakpointObserverDirective],
    });

    directive = TestBed.inject(BreakpointObserverDirective);
  });

  it('should call onBreakPointChange on ngOnInit', () => {
    
    directive.ngOnInit();

    expect(directive.activeBreakpoint).toEqual({
      breakpoint: 'sm',
      maxWidth: 599,
      minWidth: 0,
    });
    expect(directive.breakpointsList).toEqual({
      sm: { min: 0, max: 599 },
      md: { min: 600, max: 959 },
      lg: { min: 960, max: 1279 },
      xl: { min: 1280, max: Infinity },
    });
  });

  it('should emit breakpointChange event on breakpoint change', () => {
    directive.ngOnInit();
    const breakpointService = BreakpointService.getInstance();
    const spy = jest.spyOn(directive.breakpointChange, 'emit');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    directive.breakpointService.updateBreakpoint('md');

    const args: onBreakPointChangeCallbackArgs = [
      { breakpoint: 'md', minWidth: 600, maxWidth: 959 },
      {
        sm: { min: 0, max: 599 },
        md: { min: 600, max: 959 },
        lg: { min: 960, max: 1279 },
        xl: { min: 1280, max: Infinity },
      }
    ];

    expect(spy).toHaveBeenCalledWith(args);
    expect(directive.activeBreakpoint).toEqual(args[0]);
  });
});
