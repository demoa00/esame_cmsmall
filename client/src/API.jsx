const URL = 'http://localhost:3001/api';

////////////////////////
// API for images
////////////////////////

// Get images path
async function getImagesPath() {
    const response = await fetch(URL + `/images/path`, { credentials: 'include' });
    const fetched_images_path = await response.json();

    if (response.ok) {
        return fetched_images_path.map((i) => ({
            path: i.path
        }));
    } else {
        throw fetched_title;
    }
}

////////////////////////
// API for title
////////////////////////

// Get title
async function getTitle() {
    const response = await fetch(URL + `/title`);
    const fetched_title = await response.json();

    if (response.ok) {
        return fetched_title.title;
    } else {
        throw fetched_title;
    }
}

// Update title
async function updateTitle(title) {
    const response = await fetch(URL + `/title`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title }) // Conversion in JSON format
    });
    const new_title = await response.json();

    if (!response.ok) {
        throw result;
    }

    return new_title.new_title;
}

////////////////////////
// API for pages
////////////////////////

// Get all published pages
async function getAllPublishedPages() {
    const response = await fetch(URL + `/pages/published`);
    const fetched_pages = await response.json();

    if (response.ok) {
        return fetched_pages.map((p) => ({
            id: p.id,
            author_id: p.author_id,
            title: p.title,
            creation_date: p.creation_date,
            publication_date: p.publication_date ? p.publication_date : '',
            status: p.status,
            author_name: p.author_name
        }));
    } else {
        throw fetched_pages;
    }
}

// Get all created pages
async function getAllCreatedPages() {
    const response = await fetch(URL + `/pages/created`, { credentials: 'include' });
    const fetched_pages = await response.json();

    if (response.ok) {
        return fetched_pages.map((p) => ({
            id: p.id,
            author_id: p.author_id,
            title: p.title,
            creation_date: p.creation_date,
            publication_date: p.publication_date ? p.publication_date : '',
            status: p.status,
            author_name: p.author_name
        }));
    } else {
        throw fetched_pages;
    }
}

// Get page content
async function getPageDataById(id) {
    const response = await fetch(URL + `/pages/${id}`, { credentials: 'include' });
    const fetched_page = await response.json();

    if (response.ok) {
        let content = JSON.parse(fetched_page.content);

        const page = {
            id: fetched_page.id,
            author_id: fetched_page.author_id,
            title: fetched_page.title,
            creation_date: fetched_page.creation_date,
            publication_date: fetched_page.publication_date ? fetched_page.publication_date : '',
            status: fetched_page.status,
            author_name: fetched_page.author_name,
            content: content
        };

        return page;
    } else {
        throw fetched_film;
    }
}

// Add new page
async function addNewPage(new_page) {
    const response = await fetch(URL + `/pages/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_page) // Conversion in JSON format
    });
    const result = await response.json();

    if (!response.ok) {
        throw result;
    }
}

// Update a page
async function updatePage(new_page) {
    const response = await fetch(URL + `/pages/${new_page.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(new_page) // Conversion in JSON format
    });
    const result = await response.json();

    if (!response.ok) {
        throw result;
    }
}

// Delete a page
async function deletePage(id) {
    const response = await fetch(URL + `/pages/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    const result = await response.json();

    if (!response.ok) {
        throw result;
    }
}

////////////////////////
// API for users
////////////////////////

// Login
async function login(credentials) {
    const response = await fetch(URL + '/sessions', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials) // Conversion in JSON format
    });
    const result = await response.json();

    if (response.ok) {
        return result;
    } else {
        throw result.message;
    }
}

// Check whether the user is logged in or not
async function getUserInfo() {
    const response = await fetch(URL + '/sessions/current', {
        credentials: 'include'
    });
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;
    }
}

// Logout
async function logout() {
    await fetch(URL + '/sessions/current', {
        method: 'DELETE',
        credentials: 'include'
    });
}

// Get all users
async function getAllUsers() {
    const response = await fetch(URL + `/users`, { credentials: 'include' });
    const fetched_users = await response.json();

    if (response.ok) {
        return fetched_users.map((u) => ({
            id: u.id,
            name: u.name
        }));
    } else {
        throw fetched_users;
    }
}

const API = { getImagesPath, getTitle, updateTitle, getAllPublishedPages, getAllCreatedPages, getPageDataById, addNewPage, updatePage, deletePage, login, logout, getUserInfo, getAllUsers };

export default API;