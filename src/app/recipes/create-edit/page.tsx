import React from "react";
import UpsertForm from "./components/UpsertForm";

const UpsertRecipe = () => {
  return (
    <div className="mx-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-black mb-4">
        Create a New Recipe
      </h1>
      <UpsertForm />
    </div>
  );
};

export default UpsertRecipe;
