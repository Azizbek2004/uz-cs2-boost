import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock framer-motion
jest.mock("framer-motion", () => ({
    motion: {
        div: React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement("div", { ...props, ref }, children)
        ),
        button: React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement("button", { ...props, ref }, children)
        ),
        tr: React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement("tr", { ...props, ref }, children)
        ),
    },
    AnimatePresence: ({ children }: any) => children,
}));

// Import component after mocks
import DashboardCard from "@/components/DashboardCard";

describe("DashboardCard", () => {
    it("renders title and value", () => {
        render(<DashboardCard title="Test Card" value="42" />);
        expect(screen.getByText("Test Card")).toBeInTheDocument();
        expect(screen.getByText("42")).toBeInTheDocument();
    });

    it("renders subtitle when provided", () => {
        render(<DashboardCard title="Ping" value="45ms" subtitle="Good connection" />);
        expect(screen.getByText("Good connection")).toBeInTheDocument();
    });

    it("renders children content", () => {
        render(
            <DashboardCard title="Test" value="0">
                <span data-testid="child">Child Content</span>
            </DashboardCard>
        );
        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("applies onClick handler", () => {
        const handler = jest.fn();
        render(<DashboardCard title="Click Me" value="!" onClick={handler} />);
        fireEvent.click(screen.getByText("Click Me").closest("div")!);
        expect(handler).toHaveBeenCalled();
    });
});
