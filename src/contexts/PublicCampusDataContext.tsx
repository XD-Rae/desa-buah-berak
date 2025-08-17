import React, { createContext, useContext, useState, useEffect } from 'react';
import { Faculty, Achievement, Event } from '../types';
import { facultyAPI, achievementAPI, eventAPI } from '../services/api';

interface PublicCampusDataContextType {
  faculty: Faculty[];
  achievements: Achievement[];
  events: Event[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const PublicCampusDataContext = createContext<PublicCampusDataContextType | undefined>(undefined);

export const usePublicCampusData = () => {
  const context = useContext(PublicCampusDataContext);
  if (!context) {
    throw new Error('usePublicCampusData must be used within a PublicCampusDataProvider');
  }
  return context;
};

export const PublicCampusDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [facultyData, achievementsData, eventsData] = await Promise.all([
        facultyAPI.getAll(),
        achievementAPI.getAll(),
        eventAPI.getAll(),
      ]);
      setFaculty(facultyData);
      setAchievements(achievementsData);
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value: PublicCampusDataContextType = {
    faculty,
    achievements,
    events,
    loading,
    error,
    refreshData: fetchData,
  };

  return (
    <PublicCampusDataContext.Provider value={value}>
      {children}
    </PublicCampusDataContext.Provider>
  );
};
