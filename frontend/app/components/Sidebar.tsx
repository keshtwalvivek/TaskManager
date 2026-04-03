"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Task", path: "/task" },
  ];

  return (
    <div className="w-64 bg-white border-r shadow-sm">
      {/* Logo */}
      <div className="p-4 text-xl font-bold border-b">Serv🙂Ji</div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menu.map((item) => (
          <Link key={item.path} href={item.path}>
            <div
              className={`p-3 rounded-lg cursor-pointer ${
                pathname === item.path
                  ? "bg-green-200 text-green-800"
                  : "hover:bg-gray-100"
              }`}
            >
              {item.name}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}
