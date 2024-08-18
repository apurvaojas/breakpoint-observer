export type BreakpointsList = Record<string, { min: number; max: number }>;
export type ActiveBreakpoint = {
  breakpoint: string;
  minWidth: number;
  maxWidth: number;
};

export type onBreakPointChangeCallbackArgs = [
  ActiveBreakpoint,
  BreakpointsList
];

export type BreakpointEvents = {
  onBreakPointChange: onBreakPointChangeCallbackArgs;
};

export type BreakpointConfig = Record<string, number>[];

export interface InitOptions {
  breakpoints?: BreakpointConfig;
  debounceDelay?: number;
}
