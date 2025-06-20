import React from 'react'


const DeleteAlert = ({content, onDelete}) => {
  return (
    <div>
      <p className="text-sm"> You want to delete this task?
        <div className="flex justify-end mt-6 ">
        <button className="flex items-center justify-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg  px-4 py-2 cursor-pointer hover:bg-rose-300 hover:border-rose-500" type='button' onClick={onDelete}>Delete</button>
        </div>
      </p>
    </div>
  )
}

export default DeleteAlert
