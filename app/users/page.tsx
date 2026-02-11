const mockUsers = [
    { id: '1', name: 'Alice Johnson', email: 'alice@company.com', grade: 'Senior Engineer', progress: 75 },
    { id: '2', name: 'Bob Smith', email: 'bob@company.com', grade: 'Engineer', progress: 60 },
    { id: '3', name: 'Carol Williams', email: 'carol@company.com', grade: 'Lead Engineer', progress: 85 },
    { id: '4', name: 'David Brown', email: 'david@company.com', grade: 'Associate Engineer', progress: 45 },
];

export default function UsersPage() {
    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Team Management</h1>
                    <p className="text-base-content/70">Manage team members and view their progress</p>
                </div>
                <button className="btn btn-primary">+ Add Team Member</button>
            </div>

            {/* Stats */}
            <div className="stats shadow w-full bg-base-200">
                <div className="stat">
                    <div className="stat-figure text-primary text-2xl">👥</div>
                    <div className="stat-title">Total Members</div>
                    <div className="stat-value text-primary">{mockUsers.length}</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-success text-2xl">🎯</div>
                    <div className="stat-title">Avg. Progress</div>
                    <div className="stat-value text-success">
                        {Math.round(mockUsers.reduce((sum, u) => sum + u.progress, 0) / mockUsers.length)}%
                    </div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-secondary text-2xl">⭐</div>
                    <div className="stat-title">Ready for Promotion</div>
                    <div className="stat-value text-secondary">{mockUsers.filter(u => u.progress >= 80).length}</div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card bg-base-200 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Career Grade</th>
                                <th>Progress</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map((user) => (
                                <tr key={user.id} className="hover">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                    <span>{user.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm text-base-content/60">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td><span className="badge badge-outline">{user.grade}</span></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <progress className="progress progress-primary w-20" value={user.progress} max="100"></progress>
                                            <span className="text-sm">{user.progress}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.progress >= 80 ? 'badge-success' :
                                                user.progress >= 50 ? 'badge-warning' :
                                                    'badge-info'
                                            }`}>
                                            {user.progress >= 80 ? 'Ready' : user.progress >= 50 ? 'Progressing' : 'Developing'}
                                        </span>
                                    </td>
                                    <td><button className="btn btn-ghost btn-sm">Details</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
