import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
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
            newErrors.name="Name must  contain 4 at least characters !";
            valid=false;
        }
        if(!form.age.trim()|| isNaN(form.age)){
            newErrors.age="Age must be a number !";
            valid=false;
        }
        if(!form.desc.trim()||form.desc.length< 5){
            newErrors.desc="Description must contain at least 5 characters ! ";
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
        Alert.alert("Success","The pet has been added successfully !");
        router.push("/PetList");
    };
    const handleChange=(key,value)=>setForm({...form,[key]:value});

  return (
    <ScrollView contentContainerStyle={styles.container}>

    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Add Pet Page</Text>
    </View>

    <Text style={styles.title}>Add a new animal.</Text>

    <TextInput style={styles.input} placeholder="Pet name" value={form.name} 
    onChangeText={(v)=>handleChange("name",v)}/>
    {errors.name && <Text style={styles.error}>{errors.name}</Text>}

    <TextInput style={styles.input} placeholder="Type (dog,cat,...) "
    value={form.type} onChangeText={(v)=>handleChange("type",v)}/>
    {errors.type && <Text style={styles.error}>{errors.type}</Text>}

    <TextInput style={styles.input} placeholder="Age (number)" 
    value={form.age} keyboardType="numeric"
    onChangeText={(v)=>handleChange("age",v)}/>
    {errors.age && <Text style={styles.error}>{errors.age}</Text>}

    <TextInput style={[styles.input,{height:80}]}
    placeholder="Description" value={form.desc} multiline onChangeText={(v)=> handleChange("desc",v)}/>
    {errors.desc && <Text style={styles.error}>{errors.desc}</Text>}

    <TextInput style={styles.input} placeholder="Image URL (optional)"
    value={form.image} onChangeText={(v) => handleChange("image", v)}/>
   
    <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add Pet</Text>
    </TouchableOpacity> 
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 5,
  },
});