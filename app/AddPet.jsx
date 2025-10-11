import React, { use, useState } from 'react';
import { View, Text } from 'react-native';
import {useRouter} from "expo-router";
import { usePets } from './context/PetsContext';

export default function AddPet() {
    const router=useRouter();
    const { addPet }=usePets();

    const[form,setForm]=useState({
        name:"",
        type:"",
        age:"",
        desc:"",
        image:"",
    });
    const[erros,setErrors]=useState({});
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add Pet Page</Text>
    </View>
  );
}
