import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import express from "express";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const {
    title,
    creatorId,
    ingredients,
    steps,
    cookingTime,
    prepTime,
    imageUrl,
    servings,
    calories,
    isVegetarian,
  } = req.body;
  const result = await prisma.recipe.create({
    data: {
      title,
      creatorId,
      ingredients,
      steps,
      cookingTime,
      prepTime,
      servings,
      imageUrl,
      calories,
      isVegetarian,
    },
  });
  res.status(201).json(result);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const recipe = await prisma.recipe.findFirstOrThrow({
      where: { id: Number(id) },
    });
    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.recipe.delete({ where: { id: Number(id) } });
    return true;
  } catch (err: any) {
    res.status(400).send(err.message);
  }
});

router.get("/", async (req: Request, res: Response) => {
  const search = req.query.search;
  try {
    const recipes = await prisma.recipe.findMany();
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes((search as string)?.toLowerCase())
    );
    res.status(200).json(filteredRecipes);
  } catch (err: any) {
    res.status(404).send(err.message);
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const allRecipes = await prisma.recipe.findMany();
    res.status(200).json(allRecipes);
  } catch (err: any) {
    res.status(400).send(err.mesage);
  }
});

router.put("/", async (req: Request, res: Response) => {
  const {
    id,
    title,
    ingredients,
    steps,
    imageUrl,
    cookingTime,
    prepTime,
    servings,
    calories,
    isVegetarian,
  } = req.body;
  const result = await prisma.recipe.update({
    where: { id: id },
    data: {
      id,
      title,
      imageUrl,
      ingredients,
      steps,
      cookingTime,
      prepTime,
      servings,
      calories,
      isVegetarian,
    },
  });
  res.status(201).json(result);
});

router.get("/users:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const recipes = await prisma.recipe.findMany();
    const userRecipes = recipes.filter(
      (recipe) => recipe.creatorId === Number(id)
    );
    res.status(200).json(userRecipes);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

export const recipeController = router;
