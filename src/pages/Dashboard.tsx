import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useFamilyTreeStore } from '../stores/familyTreeStore';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FamilyTreeView from '../components/FamilyTreeView';
import TreeList from '../components/TreeList';
import MemberForm from '../components/MemberForm';
import MemberDetails from '../components/MemberDetails';

const Dashboard: React.FC = () => {
  const { trees, currentTreeId, createTree, loadTree } = useFamilyTreeStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If there are no trees, create a default one
    if (trees.length === 0) {
      const newTreeId = createTree('My Family Tree');
      navigate(`/dashboard/tree/${newTreeId}`);
    } 
    // If there's no current tree but there are trees, load the first one
    else if (!currentTreeId && trees.length > 0) {
      loadTree(trees[0].id);
      navigate(`/dashboard/tree/${trees[0].id}`);
    }
  }, [trees, currentTreeId, createTree, loadTree, navigate]);
  
  return (
    <div className="min-h-screen bg-primary-100 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar />
        
        <main className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/" element={<TreeList />} />
            <Route path="/tree/:treeId" element={<FamilyTreeView />} />
            <Route path="/tree/:treeId/member/add" element={<MemberForm />} />
            <Route path="/tree/:treeId/member/:memberId" element={<MemberDetails />} />
            <Route path="/tree/:treeId/member/:memberId/edit" element={<MemberForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;