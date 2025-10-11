import { createContext, useState, useContext } from 'react';
import { pets as demoPets } from '../../assets/data/pets';

const PetsContext = createContext();

export function usePets() {
  return useContext(PetsContext);
}

export function PetsProvider({ children }) {
  const initialPets = Array.isArray(demoPets) ? demoPets : []; 
const [pets, setPets] = useState(initialPets);


  function addPet(pet) {
    const newPet = { ...pet, id: Date.now().toString() };
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
