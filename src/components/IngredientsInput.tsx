"use client"
import { useState } from "react"

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

        query({
            messages: [
                {
                    role: "user",
                    content: `Use the following ingredients and create a recipe. Ingredients: ${ingredients.join(", ")}. Please only output the recipe as HTML text elements (p, h1, br, etc.)`,
                },
            ],
            model: "deepseek-ai/DeepSeek-V3.2-Exp:novita",
        }).then((response) => {
            console.log(JSON.stringify(response))
            setRecipe(response.choices[0].message.content.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^```html\n?/, "").replace(/```$/, "").replace(/\\n/g, "\n"))
        })
    }

    return (
        <>
            <input
                onKeyDown={handleKeyDown}
                onChange={(e) => setInputVal(e.target.value)}
            ></input>
            <ul>
                {ingredients.map((ingredient) => (
                    <li key={ingredient}>{ingredient}</li>
                ))}
            </ul>
            <button
                className="bg-red-500"
                onClick={handleClick}
            >
                create recipe
            </button>
            <div dangerouslySetInnerHTML={{ __html: recipe }} />
        </>
    )
}

export default IngredientsInput