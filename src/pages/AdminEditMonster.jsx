import { useParams, useNavigate } from 'react-router-dom';
import MonsterForm from '../components/MonsterForm';
import NavigationAdmin from '../components/NavigationAdmin';

const AdminEditMonster = () => {
    const { monsterId } = useParams();
    const navigate = useNavigate();

    const handleSubmit = () => {
        // Redirection après la mise à jour
        navigate('/admin/listmonster');
    };

    return (
        <>
            <NavigationAdmin />
            <MonsterForm monsterId={monsterId} onSubmit={handleSubmit} isEditMode={true} />
        </>
    );
};

export default AdminEditMonster;
