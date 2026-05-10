import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/Components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { useCreateHotelMutation } from "@/lib/api";
import { Textarea } from "./ui/textarea";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Image, MapPin, Plus, Sparkles, Star, X } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

const splitCsv = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(20, "Description should be at least 20 characters"),
  image: z.string().url("Use a valid image URL"),
  gallery: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  country: z.string().min(1, "Country is required"),
  neighborhood: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  rating: z.coerce.number().min(1).max(5),
  starRating: z.coerce.number().min(1).max(5),
  guestScore: z.coerce.number().min(0).max(10),
  amenities: z.string().min(1, "Add at least one amenity"),
  tags: z.string().min(1, "Add at least one tag"),
  featured: z.boolean().default(false),
});

export default function HotelCreateForm() {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [formError, setFormError] = useState("");
  const [heroPreview, setHeroPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      gallery: "",
      location: "",
      country: "",
      neighborhood: "",
      price: 150,
      rating: 4.5,
      starRating: 4,
      guestScore: 8.8,
      amenities: "Free Wi-Fi, Restaurant, Pool",
      tags: "boutique, city, romantic",
      featured: false,
    },
  });

  const [createHotel, { isLoading: isCreatingHotel }] = useCreateHotelMutation();

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleHeroFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await fileToDataUrl(file);
    setHeroPreview(dataUrl);
    form.setValue("image", dataUrl, { shouldDirty: true, shouldValidate: true });
    event.target.value = "";
  };

  const handleGalleryFiles = async (event) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    const galleryItems = [...splitCsv(form.getValues("gallery") ?? ""), ...dataUrls];

    setGalleryPreviews((currentPreviews) => [...currentPreviews, ...dataUrls]);
    form.setValue("gallery", galleryItems.join(", "), {
      shouldDirty: true,
      shouldValidate: true,
    });
    event.target.value = "";
  };

  const removeHeroImage = () => {
    setHeroPreview("");
    form.setValue("image", "", { shouldDirty: true, shouldValidate: true });
  };

  const removeGalleryImage = (imageToRemove) => {
    setGalleryPreviews((currentPreviews) =>
      currentPreviews.filter((preview) => preview !== imageToRemove)
    );
    form.setValue(
      "gallery",
      splitCsv(form.getValues("gallery") ?? "")
        .filter((image) => image !== imageToRemove)
        .join(", "),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  async function onSubmit(values) {
    setFormError("");

    const payload = {
      ...values,
      gallery: splitCsv(values.gallery ?? ""),
      amenities: splitCsv(values.amenities),
      tags: splitCsv(values.tags),
      searchText: [
        values.name,
        values.location,
        values.country,
        values.neighborhood,
        values.description,
        values.amenities,
        values.tags,
      ]
        .filter(Boolean)
        .join(" | "),
    };

    try {
      const token = await getToken({ skipCache: true });
      await createHotel({ payload, token }).unwrap();
      form.reset();
      navigate("/hotels");
    } catch (error) {
      setFormError(error?.data?.message ?? "Unable to create hotel.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6">
        {formError && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {formError}
          </div>
        )}

        <section className="rounded-3xl border border-black/10 bg-[#fbfaf8] p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white">
              <MapPin className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-neutral-950">Identity and location</h2>
              <p className="text-sm text-muted-foreground">Name the property and place it clearly in the catalog.</p>
            </div>
          </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="rounded-full" placeholder="The Colombo Atelier" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input className="rounded-full" placeholder="Colombo, Sri Lanka" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input className="rounded-full" placeholder="Sri Lanka" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="neighborhood"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Neighborhood</FormLabel>
                <FormControl>
                  <Input className="rounded-full" placeholder="Galle Face" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-[#fbfaf8] p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white">
              <Image className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-neutral-950">Story and imagery</h2>
              <p className="text-sm text-muted-foreground">Use polished copy and reliable image URLs.</p>
            </div>
          </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea className="min-h-32 rounded-2xl" placeholder="Describe the hotel experience..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero image URL</FormLabel>
                <FormControl>
                  <Input className="rounded-full" placeholder="https://images.unsplash.com/..." {...field} />
                </FormControl>
                <div className="rounded-2xl border border-dashed border-black/15 bg-white p-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                    <Image className="h-5 w-5 text-neutral-950" />
                    Upload hero image from your machine
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleHeroFile}
                    />
                  </label>
                  {heroPreview && (
                    <div className="relative mt-4 overflow-hidden rounded-2xl">
                      <img
                        src={heroPreview}
                        alt="Hero preview"
                        className="h-40 w-full object-cover"
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/90 text-neutral-950 shadow-sm backdrop-blur"
                        onClick={removeHeroImage}
                        aria-label="Remove hero image"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gallery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gallery URLs</FormLabel>
                <FormControl>
                  <Input className="rounded-full" placeholder="URL 1, URL 2, URL 3" {...field} />
                </FormControl>
                <FormDescription>Comma-separated image URLs.</FormDescription>
                <div className="rounded-2xl border border-dashed border-black/15 bg-white p-4">
                  <label className="flex cursor-pointer flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                    <Image className="h-5 w-5 text-neutral-950" />
                    Upload gallery images from your machine
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={handleGalleryFiles}
                    />
                  </label>
                  {galleryPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {galleryPreviews.map((preview) => (
                        <div key={preview} className="relative overflow-hidden rounded-xl">
                          <img
                            src={preview}
                            alt="Gallery preview"
                            className="h-24 w-full object-cover"
                          />
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="absolute right-2 top-2 h-7 w-7 rounded-full bg-white/90 text-neutral-950 shadow-sm backdrop-blur"
                            onClick={() => removeGalleryImage(preview)}
                            aria-label="Remove gallery image"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-[#fbfaf8] p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white">
              <Star className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-neutral-950">Pricing and quality signals</h2>
              <p className="text-sm text-muted-foreground">These values shape browsing, sorting, and trust.</p>
            </div>
          </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["price", "Price/night", "180"],
            ["rating", "Rating", "4.6"],
            ["starRating", "Stars", "4"],
            ["guestScore", "Guest score", "9.1"],
          ].map(([name, label, placeholder]) => (
            <FormField
              key={name}
              control={form.control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Input className="rounded-full" type="number" step="0.1" placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-[#fbfaf8] p-5">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-neutral-950">Search metadata</h2>
              <p className="text-sm text-muted-foreground">Amenities and tags power filters and AI matching.</p>
            </div>
          </div>
        <div className="grid gap-5 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                <FormControl>
                  <Input className="rounded-full" placeholder="Pool, Spa, Free Wi-Fi" {...field} />
                </FormControl>
                <FormDescription>Comma-separated amenities.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input className="rounded-full" placeholder="luxury, beach, family" {...field} />
                </FormControl>
                <FormDescription>Comma-separated travel styles.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        </section>

        <div className="flex flex-col gap-4 rounded-2xl bg-[#f6f1ea] p-4 sm:flex-row sm:items-center sm:justify-between">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-5 w-5 rounded border-black/20"
                  />
                </FormControl>
                <div>
                  <FormLabel className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Feature on home page
                  </FormLabel>
                  <FormDescription>
                    Featured hotels can appear in editorial home sections.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isCreatingHotel} className="black-pill rounded-full">
            <Plus className="h-4 w-4" />
            {isCreatingHotel ? "Creating..." : "Create Hotel"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
