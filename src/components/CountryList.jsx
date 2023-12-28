import CountryItem from "./CountryItem";
import Message from "./Message";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import { useCities } from "../context/CitiesContext";

const CountryList = () => {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add Your first city by clicking on city on the map. !!" />
    );

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji }];
    } else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country, ind) => (
        <CountryItem key={ind} country={country} />
      ))}
    </ul>
  );
};

export default CountryList;
