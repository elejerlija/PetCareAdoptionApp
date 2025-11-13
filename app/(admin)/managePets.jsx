import { db } from "../../firebase";
function AddEditPetModal({ visible, onClose, onSubmit, initial }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [species, setSpecies] = useState(initial?.species ?? "");
  const [age, setAge] = useState(initial?.age ? String(initial.age) : "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    if (visible) {
      setName(initial?.name ?? "");
      setSpecies(initial?.species ?? "");
      setAge(initial?.age ? String(initial.age) : "");
      setImageUrl(initial?.imageUrl ?? "");
      setDescription(initial?.description ?? "");
    }
  }, [visible, initial]);

  const submit = async () => {
    if (!name.trim()) return Alert.alert("Validation", "Please enter a name.");
    setLoading(true);
    const payload = {
      name: name.trim(),
      species: species.trim() || "Unknown",
      age: age ? Number(age) : null,
      imageUrl: imageUrl.trim() || null,
      description: description.trim() || "",
    };
    try {
      await onSubmit(payload);
      onClose();
    } catch (e) {
      Alert.alert("Error", e.message || "Could not save pet.");
    } finally {
      setLoading(false);
    }
  };}
