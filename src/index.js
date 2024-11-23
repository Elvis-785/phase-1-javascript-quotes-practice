document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.getElementById('quote-list');
    const quoteForm = document.getElementById('new-quote-form');

    // Fetch and display quotes
    function fetchQuotes() {
        fetch('http://localhost:3000/quotes?_embed=likes')
            .then(response => response.json())
            .then(data => {
                quoteList.innerHTML = '';
                data.forEach(quote => renderQuote(quote));
            });
    }

    // Render a single quote
    function renderQuote(quote) {
        const li = document.createElement('li');
        li.classList.add('quote-card');
        li.innerHTML = `
            <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn btn-success'>Likes: <span>${quote.likes.length}</span></button>
                <button class='btn btn-danger'>Delete</button>
            </blockquote>
        `;

        // Delete quote
        const deleteButton = li.querySelector('.btn-danger');
        deleteButton.addEventListener('click', () => {
            fetch(`http://localhost:3000/quotes/${quote.id}`, {
                method: 'DELETE'
            })
            .then(() => li.remove());
        });

        // Like quote
        const likeButton = li.querySelector('.btn-success');
        likeButton.addEventListener('click', () => {
            fetch('http://localhost:3000/likes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quoteId: quote.id, createdAt: Date.now() })
            })
            .then(() => {
                const span = likeButton.querySelector('span');
                span.textContent = parseInt(span.textContent) + 1;
            });
        });

        quoteList.appendChild(li);
    }

    // Handle form submission
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newQuote = {
            quote: e.target.quote.value,
            author: e.target.author.value
        };

        fetch('http://localhost:3000/quotes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newQuote)
        })
        .then(response => response.json())
        .then(quote => {
            quote.likes = [];
            renderQuote(quote);
            quoteForm.reset();
        });
    });

    fetchQuotes();
});
