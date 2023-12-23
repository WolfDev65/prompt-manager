"use client";

import React, { useState, useEffect, useRef } from 'react';

const PromptPanel = () => {

    const fileInputRef = useRef(null);

    // Initialize states with empty values
    const [prompts, setPrompts] = useState([]);
    const [categories, setCategories] = useState(['Resume', 'Development', 'Work']);

    const [prompt, setPrompt] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [editIndex, setEditIndex] = useState(-1);

    const [filterCategory, setFilterCategory] = useState(''); // New state for filter category

    const handleDeletePrompt = (indexToDelete) => {
        const updatedPrompts = prompts.filter((_, index) => index !== indexToDelete);
        setPrompts(updatedPrompts);
    };

    const clearData = () => {
        // Clear states
        setPrompts([]);
        setCategories(['General', 'Personal', 'Work']);

        // Remove items from localStorage
        localStorage.removeItem('prompts');
        localStorage.removeItem('categories');
    };

    // Load initial state from localStorage or set default values
    useEffect(() => {
        const storedPrompts = JSON.parse(localStorage.getItem('prompts')) || [];
        const storedCategories = JSON.parse(localStorage.getItem('categories')) || ['Resume', 'Development', 'Work'];

        setPrompts(storedPrompts);
        setCategories(storedCategories);
    }, []);


    // Save prompts and categories to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('prompts', JSON.stringify(prompts));
    }, [prompts]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (prompt && category) {
            const newPrompt = { text: prompt, category };
            if (editIndex >= 0) {
                // Update existing prompt
                const updatedPrompts = [...prompts];
                updatedPrompts[editIndex] = newPrompt;
                setPrompts(updatedPrompts);
                setEditIndex(-1);
            } else {
                // Add new prompt
                setPrompts([...prompts, newPrompt]);
            }
            setPrompt('');
            setCategory('');
        }
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const handleAddCategory = () => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setNewCategory('');
        }
    };

    const handleDeleteCategory = (categoryToDelete) => {
        setCategories(categories.filter(cat => cat !== categoryToDelete));
        if (category === categoryToDelete) {
            setCategory('');
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleEdit = (index) => {
        setPrompt(prompts[index].text);
        setCategory(prompts[index].category);
        setEditIndex(index);
    };

    const filteredPrompts = prompts
        .filter(p => p.text.toLowerCase().includes(searchQuery.toLowerCase()))
        .filter(p => filterCategory === '' || p.category === filterCategory); // Modified filter logic


    const exportData = () => {
        const data = {
            prompts: prompts,
            categories: categories
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'prompts-data.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const importData = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);
                setPrompts(data.prompts || []);
                setCategories(data.categories || ['General', 'Personal', 'Work']);
            };
            reader.readAsText(file);
        }
    };


    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-start items-center mb-4">
                <button onClick={exportData} className="bg-purple-500 text-white p-2">Export Data</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={importData}
                    className="hidden"
                />
                <button onClick={clearData} className="bg-red-500 text-white p-2">Clear Data</button>
                <button onClick={() => fileInputRef.current.click()} className="bg-orange-500 text-white p-2">Import Data</button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 mb-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="border p-2 rounded-md flex-grow text-black"
                    placeholder="Enter prompt"
                />
                <select
                    value={category}
                    onChange={handleCategoryChange}
                    className="border p-2 rounded-md text-black"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
                <button type="submit" className="bg-blue-500 rounded-md text-white p-2">
                    {editIndex >= 0 ? 'Update' : 'Save'}
                </button>
            </form>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="border p-2 rounded-md flex-grow text-black"
                    placeholder="New Category"
                />
                <button onClick={handleAddCategory} className="bg-green-500 text-white p-2 rounded-md">Add Category</button>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border p-2 w-auto text-black rounded-md"
                    placeholder="Search prompts"
                />

                <div >
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="border p-2 text-black rounded-md"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap mb-4">
                {categories.map((cat, index) => (
                    <div key={index} className="mr-2 mb-2 flex items-center">
                        <span className="text-white mr-2">{cat}</span>
                        <button onClick={() => handleDeleteCategory(cat)} className="bg-red-500 rounded-md text-white p-1">Delete</button>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrompts.map((p, index) => (
                    <div key={index} className="p-2 border flex flex-col rounded-md">
                        <span className="font-bold">Prompt:</span>
                        <p className="mb-2">{p.text}</p>
                        <span className="font-bold">Category:</span>
                        <p className="mb-2">{p.category}</p>
                        <div className="flex justify-start items-center">
                            <button onClick={() => handleEdit(index)} className="bg-green-500 text-white px-3 mr-2">Edit</button>
                            <button onClick={() => handleDeletePrompt(index)} className="bg-red-500 text-white px-3 ml-2">Delete</button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default PromptPanel;
