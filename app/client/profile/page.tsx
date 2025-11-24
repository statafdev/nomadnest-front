"use client";
import { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://192.168.8.189:5000/api/auth/Me", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setUser(data.user);
        } else {
          setError(data.message || "Erreur de récupération.");
        }
      })
      .catch(() => {
        setError("Erreur de connexion au serveur.");
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mon Profil</h1>
      {error && <p className="text-red-500">{error}</p>}
      {user && (
        <div className="space-y-2 bg-gray-100 p-4 rounded">
          <div>
            <strong>Nom d'utilisateur:</strong> {user.username}
          </div>
          <div>
            <strong>Email:</strong> {user.email}
          </div>
          <div>
            <strong>Rôle:</strong> {user.role}
          </div>
          <div>
            <strong>Créé le:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}
