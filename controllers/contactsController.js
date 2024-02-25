// const contactsRepo = require('../src/contactsSQLiteRepository');
const contactsRepo = require('../src/contactsFileRepository');
const { validationResult } = require('express-validator');
const Contact = require('../src/Contact');




/* GET contacts listing. */
exports.contacts_list = function (req, res, next) {
    const data = contactsRepo.findAll();
    res.render('contacts', { title: 'Express Contacts', contacts: data });
};

/* GET contacts add . */
exports.contacts_create_get = function (req, res, next) {
    res.render('contacts_add', { title: 'Add a Contact' });
};

/* POST contacts add . */
exports.contacts_create_post =
    function (req, res, next) {
        // console.log(req.body);
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.render('contacts_add', { title: 'Add a Contact', msg: result.array() });
        } else {
            const newContact = new Contact('', req.body.firstName, req.body.lastName, req.body.emailAdd, 
            req.body.contactNotes);
            contactsRepo.create({
                firstName: req.body.firstName.trim(), lastName: req.body.lastName.trim(),
                emailAdd: req.body.emailAdd.trim(), contactNotes: req.body.contactNotes.trim(),
                // lastModifiedTime: req.body.lastModifiedTime
            });
            res.redirect('/contacts');
        }

    };

/* GET a contact */
exports.contacts_detail = function (req, res, next) {
    const contact = contactsRepo.findById(req.params.uuid);
    if (contact) {
        res.render('contact', { title: 'Your Contact', contact: contact });
    } else {
        res.redirect('/contacts');
    }
};

/* GET contacts delete . */
exports.contacts_delete_get = function (req, res, next) {
    const contact = contactsRepo.findById(req.params.uuid);
    res.render('contacts_delete', { title: 'Delete a Contact', contact: contact });
};

/* POST contacts delete . */
exports.contacts_delete_post = function (req, res, next) {
    contactsRepo.deleteById(req.params.uuid);
    res.redirect('/contacts')
};

/* GET contacts edit  */
exports.contacts_edit_get = function (req, res, next) {
    const contact = contactsRepo.findById(req.params.uuid);
    res.render('contacts_edit', { title: 'Edit Contact', contact: contact })
};

/* POST contacts edit . */
exports.contact_edit_post = function (req, res, next) {
    // console.log(req.body);
    const result =  validationResult(req);
    if (!result.isEmpty()) {
        const contact = contactsRepo.findById(req.params.uuid);
        res.render('contacts_edit', { title: 'Edit a Contact', msg : result.array(), contact: contact });
        // const contact = contactsRepo.findById(req.params.uuid);
        // res.render('contacts_add', { title: 'Edit Contact', msg: 'fistName cannot be blank!', contact: contact });
    } else {
        const updateContact = new Contact(req.params.uuid, req.body.firstName, 
            req.body.lastName, req.body.emailAdd,
            req.body.contactNotes, req.body.lastModifiedTime);
        contactsRepo.update(updateContact);
        res.redirect('/contacts');
    }

};


