"use client";

import React, { createContext, useContext, useState } from "react";

interface LoaderContextType {
  isLoading: boolean;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  finishLoading: () => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const finishLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ isLoading, progress, setProgress, finishLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
}
