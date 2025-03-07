export interface Annonce {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  location?: string;
  createdDate?: Date; // Fixed type
  status: string;
  user_id: number;
}
