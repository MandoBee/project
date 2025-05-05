import React from 'react';
import { Link } from 'react-router-dom';
import { useFamilyTreeStore } from '../stores/familyTreeStore';
import { GitFork, PlusCircle, Trash2, Calendar } from 'lucide-react';

const TreeList: React.FC = () => {
  const { trees, createTree, deleteTree } = useFamilyTreeStore();
  
  const handleCreateTree = () => {
    const name = prompt('Enter a name for your new family tree:');
    if (name) {
      createTree(name);
    }
  };
  
  const handleDeleteTree = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteTree(id);
    }
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Family Trees</h1>
        <button
          onClick={handleCreateTree}
          className="btn btn-primary inline-flex items-center"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Tree
        </button>
      </div>
      
      {trees.length === 0 ? (
        <div className="card p-8 text-center">
          <GitFork className="h-12 w-12 text-primary-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Family Trees Yet</h2>
          <p className="text-primary-600 mb-6">
            Start your genealogy journey by creating your first family tree.
          </p>
          <button
            onClick={handleCreateTree}
            className="btn btn-primary inline-flex items-center mx-auto"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create First Tree
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {trees.map((tree) => (
            <div key={tree.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <GitFork className="h-5 w-5 text-accent-600 mr-2" />
                  <h3 className="text-lg font-semibold truncate">{tree.name}</h3>
                </div>
                <button
                  onClick={() => handleDeleteTree(tree.id, tree.name)}
                  className="text-primary-400 hover:text-red-500"
                  aria-label="Delete tree"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div className="flex items-center text-sm text-primary-500 mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Updated {formatDate(tree.updatedAt)}</span>
              </div>
              
              <div className="text-sm text-primary-600 mb-4">
                {tree.members.length} {tree.members.length === 1 ? 'member' : 'members'}
              </div>
              
              <Link 
                to={`/dashboard/tree/${tree.id}`}
                className="btn btn-secondary w-full text-center"
              >
                Open Tree
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeList;