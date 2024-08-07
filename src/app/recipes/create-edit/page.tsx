/*import React from 'react'
import UpsertForm from './utils/UpsertForm';

export default function UpsertRecipe() {
  return (
    <div className='mx-w-xl mx-auto px-4 py-8'>
        <h1 className='text-3xl font-bold text-black mb-4'>
            Create a New Recipe</h1>
    </div>
  );
}*/

import React from 'react'
import UpsertForm from './recipes/utils/UpsertForm';

const UpsertRecipe = () => {
  return (
    <div className='mx-w-xl mx-auto px-4 py-8 bg-red-500'>
        <h1 className='text-3xl font-bold text-black mb-4'>
            Create a New Recipe</h1>
    </div>
  )
};

export default UpsertRecipe;

