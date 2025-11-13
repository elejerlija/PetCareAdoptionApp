// context/PetsContext.js
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";

const PetsContext = createContext();

export function PetsProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // favorites per-user
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // 1) Auth listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });

    return unsubAuth;
  }, []);

  // 2) Pets listener (vetëm kur ka user)
  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setPets([]);
      setLoadingPets(false);
      return;
    }

    setLoadingPets(true);

    const colRef = collection(db, "pets");

    const unsubPets = onSnapshot(
      colRef,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setPets(list);
        setLoadingPets(false);
      },
      (error) => {
        console.log("🔥 pets error:", error);
        setPets([]);
        setLoadingPets(false);
      }
    );

    return unsubPets;
  }, [authReady, user]);

  // 3) Favorites listener per user
  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setFavoriteIds([]);
      setLoadingFavorites(false);
      return;
    }

    setLoadingFavorites(true);

    const favCol = collection(db, "users", user.uid, "favorites");

    const unsubFavs = onSnapshot(
      favCol,
      (snapshot) => {
        const ids = snapshot.docs.map((d) => d.id); // id e dokumentit = petId
        setFavoriteIds(ids);
        setLoadingFavorites(false);
      },
      (error) => {
        console.log("🔥 favorites error:", error);
        setFavoriteIds([]);
        setLoadingFavorites(false);
      }
    );

    return unsubFavs;
  }, [authReady, user]);

  // helpers
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

  // ✅ Toggle favorite PER USER
  const toggleFavorite = async (petId) => {
    if (!user) return;

    const favRef = doc(db, "users", user.uid, "favorites", petId);

    const isFav = favoriteIds.includes(petId);

    try {
      if (isFav) {
        await deleteDoc(favRef);
      } else {
        await setDoc(favRef, {
          petId,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const isFavorite = (petId) => favoriteIds.includes(petId);

  return (
    <PetsContext.Provider
      value={{
        pets,
        loadingPets,
        favoriteIds,
        loadingFavorites,
        isFavorite,
        getPetById,
        getCityOfPet,
        adoptPet,
        toggleFavorite,
      }}
    >
      {children}
    </PetsContext.Provider>
  );
}

export const usePets = () => useContext(PetsContext);
