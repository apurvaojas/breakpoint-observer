# Breakpoint Observer React

A React Higher order component around `@breakpoint-observer/core`, Subscribes to breakpoint change. and rerenders the component with updated props on every breakpoint change.



### Installation

```bash
npm i -S @breakpoint-observer/react
```

### Usage

### Configure Your own breakpoint

```typescript
import {
  ActiveBreakpoint,
  BreakpointsList,
  withBreakpointObserver,
  BreakpointService,
} from '@breakpoint-observer/react';

// (Optional) Setting Up Own Breakpoints
BreakpointService.setOptions({
  breakpoints: [{ mobile: 0 }, { tablet: 500 }, { desktop: 800 }],
});

// if we dont specify, it will default to inbuild bootstarap specification breakpoints

const defaultBreakpoints: BreakpointConfig = [
  { xs: 0 },  // breakpointName: minWidth
  { sm: 576 },
  { md: 768 },
  { lg: 992 },
  { xl: 1200 },
  { xxl: 1400 },
];

```

### Component 

```tsx
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

//*********************** WRAP IT WITH HOC, to Listen to the props ******************
export default withBreakpointObserver(Example);

```


### Demo
![Demo Image](https://raw.githubusercontent.com/apurvaojas/breakpoint-observer/main/docs/static/img/react-breakpoint-observer.gif)
