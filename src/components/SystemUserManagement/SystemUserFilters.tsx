import React, { useState } from 'react';
import { SystemUserSearchParams } from '../../services/SystemUserManagementService';
import { systemUserManagementService } from '../../services/SystemUserManagementService';
import './SystemUserFilters.css';

interface SystemUserFiltersProps {
    searchParams: SystemUserSearchParams;
    onFilterChange: (filters: Partial<SystemUserSearchParams>) => void;
    onSearch: (query: string) => void;
    loading: boolean;
}

const SystemUserFilters: React.FC<SystemUserFiltersProps> = ({
    searchParams,
    onFilterChange,
    onSearch,
    loading,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    const departmentOptions = systemUserManagementService.getDepartmentOptions();
    const roleOptions = systemUserManagementService.getSystemRoleOptions();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const handleFilterChange = (key: keyof SystemUserSearchParams, value: any) => {
        onFilterChange({ [key]: value });
    };

    const clearFilters = () => {
        setSearchQuery('');
        onFilterChange({
            department: undefined,
            role: undefined,
            isActive: undefined,
            page: 1,
        });
    };

    const hasActiveFilters = searchParams.department || searchParams.role || searchParams.isActive !== undefined;

    return (
        <div className="system-user-filters">
            <div className="filters-header">
                <h4>Filters & Search</h4>
                <div className="filters-actions">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                        <i className={`fas fa-chevron-${showAdvancedFilters ? 'up' : 'down'}`}></i>
                        {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
                    </button>

                    {hasActiveFilters && (
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={clearFilters}
                            disabled={loading}
                        >
                            <i className="fas fa-times"></i>
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="search-section">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-group">
                        <div className="search-input-wrapper">
                            <i className="fas fa-search search-icon"></i>
                            <input
                                type="text"
                                className="form-control search-input"
                                placeholder="Search by username, email, employee ID, name, or department..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary search-button"
                            disabled={loading}
                        >
                            <i className="fas fa-search"></i>
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="advanced-filters">
                    <div className="filters-grid">
                        {/* Department Filter */}
                        <div className="filter-group">
                            <label htmlFor="departmentFilter">Department</label>
                            <select
                                id="departmentFilter"
                                className="form-control"
                                value={searchParams.department || ''}
                                onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
                                disabled={loading}
                            >
                                <option value="">All Departments</option>
                                {departmentOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Role Filter */}
                        <div className="filter-group">
                            <label htmlFor="roleFilter">System Role</label>
                            <select
                                id="roleFilter"
                                className="form-control"
                                value={searchParams.role || ''}
                                onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
                                disabled={loading}
                            >
                                <option value="">All Roles</option>
                                {roleOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="filter-group">
                            <label htmlFor="statusFilter">Status</label>
                            <select
                                id="statusFilter"
                                className="form-control"
                                value={searchParams.isActive === undefined ? '' : searchParams.isActive.toString()}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    handleFilterChange('isActive', value === '' ? undefined : value === 'true');
                                }}
                                disabled={loading}
                            >
                                <option value="">All Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        {/* Results Per Page */}
                        <div className="filter-group">
                            <label htmlFor="limitFilter">Results Per Page</label>
                            <select
                                id="limitFilter"
                                className="form-control"
                                value={searchParams.limit || 10}
                                onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                                disabled={loading}
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="active-filters">
                    <h5>Active Filters:</h5>
                    <div className="active-filters-list">
                        {searchParams.department && (
                            <span className="filter-tag">
                                <i className="fas fa-building"></i>
                                Department: {departmentOptions.find(d => d.value === searchParams.department)?.label}
                                <button
                                    className="filter-tag-remove"
                                    onClick={() => handleFilterChange('department', undefined)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        )}

                        {searchParams.role && (
                            <span className="filter-tag">
                                <i className="fas fa-user-shield"></i>
                                Role: {roleOptions.find(r => r.value === searchParams.role)?.label}
                                <button
                                    className="filter-tag-remove"
                                    onClick={() => handleFilterChange('role', undefined)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        )}

                        {searchParams.isActive !== undefined && (
                            <span className="filter-tag">
                                <i className={`fas fa-user-${searchParams.isActive ? 'check' : 'times'}`}></i>
                                Status: {searchParams.isActive ? 'Active' : 'Inactive'}
                                <button
                                    className="filter-tag-remove"
                                    onClick={() => handleFilterChange('isActive', undefined)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Quick Filter Buttons */}
            <div className="quick-filters">
                <h5>Quick Filters:</h5>
                <div className="quick-filter-buttons">
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => onFilterChange({ department: 'IT' })}
                        disabled={loading}
                    >
                        <i className="fas fa-laptop-code"></i>
                        IT Department
                    </button>

                    <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => onFilterChange({ department: 'HR' })}
                        disabled={loading}
                    >
                        <i className="fas fa-users"></i>
                        HR Department
                    </button>

                    <button
                        className="btn btn-outline-info btn-sm"
                        onClick={() => onFilterChange({ department: 'Finance' })}
                        disabled={loading}
                    >
                        <i className="fas fa-dollar-sign"></i>
                        Finance Department
                    </button>

                    <button
                        className="btn btn-outline-warning btn-sm"
                        onClick={() => onFilterChange({ role: 'Super Admin' })}
                        disabled={loading}
                    >
                        <i className="fas fa-crown"></i>
                        Super Admins
                    </button>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => onFilterChange({ isActive: false })}
                        disabled={loading}
                    >
                        <i className="fas fa-user-times"></i>
                        Inactive Users
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemUserFilters;
