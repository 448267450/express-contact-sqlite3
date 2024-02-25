const path = require('path');
const Contact = require('./Contact');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(path.join(__dirname, '../data/contacts.sqlite'));
db.run("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, emailAdd TEXT, contactNotes TEXT, lastModifiedTime TIMESTAMP)");

const currentDate = new Date();
const CST = new Date(currentDate.getTime() - 6 * 60 * 60 * 1000);
const formattedDate = CST.toISOString();



const repo = {

    findAll: (x) => {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM contacts", (err, rows) => {
                if (err) {
                    reject(`read error: ${err.message}`);
                } else {
                    let contacts = [];
                    rows.forEach(row => {
                        const aContact = new Contact(row.id, row.firstName, row.lastName, row.emailAdd, row.contactNotes, row.lastModifiedTime);
                        contacts.push(aContact);
                    });
                    resolve(contacts);
                }
            });
        });
    },

    findById: (uuid) => {
        return new Promise((resolve, reject) => {
            db.get("SELECT * FROM contacts WHERE id =?", [uuid], (err, row) => {
                if (err) {
                    reject(`read error: ${err.message}`);
                } else {
                    let contact = new Contact(row.id, row.firstName, row.lastName, row.emailAdd, row.contactNotes, row.lastModifiedTime);
                    resolve(contact);
                }
            });
        });

    },

    create: (contact) => {
        return new Promise((resolve, reject) => {
            contact.lastModifiedTime = formattedDate;
            db.serialize(() => {
                db.run("INSERT INTO contacts VALUES (?, ?, ?, ?, ?, ?)", [contact.id, contact.firstName, contact.lastName, contact.emailAdd, contact.contactNotes, contact.lastModifiedTime], (err) => {
                    if(err) {
                        console.log(err.message);
                        reject(`error: ${err.message}`);
                    } else {
                        console.log("Contact created");
                        resolve();
                    }
                });
            });
        });
    },


    deleteById: (uuid) => {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM contacts WHERE id =?", [uuid], (err) => {
                if (err) {
                    console.log(err.message);
                    reject(`error: ${err.message}`);
                } else {
                    console.log('contact deleted');
                    resolve();
                }
            });
        });
    },

    update: (contact) => {
        contact.lastModifiedTime = formattedDate;
        return new Promise((resolve, reject) => {
            db.run("UPDATE contacts SET firstName = ?, lastName = ?, emailAdd = ?, contactNotes = ?, lastModifiedTime = ? WHERE id = ?",
                [contact.firstName, contact.lastName, contact.emailAdd, contact.contactNotes, contact.lastModifiedTime, contact.id],
                (err) => {
                    if (err) {
                        console.log(err.message);
                        reject(`error: ${err.message}`);
                    } else {
                        console.log('contact udpated');
                        resolve();
                    }

                });
        });
    }

};



module.exports = repo;