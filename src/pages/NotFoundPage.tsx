import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-3xl mb-2">404 — Page Not Found</h1>
      <Link to="/" className="text-blue-600 underline">Go back home</Link>
    </div>
  );
}
