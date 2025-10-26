import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import StaticLoginGuard from "../../src/components/StaticLoginGuard";
import { vi } from "vitest";

// Mock fetch for login-config.json
beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ enabled: true, username: "admin", password: "changeme" })
    })
  ) as any;
  localStorage.clear();
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("StaticLoginGuard", () => {
  it("renders login form when enabled and not authed", async () => {
    render(
      <StaticLoginGuard>
        <div>Protected Content</div>
      </StaticLoginGuard>
    );
    expect(await screen.findByText(/login required/i)).toBeInTheDocument();
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  it("authenticates and shows content on correct login", async () => {
    render(
      <StaticLoginGuard>
        <div>Protected Content</div>
      </StaticLoginGuard>
    );
    // Wait for login form to appear
    await screen.findByText(/login required/i);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "admin" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "changeme" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => expect(screen.getByText(/protected content/i)).toBeInTheDocument());
  });

  it("shows error on invalid login", async () => {
    render(
      <StaticLoginGuard>
        <div>Protected Content</div>
      </StaticLoginGuard>
    );
    await screen.findByText(/login required/i);
    fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: "wrong" } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(await screen.findByText(/invalid username or password/i)).toBeInTheDocument();
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });

  it("shows content if already authed in localStorage", async () => {
    localStorage.setItem("static-login-authed", "1");
    render(
      <StaticLoginGuard>
        <div>Protected Content</div>
      </StaticLoginGuard>
    );
    await waitFor(() => expect(screen.getByText(/protected content/i)).toBeInTheDocument());
  });

  it("shows content if login is disabled", async () => {
    (global.fetch as any).mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ enabled: false, username: "admin", password: "changeme" })
      })
    );
    render(
      <StaticLoginGuard>
        <div>Protected Content</div>
      </StaticLoginGuard>
    );
    // Wait for config to be loaded and content to appear
    expect(await screen.findByText(/protected content/i)).toBeInTheDocument();
  });
});
