import { useCallback } from "react";

export interface Form {
    preferences: string[];
    skills: string;
    location: string;
    hackathons: string[];
    time_zone: string;
}

export const useForm  = () => {
    const CreateRecommendation = useCallback( async (form: Form) => {
        console.log(form)
        try {
            const response = await fetch("api/hackathon/recommendation", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
            })

            const data = response.json();   

            if (response.ok) {
                console.log(data);
                console.log("Recommendation created succeessfully")
                return data;
            } else {
                console.log("Recommendation failed to create")
            }
        } catch (error) {
            console.log("Recommendation failed to create")
            console.error(error);
        }
     }, []);

     return {
        CreateRecommendation
     }

}