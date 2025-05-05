import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useFamilyTreeStore } from '../stores/familyTreeStore';
import { GitFork, LogOut, Save, Upload, User } from 'lucide-react';
import React from 'react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { saveTree, getCurrentTree, setCurrentTreeData } = useFamilyTreeStore();
  const navigate = useNavigate();

  const currentTree = getCurrentTree();

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    const tree = getCurrentTree();
    if (!tree) {
      alert('No family tree to save.');
      return;
    }
    // Convert tree data to JSON string
    const json = JSON.stringify(tree, null, 2);
    // Create a Blob from the JSON string
    const blob = new Blob([json], { type: 'application/json' });
    // Create a temporary anchor element to trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tree.name.replace(/\s+/g, '_').toLowerCase() || 'family-tree'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Optionally call saveTree for state update
    saveTree();

    // alert('Family tree saved successfully!');
  };

  const handleLoad = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          alert('Failed to read file content.');
          return;
        }
        const treeData = JSON.parse(text);
        if (!treeData || typeof treeData !== 'object') {
          alert('Invalid family tree file.');
          return;
        }
        setCurrentTreeData(treeData);
        alert('Family tree loaded successfully!');
      } catch (error) {
        alert('Error parsing family tree file: ' + (error as Error).message);
      }
    };
    reader.onerror = () => {
      alert('Error reading file.');
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <GitFork className="h-6 w-6 text-accent-600" />
                <span className="text-xl font-semibold text-primary-900">FamilyTree</span>
              </Link>

              {currentTree && (
                <span className="text-primary-500 hidden md:inline-block ml-4">
                  / {currentTree.name}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {currentTree && (
                <>
                  <button
                    onClick={handleSave}
                    className="btn btn-secondary inline-flex items-center text-sm py-1"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Save</span>
                  </button>

                  <button
                    onClick={handleLoad}
                    className="btn btn-secondary inline-flex items-center text-sm py-1"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Load</span>
                  </button>
                </>
              )}

              <div className="ml-4 flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="rounded-full bg-primary-200 p-1">
                    <User className="h-5 w-5 text-primary-700" />
                  </div>
                  <span className="ml-2 text-primary-700 hidden md:inline-block">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary inline-flex items-center text-sm py-1"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
