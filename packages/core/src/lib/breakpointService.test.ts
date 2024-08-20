import { BreakpointService } from './breakpointService';
import { debounce } from './constants';

jest.mock('./constants');
jest.spyOn(window, 'getComputedStyle').mockReturnValue({
  getPropertyValue: () => '"mockBreakpoint"',
} as any);

const mockDebounce = jest.fn((fn) => fn);
(debounce as jest.Mock).mockImplementation(mockDebounce);
describe('BreakpointService', () => {
  let service: BreakpointService;

  beforeEach(() => {
    jest.clearAllMocks();
    // document.head.innerHTML = ''; // Clear any appended styles
  });

  it('should return the same instance', () => {
    const instance1 = BreakpointService.getInstance();
    const instance2 = BreakpointService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('should initialize with default options', () => {
    service = BreakpointService.getInstance();
    expect(service.breakpoints).toEqual(expect.any(Object));
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(service.debounceDelay).toBe(100);
    expect(document.head.querySelector('style')).not.toBeNull();
  });

  it('should update options and create a new instance', () => {
    BreakpointService.setOptions({ debounceDelay: 200 });
    const newInstance = BreakpointService.getInstance();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    expect(newInstance.debounceDelay).toBe(200);
  });

  it('should return the correct active breakpoint', () => {
    service = BreakpointService.getInstance();

    const activeBreakpoint = service.activeBreakpoint;
    expect(activeBreakpoint.breakpoint).toBe('mockBreakpoint');
  });

  it('should handle resize and emit onBreakPointChange', () => {
    service = BreakpointService.getInstance();
    const emitSpy = jest.spyOn(service, 'emit');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    service.lastActiveBreakpoint = 'null';
    service.handleResize();
    expect(emitSpy).toHaveBeenCalledWith(
      'onBreakPointChange',
      service.activeBreakpoint,
      service.breakpoints
    );
  });

  it('should add listener and emit event immediately for onBreakPointChange', () => {
    service = BreakpointService.getInstance();
    const listener = jest.fn();
    service.on('onBreakPointChange', listener);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    service.lastActiveBreakpoint = 'null';
    expect(listener).toHaveBeenCalledWith(
      service.activeBreakpoint,
      service.breakpoints
    );
  });
});
