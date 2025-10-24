import CatClient from "./CatClient";

export default async function CatsPage() {
  const response = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=3",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Unable to load cats");
  }

  const cats = await response.json();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">🐾 Server-side Cats</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cats.map((cat: any) => (
          <img
            key={cat.id}
            src={cat.url}
            alt="Cat"
            className="rounded-lg shadow-md w-full h-64 object-cover"
          />
        ))}
      </div>

      <hr className="my-8" />

      <CatClient />
    </div>
  );
}
