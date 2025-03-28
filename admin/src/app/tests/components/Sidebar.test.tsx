import { render, screen } from "@testing-library/react";
import Sidebar from "@/app/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
}));

// Mock Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className, width, height }: { src: string; alt: string; className?: string; width?: number; height?: number }) => (
    <Image src={src} alt={alt} className={className} width={width} height={height} />
  ),
}));

// Mock fetch
global.fetch = jest.fn();

describe("Sidebar", () => {
  const mockUser = {
    first_name: "John",
    last_name: "Doe",
    role: "Admin",
    email: "john.doe@example.com",
  };

  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue("/admin/vendors");
  });

  it("renders the sidebar with user info", () => {
    render(<Sidebar user={mockUser} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});