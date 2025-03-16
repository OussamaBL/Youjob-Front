import { User } from "../models/User.model";

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
  }
}
