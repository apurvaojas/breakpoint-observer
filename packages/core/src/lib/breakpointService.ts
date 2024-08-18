import { debounce, defaultBreakpoints } from './constants';
import { EventEmitter } from './EventEmitter';
import type {
  BreakpointConfig,
  BreakpointEvents,
  BreakpointsList,
  InitOptions,
} from './types';

export class BreakpointService extends EventEmitter<BreakpointEvents> {
  private static instance: BreakpointService | null;
  private static options: InitOptions = {
    breakpoints: defaultBreakpoints,
    debounceDelay: 100,
  };
  public breakpoints: BreakpointsList;
  private debounceDelay = 100;
  private lastActiveBreakpoint: string | null = null;

  // Private constructor to prevent direct instantiation
  private constructor(options: InitOptions) {
    super();
    const { styles, breakpoints } = this.createStyleSheet(options.breakpoints);
    this.breakpoints = breakpoints;
    this.appendStyles(styles);
    this.debounceDelay = options.debounceDelay || 100;
    this.bindEvents();
    this.lastActiveBreakpoint = this.activeBreakpoint.breakpoint;
  }

  // Public method to get the instance of the class
  public static getInstance(): BreakpointService {
    if (!BreakpointService.instance) {
      BreakpointService.instance = new BreakpointService(
        BreakpointService.options
      );
    }
    return BreakpointService.instance;
  }

  public static setOptions(options: InitOptions) {
    BreakpointService.options = {
      ...BreakpointService.options,
      ...options,
    };
    BreakpointService.instance = null;
  }

  public get activeBreakpoint() {
    const htmlElement = document.documentElement;
    const afterStyles = window.getComputedStyle(htmlElement, '::after');
    const content = afterStyles.getPropertyValue('content');
    const breakpoint = content.replace(/['"]/g, ''); // Remove quotes from the content value

    return {
      breakpoint,
      maxWidth: this.breakpoints[breakpoint]?.max,
      minWidth: this.breakpoints[breakpoint]?.min,
    };
  }

  handleResize = debounce(() => {
    if (this.lastActiveBreakpoint === this.activeBreakpoint.breakpoint) {
      return;
    }
    this.lastActiveBreakpoint = this.activeBreakpoint.breakpoint;
    this.emit('onBreakPointChange', this.activeBreakpoint, this.breakpoints);
  }, this.debounceDelay);

  private bindEvents() {
    window.addEventListener('resize', this.handleResize);
  }

  private createStyleSheet(breakpoints: BreakpointConfig = defaultBreakpoints) {
    const breakpointsMap = breakpoints.reduce((acc, breakpoint, index) => {
      const breakpointName = Object.keys(breakpoint)[0];
      const breakpointValue = breakpoint[breakpointName];
      const nextBreakpointValue = breakpoints[index + 1]
        ? Object.values(breakpoints[index + 1])[0]
        : Infinity;

      return {
        ...acc,
        [breakpointName]: {
          min: breakpointValue,
          max: nextBreakpointValue - 0.01,
        },
      };
    }, {} as BreakpointsList);

    const styles: Record<keyof BreakpointsList, string> = Object.keys(
      breakpointsMap
    ).reduce((acc, breakpointName) => {
      const { min, max } = breakpointsMap[breakpointName];
      const mediaQuery = `@media (min-width: ${min}px)${
        max !== Infinity ? ` and (max-width: ${max}px)` : ''
      }`;
      const rule = `${mediaQuery} { html:after { content: "${breakpointName}"; } }`;
      return {
        ...acc,
        [breakpointName]: rule,
      };
    }, {});

    return {
      breakpoints: breakpointsMap,
      styles,
    };
  }

  private appendStyles(styles: Record<keyof BreakpointsList, string>) {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
    html:after {
        visibility: hidden;
        height: 0;
        width: 0;
        display: block;
      } 
      ${Object.values(styles).join('\n\n')}`;
    document.head.appendChild(styleElement);
  }

  override on<K extends keyof BreakpointEvents>(
    event: K,
    listener: (
      ...args: BreakpointEvents[Extract<keyof BreakpointEvents, K>]
    ) => void
  ): this {
    super.on(event, listener);
    if (event === 'onBreakPointChange') {
      this.emit(event, this.activeBreakpoint, this.breakpoints);
    }
    return this;
  }
}
