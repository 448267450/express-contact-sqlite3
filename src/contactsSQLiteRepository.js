// const crypto = require('node:crypto');
// const fs = require('node:fs')
const path = require('node:path')
const Contact = require('./Contact')
const betterSqlite3 = require('better-sqlite3')

const db = new betterSqlite3(path.join(__dirname, '../data/contacts.sqlite'), { verbose: console.log });


const createStmt = db.prepare("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, emailAdd TEXT, contactNotes TEXT, lastModifiedTime TIMESTAMP)");
createStmt.run();

const currentDate = new Date();
const CST = new Date(currentDate.getTime() - 6 * 60 * 60 * 1000);
const formattedDate = CST.toISOString();



const repo = {
    findAll: () => {
        const stmt = db.prepare("SELECT * FROM contacts");
        const rows = stmt.all();
        let contacts = [];
        rows.forEach((row) => {
            const aContact = new Contact(row.id, row.firstName, row.lastName, row.emailAdd, row.contactNotes, row.lastModifiedTime);
            contacts.push(aContact);
        });
        return contacts;
    },
    findById: (uuid) => {
        const stmt = db.prepare("SELECT * FROM contacts WHERE id =?");
        const row = stmt.get(uuid);
        return new Contact(row.id, row.firstName, row.lastName, row.emailAdd, row.contactNotes, row.lastModifiedTime);

    },
    create: (contact) => {
        contact.lastModifiedTime = formattedDate;
        const stmt = db.prepare("INSERT INTO contacts VALUES (?, ?, ?, ?, ?, ?)");
        const info = stmt.run(contact.id, contact.firstName, contact.lastName, contact.emailAdd, contact.contactNotes,
            contact.lastModifiedTime);
        console.log(`Contact created id : ${info.lastInsertRowid}`);
    },
    deleteById: (uuid) => {
        const stmt = db.prepare("DELETE FROM contacts WHERE id =?");
        const info = stmt.run(uuid);
        console.log(`Rows affected: ${info.changes}`);
    },
    update: (contact) => {
        contact.lastModifiedTime = formattedDate;
        const stmt = db.prepare("UPDATE contacts SET firstName = ?, lastName = ?, emailAdd = ?, contactNotes = ?, lastModifiedTime = ? WHERE id = ?");
        const info = stmt.run(contact.firstName, contact.lastName, contact.emailAdd, contact.contactNotes, contact.lastModifiedTime, contact.id);
        console.log(`Rows affected: ${info.changes}`);
    },
};



module.exports = repo;