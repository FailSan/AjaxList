export interface AnnouncementRequest {
    Title: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Typology: string;
    Category: string;
    BeginDate: string | null;
    EndDate: string | null;
    PublishedBeginDate: string | null;
    PublishedEndDate: string | null;
}