
import React, { createContext, useContext, useEffect, useState } from "react";
import { query, where } from "firebase/firestore";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";


import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";


const PetsContext = createContext();

export function PetsProvider({ children }) {
  
  const [pets, setPets] = useState([]);
  const [stores, setStores] = useState([]);

  const [loadingPets, setLoadingPets] = useState(true);

  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [requests, setRequests] = useState([]);
 
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });

    return unsubAuth;
  }, []);

  
  useEffect(() => {
    const unsubStores = onSnapshot(collection(db, "stores"), (snapshot) => {
      const list = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,          
          logoUrl: data.logo ? `/storeImages/${data.logo}` : null,
        };
      });

      setStores(list);
    });

    return unsubStores;
  }, []);

 
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
            imageUrl: data.imageUrl ?? null,
            image:data.image ?? null,
            
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


  
  useEffect(() => {
    if (!user) {
      setRequests([]);
      return;
    }

    const q = query(
    collection(db, "adoptionRequests"),
    where("userId", "==", user.uid)
  );

    const unsub = onSnapshot(q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setRequests(list);
      }
    );

    return unsub;
  }, [user]);

 
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

 
  const getAdoptionStatus = (petId) => {
    if (!user) return null;

    const req = requests.find(
      (r) => r.petId === petId && r.userId === user.uid
    );

    return req?.status ?? null;
  };

  
const adoptPet = async (id) => {
  if (!user) throw new Error("User not logged in");

  await addDoc(collection(db, "adoptionRequests"), {
    petId: id,
    userId: user.uid,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};

  
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
        stores,

        
        loadingPets,
        favoriteIds,
        loadingFavorites,

        
        isFavorite,
        toggleFavorite,

       
        getPetById,
        getCityOfPet,
        getPetsForStore,
        getAdoptionStatus,

        
        adoptPet,
      }}
    >
      {children}
    </PetsContext.Provider>
  );
}

export const usePets = () => useContext(PetsContext);
