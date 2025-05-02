import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import AppRoutes from "./Routes";
import ErrorFallback from "./components/ErrorFallback.jsx";
import LoaderForMain from "./components/layout/Loader/Loader.jsx";
import "./App.css";

// Optional: Create your own loader component
const Loader = () => <LoaderForMain />

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <Suspense fallback={<Loader />}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
