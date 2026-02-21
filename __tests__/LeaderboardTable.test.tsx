import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock framer-motion
jest.mock("framer-motion", () => ({
    motion: {
        div: React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement("div", { ...props, ref }, children)
        ),
        tr: React.forwardRef(({ children, ...props }: any, ref: any) =>
            React.createElement("tr", { ...props, ref }, children)
        ),
    },
    AnimatePresence: ({ children }: any) => children,
}));

import LeaderboardTable from "@/components/LeaderboardTable";

const mockEntries = [
    { _id: "1", playerName: "Player1", faceitElo: 2000, faceitLevel: 9, wins: 300, losses: 150, winRate: 66.7, avgKd: 1.3 },
    { _id: "2", playerName: "Player2", faceitElo: 1800, faceitLevel: 7, wins: 200, losses: 180, winRate: 52.6, avgKd: 1.05 },
    { _id: "3", playerName: "Player3", faceitElo: 1500, faceitLevel: 5, wins: 100, losses: 120, winRate: 45.5, avgKd: 0.85 },
];

describe("LeaderboardTable", () => {
    it("renders all entries", () => {
        render(<LeaderboardTable entries={mockEntries} />);
        expect(screen.getByText("Player1")).toBeInTheDocument();
        expect(screen.getByText("Player2")).toBeInTheDocument();
        expect(screen.getByText("Player3")).toBeInTheDocument();
    });

    it("displays Elo values", () => {
        render(<LeaderboardTable entries={mockEntries} />);
        expect(screen.getByText("2000")).toBeInTheDocument();
        expect(screen.getByText("1800")).toBeInTheDocument();
    });

    it("shows loading state", () => {
        render(<LeaderboardTable entries={[]} loading={true} />);
        expect(screen.getByText("Loading leaderboard...")).toBeInTheDocument();
    });

    it("shows empty state when no entries", () => {
        render(<LeaderboardTable entries={[]} />);
        expect(screen.getByText(/No entries yet/)).toBeInTheDocument();
    });

    it("sorts by Elo descending by default", () => {
        render(<LeaderboardTable entries={mockEntries} />);
        const cells = screen.getAllByRole("cell");
        // First data row should be Player1 (highest Elo)
        expect(cells[1]).toHaveTextContent("Player1");
    });
});
