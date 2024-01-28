import { Announcement } from "./Announcement.js";
import { AnnouncementRequest } from "./AnnouncementRequest.js";
import { Reservation } from "./Reservation.js";
import { ReservationRequest } from "./ReservationRequest.js";

export enum Entity { Announcement = 'Announcement', Reservation = 'Reservation'};
export type RequestType = AnnouncementRequest | ReservationRequest;
export type ResponseType = Announcement | Reservation;