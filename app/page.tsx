import UserTable from "@/components/user-table";

export default function Page() {
  return (
    <div className="w-screen h-screen p-4 flex flex-col items-center overflow-y-auto">
      <UserTable />
    </div>
  );
}
