
export interface Project {
  id: number;
  confirmedDate: string | null;
  dateComplete: string | null;
  progress: string;
  price: number;
  accepted?: boolean | null;
}
