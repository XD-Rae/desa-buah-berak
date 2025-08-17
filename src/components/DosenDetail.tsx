import React, { useState } from 'react';
import { X, Mail, BookOpen, GraduationCap, Phone, MapPin, Award, Book, User, Briefcase, Hash, ExternalLink, Calendar, FileText, ChevronDown, ChevronUp, Map } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Faculty } from '../types';
import { FcAddressBook } from 'react-icons/fc';
import { FaAddressCard } from 'react-icons/fa';

interface DosenDetailProps {
  dosen: Faculty;
  onClose: () => void;
}

type TabType = 'publikasi' | 'hki' | 'pengabdian';

interface ImageViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ src, alt, onClose }) => (
  <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[10000] p-4" onClick={onClose}>
    <button onClick={onClose} className="absolute top-4 right-4 text-white">
      <X className="h-6 w-6" />
    </button>
    <img src={src} alt={alt} className="max-h-[90vh] max-w-[90vw] object-contain" onClick={e => e.stopPropagation()} />
  </div>
);

const DosenDetail = ({ dosen, onClose }: DosenDetailProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('publikasi');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState<Record<string, boolean>>({});
  const lastEdu = dosen.education && dosen.education.length > 0 ? dosen.education[dosen.education.length - 1] : null;

  const TabButton = ({ tab, label, icon: Icon }: { tab: TabType; label: string; icon: React.ElementType }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-lg transition-all ${
        activeTab === tab
          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleShowAllPhotos = (id: string) => {
    setShowAllPhotos(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center mt-16 p-4 z-[9999]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-lg"
      >
        {/* Header Modal */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-semibold text-gray-900">Profil Aparatur</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Profil Atas */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-6 mb-8 items-center md:items-start text-white">
              <img
                src={dosen.foto || 'https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg'}
                alt={dosen.name}
                className="w-40 h-40 md:w-60 md:h-60 rounded-2xl shadow-lg border-2 border-white/20 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setSelectedImage(dosen.foto)}
              />
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold">{dosen.name}</h3>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">Status : Aktif</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="h-4 w-4 opacity-80" />
                  <span className="font-medium">NIK: {dosen.nidn}</span>
                </div>
                {lastEdu && (
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 opacity-80" />
                    <span>{lastEdu.degree}</span>
                  </div>
                )}
                {dosen.fields && dosen.fields.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="h-4 w-4 opacity-80" />
                    <span>{dosen.fields.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{dosen.email}</p>
              </div>
            </div>
            {dosen.phone && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Telepon</p>
                  <p className="text-gray-900">{dosen.phone}</p>
                </div>
              </div>
            )}
            {dosen.address && (
              <div className="md:col-span-2 flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="text-gray-900">{dosen.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Riwayat Pendidikan */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              Jenjang Pendidikan
            </h4>
            <div className="space-y-3">
              {dosen.education && dosen.education.length > 0 ? (
                dosen.education.map((edu, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-800">{edu.degree}</span>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">Tidak ada data pendidikan</div>
              )}
            </div>
          </div>

          {/* Mata Kuliah */}
          {dosen.courses && dosen.courses.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaAddressCard className="h-5 w-5 text-blue-600" />
                Alamat
              </h4>
              <div className="space-y-3">
                {dosen.courses.map((course, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-3"
                  >
                    <FaAddressCard className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-800">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Penelitian Section with Tabs */}
          <div className="mb-8">
  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <FileText className="h-5 w-5 text-blue-600" />
    Penelitian
  </h4>

  {/* Tab Navigation */}
  <div className="flex gap-2 mb-6 bg-gray-100 p-2 rounded-xl">
    <TabButton tab="publikasi" label="Publikasi" icon={Book} />
    <TabButton tab="hki" label="HKI" icon={Award} />
    <TabButton tab="pengabdian" label="Pengabdian" icon={User} />
  </div>

  {/* Tab Content */}
  <div className="space-y-4 max-h-[400px] overflow-y-auto sticky top-[80px]">
    {/* Publikasi Tab */}
    {activeTab === 'publikasi' && (
      <AnimatePresence>
        {dosen.publications && dosen.publications.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {dosen.publications.map((pub, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">
                      {pub.title} {pub.year && <span className="text-gray-500">({pub.year})</span>}
                    </h5>
                  </div>
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Lihat
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-gray-500">Tidak ada data publikasi</div>
        )}
      </AnimatePresence>
    )}

    {/* HKI Tab */}
    {activeTab === 'hki' && (
      <AnimatePresence>
        {dosen.hki && dosen.hki.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {dosen.hki.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-2">{item.judulHKI}</h5>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Hash className="h-4 w-4" />
                        <span>Nomor: {item.nomorHKI}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(item.tanggalHKI)}</span>
                      </div>
                    </div>
                  </div>
                  {item.linkDriveHKI && (
                    <a
                      href={item.linkDriveHKI}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Lihat Dokumen
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-gray-500">Tidak ada data HKI</div>
        )}
      </AnimatePresence>
    )}

    {/* Pengabdian Tab */}
    {activeTab === 'pengabdian' && (
      <AnimatePresence>
        {dosen.pengabdian && dosen.pengabdian.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {dosen.pengabdian.map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <h5 className="font-semibold text-gray-900 mb-3">{item.judulPengabdian}</h5>
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(item.tanggalMulai)} - {formatDate(item.tanggalSelesai)}</span>
                </div>

                {/* Description with expand/collapse */}
                <div className="mb-4">
                  <p className={`text-gray-700 ${!expandedDescriptions[item._id] && 'line-clamp-3'}`}>
                    {item.deskripsi}
                  </p>
                  {item.deskripsi.length > 150 && (
                    <button
                      onClick={() => toggleDescription(item._id)}
                      className="mt-2 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                    >
                      {expandedDescriptions[item._id] ? (
                        <>
                          Sembunyikan
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Selengkapnya
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Images Grid */}
                {item.gambarPengabdian && item.gambarPengabdian.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {/* Always show first 2 images */}
                      {item.gambarPengabdian.slice(0, 3).map((gambar, idx) => (
                        <div
                          key={idx}
                          className="relative group cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedImage(gambar)}
                        >
                          <img
                            src={gambar}
                            alt={`Dokumentasi ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg transform transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="text-white text-sm">Klik untuk memperbesar</div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Show remaining images if expanded */}
                      {showAllPhotos[item._id] && item.gambarPengabdian.slice(3).map((gambar, idx) => (
                        <div
                          key={idx + 3}
                          className="relative group cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setSelectedImage(gambar)}
                        >
                          <img
                            src={gambar}
                            alt={`Dokumentasi ${idx + 3}`}
                            className="w-full h-32 object-cover rounded-lg transform transition-transform group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="text-white text-sm">Klik untuk memperbesar</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Show "View More" button if there are more than 2 images */}
                    {item.gambarPengabdian.length > 3 && (
                      <button
                        onClick={() => toggleShowAllPhotos(item._id)}
                        className="mt-3 text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                      >
                        {showAllPhotos[item._id] ? (
                          <>
                            Sembunyikan foto
                            <ChevronUp className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Lihat {item.gambarPengabdian.length - 3} foto lainnya
                            <ChevronDown className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-8 text-gray-500">Tidak ada data pengabdian</div>
        )}
      </AnimatePresence>
    )}
  </div>
</div>

        </div>
      </motion.div>

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImage && (
          <ImageViewer
            src={selectedImage}
            alt="Preview"
            onClose={() => setSelectedImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DosenDetail;
