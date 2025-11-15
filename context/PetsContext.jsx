// context/PetsContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

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
  // ===============================
  // STATE
  // ===============================
  const [pets, setPets] = useState([]);
  const [stores, setStores] = useState([]);

  const [loadingPets, setLoadingPets] = useState(true);

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);

  // ===============================
  // AUTH LISTENER
  // ===============================
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });

    return unsubAuth;
  }, []);

  // ===============================
  // STORES LISTENER (PUBLIC)
  // ===============================
  useEffect(() => {
    const unsubStores = onSnapshot(collection(db, "stores"), (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,

          // For web static images
          logoUrl: data.logo ? `/storeImages/${data.logo}` : null,
        };
      });

      setStores(list);
    });

    return unsubStores;
  }, []);

  // ===============================
  // PETS LISTENER (requires auth)
  // ===============================
  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      setPets([]);
      setLoadingPets(false);
      return;
    }

    setLoadingPets(true);

    const unsubPets = onSnapshot(
      collection(db, "pets"),
      (snapshot) => {
        const list = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,

            // STATIC PET IMAGE URL
            imageUrl: data.image ? `/petImages/${data.image}` : null,
          };
        });

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

  // ===============================
  // FAVORITES LISTENER
  // ===============================
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
        const ids = snapshot.docs.map((d) => d.id);
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

  // ===============================
  // HELPERS FROM BOTH VERSIONS
  // ===============================
  const getPetById = (id) => pets.find((p) => p.id === id);

  const getCityOfPet = (petId) => {
    const pet = getPetById(petId);
    if (!pet) return null;

    const store = stores.find((s) => s.id === pet.storeId);
    return store?.city ?? "Unknown";
  };

  const getPetsForStore = (storeId) => {
    return pets.filter((p) => String(p.storeId) === String(storeId));
  };

  // ===============================
  // YOUR ADOPT PET
  // ===============================
  const adoptPet = async (id) => {
    await updateDoc(doc(db, "pets", id), {
      status: "pending",
      available: false,
      requestedAt: new Date().toISOString(),
    });
  };

  // ===============================
  // TOGGLE FAVORITE
  // ===============================
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

  // ===============================
  // PROVIDER RETURN
  // ===============================
  return (
    <PetsContext.Provider
      value={{
        pets,
        stores,

        // loadings
        loadingPets,
        favoriteIds,
        loadingFavorites,

        // favorites
        isFavorite,
        toggleFavorite,

        // getters
        getPetById,
        getCityOfPet,
        getPetsForStore,

        // actions
        adoptPet,
      }}
    >
      {children}
    </PetsContext.Provider>
  );
}

export const usePets = () => useContext(PetsContext);
