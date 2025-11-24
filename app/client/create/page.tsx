"use client";

import { useActionState, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createListing } from "@/lib/actions"; // Assurez-vous d'avoir exporté FormState

// Clé temporaire pour l'input file afin d'éviter la duplication dans FormData
const FILE_INPUT_NAME = "images-temp";

export default function CreateListingPage() {
  const [state, action] = useActionState(createListing, undefined);
  const [isPending, startTransition] = useTransition();

  // États locaux pour les previews d'images
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);

  // Gère la sélection des fichiers et génère les URLs de prévisualisation
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFileList(files);

      // Nettoyer les anciennes URLs pour la gestion de la mémoire
      previewImages.forEach(URL.revokeObjectURL);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(newPreviews);
    }
  };

  // Fonction de soumission manuelle corrigée
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    // 🔑 CORRECTION : Supprimer l'entrée temporaire de l'input file
    // qui ne contient pas les données complètes ou qui duplique
    data.delete(FILE_INPUT_NAME);

    // IMPORTANT : Ajouter chaque fichier de la liste locale sous la clé 'images'
    // C'est ce que l'action serveur attend.
    fileList.forEach((file) => {
      data.append("images", file);
    });

    // Appeler l'action serveur en l'enveloppant dans startTransition
    startTransition(() => {
      action(data);
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        Ajouter un nouveau logement
      </h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Détails du logement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Affichage des messages d'erreur ou de succès */}
            {state?.message && (
              <div
                className={`p-3 rounded text-sm ${
                  state.errors
                    ? "bg-red-100 border border-red-400 text-red-700"
                    : "bg-green-100 border border-green-400 text-green-700"
                }`}
              >
                {state.message}
              </div>
            )}

            {/* Champs Titre et Prix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Studio moderne près de la plage"
                  required
                />
                {state?.errors?.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prix par nuit (DZD)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="1"
                  placeholder="5000"
                  required
                />
                {state?.errors?.price && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.price}
                  </p>
                )}
              </div>
            </div>

            {/* Description et Localisation */}
            <div className="space-y-2">
              <Label htmlFor="description">Description complète</Label>
              <Textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Décrivez votre logement..."
                required
              />
              {state?.errors?.description && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation (Ville, Pays)</Label>
              <Input
                id="location"
                name="location"
                placeholder="Oran, Algérie"
                required
              />
              {state?.errors?.location && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.location}
                </p>
              )}
            </div>

            {/* Champ Images (avec Prévisualisation) */}
            <div className="space-y-2">
              <Label htmlFor="images">Photos du Logement</Label>
              <Input
                id="images"
                name={FILE_INPUT_NAME} // 👈 Utilisation de la clé temporaire
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {state?.errors?.images && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.images}
                </p>
              )}
            </div>

            {/* Prévisualisation des images */}
            {previewImages.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="w-full text-sm font-semibold mb-2">
                  Prévisualisation ({previewImages.length}) :
                </h4>
                {previewImages.map((src, index) => (
                  <div
                    key={index}
                    className="relative w-32 h-32 rounded-lg overflow-hidden border"
                  >
                    <img
                      src={src}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Bouton de Soumission */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Publier l'annonce"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
