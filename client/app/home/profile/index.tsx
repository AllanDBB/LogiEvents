import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RoleIndicator from "@/components/RoleIndicator";
import MainPageContainer from "@/components/MainPageContainer";
import { pickImageFromGallery } from "@/utils/imageUpload";
import { updateUser } from "@/services/api";

export default function ProfileScreen() {
  // Hooks
  const router = useRouter();
  const { width } = useWindowDimensions();

  // State
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string | undefined>(undefined);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const isMobile = width < 768;

  // Load user data from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // Set initial values for form fields
          setName(parsedUser.firstName || "");
          setLastname(parsedUser.lastName || "");
          setEmail(parsedUser.email || "");
          setPhone(parsedUser.phoneNumber || "");
          setProfileImage(parsedUser.profileImage || undefined);
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadUserData();
  }, [router]);

  const defaultImage = { uri: "https://ui-avatars.com/api/?name=" + name + " " + lastname };

  // Event handlers
  const handleBack = () => router.back();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handlePickImage = async () => {
    try {
      const imageUri = await pickImageFromGallery();
      if (imageUri) {
        setProfileImage(imageUri);
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Error", "No se pudo seleccionar la imagen. Inténtalo de nuevo.");
    }
  };

  const handleSave = async () => {
    if (!name || !lastname || !email) {
      Alert.alert("Error", "Por favor complete todos los campos requeridos");
      return;
    }
  
    setIsSaving(true);
    
    let token = null;
    try {
      token = await AsyncStorage.getItem("token");
    } catch (error) {
      console.error("Error al obtener el token:", error);
    }


    try {
      const userId = user._id || user.id; 
      const success = await updateUser(userId, {
        firstName: name,
        lastName: lastname,
        email,
        phoneNumber: phone,
      },
      token);
      
      if (success) {
        setIsEditing(false);
        Alert.alert("Éxito", "Perfil actualizado correctamente");
      } else {
        Alert.alert("Error", "Un error ocurrió al actualizar el perfil");
      }
    } catch (err) {
      Alert.alert("Error", "Un error ocurrió al actualizar el perfil");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
   
    // Remove user data from AsyncStorage
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");

    const success = true; 

    if (success) {
      router.replace("/");
    } else {
      Alert.alert("Error", "Error al cerrar sesión");
    }
  };

  const handleChangePassword = () => {
    Alert.alert("TODO", "Implementar cambio de contraseña");
  };

  // Render functions
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.spacer} />
    </View>
  );

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <TouchableOpacity 
        style={styles.avatarContainer} 
        onPress={isEditing ? handlePickImage : undefined}
        disabled={!isEditing || isUploadingImage}
      >
        {isUploadingImage ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Image
              source={profileImage ? { uri: profileImage } : defaultImage}
              style={styles.avatarImage}
            />
            {isEditing && (
              <View style={styles.editImageOverlay}>
                <Ionicons name="image" size={24} color="#fff" />
                <Text style={styles.editImageText}>Cambiar</Text>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{name} {lastname}</Text>
        <Text style={styles.userEmail}>{email}</Text>
        {phone ? <Text style={styles.userPhone}>{phone}</Text> : null}
      </View>
    </View>
  );

  const renderFormField = (label: string, value: string, setter: (text: string) => void, placeholder: string, keyboardType?: "email-address" | "phone-pad", autoCapitalize?: "none") => (
    <View style={styles.formField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, !isEditing ? styles.disabledInput : null]}
        value={value}
        onChangeText={setter}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={isEditing}
      />
    </View>
  );

  const renderForm = () => (
    <View style={styles.formContainer}>
      {renderFormField("Nombre", name, setName, "First Name")}
      {renderFormField("Apellidos", lastname, setLastname, "Last Name")}
      {renderFormField("Correo", email, setEmail, "Email", "email-address", "none")}
      {renderFormField("Teléfono", phone, setPhone, "Phone Number", "phone-pad")}
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsContainer}>
      {isEditing ? (
        <>
          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]} 
            onPress={handleSave}
            disabled={isSaving || isUploadingImage}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]} 
            onPress={handleEditToggle}
            disabled={isSaving || isUploadingImage}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]} 
            onPress={handleEditToggle}
          >
            <Text style={styles.editButtonText}>Editar Perfil</Text>
          </TouchableOpacity>


        </>
      )}

      <TouchableOpacity 
        style={[styles.actionButton, styles.logoutButton]} 
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );

  // Si el usuario es nulo, muestra un indicador de carga
  if (user === null) {
    return (
      <MainPageContainer showNavbar={false} showFooter={false}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D9D9D9" />
          <Text style={styles.loadingText}>Cargando Perfil...</Text>
        </View>
      </MainPageContainer>
    );
  }

  // Main content
  return (
    <MainPageContainer>
      <View style={[
        styles.contentContainer,
        !isMobile ? styles.webContentContainer : null
      ]}>
        {renderHeader()}
        {user ? <RoleIndicator role={user.role} /> : null}
        {renderProfileSection()}
        {renderForm()}
        {renderActions()}
      </View>
    </MainPageContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
  },
  webContentContainer: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  spacer: {
    width: 40,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#6c757d',
  },
  formContainer: {
    marginBottom: 30,
  },
  formField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212529',
  },
  disabledInput: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  },
  actionsContainer: {
    marginTop: 10,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#D9D9D9',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  changePasswordButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  saveButton: {
    backgroundColor: '#198754',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6c757d',
  },
});
