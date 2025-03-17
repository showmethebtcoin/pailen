
// Type definitions for Jest
/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
    }
  }

  const jest: {
    fn: <T = any>() => jest.Mock<T>;
    mock: (moduleName: string, factory?: any) => void;
    clearAllMocks: () => void;
  };

  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
  function expect<T>(value: T): jest.Matchers<T>;
  function beforeEach(fn: () => void): void;
}

export {};
