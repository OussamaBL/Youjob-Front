export class User {
  id: number;
  username: string;
  email: string;
  name: string;
  phoneNumber: string;
  role: string;
  address?: string;
  vatNumber?: number;
  skills?: string;
  rating?: number;

  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.name = data.name;
    this.email = data.email;
    this.phoneNumber = data.phoneNumber;
    this.address = data.address;
    this.role = data.role;

    // Handle optional fields based on role
    if (data.role === 'BUSINESS') {
      this.vatNumber = data.vatNumber;
    } else if (data.role === 'HANDYMAN') {
      this.skills = data.skills || [];
      this.rating = data.rating || 0;
    }
  }
}
