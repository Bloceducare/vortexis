export interface Country {
    name: string;
  }
  
  export const getCountries = async (): Promise<Country[]> => {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
    const data = await response.json();
  
    return data
      .map((country: any) => ({
        name: country.name.common,
      }))
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));
  };
  