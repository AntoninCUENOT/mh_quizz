import NavigationAdmin from "../components/NavigationAdmin";
import UploadImage from "../components/UploadImage";


const AdminWallpaper = () => {
    return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <NavigationAdmin />
            <h1 style={{background:'black', padding:'1rem', borderRadius:'64px', border:'1px solid white'}}>Upload and Change WALLPAPER</h1>
            <UploadImage />
        </div>
    );
};

export default AdminWallpaper;
