import PrimarySearchAppBar from "@/components/navigation";
import Feed from "@/components/feed";   
import FeedButtons from "@/components/feedButtons";
import { Box } from "@mui/material";

export default function Navigation() {
    return (
        <div>
        <PrimarySearchAppBar />
        <Box sx={{ flexGrow: 1 }}/>    
            <Feed />
        </div>
        
    )
}