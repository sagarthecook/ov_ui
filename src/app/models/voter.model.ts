export interface Voter {
  id: string;
  firstName: string;
  lastName: string;
  emailId: string;
  phoneNumber: string;
  dateOfBirth: string;
  aadharNumber: string;
  status: VoterStatus;
}

export enum VoterStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface VoterSearchRequest {
  searchType: 'email' | 'phone';
  searchValue: string;
}

export interface VoterListResponse {
  voters: Voter[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}