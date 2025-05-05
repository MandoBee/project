import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface FamilyMember {
  id: string;
  treeId: string;
  gender: 'male' | 'female' | 'other';
  parents: string[];
  children: string[];
  siblings: string[];
  spouses: string[];
  // Personal information
  firstName: string;
  lastName: string;
  maidenName?: string;
  birthDate?: string;
  birthPlace?: string;
  deathDate?: string;
  deathPlace?: string;
  avatar?: string;
  notes?: string;
}

export interface FamilyTree {
  id: string;
  name: string;
  members: FamilyMember[];
  rootId?: string;
  createdAt: number;
  updatedAt: number;
}

interface FamilyTreeState {
  trees: FamilyTree[];
  currentTreeId: string | null;
  
  // Actions
  createTree: (name: string) => string;
  loadTree: (treeId: string) => void;
  saveTree: () => void;
  deleteTree: (treeId: string) => void;
  setCurrentTreeData: (treeData: FamilyTree) => void;
  
  // Member actions
  addMember: (member: Omit<FamilyMember, 'id'>) => string;
  updateMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  
  // Relationship actions
  addParentChild: (parentId: string, childId: string) => void;
  addSpouse: (person1Id: string, person2Id: string) => void;
  removeRelationship: (person1Id: string, person2Id: string, type: 'parent' | 'spouse') => void;
  
  // Utility actions
  getCurrentTree: () => FamilyTree | null;
  getMember: (id: string) => FamilyMember | undefined;
}

export const useFamilyTreeStore = create<FamilyTreeState>()(
  persist(
    (set, get) => ({
      trees: [],
      currentTreeId: null,
      
      createTree: (name: string) => {
        const id = uuidv4();
        const newTree: FamilyTree = {
          id,
          name,
          members: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        
        set((state) => ({
          trees: [...state.trees, newTree],
          currentTreeId: id,
        }));
        
        return id;
      },
      
      loadTree: (treeId: string) => {
        set({ currentTreeId: treeId });
      },
      
      saveTree: () => {
        set((state) => ({
          trees: state.trees.map((tree) => 
            tree.id === state.currentTreeId 
              ? { ...tree, updatedAt: Date.now() } 
              : tree
          ),
        }));
      },
      
      deleteTree: (treeId: string) => {
        set((state) => ({
          trees: state.trees.filter((tree) => tree.id !== treeId),
          currentTreeId: state.currentTreeId === treeId ? null : state.currentTreeId,
        }));
      },
      
      addMember: (memberData) => {
        const id = uuidv4();
        const newMember: FamilyMember = {
          id,
          ...memberData,
        };
        
        set((state) => {
          const currentTree = state.trees.find((tree) => tree.id === state.currentTreeId);
          
          if (!currentTree) return state;
          
          const isFirst = currentTree.members.length === 0;
          
          return {
            trees: state.trees.map((tree) => 
              tree.id === state.currentTreeId 
                ? {
                    ...tree,
                    members: [...tree.members, newMember],
                    rootId: isFirst ? id : tree.rootId,
                    updatedAt: Date.now(),
                  } 
                : tree
            ),
          };
        });
        
        return id;
      },
      
      updateMember: (id, updatedData) => {
        set((state) => ({
          trees: state.trees.map((tree) => 
            tree.id === state.currentTreeId 
              ? {
                  ...tree,
                  members: tree.members.map((member) => 
                    member.id === id 
                      ? { 
                          ...member, 
                          ...updatedData,
                          parents: updatedData.parents ?? member.parents ?? [],
                          children: updatedData.children ?? member.children ?? [],
                          siblings: updatedData.siblings ?? member.siblings ?? [],
                          spouses: updatedData.spouses ?? member.spouses ?? [],
                        } 
                      : member
                  ),
                  updatedAt: Date.now(),
                } 
              : tree
          ),
        }));
      },
      
      deleteMember: (id) => {
        set((state) => {
          const currentTree = state.trees.find((tree) => tree.id === state.currentTreeId);
          
          if (!currentTree) return state;
          
          const updatedMembers = currentTree.members
            .filter((member) => member.id !== id)
            .map((member) => ({
              ...member,
              parents: member.parents.filter((parentId) => parentId !== id),
              children: member.children.filter((childId) => childId !== id),
              siblings: member.siblings.filter((siblingId) => siblingId !== id),
              spouses: member.spouses.filter((spouseId) => spouseId !== id),
            }));
          
          return {
            trees: state.trees.map((tree) => 
              tree.id === state.currentTreeId 
                ? {
                    ...tree,
                    members: updatedMembers,
                    rootId: tree.rootId === id 
                      ? (updatedMembers.length > 0 ? updatedMembers[0].id : undefined) 
                      : tree.rootId,
                    updatedAt: Date.now(),
                  } 
                : tree
            ),
          };
        });
      },
      
      addParentChild: (parentId, childId) => {
        set((state) => ({
          trees: state.trees.map((tree) => 
            tree.id === state.currentTreeId 
              ? {
                  ...tree,
                  members: tree.members.map((member) => {
                    if (member.id === parentId) {
                      return {
                        ...member,
                        children: [...member.children, childId],
                      };
                    }
                    
                    if (member.id === childId) {
                      return {
                        ...member,
                        parents: [...member.parents, parentId],
                      };
                    }
                    
                    return member;
                  }),
                  updatedAt: Date.now(),
                } 
              : tree
          ),
        }));
      },
      
      addSpouse: (person1Id, person2Id) => {
        set((state) => ({
          trees: state.trees.map((tree) => 
            tree.id === state.currentTreeId 
              ? {
                  ...tree,
                  members: tree.members.map((member) => {
                    if (member.id === person1Id) {
                      return {
                        ...member,
                        spouses: [...member.spouses, person2Id],
                      };
                    }
                    
                    if (member.id === person2Id) {
                      return {
                        ...member,
                        spouses: [...member.spouses, person1Id],
                      };
                    }
                    
                    return member;
                  }),
                  updatedAt: Date.now(),
                } 
              : tree
          ),
        }));
      },
      
      removeRelationship: (person1Id, person2Id, type) => {
        set((state) => ({
          trees: state.trees.map((tree) => 
            tree.id === state.currentTreeId 
              ? {
                  ...tree,
                  members: tree.members.map((member) => {
                    if (type === 'parent') {
                      if (member.id === person1Id) {
                        return {
                          ...member,
                          children: member.children.filter((id) => id !== person2Id),
                        };
                      }
                      
                      if (member.id === person2Id) {
                        return {
                          ...member,
                          parents: member.parents.filter((id) => id !== person1Id),
                        };
                      }
                    }
                    
                    if (type === 'spouse') {
                      if (member.id === person1Id) {
                        return {
                          ...member,
                          spouses: member.spouses.filter((id) => id !== person2Id),
                        };
                      }
                      
                      if (member.id === person2Id) {
                        return {
                          ...member,
                          spouses: member.spouses.filter((id) => id !== person1Id),
                        };
                      }
                    }
                    
                    return member;
                  }),
                  updatedAt: Date.now(),
                } 
              : tree
          ),
        }));
      },
      
      getCurrentTree: () => {
        const { trees, currentTreeId } = get();
        return trees.find((tree) => tree.id === currentTreeId) || null;
      },
      
      getMember: (id) => {
        const currentTree = get().getCurrentTree();
        return currentTree?.members.find((member) => member.id === id);
      },

      setCurrentTreeData: (treeData: FamilyTree) => {
        set((state) => {
          const existingTreeIndex = state.trees.findIndex((tree) => tree.id === treeData.id);
          let newTrees;
          if (existingTreeIndex !== -1) {
            newTrees = [...state.trees];
            newTrees[existingTreeIndex] = treeData;
          } else {
            newTrees = [...state.trees, treeData];
          }
          return {
            trees: newTrees,
            currentTreeId: treeData.id,
          };
        });
      },
    }),
    {
      name: 'family-tree-storage',
    }
  )
);
