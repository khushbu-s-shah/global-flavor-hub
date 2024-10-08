'use server';
import { cache } from 'react';
import { prisma } from './lib/prisma';
import { Prisma } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { string, z } from 'zod';
import { sortMethods } from './constants/recipe.constants';
import { clerkClient, auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const recipeSchema = z.object({
    title: z.string(),
    description: z.string(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
    image: z.string().url(),
    category: z.string(),
    cookingTimeInMinutes: z.number().int().positive(),
    authorId: z.string(),
});

type Recipe = z.infer<typeof recipeSchema>;

export const getRecipe = cache(async (recipeId: string) => {
    const recipe = await prisma.recipe.findUnique({
        where: { recipeId },
    });
    if (!recipe) { notFound(); }
    const response = await clerkClient().users.getUser(recipe.authorId);
    return {
        ...recipe,
        author: {
            email: response.emailAddresses[0].emailAddress,
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            image: response.imageUrl,
        },
    };
});

// Function to get recipes by various filters
export const getRecipes = cache(
    async (data: {
        searchText?: string;
        authorId?: string;
        page?: number;
        limit?: number;
        category?: string;
        sortBy?: string;
    }) => {
        const {
            searchText,
            authorId,
            page = 1,
            limit = 12,
            category,
            sortBy,
        } = data;

        try {
            let whereClause: any = {};
            let orderByClause: any = {};

            if (authorId) {
                whereClause = {
                    ...whereClause,
                    authorId,
                };
                orderByClause = {
                    ...orderByClause,
                    createdAt: 'desc',
                };
            }

            if (searchText) {
                whereClause = {
                    ...whereClause,
                    title: { contains: searchText, mode: 'insensitive' },
                };
            }

            if (category) {
                whereClause = {
                    ...whereClause,
                    category,
                };
            }

            if (sortBy) {
                orderByClause = sortMethods[sortBy]?.orderBy;
            }

            const recipes = await prisma.recipe.findMany({
                where: whereClause,
                take: limit || 12,
                skip: (page - 1) * limit,
                orderBy: orderByClause,
            });

            return { recipes, page: data?.page || 1 };
        } catch (error: any) {
            throw new Error(`Failed to fetch recipes: ${error.message}`);
        }
    }
);

export async function createRecipe(
    ingredients: string[],
    steps: string[],
    authorId: string,
    formData: FormData
) {
    //let recipe;
    //try {
        const data: Prisma.RecipeCreateInput = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            image: formData.get('image') as string,
            cookingTimeInMinutes: Number(formData.get('cookingTimeInMinutes')),
            category: formData.get('category') as string,
            ingredients,
            steps,
            authorId,
        };
        // Validate the data
        const parsedData = recipeSchema.safeParse(data);

        if (!parsedData.success) {
            // If parsing failed, throw an error with details of the validation errors
            throw new Error(
                parsedData.error.errors
                    .map((err: any) => err.message)
                    .join('\n')
            );
        }

        // Create the recipe in the database
        const recipe = await prisma.recipe.create({
            data: parsedData.data as Prisma.RecipeCreateInput,
        });

        console.log(recipe); // Check if recipe and recipeId are valid
        redirect(`/recipes/${recipe.recipeId}`);
        //return;

    } /*catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Internal server error');
    }
}*/

export async function updateRecipe(
    ingredients: string[],
    steps: string[],
    authorId: string,
    recipeId: string,
    formData: FormData
) {
    let recipe : any;
    //try {
        const payload = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            ingredients,
            steps,
            image: formData.get('image') as string,
            cookingTimeInMinutes: Number(formData.get('cookingTimeInMinutes')),
            category: formData.get('category') as string,
            authorId,
        };

        // Validate the data
        const parsedData = recipeSchema.safeParse(payload);

        if (!parsedData.success) {
            // If parsing failed, throw an error with details of the validation errors
            throw new Error(
                parsedData.error.errors
                    .map((err: any) => err.message)
                    .join('\n')
            );
        }

        // Update the recipe in the database
        recipe = await prisma.recipe.update({
            where: { recipeId, authorId },
            data: parsedData.data,
        });
        redirect(`/recipes/${recipe?.recipeId}`);

    }  /*catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Internal server error');
    }
}*/

export async function saveRecipe(userId: string, recipeId: string) {
    try {
        if (!userId || !recipeId) {
            throw new Error('Invalid user or recipe id');
        }

        await prisma.savedRecipe.create({
            data: { userId, recipeId: recipeId.toString() },
        });

        revalidatePath(`/recipes/${recipeId}`);
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Internal server error');
    }
}

export async function saveRating(
    userId: string,
    recipeId: string,
    rating: number
) {
    try {
        if (!userId || !recipeId || !rating) {
            throw new Error('Invalid data');
        }

        await prisma.rating.create({
            data: { userId, recipeId, rating },
        });

        const ratings = await prisma.rating.findMany({
            where: { recipeId },
        });

        const avgRating =
            ratings.reduce((acc: any, curr: any) => acc + curr.rating, 0) /
            ratings.length;

        await prisma.recipe.update({
            where: { recipeId },
            data: { rating: avgRating },
        });

        revalidatePath(`/recipes/${recipeId}`);
    } catch (error: any) {
        console.log(error);
        throw new Error(error.message || 'Internal server error');
    }
}

export const getSavedRecipes = cache(
    async (data: {
        searchText?: string;
        authorId?: string;
        page?: number;
        limit?: number;
        category?: string;
        sortBy?: string;
    }) => {
        const {
            searchText,
            authorId,
            page = 1,
            limit = 12,
            category,
            sortBy,
        } = data;

        try {
            let whereClause: any = {};
            let orderByClause: any = {
                'recipe.createdAt': -1,
            };

            if (searchText) {
                whereClause = {
                    ...whereClause,
                    'recipe.title': {
                        $regex: searchText,
                        $options: 'i',
                    },
                };
            }

            if (category) {
                whereClause = {
                    ...whereClause,
                    'recipe.category': category,
                };
            }

            if (sortBy) {
                orderByClause = sortMethods[sortBy]?.sortBy;
                const existKey = Object.keys(orderByClause)[0];
                const newKey = `recipe.${existKey}`;

                orderByClause = {
                    [newKey]: orderByClause[existKey],
                };
            }

            const pipeline: any = [
                {
                    $match: { userId: authorId },
                },
                {
                    $lookup: {
                        from: 'Recipe',
                        localField: 'recipeId',
                        foreignField: '_id',
                        as: 'recipe',
                    },
                },
                {
                    $unwind: '$recipe',
                },
            ];

            if (Object.keys(whereClause).length > 0) {
                pipeline.push({
                    $match: whereClause,
                });
            }

            pipeline.push(
                {
                    $sort: orderByClause,
                },
                {
                    $skip: (page - 1) * limit,
                },
                {
                    $limit: limit,
                }
            );

            const recipes: any = await prisma.savedRecipe.aggregateRaw({
                pipeline,
            });

            return {
                recipes:
                    recipes?.length > 0
                        ? recipes.map((item: any) => ({
                              ...item.recipe,
                              recipeId: item?.recipe?._id?.['$oid'],
                          }))
                        : [],
                page: data?.page || 1,
            };
        } catch (error: any) {
            throw new Error(`Failed to fetch saved recipes: ${error.message}`);
        }
    }
);

export const getSavedRecipe = cache(
    async (recipeId: string, userId: string) => {
        const savedRecipe = await prisma.savedRecipe.findFirst({
            where: { recipeId, userId },
        });
        return savedRecipe;
    }
);

export const getSavedRating = cache(
    async (recipeId: string, userId: string) => {
        const rating = await prisma.rating.findFirst({
            where: { recipeId, userId },
        });
        return rating;
    }
);

export async function deleteRecipe(authorId: string, recipeId: string) {
    try {
        await prisma.recipe.delete({ where: { recipeId, authorId } });
        revalidatePath('/recipes/my/all');
    } catch (error: any) {
        throw new Error(`Failed to delete recipes: ${error.message}`);
    }
}

export async function deleteSavedRecipe(authorId: string, recipeId: string) {
    try {
        await prisma.savedRecipe.deleteMany({
            where: {
                recipeId,
                userId: authorId,
            },
        });
        revalidatePath('/recipes/my/saved');
    } catch (error: any) {
        throw new Error(`Failed to delete saved recipes: ${error.message}`);
    }
}