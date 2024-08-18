import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  BreakpointService,
  onBreakPointChangeCallbackArgs,
} from '@breakpoint-observer/core';
import { BreakpointObserverDirective } from './breakpointObserver.directive';

@Component({
  template: `<div libBreakpointObserver></div>`,
})
class TestComponent {}

describe('BreakpointObserverDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let directive: BreakpointObserverDirective;
  let breakpointService: BreakpointService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, BreakpointObserverDirective],
      providers: [
        {
          provide: BreakpointService,
          useValue: {
            getInstance: jasmine.createSpy('getInstance').and.returnValue({
              activeBreakpoint: 'mockActiveBreakpoint',
              breakpoints: 'mockBreakpoints',
              on: jasmine.createSpy('on'),
            }),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(TestComponent);
    directive = fixture.debugElement
      .query(By.directive(BreakpointObserverDirective))
      .injector.get(BreakpointObserverDirective);
    breakpointService = TestBed.inject(BreakpointService);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should initialize correctly', () => {
    directive.ngOnInit();
    expect(breakpointService.getInstance).toHaveBeenCalledWith(
      directive.libBreakpointObserver
    );
    expect(directive.activeBreakpoint).toBe('mockActiveBreakpoint');
    expect(directive.breakpointsList).toBe('mockBreakpoints');
    expect(breakpointService.on).toHaveBeenCalledWith(
      'onBreakPointChange',
      jasmine.any(Function)
    );
  });

  it('should handle onBreakPointChange correctly', () => {
    const mockArgs: onBreakPointChangeCallbackArgs = [
      'newActiveBreakpoint',
      'newBreakpointsList',
    ];
    spyOn(directive.breakpointChange, 'emit');

    directive.onBreakPointChange(...mockArgs);

    expect(directive.activeBreakpoint).toBe('newActiveBreakpoint');
    expect(directive.breakpointsList).toBe('newBreakpointsList');
    expect(directive.breakpointChange.emit).toHaveBeenCalledWith(mockArgs);
  });
});
