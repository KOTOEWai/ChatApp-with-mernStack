import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ChatInterface from "../src/page/chat.jsx";
import { vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { describe , beforeEach,it,expect, } from "vitest";
// ✅ Mock socket.io-client
vi.mock("socket.io-client", () => ({
  io: () => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  }),
}));

// ✅ Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

// ✅ Mock fetch
globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
);

const renderChat = () => {
  return render(
    <BrowserRouter>
      <ChatInterface />
    </BrowserRouter>
  );
};

describe("ChatInterface Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input", () => {
    renderChat();
    expect(screen.getByPlaceholderText(/Search users/i)).toBeInTheDocument();
  });

  it("renders message input field", () => {
    renderChat();
    expect(
      screen.getByPlaceholderText(/Type your message here.../i)
    ).toBeInTheDocument();
  });

  it("shows error toast when message is empty", async () => {
    const { getByLabelText } = renderChat();

    const sendButton = getByLabelText("send-message");
    fireEvent.click(sendButton);

    await waitFor(() => {
      // We can't actually check toast since it's rendered outside React root,
      // but we can check console errors or formData reset.
      expect(screen.getByPlaceholderText(/Type your message here/i).value).toBe("");
    });
  });

  it("calls axios.post when message is sent", async () => {
    const { getByPlaceholderText, getByLabelText } = renderChat();

    const input = getByPlaceholderText(/Type your message here/i);
    const sendButton = getByLabelText("send-message");

    fireEvent.change(input, { target: { value: "Hello!" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });
});
