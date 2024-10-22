// 'use client'
// import React, { useState } from 'react';

// interface Tab {
//   label: string;
//   content: React.ReactNode;
//   isDefault?: boolean;
// }

// interface TabsProps {
//   tabs: Tab[];
// }

// const Tabs: React.FC<TabsProps> = ({ tabs }) => {
//   const defaultTab = tabs.find(tab => tab.isDefault) || tabs[0];
//   const [activeTab, setActiveTab] = useState(defaultTab.label);

//   const handleTabClick = (label: string) => {
//     setActiveTab(label);
//   };

//   return (
//     <div>
//       <div className="flex">
//         {tabs.map((tab) => (
//           <button
//             key={tab.label}
//             onClick={() => handleTabClick(tab.label)}
//             className={`py-2 px-4 -mb-px text-md font-bold ${
//               activeTab === tab.label ? 'font-semibold' : 'text-gray-500'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>
//       <div className="mt-4">
//         {tabs.map((tab) =>
//           activeTab === tab.label ? (
//             <div key={tab.label}>{tab.content}</div>
//           ) : null
//         )}
//       </div>
//     </div>
//   );
// };

// export default Tabs;
