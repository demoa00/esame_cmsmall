'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('./database/db_cms_mall.sqlite', (err) => { if (err) throw err; });

// Get title
exports.getTitle = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM title WHERE id = 1";

        db.get(sql, [], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            if (row != undefined) {
                resolve({ title: row.title });
            } else {
                reject(0);
            }
        });
    });
}

// Update title
exports.updateTitle = (title) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE title SET title = ? WHERE id = 1";

        db.run(sql, [title], function (err) {
            if (err) {
                reject(err);
                return;
            }

            if (this.changes == 0) {
                reject(0);
            } else {
                resolve({ new_title: title });
            }
        })
    });
}