import Sidebar from "../components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
