import NavigationAdmin from "../components/NavigationAdmin";
import UploadImage from "../components/UploadImage";


const AdminWallpaper = () => {
    return (
        <div>
            <NavigationAdmin />
            <div className="board" style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                <h2 style={{background:'black', padding:'1rem', borderRadius:'64px', border:'1px solid white', textAlign: 'center'}}>Upload and Change WALLPAPER</h2>
                <UploadImage />
            </div>
        </div>
    );
};

export default AdminWallpaper;
