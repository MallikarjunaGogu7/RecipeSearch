import React, { useState, useEffect } from "react";
import axios from "axios";


const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then((res) => res.json())
      .then((data) => setRecipes(data.recipes))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        fetchRecipes(query);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const fetchRecipes = async (searchQuery) => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/recipes/search?q=${searchQuery}`
      );
      setSuggestions(response.data.recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (recipe) => {
    setQuery(recipe.name);
    setSelectedRecipe(recipe);
    setSuggestions([]);
  };

  return (
    <>
    <div className="search-container">
      <h1 className="search-title">Recipe Search</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((recipe) => (
              <li
                key={recipe.id}
                onClick={() => handleSuggestionClick(recipe)}
                className="suggestion-item"
              >
                {recipe.name}
              </li>
            ))}
          </ul>
        )}
        {query && suggestions.length === 0 && (
          <p className="no-results">No recipes found.</p>
        )}
      </div>
      {selectedRecipe && (
        <div className="recipe-card-container">
          <div className="recipe-card">
          <h2 className="recipe-title">{selectedRecipe.name}</h2>
          <p className="recipe-cuisine">Cuisine: {selectedRecipe.cuisine}</p>
          <p className="recipe-ingredients">
            Ingredients: {selectedRecipe.ingredients.join(", ")}
          </p>
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.name}
            className="recipe-image"
          />
        </div>
        </div>
        
      )}
    </div>
    <div className="container">
      <h1 className="title">All Recipe List</h1>
      <div className="grid-container">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="card">
            <img src={recipe.image} alt={recipe.name} className="card-image" />
            <h2 className="card-title">{recipe.name}</h2>
            <p className="card-info">Prep Time: {recipe.prepTimeMinutes} min</p>
            <p className="card-info">Cook Time: {recipe.cookTimeMinutes} min</p>
            <p className="card-ingredients">
              {recipe.ingredients.length} ingredients
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default SearchBar;