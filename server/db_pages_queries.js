'use strict';

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

const db = new sqlite.Database('./database/db_cms_mall.sqlite', (err) => { if (err) throw err; });

// Get all published pages
exports.getAllPublishedPages = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.id, author_id, title, creation_date, publication_date, status, users.name FROM pages, users WHERE status = 'published' AND pages.author_id = users.id";

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const pages = rows.map((p) => ({
                id: p.id,
                author_id: p.author_id,
                title: p.title,
                creation_date: p.creation_date,
                publication_date: p.publication_date,
                status: p.status,
                author_name: p.name
            }));

            resolve(pages);
        })
    });
}

// Get all created pages
exports.getAllCreatedPages = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.id, author_id, title, creation_date, publication_date, status, users.name FROM pages, users WHERE pages.author_id = users.id";

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const pages = rows.map((p) => ({
                id: p.id,
                author_id: p.author_id,
                title: p.title,
                creation_date: p.creation_date,
                publication_date: p.publication_date,
                status: p.status,
                author_name: p.name
            }));

            resolve(pages);
        })
    });
}

// Get page content
exports.getPageDataById = (id, user) => {
    return new Promise((resolve, reject) => {
        let sql;

        if (user != undefined) { // Authenticated user
            sql = "SELECT pages.id, content, author_id, title, creation_date, publication_date, status, users.name FROM pages, users WHERE pages.id = ? AND pages.author_id = users.id";
        } else { // Not authenticated user
            sql = "SELECT pages.id, content, author_id, title, creation_date, publication_date, status, users.name FROM pages, users WHERE pages.id = ? AND pages.author_id = users.id AND pages.status = 'published'";
        }

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row != undefined) {
                const page = {
                    id: row.id,
                    content: row.content,
                    author_id: row.author_id,
                    title: row.title,
                    creation_date: row.creation_date,
                    publication_date: row.publication_date,
                    status: row.status,
                    author_name: row.name
                };

                resolve(page);
            } else {
                if (user != undefined) {
                    reject(0);
                } else {
                    reject(1);
                }
            }
        });
    });
}

// Add new page
exports.addNewPage = (new_page, author_id, content) => {
    return new Promise((resolve, reject) => {
        let status;

        if (new_page.publication_date === '') {
            status = 'draft';
        } else {
            if (dayjs(new_page.publication_date).diff(dayjs(), 'day') > 0) {
                status = 'scheduled';
            } else {
                status = 'published';
            }
        }

        const sql = "INSERT INTO pages(author_id, content, title, creation_date, publication_date, status) VALUES(?, ?, ?, DATE(?), DATE(?), ?);"

        db.run(sql, [author_id, JSON.stringify(content), new_page.title, dayjs().format('YYYY-MM-DD'), new_page.publication_date, status], function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({ last_id: this.lastID });
        })
    });
}

// Update a page
exports.updatePage = (new_page, user_id, admin, content) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id FROM users WHERE id = ?";

        db.get(sql, [new_page.author_id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row != undefined) {
                resolve(row.id);
            } else {
                reject(0);
                return;
            }
        });
    }).then((author_id) => {
        return new Promise((resolve, reject) => {
            let status;
            let sql;
            let parameters;

            if (new_page.publication_date === '') {
                status = 'draft';
            } else {
                if (dayjs(new_page.publication_date).diff(dayjs(), 'day') > 0) {
                    status = 'scheduled';
                } else {
                    status = 'published';
                }
            }

            if (admin === 0) { // Not admin user
                sql = "UPDATE pages SET content = ?, title = ?, publication_date = DATE(?), status = ? WHERE id = ? AND author_id = ?";
                parameters = [JSON.stringify(content), new_page.title, new_page.publication_date, status, new_page.id, user_id];
            } else if (admin === 1) { // Admin user
                sql = "UPDATE pages SET author_id = ?, content = ?, title = ?, publication_date = DATE(?), status = ? WHERE id = ?";
                parameters = [author_id, JSON.stringify(content), new_page.title, new_page.publication_date, status, new_page.id];
            }

            db.run(sql, parameters, function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                if (this.changes == 0) {
                    if (admin === 1) {
                        reject(1);
                    } else if (admin === 0) {
                        reject(2);
                    }
                } else {
                    resolve({ changes: this.changes });
                }
            })
        })
    });
};

// Delete a page
exports.deletePage = (id, user_id, admin) => {
    return new Promise((resolve, reject) => {
        let sql;
        let parameters;

        if (admin === 0) { // Not admin user
            sql = "DELETE FROM pages WHERE id = ? AND author_id = ?";
            parameters = [id, user_id];
        } else if (admin === 1) { // Admin user
            sql = "DELETE FROM pages WHERE id = ?";
            parameters = [id];
        }

        db.run(sql, parameters, function (err) {
            if (err) {
                reject(err);
                return;
            }

            if (this.changes == 0) {
                if (admin === 1) {
                    reject(0);
                } else if (admin === 0) {
                    reject(1);
                }
            } else {
                resolve({ changes: this.changes });
            }
        })
    });
}