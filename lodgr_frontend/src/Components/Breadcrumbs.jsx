import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

function Breadcrumbs({ items = [] }) {
  return (
    <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm" aria-label="Breadcrumb">
      <Link className="text-neutral-600 hover:underline" to="/">
        Home
      </Link>
      {items.map((item) => (
        <span key={`${item.label}-${item.to ?? "current"}`} className="flex items-center gap-1">
          <ChevronRight className="h-4 w-4 text-neutral-500" />
          {item.to ? (
            <Link className="text-neutral-600 hover:underline" to={item.to}>
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-950">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
