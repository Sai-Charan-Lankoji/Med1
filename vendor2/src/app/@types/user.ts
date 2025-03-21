export enum UserRoles {
  ADMIN = "admin",
  MEMBER = "member",
  DEVELOPER = "developer",
}

export interface UserFormData {
  id?: string; 
  first_name: string;
  last_name: string;
  email: string;
  password?: string; 
  role: UserRoles;
  vendor_id?: string; 
}


export interface UserResponseData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRoles;
  deleted_at: string | null;
  
}