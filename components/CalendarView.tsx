import React from 'react';
import { Meeting } from '../types';

interface CalendarViewProps {
    calYear: number;
    calMonth: number;
    monthNames: string[];
    firstDay: number;
    days: number;
    onSetCurrentDate: (d: Date) => void;
    meetings: Meeting[];
    onMeetingClick: (m: Meeting) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
    calYear, calMonth, monthNames, firstDay, days, onSetCurrentDate, meetings, onMeetingClick
}) => {
    const daysArray = Array.from({ length: days }, (_, i) => i + 1);
    const prevMonthDays = Array.from({ length: firstDay }, (_, i) => i);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{monthNames[calMonth]} {calYear}</h2>
                <div className="flex gap-2">
                    <button onClick={() => onSetCurrentDate(new Date(calYear, calMonth - 1, 1))} className="p-2 hover:bg-slate-700 rounded-lg"><i className="fas fa-chevron-left"></i></button>
                    <button onClick={() => onSetCurrentDate(new Date())} className="px-4 py-2 bg-slate-700 rounded text-xs font-bold">Today</button>
                    <button onClick={() => onSetCurrentDate(new Date(calYear, calMonth + 1, 1))} className="p-2 hover:bg-slate-700 rounded-lg"><i className="fas fa-chevron-right"></i></button>
                </div>
            </div>

            <div className="flex-1 bg-slate-800 rounded-2xl border border-white/5 overflow-hidden flex flex-col">
                <div className="grid grid-cols-7 border-b border-white/5 bg-slate-900/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="py-3 text-center text-[10px] uppercase font-bold text-slate-500 tracking-widest">{d}</div>
                    ))}
                </div>
                <div className="flex-1 grid grid-cols-7">
                    {prevMonthDays.map(i => <div key={`prev-${i}`} className="border-r border-b border-white/5 bg-slate-900/20"></div>)}
                    {daysArray.map(d => {
                        const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        const dayMeetings = meetings.filter(m => new Date(m.date).toISOString().split('T')[0] === dateStr);
                        const isToday = new Date().toISOString().split('T')[0] === dateStr;

                        return (
                            <div key={d} className={`border-r border-b border-white/5 p-2 transition-colors hover:bg-white/5 h-full min-h-[100px] overflow-y-auto custom-scrollbar ${isToday ? 'bg-orange-500/5' : ''}`}>
                                <div className={`text-xs font-bold mb-2 ${isToday ? 'w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center' : 'text-slate-400'}`}>{d}</div>
                                <div className="space-y-1">
                                    {dayMeetings.map(m => (
                                        <div
                                            key={m.id}
                                            onClick={() => onMeetingClick(m)}
                                            className="px-2 py-1 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded text-[10px] font-bold truncate cursor-pointer hover:bg-cyan-600/30"
                                        >
                                            {m.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
