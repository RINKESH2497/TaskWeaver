import React, { useState, useEffect } from 'react';
import { TaskInput } from './components/TaskInputForm';
import { TaskList } from './components/TaskList';
import { ReportModal } from './components/ReportModal';
import { Task } from './types';
import { Layout, Calendar, Trash, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskweaver_tasks');
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks);
        // Basic validation: filter out tasks older than 24 hours to keep it "Daily"?
        // For simplicity, we just load what is there. User clears manually.
        setTasks(parsed);
      } catch (e) {
        console.error("Failed to parse tasks", e);
      }
    }
  }, []);

  // Save to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskweaver_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Omit<Task, 'id' | 'timestamp'>) => {
    const task: Task = {
      ...newTask,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setTasks(prev => [...prev, task]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const clearAllTasks = () => {
    if (confirm("Are you sure you want to clear all tasks for today?")) {
      setTasks([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg border-b border-slate-800 bg-slate-950/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Layout className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              TaskWeaver
            </h1>
          </div>
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="sm:hidden">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-3xl font-bold text-white mb-3">Today's Progress</h2>
          <p className="text-slate-400">Log your tasks as you go. Generate a perfect status update in seconds.</p>
        </div>

        <TaskInput onAddTask={addTask} />

        <div className="flex items-center justify-between mb-4 mt-12">
          <h3 className="text-lg font-semibold text-slate-200">Task Log ({tasks.length})</h3>
          {tasks.length > 0 && (
             <button 
               onClick={clearAllTasks}
               className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 hover:bg-red-900/20 rounded transition-colors"
             >
               <Trash className="w-3 h-3" /> Clear All
             </button>
          )}
        </div>

        <TaskList tasks={tasks} onDelete={deleteTask} />

      </main>

      {/* Footer / Floating Action Button area for mobile */}
      <footer className="sticky bottom-0 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md py-4">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
           <div className="text-xs text-slate-500 hidden sm:block">
             Your data is stored locally.
           </div>
           <div className="w-full sm:w-auto">
             <button
               onClick={() => setIsModalOpen(true)}
               disabled={tasks.length === 0}
               className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                 tasks.length === 0
                   ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                   : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25'
               }`}
             >
               Generate Daily Update
             </button>
           </div>
        </div>
      </footer>

      <ReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        tasks={tasks} 
      />
    </div>
  );
};

export default App;
