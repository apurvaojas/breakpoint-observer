# Breakpoint Observer Core

A Singleton service which emits an event when screen size changes and cross any configured breakpoint threshold.


### Installation

```bash
npm i -S @breakpoint-observer/core
```

### Usage

#### Configurations

```typescript

export type BreakpointConfig = Record<string, number>[]; // { breakpointName: minWidth }[]

export interface InitOptions {
  breakpoints?: BreakpointConfig;
  debounceDelay?: number; // debounse delay for window resize event
}

```


#### Default inbuild breakpoints

```typescript
export const defaultBreakpoints: BreakpointConfig = [
  { xs: 0 },  // breakpointName: minWidth
  { sm: 576 },
  { md: 768 },
  { lg: 992 },
  { xl: 1200 },
  { xxl: 1400 },
];

// default debounce delay 100ms
const defaultdebounceDalay = 100;
```

```typescript

import { BreakpointService } from '@breakpoint-observer/core';

// Optional ********** configure your own breakpoints **********
// one time setup 
BreakpointService.setOptions({
    breakpoints: [{ xs: 0}, {md: 1100}, {xl: 1400 }]
});
// ***********************************************************

// below snippet can be used in multiple components
// Get the instance
const breakpointObserver = BreakpointService.getInstance();

breakpointObserver.on('onBreakPointChange', (activeBreakpoint: ActiveBreakpoint, allBrakpoints: BreakpointsList) => {
  console.log(activeBreakpoint);  // { "breakpoint": "xl", "maxWidth": 1399.99, "minWidth": 1200 }
  console.log(allBrakpoints); 
  // {"xs":{"min":0,"max":575.99},"sm":{"min":576,"max":767.99},"md":{"min":768,"max":991.99},"lg":{"min":992,"max":1199.99},"xl":{"min":1200,"max":1399.99},"xxl":{"min":1400,"max":null}}
});

```



