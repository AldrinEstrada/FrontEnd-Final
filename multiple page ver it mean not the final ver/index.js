// Fetch categories from API and populate the dropdown
fetch('https://opentdb.com/api_category.php')
    .then(response => response.json())
    .then(data => {
        let categories = data.trivia_categories;
        let categoryDropdown = document.getElementById('category');
        categories.sort((a, b) => a.name.localeCompare(b.name));
        categories.forEach(category => {
            let option = document.createElement('option');
            option.value = category.id;
            option.text = category.name;
            categoryDropdown.add(option);
        });
    });

// Add event listener to Start button
document.getElementById('start').addEventListener('click', () => {
    // Save selected category and difficulty
    let selectedCategory = document.getElementById('category').value;
    let selectedDifficulty = document.getElementById('difficulty').value;
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('selectedDifficulty', selectedDifficulty);
    
    // Navigate to quiz page
    window.location.href = "quiz.html";
});
