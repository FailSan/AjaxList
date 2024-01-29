import { Announcement, Slot } from "./Announcement.js";
import { AnnouncementRequest } from "./AnnouncementRequest.js";
import { ReservationRequest } from "./ReservationRequest.js";

export enum Entity { Announcement = 'Announcement', Reservation = 'Reservation'};
export type RequestType = AnnouncementRequest | ReservationRequest;
export type ResponseType = Announcement | Slot;