import NavigationAdmin from "../components/NavigationAdmin";
import UploadImage from "../components/UploadImage";
import WallpaperSelector from "../components/WallpaperSelector";

const AdminWallpaper = () => {
    return (
        <div>
            <NavigationAdmin />
            <h1>Upload and Select Wallpaper</h1>
            <UploadImage />
            <WallpaperSelector />
        </div>
    );
};

export default AdminWallpaper;
