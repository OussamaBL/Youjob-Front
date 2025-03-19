import {Annonce} from "./annonce.model";
import {Responder} from "./responder.model";

export interface Consultation {
  id:number;
  annonce: Annonce;
  responder: Responder;
  responseDate: string;
  message: string;
  accepted?: boolean | null;
}
