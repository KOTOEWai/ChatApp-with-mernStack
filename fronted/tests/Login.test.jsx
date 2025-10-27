import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, expect, beforeEach } from "vitest";
import Login from "../src/page/login.jsx";
import axios from "axios";

// 🧪 Mock dependencies
vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: "" };
  });

  it("renders email and password fields", () => {
    render(<Login />);
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  });

  it("submits form successfully", async () => {
    axios.post.mockResolvedValueOnce({ data: { token: "abc123" } });//တစ်ကြိမ်တည်း အောင်မြင်တဲ့ response ပြန်ပေးတဲ့ mock
//axios.post() function ကို call လုပ်ရင် တစ်ခါအတွက်ပဲ successful response ပြန်ပေးပါ။
    render(<Login />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const button = screen.getByText("Login");

    await userEvent.type(emailInput, "test@email.com");
    await userEvent.type(passwordInput, "123456");
    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/user/SignIn"),
        { email: "test@email.com", password: "123456" },
        expect.any(Object)
      );
    });

    expect(localStorage.getItem("chat-user")).toContain("test@email.com");
    expect(localStorage.getItem("token")).toContain("abc123");
    expect(window.location.href).toBe("/chat");
  });

  it("shows alert when login fails", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<Login />);

    await userEvent.type(screen.getByPlaceholderText("your@email.com"), "fail@test.com");
    await userEvent.type(screen.getByPlaceholderText("Enter your password"), "wrongpass");
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Invalid credentials");
    });
  });
});
