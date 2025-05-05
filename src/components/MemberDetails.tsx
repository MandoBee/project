import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFamilyTreeStore, FamilyMember } from '../stores/familyTreeStore';
import { UserPlus, Edit, ArrowLeft, User, Calendar, MapPin, Users } from 'lucide-react';
import RelationshipModal from './RelationshipModal';

const MemberDetails: React.FC = () => {
  const { treeId, memberId } = useParams<{ treeId: string; memberId: string }>();
  const navigate = useNavigate();
  const { getMember, getCurrentTree, removeRelationship } = useFamilyTreeStore();
  
  const [relationshipType, setRelationshipType] = useState<'parent' | 'child' | 'spouse' | null>(null);
  const [showRelationsMenu, setShowRelationsMenu] = useState(false);
  
  const member: FamilyMember | undefined = memberId ? getMember(memberId!) : undefined;
  const currentTree = getCurrentTree();
  
  if (!member || !currentTree) {
    return (
      <div className="text-center p-8">
        <p className="text-lg text-primary-600">
          Member not found. They may have been deleted.
        </p>
        <button
          onClick={() => navigate(`/dashboard/tree/${treeId!}`)}
          className="btn btn-primary mt-4"
        >
          Return to Family Tree
        </button>
      </div>
    );
  }
  
  const gender = member.gender ?? '';
  const parents = member.parents.map((id) => getMember(id)).filter((m): m is NonNullable<typeof m> => m !== undefined);
  const children = member.children.map((id) => getMember(id)).filter((m): m is NonNullable<typeof m> => m !== undefined);
  const siblings = member.siblings.map((id) => getMember(id)).filter((m): m is NonNullable<typeof m> => m !== undefined);
  const spouses = member.spouses.map((id) => getMember(id)).filter((m): m is NonNullable<typeof m> => m !== undefined);
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/dashboard/tree/${treeId!}`)}
            className="mr-4 text-primary-600 hover:text-primary-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">
            {member.firstName} {member.lastName}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowRelationsMenu(!showRelationsMenu)}
              className="btn btn-secondary flex items-center"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Relation
            </button>
            
            {showRelationsMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-primary-300 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setRelationshipType('parent');
                      setShowRelationsMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-primary-700 hover:bg-primary-100"
                  >
                    Add Parent
                  </button>
                  <button
                    onClick={() => {
                      setRelationshipType('child');
                      setShowRelationsMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-primary-700 hover:bg-primary-100"
                  >
                    Add Child
                  </button>
                  <button
                    onClick={() => {
                      setRelationshipType('spouse');
                      setShowRelationsMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-primary-700 hover:bg-primary-100"
                  >
                    Add Spouse
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <Link
            to={`/dashboard/tree/${treeId!}/member/${memberId!}/edit`}
            className="btn btn-primary flex items-center"
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="card">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-primary-200 flex items-center justify-center mb-4 overflow-hidden">
                {member.avatar ? (
                  <img src={member.avatar} alt={`${member.firstName} ${member.lastName}`} className="w-full h-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-primary-500" />
                )}
              </div>
              
              <h2 className="text-xl font-semibold">
                {member.firstName} {member.lastName}
              </h2>
              
              {member.maidenName && (
                <p className="text-primary-600 text-sm">
                  née {member.maidenName}
                </p>
              )}
              
              <div className="mt-2 px-3 py-1 rounded-full bg-primary-100 text-primary-800 text-sm">
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-primary-200">
              <div className="space-y-3">
                {member.birthDate && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                    <div>
                      <div className="text-sm text-primary-600">Born</div>
                      <div>{member.birthDate}</div>
                    </div>
                  </div>
                )}
                
                {member.birthPlace && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary-500 mr-2" />
                    <div>
                      <div className="text-sm text-primary-600">Birthplace</div>
                      <div>{member.birthPlace}</div>
                    </div>
                  </div>
                )}
                
                {member.deathDate && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                    <div>
                      <div className="text-sm text-primary-600">Died</div>
                      <div>{member.deathDate}</div>
                    </div>
                  </div>
                )}
                
                {member.deathPlace && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary-500 mr-2" />
                    <div>
                      <div className="text-sm text-primary-600">Place of Death</div>
                      <div>{member.deathPlace}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Family Relationships</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-primary-700 font-medium flex items-center mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  Parents
                </h4>
                
                {parents.length > 0 ? (
                  <div className="space-y-2">
                    {parents.map((parent) => (
                      <div key={parent.id} className="flex items-center justify-between bg-primary-50 p-2 rounded">
                        <Link 
                          to={`/dashboard/tree/${treeId!}/member/${parent.id}`}
                          className="flex items-center hover:text-accent-600"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center mr-2 overflow-hidden">
                            {parent.avatar ? (
                              <img src={parent.avatar} alt={parent.firstName} className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-primary-700" />
                            )}
                          </div>
                          <span>
                            {parent.firstName} {parent.lastName}
                          </span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            if (confirm('Remove this relationship?')) {
                              removeRelationship(parent.id, member.id, 'parent');
                            }
                          }}
                          className="text-primary-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary-500 text-sm italic">No parents added yet</p>
                )}
              </div>
              
              <div>
                <h4 className="text-primary-700 font-medium flex items-center mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  Spouses
                </h4>
                
                {spouses.length > 0 ? (
                  <div className="space-y-2">
                    {spouses.map((spouse) => (
                      <div key={spouse.id} className="flex items-center justify-between bg-primary-50 p-2 rounded">
                        <Link 
                          to={`/dashboard/tree/${treeId!}/member/${spouse.id}`}
                          className="flex items-center hover:text-accent-600"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center mr-2 overflow-hidden">
                            {spouse.avatar ? (
                              <img src={spouse.avatar} alt={spouse.firstName} className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-primary-700" />
                            )}
                          </div>
                          <span>
                            {spouse.firstName} {spouse.lastName}
                          </span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            if (confirm('Remove this relationship?')) {
                              removeRelationship(member.id, spouse.id, 'spouse');
                            }
                          }}
                          className="text-primary-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary-500 text-sm italic">No spouses added yet</p>
                )}
              </div>
              
              <div>
                <h4 className="text-primary-700 font-medium flex items-center mb-2">
                  <Users className="h-4 w-4 mr-1" />
                  Children
                </h4>
                
                {children.length > 0 ? (
                  <div className="space-y-2">
                    {children.map((child) => (
                      <div key={child.id} className="flex items-center justify-between bg-primary-50 p-2 rounded">
                        <Link 
                          to={`/dashboard/tree/${treeId!}/member/${child.id}`}
                          className="flex items-center hover:text-accent-600"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center mr-2 overflow-hidden">
                            {child.avatar ? (
                              <img src={child.avatar} alt={child.firstName} className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-4 w-4 text-primary-700" />
                            )}
                          </div>
                          <span>
                            {child.firstName} {child.lastName}
                          </span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            if (confirm('Remove this relationship?')) {
                              removeRelationship(member.id, child.id, 'parent');
                            }
                          }}
                          className="text-primary-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-primary-500 text-sm italic">No children added yet</p>
                )}
              </div>
            </div>
          </div>
          
          {member.notes && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Notes</h3>
              <p className="text-primary-700 whitespace-pre-line">{member.notes}</p>
            </div>
          )}
        </div>
      </div>
      
      {relationshipType && (
        <RelationshipModal
          isOpen={true}
          onClose={() => setRelationshipType(null)}
          memberId={memberId!}
          relationType={relationshipType}
        />
      )}
    </div>
  );
};

export default MemberDetails;