import { useState } from "react";
import { farmService } from "../services/farmService";
import { useAuthStore } from "@shared/store/authStore";

export const useFarms = () => {
  const [farms, setFarms] = useState([]);
  const [currentFarm, setCurrentFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, user } = useAuthStore();

  const fetchFarms = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      // Use provided userId or fall back to authenticated user's ID
      const targetUserId = userId || user?.id;
      const data = await farmService.getUserFarms(token, targetUserId);

      // The backend returns { farms: [...] }
      setFarms(data.farms || data);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar las granjas");
      console.error("Error fetching farms:", err);
      // Mock data para desarrollo si falla la API
      setFarms([
        {
          id: 1,
          name: "Granja El Progreso",
          location: "Antioquia, Colombia",
          animalCount: 250,
          area: "50 hectáreas",
          description: "Granja dedicada a la producción lechera",
        },
        {
          id: 2,
          name: "Finca La Esperanza",
          location: "Cundinamarca, Colombia",
          animalCount: 180,
          area: "35 hectáreas",
          description: "Producción de ganado de carne",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getFarmById = async (farmId) => {
    setLoading(true);
    setError(null);

    try {
      const data = await farmService.getFarmById(farmId);
      setCurrentFarm(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar la granja");
      console.error("Error fetching farm by ID:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createFarm = async (farmData) => {
    setLoading(true);
    setError(null);

    try {
      const newFarm = await farmService.createFarm(farmData);
      // Add the new farm to the list
      setFarms((prevFarms) => [...prevFarms, newFarm]);
      return newFarm;
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la granja");
      console.error("Error creating farm:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    farms,
    currentFarm,
    loading,
    error,
    fetchFarms,
    getFarmById,
    createFarm,
  };
};
