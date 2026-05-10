import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

function Footer() {
  return (
    <footer className="editorial-shell pb-4 pt-10">
      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-sm">
        <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8 lg:p-10">
          <div>
            <div>
              <div className="flex items-center gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-black/10 bg-white">
                  <img
                    src="/logo.svg"
                    alt=""
                    className="block h-12 w-12"
                    style={{ transform: "translateX(12%)" }}
                  />
                </span>
                <p className="text-4xl font-semibold leading-none tracking-normal text-neutral-950 sm:text-5xl">
                  Lodgr
                </p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                AI-guided hotel discovery
              </p>
            </div>

            <h2 className="mt-8 max-w-3xl text-5xl font-semibold leading-none text-neutral-950 md:text-7xl lg:text-8xl">
              Stay curious.
              <br />
              Book clearly.
            </h2>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div className="rounded-3xl bg-[#f4efe8] p-5">
              <Sparkles className="h-6 w-6 text-neutral-950" />
              <p className="mt-4 text-sm leading-6 text-neutral-700">
                Describe a trip in plain language and Lodgr searches by meaning:
                mood, amenities, destination context, and the kind of stay you
                actually want.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
              <Link className="group flex items-center justify-between rounded-full border border-black/10 px-4 py-3 transition hover:bg-neutral-950 hover:text-white" to="/hotels">
                Browse hotels
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
              </Link>
              <Link className="group flex items-center justify-between rounded-full border border-black/10 px-4 py-3 transition hover:bg-neutral-950 hover:text-white" to="/my-account">
                My account
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black/10 px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8 lg:px-10">
          <p>© 2026 Lodgr. Curated stays, semantic search, smoother bookings.</p>
          <p>Built for travelers who know the feeling before the destination.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
