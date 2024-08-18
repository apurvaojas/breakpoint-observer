import {
  ActiveBreakpoint,
  BreakpointService,
  BreakpointsList,
  onBreakPointChangeCallbackArgs,
} from '@breakpoint-observer/core';
import { ComponentType, useEffect, useRef, useState } from 'react';

export type BreakpointProps = {
  activeBreakpoint?: ActiveBreakpoint;
  breakpointsList?: BreakpointsList;
};

export function withBreakpointObserver<T>(
  Component: ComponentType<T & BreakpointProps>
): ComponentType<T> {
  return (props: T) => {
    const breakpointService = useRef<BreakpointService>();

    const [breakPointProps, setBreakpointProps] =
      useState<onBreakPointChangeCallbackArgs | null>(null);

    useEffect(() => {
      if (!breakpointService.current) {
        breakpointService.current = BreakpointService.getInstance();

        breakpointService.current.on(
          'onBreakPointChange',
          (...args: onBreakPointChangeCallbackArgs) => {
            setBreakpointProps(args);
          }
        );
      }
    }, []);

    return (
      <Component
        {...(props as T)}
        activeBreakpoint={breakPointProps?.[0]}
        breakpointsList={breakPointProps?.[1]}
      />
    );
  };
}
