import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { createClient } from "@/lib/supabase/client";
import { CountUp, Reveal, ZoomSettle } from "./HeroMotion";

interface PropertyImage {
  id: string;
  image_url: string;
  display_order: number;
}

interface Property {
  id: string;
  slug: string;
  title: string;
  is_sold: boolean;
  location: string;
  price: number;
  property_images: PropertyImage[];
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85";

export default async function Hero() {
  "use cache";
  cacheLife("hours");
  cacheTag("hero-property");

  const supabase = createClient();

  const { data: properties, error } = await supabase
    .from("properties")
    .select(
      `
      id,
      slug,
      is_sold,
      title,
      location,
      price,
      property_images (
        id,
        image_url,
        display_order
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) console.error("Hero fetch error:", error.message);

  const property: Property | undefined = (properties as Property[] | null)?.[0];

  const heroImage =
    [...(property?.property_images ?? [])].sort(
      (a, b) => a.display_order - b.display_order,
    )[0]?.image_url ?? FALLBACK_IMAGE;

  const formattedPrice = property
    ? new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(property.price)
    : null;

  return (
    <section className="relative isolate overflow-hidden bg-[#f3f5ef] font-sans">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-6 sm:py-16 lg:min-h-screen lg:grid-cols-2 lg:gap-12 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[0.95] tracking-tight text-[#172018] lg:mt-6">
            <Reveal as="span" direction="left" delay={0.1} className="block">
              Build what’s
            </Reveal>
            <Reveal
              as="span"
              direction="left"
              delay={0.45}
              className="block font-serif font-normal italic text-[#091e3c]"
            >
              next.
            </Reveal>
          </h1>

          <Reveal direction="left" delay={0.7}>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#626a60] sm:mt-6 sm:text-lg sm:leading-8">
              We work with developers, investors, and homebuyers to deliver
              properties built to last, in locations that grow in value.
            </p>
          </Reveal>

          <Reveal direction="up" delay={0.95} className="mt-8">
            <Link href="/partners" className="block sm:inline-block">
              <Button className="h-12 w-full cursor-pointer rounded-full bg-[#091e3c] px-8 text-sm font-semibold text-white shadow-lg shadow-[#091e3c]/20 transition-colors hover:bg-[#0b315d] sm:w-auto">
                Become partners
              </Button>
            </Link>
          </Reveal>

          <Reveal direction="up" delay={1.15}>
            <div className="mt-10 flex gap-8 border-t border-[#d8dccf] pt-6 sm:mt-12 sm:gap-10">
              <div>
                <p className="text-2xl font-semibold text-[#172018]">
                  <CountUp to={100} suffix="+" />
                </p>
                <p className="mt-1 text-sm text-[#777f72]">Properties</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#172018]">
                  <CountUp to={50} suffix="+" />
                </p>
                <p className="mt-1 text-sm text-[#777f72]">Clients</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#172018]">
                  <CountUp to={5} suffix="+" />
                </p>
                <p className="mt-1 text-sm text-[#777f72]">Locations</p>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal
          direction="right"
          fade={false}
          delay={0.2}
          duration={1.5}
          className="relative h-104 sm:h-128 lg:h-145"
        >
          <div className="absolute inset-y-0 right-0 w-full overflow-hidden rounded-3xl bg-[#ccd3c1] sm:w-[92%] sm:rounded-[2rem]">
            <ZoomSettle className="absolute inset-0">
              <Image
                src={heroImage}
                alt={property?.title ?? "Modern Constrally development"}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </ZoomSettle>
            <div className="absolute inset-0 bg-linear-to-t from-[#172018]/35 via-transparent to-transparent" />
          </div>

          {property && (
            <Reveal
              direction="left"
              delay={1.3}
              className="absolute inset-x-3 bottom-3 sm:inset-x-auto sm:bottom-8 sm:left-0 sm:w-[58%]"
            >
              <div className="block rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-md sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#7b8474] sm:text-xs">
                      {property.is_sold ? "Sold" : "Featured Property"}
                    </p>
                    <h2 className="mt-2 text-lg font-semibold text-[#172018] sm:text-xl">
                      {property.title}
                    </h2>
                  </div>
                </div>
                <div className="mt-4 flex justify-between border-t border-[#e5e8df] pt-3 text-sm text-[#626a60]">
                  <span>{property.location}</span>
                  <span>{formattedPrice}</span>
                </div>
              </div>
            </Reveal>
          )}
        </Reveal>
      </div>
    </section>
  );
}
