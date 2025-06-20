import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../components/layouts/DashboardLayout';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import { LuUpload } from 'react-icons/lu';
import FileUploadButton from '../components/Inputs/FileUploadButton';

const UserInfoPage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImageUrl: '',
  });

  const [displayImageUrl, setDisplayImageUrl] = useState('');

  const [error, setError] = useState("")

useEffect(() => {
  const shouldShowToast = sessionStorage.getItem("showToastAfterRefresh");

  if (shouldShowToast) {
    toast.success("Profile picture updated!");
    sessionStorage.removeItem("showToastAfterRefresh"); // ล้างออก
  }

  fetchProfile(); // โหลดข้อมูล profile ปกติ
}, []);


const fetchProfile = async () => {
  try {
    const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);

    // เซ็ตค่าหลัก
    setUserData(res.data);

    // เซ็ตค่ารูปภาพ พร้อม cache bust
    const url = res.data.profileImageUrl;
    setDisplayImageUrl(url ? `${url}?t=${new Date().getTime()}` : '');
  } catch (err) {
    console.error("Failed to load profile", err);
  }
};


  useEffect(() => {
    fetchProfile()
  }, [])

  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError("")
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setError("Please upload picture!");
      return;
    }



    const formData = new FormData();
    formData.append("image", imageFile);

    setLoading(true);
    try {
      const res = await axiosInstance.post(API_PATHS.USERS.UPDATE_AVATAR, formData, {
      });

      // toast.success("Profile picture updated!");
      sessionStorage.setItem("showToastAfterRefresh", "true");

      await fetchProfile();

      setUserData((prev) => ({ ...prev, profileImageUrl: res.data.profileImageUrl }));
      setPreviewImage(null);
      setImageFile(null);

      window.location.reload();

    } catch (error) {
      toast.error("Failed to update image");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="mt-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Profile Info</h2>

        <div className="form-card p-5">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <img
                src={previewImage || displayImageUrl || '/default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border shadow "

              />
              <FileUploadButton handleAvatarChange={handleAvatarChange} />
            </div>
            {/* <ProfileChange/> */}
            <button
              onClick={handleUpload}
              disabled={loading}
              className="add-btn mt-6"
            >
              {loading ? "Uploading..." : "Change Profile Picture"}
            </button>
            {error && (
              <p className="text-red-500 text-sm mt-3">{error}</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserInfoPage;
