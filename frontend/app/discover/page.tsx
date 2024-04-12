import PrimarySearchAppBar from "@/components/navigation";
import PollCards from "@/components/pollCards";   
import FeedButtons from "@/components/feedButtons";
import { Box } from "@mui/material";

export default function Navigation() {
    return (
        <div>
        <PrimarySearchAppBar />
        <Box sx={{ flexGrow: 1 }}/>
          <FeedButtons/>
        <PollCards />
        </div>
        
    )
}