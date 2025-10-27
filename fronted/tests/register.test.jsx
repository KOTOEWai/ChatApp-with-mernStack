import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../src/page/SignUp.jsx";
import axios from "axios";

// 🧪 Mock dependencies
vi.mock("axios");
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
  },
  ToastContainer: () => <div data-testid="toast-container" />,
}));

describe("SignUp Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders all required input fields", () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Register/i })).toBeInTheDocument();
  });

  it("submits signup form successfully", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "Register successful!" } });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText("Enter name"), "Toewailyun");
    await userEvent.type(screen.getByPlaceholderText("Enter email"), "toewai@email.com");
    await userEvent.type(screen.getByPlaceholderText("Enter password"), "Toewai123@");

    const fileInput = screen.getByLabelText(/Profile Picture/i);
    const file = new File(["dummy"], "avatar.png", { type: "image/png" });
    await userEvent.upload(fileInput, file);

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining("/user/SignUp"),
        expect.any(FormData),
        expect.any(Object)
      );
    });
  });

  it("shows alert when signup fails", async () => {
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Email already exists" } },
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText("Enter name"), "Toewailyun");
    await userEvent.type(screen.getByPlaceholderText("Enter email"), "fail@email.com");
    await userEvent.type(screen.getByPlaceholderText("Enter password"), "Toewai123@");

    fireEvent.submit(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith("Email already exists");
    });
  });
});
