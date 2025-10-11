import { createContext, useState, useContext } from 'react';
import { pets as demoPets } from '../../assets/data/pets';
import { makeId } from '../../assets/utils/id';

const PetsContext = createContext();

export function usePets() {
  return useContext(PetsContext);
}

export function PetsProvider({ children }) {
  const [pets, setPets] = useState(demoPets);

  function addPet(pet) {
    const newPet = { ...pet, id: makeId() };
    setPets(prev => [...prev, newPet]);
  }

  function getPetById(id) {
    return pets.find(p => p.id === id);
  }

  return (
    <PetsContext.Provider value={{ pets, setPets, addPet, getPetById }}>
      {children}
    </PetsContext.Provider>
  );
}
