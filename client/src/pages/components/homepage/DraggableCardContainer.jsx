import React, { useEffect, useState } from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "../../../components/ui/draggable-card";
import { fetchAllCountries } from "../../../api/countryApi";

export function DraggableCardCon() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await fetchAllCountries();
        
        // Sort by quality of life metrics (this is a simplified example)
        // In a real app, you'd want more comprehensive metrics
        const topCountries = data
          .filter(country => country.capital && country.flags) // Ensure basic data exists
          .sort((a, b) => {
            // This is a simplistic ranking - you'd want to use actual quality of life data
            // Here we're using a combination of factors that might indicate good living conditions
            const scoreA = ((a.gini ? (100 - a.gini) : 50) + // Lower gini is better
                          (a.unemployment ? (100 - a.unemployment) : 0) + // Lower unemployment better
                          (a.lifeExpectancy || 0)); // Higher life expectancy better
            
            const scoreB = ((b.gini ? (100 - b.gini) : 50) +
                          (b.unemployment ? (100 - b.unemployment) : 0) +
                          (b.lifeExpectancy || 0));
            
            return scoreB - scoreA;
          })
          .slice(0, 10); // Take top 10
          
        setCountries(topCountries);
      } catch (err) {
        setError("Failed to fetch countries. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Positions for 10 cards - you'll need to adjust these
  const positions = [
    // Left side cards (5)
    "absolute top-10 left-[5%] rotate-[-8deg]",
    "absolute top-32 left-[10%] rotate-[-3deg]",
    "absolute top-60 left-[5%] rotate-[-12deg]",
    "absolute top-20 left-[15%] rotate-[5deg]",
    "absolute top-80 left-[10%] rotate-[2deg]",
    
    // Right side cards (5)
    "absolute top-10 right-[5%] rotate-[8deg]",
    "absolute top-32 right-[10%] rotate-[3deg]",
    "absolute top-60 right-[5%] rotate-[12deg]",
    "absolute top-20 right-[15%] rotate-[-5deg]",
    "absolute top-80 right-[10%] rotate-[-2deg]",
  ];

  if (loading) {
    return (
      <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
        <p className="text-center text-2xl font-black text-neutral-400 dark:text-neutral-800">
          Loading countries...
        </p>
      </DraggableCardContainer>
    );
  }

  if (error) {
    return (
      <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
        <p className="text-center text-2xl font-black text-red-500 dark:text-red-400">
          {error}
        </p>
      </DraggableCardContainer>
    );
  }

  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      <p className="absolute top-1/2 mx-auto max-w-sm -translate-y-3/4 text-center text-2xl font-black text-neutral-400 md:text-4xl dark:text-neutral-800">
        Top 10 Countries for Quality of Life
      </p>
      {countries.map((country, index) => (
        <DraggableCardBody key={country.name.common} className={positions[index]}>
          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            className="pointer-events-none relative z-10 h-60 w-80 object-contain border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2"
          />
          <h3 className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
            {country.name.common}
          </h3>
          <div className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            {country.capital && <p>Capital: {country.capital[0]}</p>}
            {country.lifeExpectancy && <p>Life Expectancy: {country.lifeExpectancy}</p>}
          </div>
        </DraggableCardBody>
      ))}
    </DraggableCardContainer>
  );
}