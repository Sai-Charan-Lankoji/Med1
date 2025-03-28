// app/test/pages/planspage.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PlansWithSearch from "@/app/components/PlansWithSearch";
import "@testing-library/jest-dom";

const mockPlans = [
  {
    id: "plan_001",
    name: "Basic Plan",
    description: "This is a basic plan",
    price: "10",
    discount: 5,
    no_stores: 2,
    commission_rate: 10,
    features: ["Feature A", "Feature B"],
    isActive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
  {
    id: "plan_002",
    name: "Pro Plan",
    description: "This is a pro plan",
    price: "30",
    discount: 0,
    no_stores: 5,
    commission_rate: 5,
    features: ["Feature X", "Feature Y"],
    isActive: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  },
];

describe("PlansWithSearch component", () => {
  it("renders plans correctly", () => {
    render(
      <PlansWithSearch
        initialPlans={mockPlans}
        initialError={null}
        cookieHeader=""
      />
    );

    expect(screen.getByText("Subscription Plans")).toBeInTheDocument();
    expect(screen.getByText("Basic Plan")).toBeInTheDocument();
    expect(screen.getByText("Pro Plan")).toBeInTheDocument();
  });

  it("filters plans on search", () => {
    render(
      <PlansWithSearch
        initialPlans={mockPlans}
        initialError={null}
        cookieHeader=""
      />
    );

    const searchInput = screen.getByPlaceholderText("Search plans...");
    fireEvent.change(searchInput, { target: { value: "Basic" } });

    expect(screen.getByText("Basic Plan")).toBeInTheDocument();
    expect(screen.queryByText("Pro Plan")).not.toBeInTheDocument();
  });

  it("shows no plans found if no match", () => {
    render(
      <PlansWithSearch
        initialPlans={mockPlans}
        initialError={null}
        cookieHeader=""
      />
    );

    const searchInput = screen.getByPlaceholderText("Search plans...");
    fireEvent.change(searchInput, { target: { value: "XYZ" } });

    expect(screen.getByText("No plans found")).toBeInTheDocument();
  });

  it("shows error alert if initialError exists", () => {
    render(
      <PlansWithSearch
        initialPlans={mockPlans}
        initialError="Something went wrong"
        cookieHeader=""
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });
});
