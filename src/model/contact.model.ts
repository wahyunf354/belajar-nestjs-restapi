export class CreateContactRequest {
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
}

export class ContactResponse {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  username: string;
}

export class UpdateContactRequest {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  phone: string;
  username: string;
}

export class SearchContactRequest {
  name?: string;
  email?: string;
  phone?: string;
  size: number;
  page: number;
}
