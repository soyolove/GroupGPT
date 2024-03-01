import { UseHistory } from "@/drizzle/type-output"

export default async function ShowAllVersion({useHistory}:{useHistory:UseHistory[]}){

    if (useHistory.length == 0){
        return(
            <div>
                No use History
            </div>
        )
    }
    return(
        <div>
            <div>
                All UseHistory are here
            </div>
            {useHistory.map((history)=>{
                return(
                    <div key={history.id}>
                        {history.createAt.toString()}
                        {history.timeCost}
                        {history.details}

                    </div>
                )
            })}
        </div>
    )
    

}