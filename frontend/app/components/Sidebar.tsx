"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, CheckSquare, Menu } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Task", path: "/task", icon: CheckSquare },
  ];

  return (
    <div
      className={`h-screen bg-white border-r shadow-sm transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {/* Left side */}
        <div className="flex items-center gap-2">
          {isOpen && <span className="text-xl font-bold">Jira</span>}
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path}>
              <div
                className={`flex items-center rounded-lg mb-3 cursor-pointer transition-all duration-300 ${
                  isOpen ? "gap-3 p-2 justify-start" : "p-2 justify-center"
                } ${
                  pathname === item.path
                    ? "bg-[var(--primary)] text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {!isOpen ? (
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl p-2">
                    <Icon className="w-6 h-6 " />
                  </div>
                ) : (
                  <>
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
