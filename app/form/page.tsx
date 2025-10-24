import FormClient from "./FormClient";

export default async function Page() {
  // future: supabase client for server-side

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Registration form (Mantine)</h1>
      <FormClient />
    </div>
  );
}
