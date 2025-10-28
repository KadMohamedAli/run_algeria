"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

export default function WinnerPricesComponent({ prix_gagnants }) {
  if (!prix_gagnants || Object.keys(prix_gagnants).length === 0) return null;

  const scrollRef = useRef(null);

  // Scroll by one "page" (one card width)
  const scroll = (dir) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardWidth = container.offsetWidth; // only the visible width
    const scrollAmount = dir === "left" ? -cardWidth : cardWidth;

    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section className="relative">
      <h2 className="text-3xl font-bold mb-5 text-white text-start">
        Récompense
      </h2>

      {/* --- Scroll Buttons (desktop only) --- */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10 backdrop-blur-sm transition"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10 backdrop-blur-sm transition"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* --- Scroll Container --- */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
      >
        {Object.entries(prix_gagnants).map(([category, rewards], idx) => (
          <div
            key={category}
            className="snap-center flex-shrink-0 w-full px-4 sm:px-8"
          >
            <div className="rounded-xl p-8 h-full flex flex-col items-center space-y-8 bg-transparent">
              <h3 className="text-2xl font-bold text-white text-center">
                {category}
              </h3>

              {rewards["1er"] || rewards["2e"] || rewards["3e"] ? (
                <Podium rewards={rewards} />
              ) : (
                <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                  {Object.entries(rewards).map(([pos, values]) => (
                    <li key={pos}>
                      <span className="font-semibold capitalize text-white">
                        {pos}
                      </span>
                      : {values.join(", ")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const formatPrice = (value) => {
  if (typeof value === "number" || /^\d+(\s?DA)?$/.test(value)) {
    const num = parseInt(value.toString().replace(/\D/g, ""), 10);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DA";
  }
  return value;
};

const formatPlace = (place) => {
  const num = parseInt(place);
  if (isNaN(num)) return place;
  const suffix = num === 1 ? "er" : "e";

  return (
    <>
      {num}
      <span className="text-xs align-super ml-0.5">{suffix}</span>
    </>
  );
};

function Podium({ rewards }) {
  const podium = [
    {
      place: "2e",
      base: "bg-gradient-to-t from-gray-800 to-gray-600 border border-gray-400/30",
      height: "h-40",
      rounding: "rounded-tl-xl",
    },
    {
      place: "1er",
      base: "bg-gradient-to-t from-yellow-800 to-yellow-600 border border-yellow-500/40",
      height: "h-52",
      rounding: "rounded-t-xl",
    },
    {
      place: "3e",
      base: "bg-gradient-to-t from-amber-900 to-amber-700 border border-amber-600/40",
      height: "h-32",
      rounding: "rounded-tr-xl",
    },
  ];

  const others = Object.entries(rewards).filter(
    ([k]) => !["1er", "2e", "3e", "finishers"].includes(k)
  );

  return (
    <div className="flex flex-col items-center text-center w-full">
      {/* --- Podium --- */}
      <div className="relative flex justify-center items-end w-full max-w-md mx-auto mb-10 gap-0">
        {podium.map(
          (p) =>
            rewards[p.place] && (
              <div
                key={p.place}
                className={`flex flex-col justify-end items-center w-28 sm:w-32 ${p.height} relative ${p.rounding} ${p.base} shadow-[0_0_15px_rgba(255,255,255,0.05)] text-white transition-transform duration-300 hover:scale-[1.03]`}
              >
                <div className="absolute top-2 font-extrabold text-2xl drop-shadow-lg text-gray-800">
                  {formatPlace(p.place)}
                </div>

                <ul className="text-sm font-semibold leading-tight mb-4 text-white drop-shadow-sm">
                  {rewards[p.place].map((r, i) => (
                    <li key={i}>{formatPrice(r)}</li>
                  ))}
                </ul>
              </div>
            )
        )}
      </div>

      {/* --- Other positions --- */}
      {others.length > 0 && (
        <div className="text-gray-300 text-sm mb-4 w-full max-w-md">
          <ul className="space-y-1">
            {others.map(([pos, values]) => (
              <li key={pos}>
                <span className="font-semibold text-white">
                  {formatPlace(pos)}
                </span>{" "}
                : {values.map((v, i) => formatPrice(v)).join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- Finishers --- */}
      {rewards.finishers && (
        <div className="bg-[#ffffff0d] rounded-lg px-4 py-3 text-gray-100 font-semibold text-center mt-4 w-full max-w-md">
          <div className="text-lg mb-1 text-white uppercase font-bold underline">
            Finishers
          </div>
          <ul className="text-sm space-y-1">
            {rewards.finishers.map((f, i) => (
              <li key={i}>{formatPrice(f)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
