import type { User } from "@/models/user";

const users: User[] = [
  {
    id: "1",
    name: "Nombre",
    lastname: "Apellido Apellido",
    fullname: "Nombre Apellido Apellido",
    email: "micorreo@gmail.com",
    role: "user",
    phone: "+506 8812 3456",
    createdAt: "2023-10-15T14:30:00Z",
    updatedAt: "2024-02-20T09:45:00Z"
  },
  {
    id: "2",
    name: "Juan",
    lastname: "Pérez González",
    fullname: "Juan Pérez González",
    email: "juan.perez@gmail.com",
    role: "user",
    phone: "+506 8765 4321",
    createdAt: "2023-11-05T10:20:00Z",
    updatedAt: "2024-01-15T16:30:00Z"
  },
  {
    id: "3",
    name: "María",
    lastname: "Rodríguez Vargas",
    fullname: "María Rodríguez Vargas",
    email: "maria.rodriguez@gmail.com",
    role: "user",
    phone: "+506 6543 2109",
    profileImage: "https://example.com/profiles/maria.jpg",
    createdAt: "2023-12-12T08:10:00Z",
    updatedAt: "2024-03-05T11:20:00Z"
  },
  {
    id: "4",
    name: "Carlos",
    lastname: "Jiménez Soto",
    fullname: "Carlos Jiménez Soto",
    email: "carlos.jimenez@gmail.com",
    role: "admin",
    phone: "+506 7890 1234",
    createdAt: "2024-01-20T13:45:00Z",
    updatedAt: "2024-02-28T15:15:00Z"
  }
];

export default users;