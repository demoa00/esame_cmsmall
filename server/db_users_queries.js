'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('./database/db_cms_mall.sqlite', (err) => { if (err) throw err; });

// Get user by id
exports.getUserById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE id=?';

        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve({ error: 'User not found!' });
            } else {
                const user = {
                    id: row.id,
                    username: row.username,
                    name: row.name,
                    admin: row.admin
                };

                resolve(user);
            }
        });
    });
}

// Get all users
exports.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name FROM users';

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.log(err)
                reject(err);
            } else {
                const users = rows.map((u) => ({
                    id: u.id,
                    name: u.name
                }));

                resolve(users);
            }
        });
    });
}

// Get user by username and password
exports.getUser = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE username=?';

        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const user = {
                    id: row.id,
                    username: row.username,
                    name: row.name,
                    admin: row.admin
                };

                const salt = row.salt;

                crypto.scrypt(password, salt, 64, (err, hashedPassword) => {
                    if (err) {
                        reject(err);
                    }

                    const passwordHex = Buffer.from(row.password, 'hex');

                    if (!crypto.timingSafeEqual(passwordHex, hashedPassword)) {
                        resolve(false);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
}