import React from 'react';
// import { Link, useParams } from 'react-router-dom';
import { User } from 'lucide-react';

interface NodeProps {
  data: {
    id: string;
    gender: string;
    name?: string;
    birthDate?: string;
    avatar?: string;
  };
  isRoot: boolean;
}

interface NodeProps {
  data: {
    id: string;
    gender: string;
    name?: string;
    birthDate?: string;
    avatar?: string;
  };
  isRoot: boolean;
  onClick?: (id: string) => void;
}

const FamilyNode: React.FC<NodeProps> = ({ data, isRoot }) => {
  // Determine styling based on gender
  const getGenderStyle = () => {
    switch (data.gender) {
      case 'male':
        return 'border-blue-500 bg-blue-50';
      case 'female':
        return 'border-pink-500 bg-pink-50';
      default:
        return 'border-primary-500 bg-primary-50';
    }
  };

  return (
    <div
      className={
        'cursor-pointer transition-transform hover:scale-105 ' +
        'block w-44 h-20 p-2 border-2 rounded-md shadow-sm hover:shadow-md ' +
        (isRoot ? 'border-accent-500 ring-2 ring-accent-300' : getGenderStyle())
      }
    >
      <div className="flex items-center h-full">
        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-200 mr-2 overflow-hidden">
          {data.avatar ? (
            <img src={data.avatar} alt={data.name} className="w-full h-full object-cover" />
          ) : (
            <User className="h-6 w-6 text-primary-700" />
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="font-medium text-primary-900 truncate">{data.name}</div>
          {data.birthDate && (
            <div className="text-xs text-primary-500">b. {data.birthDate}</div>
          )}
          <div className="text-xs text-primary-500">
            {isRoot ? '(Root)' : data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyNode;