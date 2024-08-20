/* eslint-disable @typescript-eslint/ban-types */
// import '@testing-library/jest-dom/extend-expect';
import { BreakpointService } from '@breakpoint-observer/core';
import { act, render, screen, waitFor } from '@testing-library/react';
import { withBreakpointObserver } from './react';

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
      this.emit(event, this.activeBreakpoint);
    }

    updateBreakpoint(breakpoint: keyof typeof this.breakpoints) {
      this.activeBreakpoint = {
        breakpoint,
        maxWidth: this.breakpoints[breakpoint].max,
        minWidth: this.breakpoints[breakpoint].min,
      };
      this.emit('onBreakPointChange', this.activeBreakpoint);
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

// Wrapped Component
const WrappedComponent = withBreakpointObserver(({ activeBreakpoint }) => (
  <div data-testid="mock-component">
    {JSON.stringify(activeBreakpoint) ?? null}
  </div>
));

describe('withBreakpointObserver HOC', () => {
  it('should pass the initial breakpoint to the wrapped component', () => {
    render(<WrappedComponent />);
    expect(screen.getByTestId('mock-component').innerHTML).toBe(
      JSON.stringify({ breakpoint: 'sm', maxWidth: 599, minWidth: 0 })
    );
  });

  it('should update the wrapped component when the breakpoint changes', async () => {
    const breakpointService = BreakpointService.getInstance();

    act(() => {
      render(<WrappedComponent />);
    });

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    waitFor(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      breakpointService.updateBreakpoint('lg');
      expect(screen.getByTestId('mock-component').innerHTML).toBe(
        JSON.stringify({ breakpoint: 'lg', maxWidth: Infinity, minWidth: 960 })
      );
    });
  }, 20000);
});
