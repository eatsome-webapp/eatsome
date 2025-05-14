export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="staff-mode">
      <div className="flex h-screen">
        <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
          {/* Staff sidebar komt hier */}
          <div className="p-4 font-semibold">Staff Sidebar</div>
        </div>
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-gray-200 flex items-center px-4">
            {/* Staff header komt hier */}
            <div>Restaurant Staff Dashboard</div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 