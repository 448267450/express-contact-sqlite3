class Contact{
    constructor(id, firstName, lastName, emailAdd, contactNotes, lastModifiedTime){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAdd = emailAdd;
        this.contactNotes = contactNotes;
        this.lastModifiedTime = lastModifiedTime;
    }
}

module.exports = Contact;