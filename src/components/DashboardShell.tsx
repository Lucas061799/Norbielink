"use client";

import { useState } from "react";
import Sidenav from "@/components/Sidenav";
import TopBar from "@/components/TopBar";
import Clients from "@/components/Clients";

interface DashboardShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardShell({ children, pageTitle }: DashboardShellProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Marketplace");

  const renderPage = () => {
    switch (activePage) {
      case "Clients":
        return <Clients isDark={darkMode} />;
      default:
        return (
          <>
            {pageTitle && (
              <h1
                className="text-[22px] font-semibold pb-4"
                style={{
                  color: darkMode ? "#F9FAFB" : "#1F2937",
                  borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "#F3F4F6"}`,
                }}
              >
                {pageTitle}
              </h1>
            )}
            {children}
          </>
        );
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{ background: darkMode ? "#0F1120" : "#ffffff" }}
    >
      <Sidenav
        isDark={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        activeItem={activePage}
        onActiveChange={setActivePage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar isDark={darkMode} />
        <main
          className="flex-1 overflow-hidden transition-colors duration-300 py-6 px-12"
          style={{ background: darkMode ? "#0F1120" : "#ffffff", display: activePage === "Clients" ? "flex" : "block", flexDirection: "column" as const, overflowY: activePage === "Clients" ? "hidden" : "auto", height: activePage === "Clients" ? "100%" : "auto" }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
