// Vitest global setup for all tests
import "@testing-library/jest-dom";

// Mock Next.js router for all tests
import { vi } from "vitest";

vi.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/",
    push: vi.fn(),
    prefetch: vi.fn(),
    replace: vi.fn(),
    asPath: "/",
    query: {},
  }),
}));

// Mock IntersectionObserver for jsdom
globalThis.IntersectionObserver = class {
  root = null;
  rootMargin = "";
  thresholds = [];
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
};

// Mock ResizeObserver for jsdom
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
