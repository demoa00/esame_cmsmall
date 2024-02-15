'use strict';

const sqlite = require('sqlite3');

const db = new sqlite.Database('./database/db_cms_mall.sqlite', (err) => { if (err) throw err; });

// Get images path
exports.getImagesPath = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM images";

        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            if (rows != undefined) {
                const images_path = rows.map((i) => ({
                    path: i.path
                }));

                resolve(images_path);
            } else {
                reject(0);
            }
        });
    });
}