import React, { FC } from 'react';
import RecipeUpsertForm from './components/RecipeUpsertForm';
import { getRecipe } from '@/app/action';

const RecipeUpsertPage: FC<{
  searchParams: {
    recipeId: string;
  };
}> = async ({ searchParams }) => {
  let recipe: any = {};
  if (searchParams?.recipeId) {
    recipe = await getRecipe(searchParams.recipeId);
  }
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {searchParams?.recipeId ? 'Update Recipe' : 'Create Recipe'}
      </h1>

      <RecipeUpsertForm
        recipeId={searchParams.recipeId || ''}
        existRecipe={recipe}
      />
    </div>
  );
};

export default RecipeUpsertPage;
