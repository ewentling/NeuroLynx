import React from 'react';
import { Task, User, Company } from '../types';

interface TasksViewProps {
    tasks: Task[];
    currentUser: User | null;
    selectedCompanyId: string;
    taskFilter: string;
    selectedTasks: Set<string>;
    setSelectedTasks: (ids: Set<string>) => void;
    moveTask: (taskId: string, status: Task['status']) => void;
    handleTaskExport: () => void;
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    addToast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
    setModalData: (data: any) => void;
    setActiveModal: (modal: any) => void;
}

const TasksView: React.FC<TasksViewProps> = ({
    tasks, currentUser, selectedCompanyId, taskFilter, selectedTasks, setSelectedTasks, moveTask, handleTaskExport, setTasks, addToast, setModalData, setActiveModal
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Task Board</h2>
                <div className="flex gap-2">
                    <button onClick={handleTaskExport} className="px-4 py-2 bg-slate-700 rounded text-xs font-bold hover:bg-slate-600"><i className="fas fa-download mr-2"></i> Export</button>
                    {selectedTasks.size > 0 && (
                        <button onClick={() => {
                            setTasks(prev => prev.filter(t => !selectedTasks.has(t.id)));
                            setSelectedTasks(new Set());
                            addToast('success', 'Tasks Deleted');
                        }} className="px-4 py-2 bg-red-600 rounded text-xs font-bold hover:bg-red-500 animate-pulse">
                            Delete Selected ({selectedTasks.size})
                        </button>
                    )}
                    <button onClick={() => { setModalData({}); setActiveModal('save_task'); }} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold">New Task</button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                {['todo', 'in_progress', 'done'].map(status => (
                    <div
                        key={status}
                        className="bg-slate-800/50 p-4 rounded-xl border border-white/5 flex flex-col h-full"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            const taskId = e.dataTransfer.getData('taskId');
                            if (taskId) moveTask(taskId, status as Task['status']);
                        }}
                    >
                        <h3 className="uppercase text-xs font-bold text-slate-500 mb-4">{status.replace('_', ' ')}</h3>
                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                            {tasks.filter(t => t.status === status && (taskFilter === 'all' || t.assignedTo === currentUser?.id) && (selectedCompanyId === 'all' || t.clientId === selectedCompanyId)).map(t => (
                                <div
                                    key={t.id}
                                    draggable
                                    onDragStart={(e) => e.dataTransfer.setData('taskId', t.id)}
                                    className={`p-3 bg-slate-700 rounded-lg border shadow-sm group relative cursor-grab active:cursor-grabbing hover:border-cyan-500/50 transition-all ${selectedTasks.has(t.id) ? 'border-cyan-500 ring-1 ring-cyan-500' : 'border-white/5'}`}
                                >
                                    <input
                                        type="checkbox"
                                        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        checked={selectedTasks.has(t.id)}
                                        onChange={(e) => {
                                            const newSet = new Set(selectedTasks);
                                            if (e.target.checked) newSet.add(t.id);
                                            else newSet.delete(t.id);
                                            setSelectedTasks(newSet);
                                        }}
                                    />
                                    <div className="font-bold text-sm mb-1 pr-6">{t.title}</div>
                                    <div className="text-[10px] text-slate-400 mb-2 line-clamp-2">{t.description}</div>
                                    <div className="flex justify-between items-center">
                                        <div className={`w-2 h-2 rounded-full ${t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {status !== 'todo' && <button onClick={() => moveTask(t.id, 'todo')} className="p-1 hover:text-white"><i className="fas fa-arrow-left"></i></button>}
                                            {status !== 'done' && <button onClick={() => moveTask(t.id, 'done')} className="p-1 hover:text-white"><i className="fas fa-check"></i></button>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksView;
