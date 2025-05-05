import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFamilyTreeStore } from '../stores/familyTreeStore';
import { PlusCircle, Home, GitFork, FolderTree, UserPlus, Search } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { trees, currentTreeId, createTree } = useFamilyTreeStore();
  const navigate = useNavigate();
  
  const handleCreateTree = () => {
    const name = prompt('Enter a name for your new family tree:');
    if (name) {
      const newTreeId = createTree(name);
      navigate(`/dashboard/tree/${newTreeId}`);
    }
  };
  
  return (
    <aside className="w-64 border-r border-primary-200 bg-white hidden md:block">
      <div className="p-4">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="input pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-primary-400" />
          </div>
        </div>
        
        <nav>
          <ul className="space-y-1">
            <li>
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-primary-100 text-primary-700"
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            
            {currentTreeId && (
              <li>
                <Link
                  to={`/dashboard/tree/${currentTreeId}`}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-primary-100 text-primary-700"
                >
                  <GitFork className="h-5 w-5" />
                  <span>Current Tree</span>
                </Link>
              </li>
            )}
            
            {currentTreeId && (
              <li>
                <Link
                  to={`/dashboard/tree/${currentTreeId}/member/add`}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-primary-100 text-primary-700"
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Add Member</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2">
            Your Family Trees
          </h3>
          
          <ul className="space-y-1">
            {trees.map((tree) => (
              <li key={tree.id}>
                <Link
                  to={`/dashboard/tree/${tree.id}`}
                  className={`
                    flex items-center space-x-3 px-3 py-2 rounded-md text-primary-700
                    ${currentTreeId === tree.id ? 'bg-primary-100 font-medium' : 'hover:bg-primary-100'}
                  `}
                >
                  <FolderTree className="h-5 w-5" />
                  <span className="truncate">{tree.name}</span>
                </Link>
              </li>
            ))}
            
            <li>
              <button
                onClick={handleCreateTree}
                className="flex items-center space-x-3 px-3 py-2 w-full text-left rounded-md hover:bg-primary-100 text-accent-600"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Create New Tree</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;