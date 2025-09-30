"use client"
import { useState } from "react"
import Ingredients from "./Ingredients"

function IngredientsInput() {
    const [inputVal, setInputVal] = useState('')
    const [ingredients, setIngredients] = useState<string[]>([])
    const [recipe, setRecipe] = useState<string>('')

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            setIngredients((prev) => [...prev, inputVal.trim()])
            setInputVal('')
            event.currentTarget.value = ''

            console.log(ingredients)
        }
    }

    const handleRemoveIngredient = (ingredientToRemove: string) => {
        setIngredients(ingredients.filter(ing => ing !== ingredientToRemove))
        console.log(ingredients)
    }

    function handleClick() {
        async function query(data: any) {
            const response = await fetch(
                "https://router.huggingface.co/v1/chat/completions",
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify(data),
                }
            )
            const result = await response.json()
            return result
        }

        if (ingredients.length > 2) query({
            messages: [
                {
                    role: "user",
                    content: `Use the following ingredients and create a recipe. Ingredients: ${ingredients.join(", ")}. Please only output the recipe as HTML text elements (p, h1, br, etc.)`,
                },
            ],
            model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
        }).then((response) => {
            setRecipe(response.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^```html\n?/, "").replace(/```$/, "").replace(/\\n/g, "\n"))
        })
        else console.log("not enough ingredients")
    }

    return (
        <main
            className="w-1/1 min-h-svh flex flex-col items-center justify-center *:shrink-0"
        >
            <h1
                className="text-3xl font-semibold mb-8"
            >
                What are we cooking?
            </h1>
            <input
                className="w-1/2 h-12 bg-gray-200 rounded-full pl-8 pr-8 placeholder-gray-600"
                onKeyDown={handleKeyDown}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Add an ingredient"
            ></input>
            {ingredients.length > 0 && <Ingredients ingredients={ingredients} onRemove={handleRemoveIngredient} />}
            <button
                className="bg-orange-400 mt-8 mb-12 h-10 rounded-full pl-8 pr-8 text-white font-semibold hover:cursor-pointer hover:bg-orange-300"
                onClick={handleClick}
            >
                Create recipe
            </button>
            <div 
            className="mb-12"
                dangerouslySetInnerHTML={{ __html: recipe }} 
            />
        </main>
    )
}

export default IngredientsInput