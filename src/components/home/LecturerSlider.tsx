import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { BookOpen, GraduationCap, Mail } from 'lucide-react';
import { usePublicCampusData } from '../../contexts/PublicCampusDataContext';
import { Faculty } from '../../types';
import DosenDetail from '../DosenDetail';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const LecturerSlider: React.FC = () => {
  const { faculty, loading, error } = usePublicCampusData();
  const [filteredFaculty, setFilteredFaculty] = useState<Faculty[]>(faculty);
  const [selectedDosen, setSelectedDosen] = useState<Faculty | null>(null);

  useEffect(() => {
    setFilteredFaculty(faculty);
  }, [faculty]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="mt-20 px-4 md:px-16 lg:px-32 ">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Aparatur Desa</h2>
      <p className="text-center text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
        Tenaga pengajar dari lulusan Universitas terkemuka yang ahli di bidangnya.
      </p>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        speed={400}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="py-10 pb-12"
      >
        {filteredFaculty.map((lecturer) => {
          const lastEdu = lecturer.education && lecturer.education.length > 0 ? lecturer.education[lecturer.education.length - 1] : null;
          // Bidang maksimal 2, jika lebih dari 2 tampilkan '+N'
          const bidangList = lecturer.fields ? lecturer.fields.slice(0, 2) : [];
          const bidangMore = lecturer.fields && lecturer.fields.length > 2 ? lecturer.fields.length - 2 : 0;
          return (
            <SwiperSlide key={lecturer._id}>
              <div
                className="relative flex flex-col items-center bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all max-w-sm mx-auto border border-gray-100 px-6 pt-16 pb-6 min-h-[370px] hover:-translate-y-1 duration-200 cursor-pointer group"
                onClick={() => setSelectedDosen(lecturer)}
                title="Lihat detail dosen"
              >
                {/* Foto bulat floating atau avatar inisial, lebih besar dan lebih dekat ke nama */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10">
                  {lecturer.foto ? (
                    <img
                      src={lecturer.foto}
                      alt={lecturer.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-gray-100"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold text-white border-4 border-white shadow-md" style={{background: 'linear-gradient(135deg, #60a5fa 0%, #818cf8 100%)'}}>
                      {getInitials(lecturer.name)}
                    </div>
                  )}
                </div>
                {/* Konten utama */}
                <div className="flex flex-col items-center mt-12 w-full">
                  <h3 className="text-xl font-extrabold text-gray-900 text-center mb-1 group-hover:text-blue-700 transition-colors">{lecturer.name}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-2">
                    <BookOpen size={16} className="text-blue-500" />
                    {lecturer.position || 'Dosen'}
                  </span>
                  {/* Bidang/fields chip maksimal 2, jika lebih tampilkan +N */}
                  {bidangList.length > 0 && (
                    <div className="flex gap-2 flex-wrap justify-center mb-2 max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-blue-100">
                      {bidangList.map((field, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">
                          {field}
                        </span>
                      ))}
                      {bidangMore > 0 && (
                        <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap">+{bidangMore}</span>
                      )}
                    </div>
                  )}
                  <div className="w-12 border-b-2 border-blue-100 mb-2" />
                  <div className="w-full flex flex-col divide-y divide-gray-100 bg-gray-50 rounded-xl shadow-sm mt-2">
                    <div className="flex items-center gap-2 px-4 py-2">
                      <GraduationCap size={18} className="text-gray-600" />
                      <span className="truncate">
                        {lastEdu ? `${lastEdu.degree}${lastEdu.institution ? ' - ' + lastEdu.institution : ''}` : <span className='bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full text-xs'>Belum Ada Data</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2">
                      <Mail size={18} className="text-gray-600" />
                      <span className="truncate">
                        {lecturer.email || <span className='bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full text-xs'>Email tidak tersedia</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* Modal detail dosen */}
      {selectedDosen && (
        <DosenDetail dosen={selectedDosen} onClose={() => setSelectedDosen(null)} />
      )}
    </div>
  );
};

export default LecturerSlider;
