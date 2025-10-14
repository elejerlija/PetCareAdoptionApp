import { createContext, useState, useContext } from 'react';
import { pets as demoPets } from '../assets/data/pets';
import { stores } from '../assets/data/stores';

const PetsContext = createContext();

export function usePets() {
  return useContext(PetsContext);
}

export function PetsProvider({ children }) {
  const initialPets = Array.isArray(demoPets) ? demoPets : [];
  const [pets, setPets] = useState(
    initialPets.map(p => ({
      available: true,
      ...p,
      id: String(p.id ?? Date.now() + Math.random()),
    }))
  );

  function getCityOfPet(petId) {
    const pet = getPetById(petId);          // find the pet by id
    if (!pet) return null;                  // return null if pet not found

    const store = stores.find(s => s.id === pet.storeId); // find the store for this pet
    return store?.city;             // return city or null if store not found
  }

  function addPet(pet) {
    const newPet = {
      available: true,
      ...pet,
      id: String(pet.id ?? Date.now()),
    };
    setPets(prev => [...prev, newPet]);
  }

  function getPetById(id) {
    return pets.find(p => String(p.id) === String(id));
  }
  const getPetsForStore = (storeId) => {
    return pets.filter(p => p.storeId === storeId);
  };
  function adoptPet(id) {
    setPets(prev =>
      prev.map(p =>
        String(p.id) === String(id) ? { ...p, available: false } : p
      )
    );
  }

  return (
    <PetsContext.Provider
      value={{ pets, setPets, addPet, getPetById, adoptPet, getCityOfPet, getPetsForStore, stores }} 
    >
      {children}
    </PetsContext.Provider>
  );
}
