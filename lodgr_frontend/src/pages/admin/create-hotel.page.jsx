import Breadcrumbs from "@/Components/Breadcrumbs";
import HotelCreateForm from "@/Components/HotelCreateForm";
import { BadgeCheck, Database, Sparkles } from "lucide-react";

function CreateHotelPage() {

  return (
    <main className="editorial-shell py-8">
      <Breadcrumbs
        items={[
          { label: "Hotels", to: "/hotels" },
          { label: "Create Hotel" },
        ]}
      />

      <section className="mb-6 overflow-hidden rounded-[2rem] bg-neutral-950 text-white shadow-sm">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_340px] md:p-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase text-white/80">
              <Database className="h-4 w-4" />
              Admin workspace
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Add a stay worthy of the Lodgr catalog.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
              Create rich hotel records with imagery, amenities, tags, and AI-ready search text so the stay appears across browsing and semantic recommendations.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
            <Sparkles className="h-7 w-7" />
            <p className="mt-4 text-sm font-medium">Publishing checklist</p>
            <div className="mt-4 space-y-3 text-sm text-white/75">
              {[
                "Use a high-quality hero image",
                "Add 3 gallery images when possible",
                "Include searchable amenities and travel-style tags",
              ].map((item) => (
                <p key={item} className="flex items-start gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-[#c9a46a]" />
                  {item}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <HotelCreateForm />
        </div>

        <aside className="h-fit rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm lg:sticky lg:top-24">
          <p className="text-sm font-semibold text-neutral-950">Admin notes</p>
          <div className="mt-4 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>
              New hotels are saved immediately and hotel lists are refreshed after creation.
            </p>
            <p>
              If OpenRouter is configured, the backend will generate an embedding so this hotel can be found by AI Search.
            </p>
            <p>
              Mark only strong editorial picks as featured to keep the home page curated.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default CreateHotelPage;
