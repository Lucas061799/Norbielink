"use client";

import { useState } from "react";
import Sidenav from "@/components/Sidenav";
import TopBar from "@/components/TopBar";
import Clients from "@/components/Clients";
import Agencies from "@/components/Agencies";

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
      case "Agencies":
        return <Agencies isDark={darkMode} />;
      default:
        return (
          <>
            {pageTitle && (
              <div className="flex flex-col justify-center flex-shrink-0 mb-5"
                style={{ height: 71, borderBottom: `0.87px solid ${darkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
                <h1 className="text-[22px] font-normal" style={{ color: darkMode ? "#F9FAFB" : "#1F2937" }}>
                  {pageTitle}
                </h1>
              </div>
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
          className="flex-1 overflow-hidden transition-colors duration-300 px-12"
          style={{ background: darkMode ? "#0F1120" : "#ffffff", paddingTop: (activePage === "Clients" || activePage === "Agencies") ? 0 : 24, paddingBottom: 24, display: (activePage === "Clients" || activePage === "Agencies") ? "flex" : "block", flexDirection: "column" as const, overflowY: (activePage === "Clients" || activePage === "Agencies") ? "hidden" : "auto", height: (activePage === "Clients" || activePage === "Agencies") ? "100%" : "auto" }}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
