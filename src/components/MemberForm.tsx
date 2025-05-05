import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFamilyTreeStore, FamilyMember } from '../stores/familyTreeStore';
import { Save, ArrowLeft, Trash2, Upload } from 'lucide-react';

interface MemberFormProps {
  memberId?: string;
  onClose?: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ memberId: propMemberId, onClose }) => {
  const { treeId, memberId: paramMemberId } = useParams<{ treeId: string; memberId: string }>();
  const navigate = useNavigate();
  const { getMember, addMember, updateMember, deleteMember, getCurrentTree } = useFamilyTreeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const memberId = propMemberId || paramMemberId;
  const isEditing = Boolean(memberId);
  const existingMember = memberId ? getMember(memberId) : undefined;
  const currentTree = getCurrentTree();

  if (!currentTree) {
    return <div>Loading family tree data...</div>;
  }
  
  const [formData, setFormData] = useState<Partial<FamilyMember>>({
    firstName: '',
    lastName: '',
    gender: 'male',
    birthDate: '',
    birthPlace: '',
    deathDate: '',
    deathPlace: '',
    maidenName: '',
    notes: '',
    avatar: '',
  });
  
  useEffect(() => {
    if (existingMember) {
      setFormData({
        firstName: existingMember.firstName,
        lastName: existingMember.lastName,
        gender: existingMember.gender,
        birthDate: existingMember.birthDate || '',
        birthPlace: existingMember.birthPlace || '',
        deathDate: existingMember.deathDate || '',
        deathPlace: existingMember.deathPlace || '',
        maidenName: existingMember.maidenName || '',
        notes: existingMember.notes || '',
        avatar: existingMember.avatar || '',
      });
    }
  }, [existingMember]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    if (memberId && confirm('Are you sure you want to delete this family member? This action cannot be undone.')) {
      deleteMember(memberId);
      if (onClose) {
        onClose();
      } else {
        navigate(`/dashboard/tree/${treeId}`);
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName) {
      alert('First name and last name are required');
      return;
    }
    
    if (isEditing && memberId) {
      updateMember(memberId, formData);
      if (onClose) {
        onClose();
      } else {
        navigate(`/dashboard/tree/${treeId}/member/${memberId}`);
      }
    } else {
      const newMemberId = addMember({
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.gender as 'male' | 'female' | 'other',
        birthDate: formData.birthDate,
        birthPlace: formData.birthPlace,
        deathDate: formData.deathDate,
        deathPlace: formData.deathPlace,
        maidenName: formData.maidenName,
        notes: formData.notes,
        avatar: formData.avatar,
        parents: [],
        children: [],
        siblings: [],
        spouses: [],
        treeId: currentTree.id, // associate member with current tree
      });
      
      if (onClose) {
        onClose();
      } else {
        navigate(`/dashboard/tree/${treeId}/member/${newMemberId}`);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              } else {
                navigate(-1);
              }
            }}
            className="mr-4 text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">
            {isEditing ? `Edit ${existingMember?.firstName} ${existingMember?.lastName}` : `Add New Family Member to ${currentTree.name}`}
          </h1>
        </div>
        
        {isEditing && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 flex items-center"
          >
            <Trash2 className="h-5 w-5 mr-1" />
            Delete
          </button>
        )}
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full bg-primary-200 flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.avatar ? (
                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="h-8 w-8 text-primary-500" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-accent-500 text-white p-2 rounded-full shadow-md hover:bg-accent-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-primary-700 mb-1">
                  First Name*
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-primary-700 mb-1">
                  Last Name*
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="maidenName" className="block text-sm font-medium text-primary-700 mb-1">
                  Maiden Name (if applicable)
                </label>
                <input
                  id="maidenName"
                  name="maidenName"
                  type="text"
                  value={formData.maidenName}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-primary-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Life Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-primary-700 mb-1">
                  Birth Date
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              
              <div>
                <label htmlFor="birthPlace" className="block text-sm font-medium text-primary-700 mb-1">
                  Birth Place
                </label>
                <input
                  id="birthPlace"
                  name="birthPlace"
                  type="text"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              
              <div>
                <label htmlFor="deathDate" className="block text-sm font-medium text-primary-700 mb-1">
                  Death Date (if applicable)
                </label>
                <input
                  id="deathDate"
                  name="deathDate"
                  type="date"
                  value={formData.deathDate}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              
              <div>
                <label htmlFor="deathPlace" className="block text-sm font-medium text-primary-700 mb-1">
                  Death Place (if applicable)
                </label>
                <input
                  id="deathPlace"
                  name="deathPlace"
                  type="text"
                  value={formData.deathPlace}
                  onChange={handleChange}
                  className="input"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-primary-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={formData.notes}
              onChange={handleChange}
              className="input"
              placeholder="Add any additional information about this person..."
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  navigate(-1);
                }
              }}
              className="btn btn-secondary mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center"
            >
              <Save className="h-5 w-5 mr-2" />
              {isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
