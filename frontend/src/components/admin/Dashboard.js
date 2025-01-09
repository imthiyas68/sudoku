// src/components/admin/Dashboard.js
import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const Dashboard = () => {
    const [activeGames, setActiveGames] = useState([]);
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        const [gamesResponse, tournamentsResponse] = await Promise.all([
            api.get('/admin/games/active'),
            api.get('/admin/tournaments')
        ]);
        setActiveGames(gamesResponse.data);
        setTournaments(tournamentsResponse.data);
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <div className="dashboard-grid">
                <ActiveGames games={activeGames} />
                <TournamentManager tournaments={tournaments} />
                <CertificateManager />
            </div>
        </div>
    );
};




