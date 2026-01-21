interface VotingData {
  votingId: number;
  electionId: number;
  electionName: string;
  electionStartTime: string;
  electionEndTime: string;
  candidates: Candidate[];
}

interface Candidate {
  candidateId: number;
  candidateName: string;
  partyName: string;
  symbolUrl: string;
  photo: string;
}