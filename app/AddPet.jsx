import React, { use, useState } from 'react';
import { View, Text, Alert, Touchable, TouchableOpacity,ScrollView } from 'react-native';
import {useRouter} from "expo-router";
import { usePets } from './context/PetsContext';
import { ScrollView, TextInput } from 'react-native-web';

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

    const handleAdd=()=>{
        if(!validate())return;
        const newPet={
            name:form.name,
            type:form.type,
            age:Number(form.age),
            desc:form.desc,
            image:form.image
        };
        addPet(newPet);
        Alert.alert("Sukses","Kafsha u shtua me sukses!");
        router.push("/PetList");
    };
    const handleChange=(key,value)=>setForm({...form,[key]:value});

  return (
    <ScrollView contentContainerStyle={styles.container}>

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add Pet Page</Text>
    </View>

    <Text style={styles.title}>Shto nje kafshe te re.</Text>

    <TextInput style={styles.input} placeholder="Emri i kafshes" value={form.name} 
    onChangeText={(v)=>handleChange("name",v)}/>
    {errors.name && <Text style={styles.error}>{errors.name}</Text>}

    <TextInput style={styles.input} placeholder="Tipi (qen,mace,...)"
    value={form.type} onChangeText={(v)=>handleChange("type",v)}/>
    {errors.type && <Text style={styles.error}>{errors.type}</Text>}

    <TextInput style={styles.input} placeholder="Mosha (numer)" 
    value={form.age} keyboardType="numeric"
    onChangeText={(v)=>handleChange("age",v)}/>
    {errors.age && <Text style={styles.error}>{errors.age}</Text>}

    <TextInput style={[styles.input,{height:80}]}
    placeholder="Pershkrim" value={form.desc} multiline onChangeText={(v)=> handleChange("desc",v)}/>
    {errors.desc && <Text style={styles.error}>{errors.desc}</Text>}

    <TextInput style={styles.input} placeholder="Image URL (opsionale)"
    value={form.image} onChangeText={(v) => handleChange("image", v)}/>
   
    <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Shto Kafshen</Text>
    </TouchableOpacity> 
    </ScrollView>
  );
}
