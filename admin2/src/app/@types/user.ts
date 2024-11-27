export enum UserRoles {
    ADMIN = "admin",
    MEMBER = "member",
    DEVELOPER = "developer"
  }
  
export interface UserFormData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRoles;
    vendor_id: string;
  }