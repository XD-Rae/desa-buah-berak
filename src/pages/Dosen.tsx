import React, { useState, useEffect } from 'react';
import { facultyAPI } from '../services/api';
import { Faculty } from '../types';
import DosenDetail from '../components/DosenDetail';
import { Mail, BookOpen, GraduationCap } from 'lucide-react';
import { IMAGES } from '../assets';

const Dosen: React.FC = () => {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedDosen, setSelectedDosen] = useState<Faculty | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const data = await facultyAPI.getAll();
        setFaculty(data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data dosen');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Ambil bidang unik untuk filter
  const uniqueFields = Array.from(new Set(faculty.flatMap((f) => f.fields)));

  // Filter berdasarkan pencarian dan bidang
  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      searchTerm === '' ||
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.nidn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesField = selectedField === '' || f.fields.includes(selectedField);

    return matchesSearch && matchesField;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-16 pb-16 ">
      {/* Header Besar */}
      <div className="text-center pt-12 pb-6 mx-auto max-w-7xl px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Aparatur Desa Buah Berak</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Tenaga yang Menjalankan Tugas Pemerintahan dan Pelayanan di Tingkat Desa.</p>
      </div>

      {/* List Dosen */}
      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-2 justify-items-center">
        {filteredFaculty.map((dosen) => {
          // Ambil pendidikan terakhir (jika ada)
          const lastEdu = dosen.education && dosen.education.length > 0 ? dosen.education[dosen.education.length - 1] : null;
          // Ambil 2 mata kuliah pertama (jika ada)
          const firstCourses = dosen.courses ? dosen.courses.slice(0, 2) : [];
          const moreCourses = dosen.courses && dosen.courses.length > 2 ? dosen.courses.length - 2 : 0;
          return (
            <div
              key={dosen._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-70 w-80"
            >
              {/* Foto dan Nama di atas dengan gradient */}
              <div className="relative h-60  bg-gradient-to-b from-gray-400 to-gray-200 flex items-end justify-center">
                <img
                  src={dosen.foto || IMAGES.image19}
                  alt={dosen.name}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full  object-top"
                  style={{zIndex:1}}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-white/0" style={{zIndex:2}} />
                <div className="relative z-10 p-6 w-full">
                  <div className="font-bold text-2xl text-white drop-shadow mb-1">{dosen.name}</div>
                  <div className="text-white/ text-base font-medium flex items-center gap-2 mb-1">
                    </div>
                </div>
              </div>
              {/* Konten Utama */}
              <div className="p-6 flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <p className="text-sm font-medium text-gray-500">Jabatan :  </p>
                  {dosen.fields && dosen.fields.length > 0 ? dosen.fields.join(', ') : '-'}
                </div>
                
                {moreCourses > 0 && (
                  <div className="text-xs text-gray-500 ml-6">+{moreCourses} </div>
                )}
                <button
                  className="mt-4 w-full bg-blue-700 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition"
                  onClick={() => setSelectedDosen(dosen)}
                >
                  Lihat Detail
                </button>
              </div>
            </div>
          );
        })}
        {filteredFaculty.length === 0 && (
          <p className="text-center text-gray-500 col-span-full">Tidak ada data aparatur desa.</p>
        )}
      </div>

      {/* Dosen Detail Modal */}
      {selectedDosen && (
        <DosenDetail
          dosen={selectedDosen}
          onClose={() => setSelectedDosen(null)}
        />
      )}
    </div>
  );
};

export default Dosen;
