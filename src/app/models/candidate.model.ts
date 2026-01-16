
export interface Party {
  id: number;
  name?: string;
}

export interface election{
  id: number;
  Name?: string;
}



export class Candidate {
  firstName: string;
  middleName: string;
  lastName: string;
  occupation: string;
  income: number;
  election: election;
  party: Party;
  candidatePhoto: string;
  incomeProof: string;

  constructor(
    firstName: string = '',
    middleName: string = '',
    lastName: string = '',
    occupation: string = '',
    income: number = 0,
   election: election = { id: 0 },
    party: Party = { id: 0 },
    candidatePhoto: string = '',
    incomeProof: string = ''
    
  ) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.occupation = occupation;
    this.income = income;
    this.election = election;
    this.party = party;
    this.candidatePhoto = candidatePhoto;
    this.incomeProof = incomeProof;
  }
}
