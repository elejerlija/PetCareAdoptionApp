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
    const[errors,setErrors]=useState({});

    const validate = ()=> {
        let valid=true;
        let newErrors={};
        
        if(!form.name.trim()|| form.name.length<3){
            newErrors.name="Emri duhet te kete te pakten 3 shkronja.";
            valid=false;
        }
        if(!form.age.trim()|| isNaN(form.age)){
            newErrors.age="Mosha duhet te jete numer.";
            valid=false;
        }
        if(!form.desc.trim()||form.desc.length< 5){
            newErrors.desc="Pershkrimi duhet te kete te pakten 5 karaktere.";
            valid=false;
        }
        setErrors(newErrors);
        return valid;
    };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add Pet Page</Text>
    </View>
  );
}
