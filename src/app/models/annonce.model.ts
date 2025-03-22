import { User } from "../models/User.model";
import {Project} from "./project.model";

export class Annonce {
  id!: number;
  title!: string;
  description!: string;
  category!: string;
  price!: number;
  location!: string;
  createdDate!: string;
  status!: string;
  createdBy!: User;
  project!: Project;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.price = data.price;
    this.location = data.location;
    this.createdDate = data.createdDate;
    this.status = data.status;

    this.createdBy = new User(data.createdBy);
    this.project = data.project ? {
      id: data.project.id,
      confirmedDate: data.project.confirmedDate || null,
      dateComplete: data.project.dateComplete || null,
      progress: data.project.progress,
      price: data.project.price,
      accepted: data.project.accepted ?? null
    } : {
      id: "",
      confirmedDate: null,
      dateComplete: null,
      progress: "",
      price: 0,
      accepted: null
    };
  }
}
