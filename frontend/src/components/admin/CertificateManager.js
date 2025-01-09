// src/components/admin/CertificateManager.js
const CertificateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [newTemplate, setNewTemplate] = useState({
        type: 'participation',
        gameType: 'solo'
    });

    const handleTemplateUpload = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('template', file);
        formData.append('type', newTemplate.type);
        formData.append('gameType', newTemplate.gameType);

        await api.post('/admin/certificates/templates', formData);
        loadTemplates();
    };

    return (
        <div className="certificate-manager">
            <h3>Certificate Templates</h3>
            <div className="template-upload">
                <select
                    value={newTemplate.type}
                    onChange={e => setNewTemplate({...newTemplate, type: e.target.value})}
                >
                    <option value="participation">Participation</option>
                    <option value="winner">Winner</option>
                </select>
                <input type="file" onChange={handleTemplateUpload} />
            </div>
            <div className="templates-list">
                {templates.map(template => (
                    <div key={template._id} className="template-item">
                        <span>{template.type}</span>
                        <span>{template.gameType}</span>
                        <button onClick={() => handleTemplateDelete(template._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { Dashboard, GameSettings, CertificateManager };  
