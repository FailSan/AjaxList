export interface Contact {
    FirstName: string;
    LastName: string;
    Email: string;
    PhoneNumber: string;
}

export interface Location {
    Address: string;
    CivicNumber: string;
    Cap: number;
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
    BeginDate: string;
    EndDate: string;
    PublishDate: string | null;
    Announcer: Contact;
    Location: Location;
    Status: string;
}

export interface Offer extends Announcement {
    Start: string;
    End: string;
    Capacity: number;
    SaturdaysIncluded: boolean;
    HolidaysIncluded: boolean;
    Slots: Array<Slot>;
}

export interface Request extends Announcement {
    Responses: Array<Response>;
}

export interface Slot {
    OfferId: number;
    Id: number;
    Date: string;
    Start: string;
    End: string;
    Typology: string;
    Reservation: Reservation | null;
}

export interface Reservation {
    Id: number;
    ReservedBy: Contact;
}

export interface Response {
    Id: number;
    RespondedBy: Contact;
    RespondedAt: string;
}