"use client";

import { useState } from "react";
import { Button } from "@mantine/core";

export default function CatClient() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.thecatapi.com/v1/images/search?limit=3"
      );
      const data = await res.json();
      setCats(data);
    } catch (err) {
      console.error("Error fetching cats:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">🐾 Client-side Cats</h2>
      <Button onClick={fetchCats} loading={loading} color="indigo">
        {loading ? "Loading..." : "Load cats"}
      </Button>

      {cats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {cats.map((cat) => (
            <img
              key={cat.id}
              src={cat.url}
              alt="Cat"
              className="rounded-lg shadow-md w-full h-64 object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
