import React from 'react'

const UserCard = ({ key, userInfo }) => {
    return (
        <div className='user-card p-2 '>
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3 ">
                    <img src={userInfo?.profileImageUrl}
                        alt={`Avatar`}
                        className='w-12 h-12 rounded-full border-2 border-white'
                    />

                    <div className=''>
                        <p className="text-sm font-medium">{userInfo?.name}</p>
                        <p className="text-xs text-gray-500">{userInfo?.email}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-end gap-3 mt-5 ">
                <StatCard
                    label="Pending"
                    count={userInfo?.pendingTasks || 0}
                    status="Pending"
                    
                />
                <StatCard
                    label="In Progress"
                    count={userInfo?.inProgressTasks || 0}
                    status="In Progress"
                
                />
                <StatCard
                    label="Completed"
                    count={userInfo?.completedTasks || 0}
                    status="Completed"
                />
            </div>
        </div>
    )
}

export default UserCard

const StatCard = ({ label, count, status }) => {
    const getStatusTagColor = () => {
        switch (status) {
            case "In Progress":
                return "text-cyan-500 bg-gray-50 text-center"

            case "Completed":
                return "text-indigo-500 bg-gray-50 text-center"

            default:
                return "text-violet-500 bg-gray-50 text-center"
        }
    }

    return (
        <div className={`flex-1 text-[10px] font-medium ${getStatusTagColor()}  -y-0.5 rounded `}>
            <span className="text-[12px] font-semibold">{count}</span> <br />
            <span className='text-[12px] font-semibold whitespace-nowrap '>{label}</span>
        </div>)
}
