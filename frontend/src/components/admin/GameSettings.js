// src/components/admin/GameSettings.js
const GameSettings = () => {
    const [settings, setSettings] = useState({
        timeLimit: 30,
        difficulty: 'medium',
        gradeLevel: 7,
        teamSize: 5
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/admin/settings', settings);
    };

    return (
        <form onSubmit={handleSubmit} className="game-settings">
            <h3>Game Settings</h3>
            <div className="settings-grid">
                <label>
                    Time Limit (minutes)
                    <input
                        type="number"
                        value={settings.timeLimit}
                        onChange={e => setSettings({...settings, timeLimit: e.target.value})}
                    />
                </label>
                {/* Add other settings fields */}
            </div>
            <button type="submit">Save Settings</button>
        </form>
    );
}; 
