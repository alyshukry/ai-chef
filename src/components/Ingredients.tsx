import { ReactElement } from "react";

interface Props {
    ingredients: string[]
    onRemove: (ingredient: string) => void
}

function Ingredients({ ingredients, onRemove }: Props): ReactElement {
    function handleClick(event: React.MouseEvent<HTMLLIElement>, ingredient: string) {
        onRemove(ingredient)
    }

    return (
        <ul
            className="flex flex-row flex-wrap items-center justify-center gap-4 max-w-1/2 mt-8"
        >
            {ingredients.map((ingredient, i) => (
                <li
                    key={i}
                    className="bg-gray-100 text-gray-600 pl-6 pr-6 pt-2 pb-2 rounded-full hover:cursor-pointer"
                    onClick={(e) => handleClick(e, ingredient)}
                >
                    {ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
                </li>
            ))}
        </ul>
    )
}

export default Ingredients