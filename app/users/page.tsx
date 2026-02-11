'use client';

import { useEffect, useState } from 'react';
import { useAuthFetch, useRequireRole } from '@/lib/auth-helpers';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    currentGrade: string | null;
    targetGrade: string | null;
    avatarInitials: string | null;
    joinedAt: string;
    teamMemberships?: any[];
}

export default function UsersPage() {
    const { isAuthorized, isLoading: authLoading, session } = useRequireRole(
        ['ADMIN', 'MANAGER'],
        { redirect: true }
    );
    const { authFetch } = useAuthFetch();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'VIEWER',
        currentGrade: '',
        targetGrade: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await authFetch('/api/users');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await authFetch('/api/users', {
                method: 'POST',
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                setShowAddModal(false);
                setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    role: 'VIEWER',
                    currentGrade: '',
                    targetGrade: ''
                });
                fetchUsers();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to add user');
            }
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Failed to add user');
        }
    };

    const isAdmin = session?.user?.role === 'ADMIN';

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!isAuthorized) {
        return null; // will redirect via useRequireRole
    }

    return (
        <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">User Management</h1>
                    <p className="text-base-content/70">Manage users and their access levels</p>
                </div>
                {isAdmin && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowAddModal(true)}
                    >
                        + Add User
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="stats shadow w-full bg-base-200">
                <div className="stat">
                    <div className="stat-figure text-primary text-2xl">👥</div>
                    <div className="stat-title">Total Users</div>
                    <div className="stat-value text-primary">{users.length}</div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-success text-2xl">👑</div>
                    <div className="stat-title">Managers</div>
                    <div className="stat-value text-success">
                        {users.filter(u => u.role === 'MANAGER' || u.role === 'ADMIN').length}
                    </div>
                </div>
                <div className="stat">
                    <div className="stat-figure text-secondary text-2xl">⭐</div>
                    <div className="stat-title">Team Leads</div>
                    <div className="stat-value text-secondary">
                        {users.filter(u => u.role === 'LEAD').length}
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card bg-base-200 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Current Grade</th>
                                <th>Target Grade</th>
                                <th>Joined</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover">
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar placeholder">
                                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                    <span>{user.avatarInitials || user.name.charAt(0)}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm text-base-content/60">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.role === 'ADMIN' ? 'badge-error' :
                                            user.role === 'MANAGER' ? 'badge-warning' :
                                                user.role === 'LEAD' ? 'badge-info' :
                                                    'badge-ghost'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {user.currentGrade ? (
                                            <span className="text-sm">{user.currentGrade.replace(/_/g, ' ')}</span>
                                        ) : (
                                            <span className="text-sm text-base-content/40">Not set</span>
                                        )}
                                    </td>
                                    <td>
                                        {user.targetGrade ? (
                                            <span className="text-sm">{user.targetGrade.replace(/_/g, ' ')}</span>
                                        ) : (
                                            <span className="text-sm text-base-content/40">Not set</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="text-sm">
                                            {new Date(user.joinedAt).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost btn-sm">Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Add New User</h3>
                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    className="input input-bordered"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    className="input input-bordered"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Role</span>
                                </label>
                                <select
                                    className="select select-bordered"
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                >
                                    <option value="VIEWER">Viewer</option>
                                    <option value="JUNIOR">Junior</option>
                                    <option value="MID">Mid</option>
                                    <option value="LEAD">Lead</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
