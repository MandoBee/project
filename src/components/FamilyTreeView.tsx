import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactFlow, {
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  // Node,
  Edge,
  Position,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFamilyTreeStore, FamilyMember } from '../stores/familyTreeStore';
import FamilyNode from './FamilyNode';
import { PlusCircle } from 'lucide-react';
import MemberForm from './MemberForm';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const HORIZONTAL_SPACING = 50;
const VERTICAL_SPACING = 100;

interface CustomFamilyNodeProps {
  data: {
    id: string;
    gender: string;
    name: string;
    birthDate: string;
    avatar?: string;
  };
  isRoot: boolean;
}

// Updated FamilyNode component to include handles
const CustomFamilyNode: React.FC<CustomFamilyNodeProps> = ({ data, isRoot }) => {
  return (
    <div>
      <FamilyNode data={data} isRoot={isRoot} />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Right} id="right" />
      <Handle type="target" position={Position.Left} id="left" />
    </div>
  );
};

const calculateNodePositions = (
  members: FamilyMember[],
  layoutMode: 'vertical' | 'horizontal'
): Record<string, { x: number; y: number }> => {
  const memberMap = new Map<string, FamilyMember>();
  members.forEach((m) => memberMap.set(m.id, m));

  const levels = new Map<string, number>();

  const assignLevel = (memberId: string, level: number) => {
    if (!levels.has(memberId)) {
      levels.set(memberId, level);
      const member = memberMap.get(memberId);
      if (member?.children) {
        member.children.forEach((childId) => assignLevel(childId, level + 1));
      }
    }
  };

  const childIds = new Set<string>();
  members.forEach((m) => {
    if (m.children) {
      m.children.forEach((cid) => childIds.add(cid));
    }
  });

  const rootMembers = members.filter((m) => !childIds.has(m.id));
  rootMembers.forEach((root) => assignLevel(root.id, 0));

  const levelGroups = new Map<number, string[]>();
  levels.forEach((level, memberId) => {
    if (!levelGroups.has(level)) {
      levelGroups.set(level, []);
    }
    levelGroups.get(level)!.push(memberId);
  });

  const positions: Record<string, { x: number; y: number }> = {};

  levelGroups.forEach((memberIds, level) => {
    const centerOffset = -(memberIds.length * (NODE_WIDTH + HORIZONTAL_SPACING)) / 2;
    memberIds.forEach((memberId, index) => {
      if (layoutMode === 'vertical') {
        positions[memberId] = {
          x: centerOffset + index * (NODE_WIDTH + HORIZONTAL_SPACING),
          y: level * (NODE_HEIGHT + VERTICAL_SPACING),
        };
      } else {
        positions[memberId] = {
          x: level * (NODE_WIDTH + HORIZONTAL_SPACING),
          y: centerOffset + index * (NODE_HEIGHT + VERTICAL_SPACING),
        };
      }
    });
  });

  return positions;
};

const FamilyTreeView: React.FC = () => {
  const { treeId } = useParams<{ treeId: string }>();
  const { trees, loadTree, getCurrentTree } = useFamilyTreeStore();
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const nodeTypes = useMemo(() => ({
    default: (nodeProps: any) => {
      const currentTree = getCurrentTree();
      const isRoot = nodeProps.id === currentTree?.rootId;
      return <CustomFamilyNode data={nodeProps.data} isRoot={isRoot} />;
    },
  }), [getCurrentTree]);

  const transformToReactFlow = useCallback((members: FamilyMember[]) => {
    const positions = calculateNodePositions(members, layoutMode);

    const rfNodes = members.map((member) => ({
      id: member.id,
      type: 'default',
      data: {
        id: member.id,
        gender: member.gender,
        name: `${member.firstName} ${member.lastName}`,
        birthDate: member.birthDate,
        avatar: member.avatar,
      },
      position: positions[member.id] || { x: 0, y: 0 },
      style: { width: NODE_WIDTH, height: NODE_HEIGHT },
      sourcePosition: layoutMode === 'vertical' ? Position.Bottom : Position.Right,
      targetPosition: layoutMode === 'vertical' ? Position.Top : Position.Left,
    }));

    const rfEdges: Edge[] = [];

    members.forEach((member) => {
      // Parent-child relationships
      if (member.children) {
        member.children.forEach((childId) => {
          rfEdges.push({
            id: `e-parent-${member.id}-${childId}`,
            source: member.id,
            target: childId,
            sourceHandle: layoutMode === 'vertical' ? 'bottom' : 'right',
            targetHandle: layoutMode === 'vertical' ? 'top' : 'left',
            type: 'smoothstep',
            animated: false,
          });
        });
      }

      // Spouse relationships
      if (member.spouses) {
        member.spouses.forEach((spouseId) => {
          if (member.id < spouseId) {
            rfEdges.push({
              id: `e-spouse-${member.id}-${spouseId}`,
              source: member.id,
              target: spouseId,
              type: 'step',
              animated: true,
              style: { stroke: 'red', strokeWidth: 2, strokeDasharray: '5,5' },
            });
          }
        });
      }

      // Sibling relationships
      if (member.siblings) {
        member.siblings.forEach((siblingId) => {
          if (member.id < siblingId) {
            rfEdges.push({
              id: `e-sibling-${member.id}-${siblingId}`,
              source: member.id,
              target: siblingId,
              type: 'straight',
              animated: false,
              style: { stroke: 'blue', strokeWidth: 1, strokeDasharray: '2,2' },
            });
          }
        });
      }
    });

    return { rfNodes, rfEdges };
  }, [layoutMode]);

  useEffect(() => {
    if (treeId) {
      loadTree(treeId);
      const currentTree = trees.find((tree) => tree.id === treeId);
      if (currentTree?.members?.length) {
        const { rfNodes, rfEdges } = transformToReactFlow(currentTree.members);
        setNodes(rfNodes);
        setEdges(rfEdges);
      } else {
        setNodes([]);
        setEdges([]);
      }
    }
  }, [treeId, loadTree, trees, transformToReactFlow, setNodes, setEdges]);

  const currentTree = getCurrentTree();

  if (!currentTree) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Family Tree Selected</h2>
          <p className="text-primary-600 mb-6">
            Select a family tree from the sidebar or create a new one.
          </p>
        </div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center card p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">{currentTree.name}</h2>
          <p className="text-primary-600 mb-6">
            Your family tree is empty. Start by adding your first family member.
          </p>
          <Link
            to={`/dashboard/tree/${treeId}/member/add`}
            className="btn btn-primary inline-flex items-center justify-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add First Member
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{currentTree.name}</h2>
        <div className="flex space-x-2">
          <Link
            to={`/dashboard/tree/${treeId}/member/add`}
            className="btn btn-primary inline-flex items-center"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Member
          </Link>
          <button
            onClick={() => setLayoutMode(layoutMode === 'vertical' ? 'horizontal' : 'vertical')}
            className="btn btn-secondary"
          >
            {layoutMode === 'vertical' ? '⇅' : '⇄'}
          </button>
        </div>
      </div>

      <div className="flex-1 border border-primary-200 rounded-lg bg-white overflow-hidden relative">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={(_, node) => node?.id && (setSelectedMemberId(node.id), setIsEditModalOpen(true))}
            fitView
            attributionPosition="bottom-right"
            nodeTypes={nodeTypes}
            zoomOnScroll
            zoomOnPinch
            panOnDrag
            defaultViewport={{ x: 0, y: 0, zoom: .1 }}
            minZoom={0.3}
            maxZoom={2}
          >
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>

      {isEditModalOpen && selectedMemberId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsEditModalOpen(false)}
            >
              ✕
            </button>
            <MemberForm
              memberId={selectedMemberId}
              onClose={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeView;