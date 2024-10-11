import { getCountries } from "@/app/_lib/data-service";
import { CountryInterface } from "../interface/interface";

// Let's imagine your colleague already built this component 😃
interface PropTypes {
  defaultCountry: string;
  name: string;
  id: string;
  className: string;
}

async function SelectCountry({
  defaultCountry,
  name,
  id,
  className,
}: PropTypes) {
  const countries = await getCountries();
  const flag =
    countries.find(
      (country: CountryInterface) => country.name === defaultCountry
    )?.flag ?? "";

  return (
    <select
      name={name}
      id={id}
      // Here we use a trick to encode BOTH the country name and the flag into the value. Then we split them up again later in the server action
      defaultValue={`${defaultCountry}%${flag}`}
      className={className}
    >
      <option value="">Select country...</option>
      {countries.map((c: CountryInterface) => (
        <option key={c.name} value={`${c.name}%${c.flag}`}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export default SelectCountry;
