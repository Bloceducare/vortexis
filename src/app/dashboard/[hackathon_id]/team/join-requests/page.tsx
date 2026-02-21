import { useHackathonStore } from "@/store/useHackathonStore";


export default function MyJoinRequests () {
    const activeHackathon = useHackathonStore((state) => state.activeHackathon);
        const hackathon_id = activeHackathon?.id as string;  

    return (
        <section>
            
        </section>

    )
}