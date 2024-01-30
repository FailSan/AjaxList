export interface AnnouncementRequest {
    Title: string;
    FirstName: string;
    LastName: string;
    Email: string;
    Typology: string;
    Category: string;
    BeginDate: Date | null;
    EndDate: Date | null;
    PublishBeginDate: Date | null;
    PublishEndDate: Date | null;
}