import React from 'react';
import { Project, ProjectPhase, Company } from '../types';

interface ProjectsViewProps {
    projects: Project[];
    companies: Company[];
    onUpdateMilestone: (projectId: string, milestoneId: string, completed: boolean) => void;
    onAddProject: () => void;
}

const PHASE_ORDER: ProjectPhase[] = ['discovery', 'design', 'build', 'test', 'deploy', 'completed'];
const PHASE_COLORS: Record<ProjectPhase, string> = {
    discovery: 'bg-purple-500',
    design: 'bg-blue-500',
    build: 'bg-orange-500',
    test: 'bg-yellow-500',
    deploy: 'bg-green-500',
    completed: 'bg-emerald-500',
};

const ProjectsView: React.FC<ProjectsViewProps> = ({ projects, companies, onUpdateMilestone, onAddProject }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Project Tracker</h2>
                <button onClick={onAddProject} className="px-4 py-2 bg-orange-600 rounded text-xs font-bold hover:bg-orange-500">
                    <i className="fas fa-plus mr-2"></i>New Project
                </button>
            </div>

            {projects.map(project => {
                const company = companies.find(c => c.id === project.companyId);
                const completedMs = project.milestones.filter(m => m.completed).length;
                const totalMs = project.milestones.length;
                const progress = totalMs ? Math.round((completedMs / totalMs) * 100) : 0;

                return (
                    <div key={project.id} className="bg-slate-800 rounded-xl border border-white/5 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{project.name}</h3>
                                <div className="text-xs text-slate-400 mt-1">
                                    {company?.name} • {project.startDate} → {project.targetEndDate || 'TBD'}
                                    {project.budget && <span className="ml-2 text-cyan-400 font-mono">${project.budget.toLocaleString()}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${project.status === 'active' ? 'bg-green-500/20 text-green-400' : project.status === 'on_hold' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {project.status.replace('_', ' ')}
                                </div>
                                <div className="text-sm font-mono text-slate-400">{progress}%</div>
                            </div>
                        </div>

                        {/* Phase Progress Bar */}
                        <div className="flex gap-1 mb-6">
                            {PHASE_ORDER.filter(p => p !== 'completed').map(phase => {
                                const phaseMs = project.milestones.filter(m => m.phase === phase);
                                const phaseComplete = phaseMs.every(m => m.completed) && phaseMs.length > 0;
                                const isCurrent = project.phase === phase;

                                return (
                                    <div key={phase} className="flex-1">
                                        <div className={`h-2 rounded-full transition-all ${phaseComplete ? PHASE_COLORS[phase] : isCurrent ? PHASE_COLORS[phase] + ' opacity-50 animate-pulse' : 'bg-slate-700'}`}></div>
                                        <div className={`text-[9px] uppercase font-bold text-center mt-1 ${isCurrent ? 'text-white' : 'text-slate-600'}`}>{phase}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Kanban-style Milestones */}
                        <div className="grid grid-cols-5 gap-3">
                            {PHASE_ORDER.filter(p => p !== 'completed').map(phase => (
                                <div key={phase} className="space-y-2">
                                    <div className={`text-[10px] uppercase font-bold text-center py-1 rounded ${PHASE_COLORS[phase]}/20`} style={{ color: phase === 'discovery' ? '#a78bfa' : phase === 'design' ? '#60a5fa' : phase === 'build' ? '#fb923c' : phase === 'test' ? '#facc15' : '#4ade80' }}>
                                        {phase}
                                    </div>
                                    {project.milestones.filter(m => m.phase === phase).map(ms => (
                                        <div
                                            key={ms.id}
                                            className={`p-2 rounded border text-xs cursor-pointer transition-all ${ms.completed ? 'bg-green-500/10 border-green-500/20 opacity-60' : 'bg-black/20 border-white/5 hover:border-cyan-500/30'}`}
                                            onClick={() => onUpdateMilestone(project.id, ms.id, !ms.completed)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${ms.completed ? 'border-green-500 bg-green-500 text-white' : 'border-slate-600'}`}>
                                                    {ms.completed && <i className="fas fa-check text-[8px]"></i>}
                                                </div>
                                                <span className={`font-bold ${ms.completed ? 'line-through text-slate-500' : ''}`}>{ms.title}</span>
                                            </div>
                                            {ms.dueDate && <div className="text-[10px] text-slate-500 mt-1 ml-6">{ms.dueDate}</div>}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProjectsView;
