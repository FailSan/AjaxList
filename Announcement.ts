export interface Contact {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
}

export interface Location {
    Address: string;
    CivicNumber: string;
    CAP: number;
    Municipality: string;
    Province: string;
    CompleteAddress: string;
}

export interface Announcement {
    Id: number;
    Title: string;
    Description: string;
    Typology: string;
    Category: string;
    BeginDate: Date;
    EndDate: Date;
    PublishDate: Date | null;
    Announcer: Contact;
    Location: Location;
}

export interface Offer extends Announcement {
    Slots: Array<Slot>;
}

export interface Request extends Announcement {
    Responses: Array<Response>;
}

export interface Slot {
    Id: number;
    Day: Date;
    StartTime: string;
    EndTime: string;
    ReservedBy: Contact | null;
}

export interface Response {
    Id: number;
    RespondedBy: Contact | null;
}