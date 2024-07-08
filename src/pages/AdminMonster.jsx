import MonsterForm from '../components/MonsterForm'; // Importez votre formulaire de création de monstre
import NavigationAdmin from '../components/NavigationAdmin';

const AdminMonster = () => {
    return (
        <>
            <NavigationAdmin />
            <MonsterForm /> {/* Incluez votre formulaire de création de monstre */}
        </>
    );
};

export default AdminMonster;
