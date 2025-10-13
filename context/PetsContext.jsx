import { createContext, useState, useContext } from 'react';
import { pets as demoPets } from '../assets/data/pets';

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

  // 🔴 SHTO KËTË
  function adoptPet(id) {
    setPets(prev =>
      prev.map(p =>
        String(p.id) === String(id) ? { ...p, available: false } : p
      )
    );
  }

  return (
    <PetsContext.Provider
      value={{ pets, setPets, addPet, getPetById, adoptPet }} // 🔴 sigurohu që adoptPet është këtu
    >
      {children}
    </PetsContext.Provider>
  );
}
