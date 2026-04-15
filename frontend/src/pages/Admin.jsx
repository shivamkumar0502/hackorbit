// import React, { useState } from 'react';
// import { Plus, Edit, Trash2, Home, RefreshCw, Zap ,Video} from 'lucide-react';
// import { NavLink } from 'react-router';

// function Admin() {
//   const [selectedOption, setSelectedOption] = useState(null);

//   const adminOptions = [
//     {
//       id: 'create',
//       title: 'Create Problem',
//       description: 'Add a new coding problem to the platform',
//       icon: Plus,
//       color: 'btn-success',
//       bgColor: 'bg-success/10',
//       route: '/admin/create'
//     },
//     {
//       id: 'update',
//       title: 'Update Problem',
//       description: 'Edit existing problems and their details',
//       icon: Edit,
//       color: 'btn-warning',
//       bgColor: 'bg-warning/10',
//       route: '/admin/update'
//     },
//     {
//       id: 'delete',
//       title: 'Delete Problem',
//       description: 'Remove problems from the platform',
//       icon: Trash2,
//       color: 'btn-error',
//       bgColor: 'bg-error/10',
//       route: '/admin/delete'
//     },
//     {
//       id: 'video',
//       title: 'Video Problem',
//       description: 'Up;oad And delete Videos',
//       icon: Video,
//       color: 'btn-success',
//       bgColor: 'bg-error/10',
//       route: '/admin/video'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-base-200">
//       <div className="container mx-auto px-4 py-8">
//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-base-content mb-4">
//             Admin Panel
//           </h1>
//           <p className="text-base-content/70 text-lg">
//             Manage coding problems on your platform
//           </p>
//         </div>

//         {/* Admin Options Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {adminOptions.map((option) => {
//             const IconComponent = option.icon;
//             return (
//               <div
//                 key={option.id}
//                 className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
//               >
//                 <div className="card-body items-center text-center p-8">
//                   {/* Icon */}
//                   <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
//                     <IconComponent size={32} className="text-base-content" />
//                   </div>
                  
//                   {/* Title */}
//                   <h2 className="card-title text-xl mb-2">
//                     {option.title}
//                   </h2>
                  
//                   {/* Description */}
//                   <p className="text-base-content/70 mb-6">
//                     {option.description}
//                   </p>
                  
//                   {/* Action Button */}
//                   <div className="card-actions">
//                     <div className="card-actions">
//                     <NavLink 
//                     to={option.route}
//                    className={`btn ${option.color} btn-wide`}
//                    >
//                    {option.title}
//                    </NavLink>
//                    </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Admin;
import React from 'react';
import { Plus, Edit, Trash2, Video } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Admin() {

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'bg-yellow-500 hover:bg-yellow-600',
      route: '/admin/update'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'bg-red-500 hover:bg-red-600',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload and delete videos',
      icon: Video,
      color: 'bg-green-500 hover:bg-green-600',
      route: '/admin/video'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Admin Panel
          </h1>
          <p className="text-gray-400 text-lg">
            Manage coding problems on your platform
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {adminOptions.map((option) => {
            const Icon = option.icon;

            return (
              <div
                key={option.id}
                className="bg-[#111] border border-gray-800 rounded-2xl p-8 text-center 
                           hover:shadow-lg hover:shadow-black/40 
                           transition-all duration-300 hover:-translate-y-2"
              >

                {/* ICON */}
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center 
                                rounded-full bg-gray-800">
                  <Icon size={28} className="text-white" />
                </div>

                {/* TITLE */}
                <h2 className="text-xl font-semibold mb-2">
                  {option.title}
                </h2>

                {/* DESC */}
                <p className="text-gray-400 mb-6 text-sm">
                  {option.description}
                </p>

                {/* BUTTON */}
                <NavLink
                  to={option.route}
                  className={`inline-block px-6 py-2 rounded-lg font-medium text-black ${option.color}`}
                >
                  {option.title}
                </NavLink>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
}

export default Admin;