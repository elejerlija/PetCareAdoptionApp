import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const PetsContext = createContext();

export function PetsProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    const colRef = collection(db, "pets");

    const unsub = onSnapshot(colRef, (snapshot) => {
      const list = snapshot.docs.map((d) => ({
        id: d.id,       
        ...d.data(),    
      }));
      setPets(list);
      setLoadingPets(false);
    });

    return unsub;
  }, []);

  const getPetById = (id) => pets.find((p) => p.id === id);

  const getCityOfPet = (petId) =>
    pets.find((p) => p.id === petId)?.city || "Unknown";

  const adoptPet = async (id) => {
    try {
      const ref = doc(db, "pets", id);
      await updateDoc(ref, { available: false });
    } catch (err) {
      console.error("Error adopting pet:", err);
    }
  };

  return (
    <PetsContext.Provider
      value={{ pets, loadingPets, getPetById, getCityOfPet, adoptPet }}
    >
      {children}
    </PetsContext.Provider>
  );
}

export const usePets = () => useContext(PetsContext);
