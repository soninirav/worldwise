import CityItem from "./CityItem";
import Message from "./Message";
import styles from "./Citylist.module.css";
import Spinner from "./Spinner";
import { useCities } from "../context/CitiesContext";

const CityList = () => {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;
  if (!cities.length)
    return (
      <Message message="Add Your first city by clicking on city on the map. !!" />
    );
  return (
    <ul className={styles.cityList}>
      {cities.map((city, ind) => (
        <CityItem key={city.id} city={city} />
      ))}
    </ul>
  );
};

export default CityList;
