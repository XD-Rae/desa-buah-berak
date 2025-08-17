import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import { kurikulum, fasilitas } from '../data/programData';
import { BookOpen, Users, Trophy, Heart, Search, GraduationCap, Book, Calendar, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import KegiatanDetail from '../components/KegiatanDetail';
import { eventAPI } from '../services/api';
import { Event } from '../types';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

const programs = [
  {
    name: 'Software Engineering',
    description: 'Pengembangan perangkat lunak dengan fokus pada metodologi modern dan praktik industri',
    icon: BookOpen,
  },
  {
    name: 'Data Science',
    description: 'Analisis data dan machine learning untuk solusi bisnis dan teknologi',
    icon: Users,
  },
  {
    name: 'Cyber Security',
    description: 'Keamanan sistem informasi dan jaringan komputer',
    icon: Trophy,
  },
  {
    name: 'Mobile Development',
    description: 'Pengembangan aplikasi mobile untuk iOS dan Android',
    icon: Heart,
  },
];

const Program = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKurikulum, setSelectedKurikulum] = useState('');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<Record<string, boolean>>({});
  const [showAllKegiatan, setShowAllKegiatan] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState<Event | null>(null);
  const [kegiatan, setKegiatan] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const data = await eventAPI.getAll();
        setKegiatan(data);
        setError(null);
      } catch (err) {
        setError('Gagal memuat data kegiatan');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const displayedKegiatan = showAllKegiatan ? kegiatan : kegiatan.slice(0, 6);

  // Toggle expanded state for a specific curriculum
  const toggleCourseExpansion = (itemId: string) => {
    setExpandedCourses(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Filter kurikulum based on search and selection
  const filteredKurikulum = kurikulum.filter(item => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedKurikulum === '' || item.nama === selectedKurikulum)
  );

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
    <div className="py-24 sm:py-32">
      {/* Programs Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-800">PROGRAM UNGGULAN</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Program Pengembangan Mahasiswa
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Berbagai program yang dirancang untuk mengembangkan potensi dan kemampuan mahasiswa Informatika
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
            {programs.map((program) => (
              <motion.div
                key={program.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col rounded-xl bg-white p-8 shadow-lg hover:shadow-xl"
              >
                <dt className="flex items-center gap-x-3 text-lg font-semibold text-gray-900">
                  {program.icon && <program.icon className="h-6 w-6 flex-none text-blue-600" />}
                  {program.name}
                </dt>
                <dd className="mt-4 text-base text-gray-600 leading-relaxed">
                  {program.description}
                </dd>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Kurikulum Section with Search & Filter */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Kurikulum</h2>
            <p className="mt-4 text-lg text-gray-600">
              Kurikulum yang dirancang sesuai kebutuhan industri dan perkembangan teknologi
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="relative w-full md:w-2/5">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Cari kurikulum..." 
                className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="w-full md:w-1/4 py-2 px-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedKurikulum}
              onChange={(e) => setSelectedKurikulum(e.target.value)}
            >
              <option value="">Semua Program</option>
              {kurikulum.map((item) => (
                <option key={item.id} value={item.nama}>{item.nama}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filteredKurikulum.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Card Header with Gradient */}
                <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400 p-6">
                  <div className="absolute -bottom-10 left-6">
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                      <GraduationCap className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 flex items-center">
                    <Calendar className="h-5 w-5 text-white/80" />
                    <span className="ml-2 text-white font-medium">
                      Semester {item.semester}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 pt-14">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center justify-between">
                    {item.nama}
                    <span className="text-blue-600 opacity-0 group-hover:opacity-100">
                      <ChevronRight className="h-5 w-5" />
                    </span>
                  </h3>
                  <p className="text-gray-600 mb-6">{item.deskripsi}</p>
                  
                  {/* Mata Kuliah List with Dropdown */}
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-900 font-semibold">
                      <Book className="h-5 w-5 mr-2 text-blue-600" />
                      Mata Kuliah
                    </div>
                    <ul className="grid grid-cols-1 gap-3">
                      {/* Always show first 2 subjects */}
                      {item.mataKuliah.slice(0, 2).map((mk, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ 
                            opacity: hoveredCard === index ? 1 : 0.8,
                            x: hoveredCard === index ? 0 : -10
                          }}
                          className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                        >
                          <div className="h-2 w-2 bg-blue-600 rounded-full mr-3" />
                          {mk}
                        </motion.li>
                      ))}
                      
                      {/* Show remaining subjects if expanded */}
                      {item.mataKuliah.length > 2 && expandedCourses[item.id] && (
                        item.mataKuliah.slice(2).map((mk, i) => (
                          <motion.li
                            key={i + 2}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center text-gray-600 bg-gray-50 rounded-lg p-3 hover:bg-blue-50 transition-colors"
                          >
                            <div className="h-2 w-2 bg-blue-600 rounded-full mr-3" />
                            {mk}
                          </motion.li>
                        ))
                      )}
                    </ul>
                    
                    {/* Show dropdown button only if there are more than 2 subjects */}
                    {item.mataKuliah.length > 2 && (
                      <button
                        onClick={() => toggleCourseExpansion(item.id)}
                        className="mt-2 flex items-center justify-center w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        {expandedCourses[item.id] ? (
                          <>
                            <span>Lihat lebih sedikit</span>
                            <ChevronUp className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>Lihat {item.mataKuliah.length - 2} mata kuliah lainnya</span>
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Fasilitas Section with 3D Carousel */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Fasilitas Laboratorium</h2>
            <p className="mt-4 text-lg text-gray-600">
              Fasilitas modern untuk mendukung pembelajaran dan praktikum
            </p>
          </div>

          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="w-full py-12"
          >
            {fasilitas.map((item) => (
              <SwiperSlide
                key={item.id}
                className="w-[300px] sm:w-[350px] bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <img
                  src={item.foto}
                  alt={item.nama}
                  className="w-full h-[250px] object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.nama}
                  </h3>
                  <p className="text-gray-600">{item.deskripsi}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Kegiatan Section */}
<div className="bg-gradient-to-b from-gray-50 to-white py-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16">
      <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
        Program Unggulan
      </span>
      <h2 className="text-3xl font-bold text-gray-900">Kegiatan Akademik</h2>
      <p className="mt-4 text-lg text-gray-600">
        Berbagai kegiatan untuk mengembangkan soft skill dan hard skill mahasiswa
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
      {displayedKegiatan.map((item) => (
        <motion.div
                key={item._id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl flex flex-col"
        >
          {/* Gambar Kegiatan dengan Overlay */}
          <div className="relative overflow-hidden">
            <img
              src={item.foto}
              alt={item.nama}
              className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Badge Tanggal */}
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg flex items-center justify-center">
              {item.tanggal}
            </div>

            {/* Label Kategori */}
            <div className="absolute bottom-4 left-4">
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {item.jenis || "Workshop"}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors min-h-16">
              {item.nama}
            </h3>
            <p className="text-gray-600 line-clamp-3 flex-grow">{item.deskripsi}</p>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center text-gray-500 text-sm">
                📍 {item.lokasi || "Kampus Utama"}
              </div>

              <button
                onClick={() => setSelectedKegiatan(item)}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Selengkapnya
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>

    {/* Tombol Lihat Semua */}
    {kegiatan.length > 6 && (
      <div className="text-center mt-10">
        <button
          onClick={() => setShowAllKegiatan(!showAllKegiatan)}
          className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
        >
          {showAllKegiatan ? 'Sembunyikan Kegiatan' : 'Lihat Semua Kegiatan'}
          {showAllKegiatan ? (
            <ChevronUp className="ml-2 h-5 w-5" />
          ) : (
            <ChevronDown className="ml-2 h-5 w-5" />
          )}
        </button>
      </div>
    )}
  </div>
</div>

      {/* Kegiatan Detail Modal */}
      {selectedKegiatan && (
        <KegiatanDetail
          kegiatan={selectedKegiatan}
          onClose={() => setSelectedKegiatan(null)}
        />
      )}
    </div>
  );
};

export default Program;