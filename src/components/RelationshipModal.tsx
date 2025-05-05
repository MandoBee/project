import React, { useState } from 'react';
import { useFamilyTreeStore } from '../stores/familyTreeStore';
import { X } from 'lucide-react';

interface RelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: string;
  relationType: 'parent' | 'child' | 'spouse';
}

const RelationshipModal: React.FC<RelationshipModalProps> = ({
  isOpen,
  onClose,
  memberId,
  relationType,
}) => {
  const { getCurrentTree, getMember, addParentChild, addSpouse } = useFamilyTreeStore();
  const [selectedMemberId, setSelectedMemberId] = useState('');
  
  const currentTree = getCurrentTree();
  const currentMember = getMember(memberId);
  
  if (!isOpen || !currentTree || !currentMember) return null;
  
  const availableMembers = currentTree.members.filter((member) => {
    // Exclude the current member
    if (member.id === memberId) return false;
    
    // For parents, exclude existing parents and descendants
    if (relationType === 'parent') {
      return !currentMember.parents.includes(member.id);
    }
    
    // For children, exclude ancestors and existing children
    if (relationType === 'child') {
      return !currentMember.children.includes(member.id);
    }
    
    // For spouses, exclude existing spouses and close relatives
    if (relationType === 'spouse') {
      return !currentMember.spouses.includes(member.id) &&
             !currentMember.parents.includes(member.id) &&
             !currentMember.children.includes(member.id) &&
             !currentMember.siblings.includes(member.id);
    }
    
    return true;
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMemberId) {
      alert('Please select a family member');
      return;
    }
    
    if (relationType === 'parent') {
      addParentChild(selectedMemberId, memberId);
    } else if (relationType === 'child') {
      addParentChild(memberId, selectedMemberId);
    } else if (relationType === 'spouse') {
      addSpouse(memberId, selectedMemberId);
    }
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Add {relationType.charAt(0).toUpperCase() + relationType.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-primary-500 hover:text-primary-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Select a family member to add as {relationType}:
            </label>
            
            {availableMembers.length > 0 ? (
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="input"
              >
                <option value="">Select a person...</option>
                {availableMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-primary-500 italic">
                No available family members to add as {relationType}.
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedMemberId}
            >
              Add {relationType.charAt(0).toUpperCase() + relationType.slice(1)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RelationshipModal;