import React, { useRef } from 'react';
import { LuUpload } from 'react-icons/lu';

const FileUploadButton = ({ handleAvatarChange }) => {
  const fileInputRef = useRef(); // ใช้สำหรับอ้างถึง <input>

  

  const handleButtonClick = () => {
    fileInputRef.current.click(); // สั่ง input คลิกแทน
  };

  return (
    <div className="flex relative items-center gap-3">
      {/* input ซ่อนไว้ */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        className="hidden"
      />

      {/* ปุ่มที่ใช้แทน input */}
      <button
        type="button"
        onClick={handleButtonClick}
        className="absolute right-0 -bottom-1 bg-primary cursor-pointer rounded-full w-8 h-8 flex items-center justify-center"
      >
        <LuUpload />
      </button>
    </div>
  );
};

export default FileUploadButton;
