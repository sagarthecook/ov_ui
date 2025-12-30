export interface Country {
  id: number;
  name?: string;
}

export interface State {
  id: number;
  name?: string;
}

export interface City {
  id: number;
  name?: string;
}

export interface Officer {
  id: number;
  name?: string;
}

export class Election {
  electionName: string;
  electionDate: string;
  resultDate: string;
  formEndDate: string;
  country: Country;
  state: State;
  city: City;
  officer: Officer;

  constructor(
    electionName: string = '',
    electionDate: string = '',
    resultDate: string = '',
    formEndDate: string = '',
    country: Country = { id: 0 },
    state: State = { id: 0 },
    city: City = { id: 0 },
    officer: Officer = { id: 0 }
  ) {
    this.electionName = electionName;
    this.electionDate = electionDate;
    this.resultDate = resultDate;
    this.formEndDate = formEndDate;
    this.country = country;
    this.state = state;
    this.city = city;
    this.officer = officer;
  }
}