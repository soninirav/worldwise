import { useCallback } from "react";
import { createContext, useContext, useEffect, useReducer } from "react";

const CitiesContext = createContext();

const BASE_URL = "http://localhost:8000";

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        currentCity: {},
        cities: state.cities.filter((city) => city.id != action.payload),
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown");
  }
};

const CitiesProvider = ({ children }) => {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoadinng] = useState(true);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
        // setCities(data);
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error ot load state.!!",
        });
        // alert("There was an error to load state. !!");
      }
    };
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function (id) {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        // setIsLoadinng(true)
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data });
        // setCurrentCity(data);
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error ot getting city.!!",
        });
      }
    },
    [currentCity.id]
  );

  const createCity = async (newCity) => {
    dispatch({ type: "loading" });
    try {
      // setIsLoadinng(true);
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // setCities((cities) => [...cities, data]);
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error ot creating city state.!!",
      });
    }
  };

  const deleteCity = async (id) => {
    dispatch({ type: "loading" });
    try {
      // setIsLoadinng(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      // setCities((cities) => cities.filter((city) => city.id != id));
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error ot load state.!!",
      });
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities context was used outside the cities provider.");
  return context;
};

export { CitiesProvider, useCities };
