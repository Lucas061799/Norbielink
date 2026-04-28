"use client";

import { useState } from "react";
import Sidenav from "@/components/Sidenav";
import TopBar from "@/components/TopBar";
import Clients from "@/components/Clients";
import Agencies from "@/components/Agencies";
import Quotes from "@/components/Quotes";
import Policies from "@/components/Policies";
import Endorsements from "@/components/Endorsements";
import Website from "@/components/Website";

interface DashboardShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardShell({ children, pageTitle }: DashboardShellProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Marketplace");

  if (activePage === "Website") {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <Website isDark={darkMode} />
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "Clients":
        return <Clients isDark={darkMode} />;
      case "Agencies":
        return <Agencies isDark={darkMode} />;
      case "Quotes":
        return <Quotes isDark={darkMode} />;
      case "Policies":
        return <Policies isDark={darkMode} />;
      case "Endorsements":
        return <Endorsements isDark={darkMode} />;
      default: {
        const title = pageTitle;
        return (
          <>
            {title && (
              <div className="flex flex-col justify-center flex-shrink-0 mb-12"
                style={{ height: 71, borderBottom: `0.87px solid ${darkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
                <h1 className="text-[22px] font-normal" style={{ color: darkMode ? "#F9FAFB" : "#1F2937" }}>
                  {title}
                </h1>
              </div>
            )}
            {children}
          </>
        );
      }
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
        <TopBar isDark={darkMode} activePage={activePage} />
        <main
          className="flex-1 overflow-hidden transition-colors duration-300 px-12"
          style={(() => { const fullHeightPages = ["Clients", "Agencies", "Quotes", "Policies", "Endorsements"]; const isFullHeight = fullHeightPages.includes(activePage); return { background: darkMode ? "#0F1120" : "#ffffff", paddingTop: isFullHeight ? 0 : 24, paddingBottom: isFullHeight ? 48 : 24, display: isFullHeight ? "flex" : "block", flexDirection: "column" as const, overflowY: isFullHeight ? "hidden" : "auto", height: isFullHeight ? "100%" : "auto" }; })()}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
