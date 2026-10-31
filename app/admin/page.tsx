"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/submitClient";
import { Search, Users, UserPlus, X, Loader2 } from "lucide-react";
import Image from "next/image";

type Partner = {
  id: string;
  name: string;
  email: string;
  year_joined: number;
  date_of_birth: string;
  whatsapp: string;
  address: string;
  referred_by: string | null;
  referral_code: string;
  created_at?: string;
};

export default function Admin() {
  const supabase = createClient();

  const [partners, setPartners] = useState<Partner[]>([]);
  const [selected, setSelected] = useState<Partner | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPartners() {
      const { data, error } = await supabase
        .from("partner_applications")
        .select("*");

      if (error) {
        setError("Unable to fetch partner applications.");
        console.error(error);
      } else {
        setPartners(data as Partner[]);
      }

      setLoading(false);
    }

    fetchPartners();
  }, []);

  const filteredPartners = useMemo(() => {
    const query = search.toLowerCase();

    return partners.filter((partner) =>
      [
        partner.name,
        partner.email,
        partner.whatsapp,
        partner.referral_code,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [partners, search]);

  const referredCount = partners.filter(
    (partner) => partner.referred_by,
  ).length;

  const currentMonthCount = partners.filter((partner) => {
    if (!partner.created_at) return false;

    const date = new Date(partner.created_at);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-5 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto max-w-7xl space-y-10">
        {/* Dashboard Header */}
        <header className="border-b border-neutral-200 pb-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo.jpeg"
                alt="Constrally logo"
                width={180}
                height={80}
                priority
                className="h-auto w-28 object-contain sm:w-36"
              />

              <div className="hidden h-12 w-px bg-neutral-200 sm:block" />

              <div>
                <p className="font-serif text-lg text-[#091e3c] sm:text-xl">
                  Partner Portal
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                  Administration
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                Dashboard
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                Manage your partner network
              </p>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="font-serif text-3xl text-[#091e3c] sm:text-4xl">
              Constrally Partners
            </h1>

            <p className="mt-2 text-sm text-neutral-500">
              View and manage submitted partners.
            </p>
          </div>
        </header>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Applications"
            value={partners.length}
            icon={<Users size={20} />}
          />

          <StatCard
            title="This Month"
            value={currentMonthCount}
            icon={<UserPlus size={20} />}
          />

          <StatCard
            title="Referred Applications"
            value={referredCount}
            icon={<Users size={20} />}
          />
        </div>

        {/* Applications */}
        <section className="border border-neutral-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-serif text-xl text-neutral-900">
                All Applications
              </h2>
              <p className="mt-1 text-xs text-neutral-500">
                {filteredPartners.length} applications found
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applications..."
                className="h-11 w-full border border-neutral-200 pl-10 pr-4 text-sm outline-none focus:border-[#091e3c]"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 p-16 text-sm text-neutral-500">
              <Loader2 className="animate-spin" size={18} />
              Loading applications...
            </div>
          ) : error ? (
            <p className="p-10 text-center text-sm text-red-600">{error}</p>
          ) : filteredPartners.length === 0 ? (
            <p className="p-16 text-center text-sm text-neutral-500">
              No applications found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-187.5 text-left">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                    <th className="px-5 py-4 font-medium">Name</th>
                    <th className="px-5 py-4 font-medium">Email</th>
                    <th className="px-5 py-4 font-medium">WhatsApp</th>
                    <th className="px-5 py-4 font-medium">Year Joined</th>
                    <th className="px-5 py-4 font-medium">Referral</th>
                    <th className="px-5 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPartners.map((partner) => (
                    <tr
                      key={partner.id}
                      className="border-b border-neutral-100 transition-colors hover:bg-neutral-50"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                        {partner.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {partner.email}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {partner.whatsapp}
                      </td>

                      <td className="px-5 py-4 text-sm text-neutral-600">
                        {partner.year_joined}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {partner.referred_by ? (
                          <span className="text-[#091e3c]">
                            {partner.referred_by}
                          </span>
                        ) : (
                          <span className="text-neutral-400">Direct</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(partner)}
                          className="text-xs font-semibold uppercase tracking-wider text-[#091e3c] hover:underline"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Application Details */}
        {selected && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
            <div className="h-full w-full max-w-lg overflow-y-auto bg-white p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
                <div>
                  <p className="text-xs uppercase tracking-widest text-neutral-500">
                    Application Details
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-[#091e3c]">
                    {selected.name}
                  </h2>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="p-2 text-neutral-500 hover:bg-neutral-100"
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-8 space-y-6">
                <Detail label="Full Name" value={selected.name} />
                <Detail label="Email Address" value={selected.email} />
                <Detail label="WhatsApp Number" value={selected.whatsapp} />
                <Detail
                  label="Year Joined Real Estate"
                  value={selected.year_joined}
                />
                <Detail
                  label="Date of Birth"
                  value={formatDate(selected.date_of_birth)}
                />
                <Detail label="Address" value={selected.address} />
                <Detail
                  label="Referred By"
                  value={selected.referred_by || "Direct application"}
                />
                <Detail
                  label="Personal Referral Code"
                  value={selected.referral_code}
                />
                <Detail
                  label="Date Submitted"
                  value={formatDate(selected.created_at)}
                />
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-10 h-12 w-full bg-[#091e3c] text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#071832]"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between text-neutral-500">
        <p className="text-xs uppercase tracking-wider">{title}</p>
        {icon}
      </div>

      <p className="mt-5 font-serif text-3xl text-[#091e3c]">{value}</p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="border-b border-neutral-100 pb-4">
      <p className="text-xs uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <p className="mt-2 wrap-break-word text-sm text-neutral-900">
        {value ?? "Not provided"}
      </p>
    </div>
  );
}
