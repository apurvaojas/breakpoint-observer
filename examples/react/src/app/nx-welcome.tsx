import {
  ActiveBreakpoint,
  BreakpointsList,
  withBreakpointObserver,
  BreakpointService,
} from '@breakpoint-observer/react';

// Setting Up Own Breakpoints
BreakpointService.setOptions({
  breakpoints: [{ mobile: 0 }, { tablet: 500 }, { desktop: 800 }],
});


export function Example({
  activeBreakpoint,
  breakpointsList,
}: {
  activeBreakpoint?: ActiveBreakpoint;
  breakpointsList?: BreakpointsList;
}) {
  return (
    <>
      <h3>Active Breakpoint: </h3>
      <pre>
        {activeBreakpoint ? JSON.stringify(activeBreakpoint, null, 2) : 'null'}
      </pre>
      <br />
      <h3>Breakpoints List: </h3>
      <pre>
        {breakpointsList ? JSON.stringify(breakpointsList, null, 2) : 'null'}
      </pre>
    </>
  );
}

export default withBreakpointObserver(Example);
