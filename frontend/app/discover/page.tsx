import PrimarySearchAppBar from "@/components/navigation";
import OutlinedCard from "@/components/pollCard";   
import FeedButtons from "@/components/feedButtons";

export default function Navigation() {
    return (
        <div>
        <PrimarySearchAppBar />
		<FeedButtons />
        <OutlinedCard />
        </div>
        
    )
}