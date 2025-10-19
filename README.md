# 🐾 PetCare Adoption App

**Grupi:** 8 
**Projekti:** PetCare Adoption
**Lënda:** Programimi për Pajisje Mobile  

## Statusi i projektit
Faza I – Prototipi minimal (UI + navigim + listë bazë).

## Anëtaret e grupit

- Elë Jerlija
- Elona Kuqi
- Elsa Krasniqi
- Erinë Mujku
- Fahrije Gjokiqi
- Florjetë Kuka

## Përshkrimi i shkurtër
Aplikacion mobil për kërkim dhe adoptim të kafshëve shtëpiake. Përdoruesit shfletojnë listën e kafshëve, hapin detajet dhe dërgojnë kërkesë për adoptim. Qëllimi është të lehtësohet lidhja mes strehimoreve dhe adoptuesve përmes një UI të thjeshtë dhe të qartë.


## Ekranet (Faza I)
- Home – Përshkrim i shkurtër rreth aplikacionit.
- List – Shfaqen kafshë statike (emri, mosha, qyteti, statusi) dhe butoni “+ Add Pet” për shtimin e kafshëve (funksionalitet demonstrues).
- Çdo kafshë paraqitet si Card; duke hapur card-in shfaqen detaje shtesë dhe butoni “Adopt”.
- Me klikimin e butonit "Adopt" statusi i kafshës ndryshon nga Available në Not Available.
- Profile – Shfaq të dhënat e përdoruesit dhe formën për përditësimin e tyre (bazike).
- Map – Hartë me lokacionet e strehimoreve.
- Login/Signup - Vetëm screens të cilave më vonë do ti jipet funksionalitet.

## Navigimi
Përdoret expo-router (file-based routing). Ekranet vendosen në `app/`, dhe rrugët krijohen sipas emrave të skedarëve.


## Komponentet 
- InputField.jsx – Komponent i personalizuar për fushat hyrëse në formularë.
Pranon props si label, placeholder, value dhe onChangeText.
Siguron që fusha të ketë një hapësirë të rregullt midis elementeve.
Përdoret në ProfileScreen, AddPet, dhe forma të tjera për mbledhje të të dhënave.

- PrimaryButton.jsx – Buton i cili siguron pamje të njëtrajtshme për butonat në gjithë aplikacionin (p.sh. “Save”, “Add Pet”, “Adopt”).
Pranon props si title dhe onPress.
Është i stilizuar me ngjyrën tematike të aplikacionit (#83BAC9).
Siguron që përdoruesi të ketë feedback vizual kur butoni është aktiv, i shtypur ose i bllokuar.

- PetCard.jsx – Komponent që paraqet informacionin e një kafshe individuale në listë.
Përdoret në ekranet Home dhe List për të shfaqur kafshët që janë në dispozicion për adoptim.
Pranon props:

pet – objekti që përmban të dhënat e kafshës (emri, mosha, qyteti, imazhi, statusi).

onPress – funksioni që thirret kur përdoruesi shtyp kartën (zakonisht për të hapur detajet e kafshës).
Merr qytetin e kafshës përmes context-it (usePets) duke përdorur funksionin getCityOfPet.
Kontrollon nëse pet.image është uri apo lokal për të vendosur imazhin korrekt.
Përfshin dizajn të lehtë me hije (shadow / elevation) dhe rrethime të buta (borderRadius: 12).
