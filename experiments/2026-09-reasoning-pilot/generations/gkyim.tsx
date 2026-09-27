// Intent: Monitor portfolio overnight changes and identify positions needing investigation.
// Information: Holdings with current and previous-close prices, deltas, and percentage changes.
// Decision: Which positions moved significantly enough to warrant deeper inspection.
// Pattern: Explorer (table with delta columns, basis = previous day close; drill into detail view).

import React, { useState } from "react";
import {
  Page,
  Header,
  Section,
  DataTable,
  Delta,
  Status,
  FilterBar,
  Inspector,
} from "@stoa/react";

export default function PortfolioMorning() {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const holdings = [
    {
      id: "AAPL",
      symbol: "AAPL",
      name: "Apple Inc.",
      quantity: 500,
      currentPrice: 228.45,
      previousClose: 226.80,
      currentValue: 114225,
      previousValue: 113400,
      sector: "Technology",
      dayChange: 1.65,
      dayChangePercent: 0.73,
      weight: 18.2,
      target: 15.0,
    },
    {
      id: "MSFT",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      quantity: 300,
      currentPrice: 447.92,
      previousClose: 450.15,
      currentValue: 134376,
      previousValue: 135045,
      sector: "Technology",
      dayChange: -2.23,
      dayChangePercent: -0.51,
      weight: 21.4,
      target: 20.0,
    },
    {
      id: "JPM",
      symbol: "JPM",
      name: "JPMorgan Chase",
      quantity: 800,
      currentPrice: 195.30,
      previousClose: 191.75,
      currentValue: 156240,
      previousValue: 153400,
      sector: "Financials",
      dayChange: 3.55,
      dayChangePercent: 1.85,
      weight: 24.9,
      target: 25.0,
    },
    {
      id: "XOM",
      symbol: "XOM",
      name: "Exxon Mobil",
      quantity: 450,
      currentPrice: 113.20,
      previousClose: 118.50,
      currentValue: 50940,
      previousValue: 53325,
      sector: "Energy",
      dayChange: -5.30,
      dayChangePercent: -4.47,
      weight: 8.1,
      target: 10.0,
    },
    {
      id: "JNJ",
      symbol: "JNJ",
      name: "Johnson & Johnson",
      quantity: 600,
      currentPrice: 155.80,
      previousClose: 156.40,
      currentValue: 93480,
      previousValue: 93840,
      sector: "Healthcare",
      dayChange: -0.60,
      dayChangePercent: -0.38,
      weight: 14.9,
      target: 15.0,
    },
    {
      id: "WMT",
      symbol: "WMT",
      name: "Walmart Inc.",
      quantity: 550,
      currentPrice: 98.75,
      previousClose: 96.20,
      currentValue: 54312,
      previousValue: 52910,
      sector: "Consumer",
      dayChange: 2.55,
      dayChangePercent: 2.65,
      weight: 8.7,
      target: 10.0,
    },
  ];

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalPreviousValue = holdings.reduce((sum, h) => sum + h.previousValue, 0);
  const totalDayChange = totalValue - totalPreviousValue;
  const totalDayChangePercent = (totalDayChange / totalPreviousValue) * 100;

  const columns = [
    { key: "symbol", label: "Symbol", width: 80 },
    { key: "name", label: "Position", width: 180 },
    { key: "sector", label: "Sector", width: 120 },
    { key: "quantity", label: "Qty", align: "right" as const, width: 70 },
    { key: "currentPrice", label: "Price", align: "right" as const, width: 100 },
    {
      key: "delta",
      label: "Change",
      align: "right" as const,
      width: 120,
      render: (row: (typeof holdings)[0]) => (
        <Delta value={row.dayChange} basis={row.previousClose} />
      ),
    },
    {
      key: "currentValue",
      label: "Value",
      align: "right" as const,
      width: 120,
      render: (row: (typeof holdings)[0]) => `$${row.currentValue.toLocaleString()}`,
    },
  ];

  const selectedHolding = holdings.find((h) => h.id === selectedRow);

  return (
    <Page title="Portfolio">
      <Header
        title="Your Book"
        subtitle={`Overnight change: ${totalDayChangePercent > 0 ? "+" : ""}${totalDayChangePercent.toFixed(2)}% ($${totalDayChange > 0 ? "+" : ""}${totalDayChange.toLocaleString()})`}
      />

      <main style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        <div>
          <Section title="Positions (Previous Close Basis)">
            <DataTable
              columns={columns}
              rows={holdings.map((h) => ({
                ...h,
                onClick: () => setSelectedRow(h.id),
              }))}
              selectable
              onRowSelect={(id) => setSelectedRow(id as string)}
              stickyFirstColumn
            />
          </Section>
        </div>

        {selectedHolding && (
          <aside>
            <Inspector
              primary={{
                title: selectedHolding.name,
                metrics: [
                  {
                    label: "Current Price",
                    value: `$${selectedHolding.currentPrice.toFixed(2)}`,
                  },
                  {
                    label: "Previous Close",
                    value: `$${selectedHolding.previousClose.toFixed(2)}`,
                  },
                ],
              }}
              context={{
                title: "Position Context",
                content: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <p style={{ marginBottom: "4px", fontSize: "0.875rem", fontWeight: 500 }}>
                        Portfolio Weight
                      </p>
                      <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                        {selectedHolding.weight.toFixed(1)}%{" "}
                        <span style={{ fontSize: "0.875rem", color: "#666" }}>
                          (Target: {selectedHolding.target.toFixed(1)}%)
                        </span>
                      </p>
                    </div>
                    <div>
                      <p style={{ marginBottom: "4px", fontSize: "0.875rem", fontWeight: 500 }}>
                        Sector
                      </p>
                      <p style={{ fontSize: "1rem" }}>{selectedHolding.sector}</p>
                    </div>
                    <div>
                      <p style={{ marginBottom: "4px", fontSize: "0.875rem", fontWeight: 500 }}>
                        Position Value
                      </p>
                      <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                        ${selectedHolding.currentValue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ),
              }}
              history={{
                title: "Today",
                content: (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <p style={{ marginBottom: "4px", fontSize: "0.875rem", fontWeight: 500 }}>
                        Price Change
                      </p>
                      <p
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: 600,
                          color: selectedHolding.dayChange > 0 ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {selectedHolding.dayChange > 0 ? "+" : ""}${selectedHolding.dayChange.toFixed(2)} (
                        {selectedHolding.dayChangePercent > 0 ? "+" : ""}
                        {selectedHolding.dayChangePercent.toFixed(2)}%)
                      </p>
                    </div>
                    <div>
                      <p style={{ marginBottom: "4px", fontSize: "0.875rem", fontWeight: 500 }}>
                        Value Change
                      </p>
                      <p
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: 600,
                          color:
                            selectedHolding.currentValue - selectedHolding.previousValue > 0
                              ? "#16a34a"
                              : "#dc2626",
                        }}
                      >
                        {selectedHolding.currentValue - selectedHolding.previousValue > 0 ? "+" : ""}
                        ${(selectedHolding.currentValue - selectedHolding.previousValue).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ),
              }}
            />
          </aside>
        )}
      </main>
    </Page>
  );
}
